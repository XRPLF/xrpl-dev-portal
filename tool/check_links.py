#!/usr/bin/env python3
import requests
import os
import yaml
import argparse
from bs4 import BeautifulSoup

DEFAULT_CONFIG_FILE = "devportal-config.yml"

soupsCache = {}
def getSoup(fullPath):
  if fullPath in soupsCache.keys():
    soup = soupsCache[fullPath]
  else:
    with open(fullPath, 'r') as f:
      soup = BeautifulSoup(f.read(), "html.parser")
      soupsCache[fullPath] = soup
  return soup

def checkLinks(offline=False):
    externalCache = []
    broken_links = []
    num_links_checked = 0
    for dirpath, dirnames, filenames in os.walk(config["out_path"]):
      if os.path.abspath(dirpath) == os.path.abspath(config["template_path"]):
        # don't try to parse and linkcheck the templates
        continue
      for fname in filenames:
        fullPath = os.path.join(dirpath, fname)
        if "/node_modules/" in fullPath or ".git" in fullPath:
          print("skipping ignored dir:", fullPath)
          continue
        if fullPath.endswith(".html"):
          soup = getSoup(fullPath)
          links = soup.find_all('a')
          for link in links:
            if "href" not in link.attrs:
              #probably an <a name> type anchor, skip
              continue

            endpoint = link['href']
            if not endpoint.strip():
              print("Empty link in",fullPath)
              broken_links.append( (fullPath, endpoint) )
              num_links_checked += 1
            
            elif endpoint == "#":
              continue
            
            elif "mailto:" in endpoint:
              print("Skipping email link in %s to %s"%(fullPath, endpoint))
              continue

            elif "://" in endpoint:
              if offline:
                print("Offline - Skipping remote URL %s"%(endpoint))
                continue
                
              num_links_checked += 1
              if endpoint not in externalCache:
                print("Testing remote URL %s"%(endpoint))
                try:
                  code = requests.head(endpoint).status_code
                except Exception as e:
                  print("Error occurred:",e)
                  code = 500
                if code == 405 or code == 404:
                  #HEAD didn't work, maybe GET will?
                  try:
                    code = requests.get(endpoint).status_code
                  except Exception as e:
                    print("Error occurred:",e)
                    code = 500
                
                if code < 200 or code >= 400:
                  print("Broken remote link in %s to %s"%(fullPath, endpoint))
                  broken_links.append( (fullPath, endpoint) )
                else:
                  print("...success.")
                  externalCache.append(endpoint)
            
              
            elif '#' in endpoint:
              print("Testing local link %s from %s"%(endpoint, fullPath))
              num_links_checked += 1
              filename,anchor = endpoint.split("#",1)
              if filename == "":
                fullTargetPath = fullPath
              else:
                fullTargetPath = os.path.join(dirpath, filename)
              if not os.path.exists(fullTargetPath):
                print("Broken local link in %s to %s"%(fullPath, endpoint))
                broken_links.append( (fullPath, endpoint) )

              elif "-api-tool.html" in fullTargetPath:
                  #These pages are populated dynamically, so BeatifulSoup wouldn't
                  # be able to find anchors in them anyway
                  print("Skipping anchor link in %s to API tool %s" % 
                        (fullPath, endpoint))
                  continue

              elif fullTargetPath != "../":
                num_links_checked += 1
                targetSoup = getSoup(fullTargetPath)
                if not targetSoup.find(id=anchor) and not targetSoup.find(
                        "a",attrs={"name":anchor}):
                  print("Broken anchor link in %s to %s"%(fullPath, endpoint))
                  broken_links.append( (fullPath, endpoint) )
                else:
                  print("...anchor found.")
                continue

            elif endpoint[0] == '/':
              #can't really test links out of the local field
              print("Skipping absolute link in %s to %s"%(fullPath, endpoint))
              continue

            else:
              num_links_checked += 1
              if not os.path.exists(os.path.join(dirpath, endpoint)):
                print("Broken local link in %s to %s"%(fullPath, endpoint))
                broken_links.append( (fullPath, endpoint) )
    return broken_links, num_links_checked



def load_config(config_file=DEFAULT_CONFIG_FILE):
    """Reload config from a YAML file."""
    global config
    print("loading config file %s..." % config_file)
    with open(config_file, "r") as f:
        config = yaml.load(f)
        assert(config["out_path"])
        assert(type(config["known_broken_links"]) == list)



if __name__ == "__main__":
    parser = argparse.ArgumentParser(
            description='Check files in this repository for broken links.')
    parser.add_argument("-o", "--offline", action="store_true",
                       help="Check local anchors only")
    parser.add_argument("-s", "--strict", action="store_true",
                        help="Exit with error even on known problems")
    parser.add_argument("--config", "-c", type=str,
                        help="Specify path to an alternate config file.")
    args = parser.parse_args()
    
    if args.config:
        load_config(args.config)
    else:
        load_config()
    
    
    
    broken_links, num_links_checked = checkLinks(args.offline)
    
    print("---------------------------------------")
    print("Link check report. %d links checked."%num_links_checked)
    
    if not args.strict:
      unknown_broken_links = [ (page,link) for page,link in broken_links 
                        if link not in config["known_broken_links"] ]
    
    if not broken_links:
      print("Success! No broken links found.")
    else:
      print("%d broken links found:"%(len(broken_links)))
      [print("File:",fname,"Link:",link) for fname,link in broken_links]
      
      if args.strict or unknown_broken_links:
          exit(1)
      
      print("Success - all broken links are known problems.")

