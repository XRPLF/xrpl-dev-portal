#!/usr/bin/env python3
from bs4 import BeautifulSoup
import requests
import os, argparse

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
    atRoot = True
    broken_links = []
    num_links_checked = 0
    for dirpath, dirnames, filenames in os.walk("../"):
      if atRoot:
        dirnames.remove('tool')
        atRoot = False
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
                if code == 405:
                  #HEAD not allowed -- does GET work?
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

#Sometimes, a link is not really problematic, but the link checker detects it as
# such and the easiest solution is to ignore it.
KNOWN_PROBLEMS = [
    "https://validators.ripple.com", #I don't know why, but Python doesn't like the cert here. Firefox is OK with it.
    "https://support.ripplelabs.com/hc/en-us/categories/200194196-Set-Up-Activation", #Needs outside intervention. Ticket: IN-1168
]

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
            description='Check files in this repository for broken links.')
    parser.add_argument("-o", "--offline", action="store_true",
                       help="Check local anchors only")
    parser.add_argument("-s", "--strict", action="store_true",
                        help="Exit with error even on known problems")
    args = parser.parse_args()
    
    broken_links, num_links_checked = checkLinks(args.offline)
    
    print("---------------------------------------")
    print("Link check report. %d links checked."%num_links_checked)
    
    if not args.strict:
      unknown_broken_links = [(page,link) for page,link in broken_links 
                        if link not in KNOWN_PROBLEMS]
    
    if not broken_links:
      print("Success! No broken links found.")
    else:
      print("%d broken links found:"%(len(broken_links)))
      [print("File:",fname,"Link:",link) for fname,link in broken_links]
      
      if args.strict or unknown_broken_links:
          exit(1)
      
      print("Success - all broken links are known problems.")

