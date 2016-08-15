#!/usr/bin/env python3
import requests
import os
import yaml
import argparse
import logging
from bs4 import BeautifulSoup
from time import time

DEFAULT_CONFIG_FILE = "dactyl-config.yml"
TIMEOUT_SECS = 5
CHECK_IN_INTERVAL = 30

soupsCache = {}
def getSoup(fullPath):
  if fullPath in soupsCache.keys():
    soup = soupsCache[fullPath]
  else:
    with open(fullPath, 'r') as f:
      soup = BeautifulSoup(f.read(), "html.parser")
      soupsCache[fullPath] = soup
  return soup

def check_remote_url(endpoint, fullPath, broken_links, externalCache, isImg=False):
    if isImg:
        linkword = "image"
    else:
        linkword = "link"
    if endpoint in [v for k,v in broken_links]:
        # We already confirmed this was broken, so just add another instance
        logging.warning("Broken %s %s appears again in %s" % (linkword, endpoint, fullPath))
        broken_links.append( (fullPath, endpoint) )
        return False
    if endpoint in externalCache:
        logging.debug("Skipping cached %s %s" % (linkword, endpoint))
        return True
    if endpoint in config["known_broken_links"]:
        logging.warning("Skipping known broken %s %s in %s" % (linkword, endpoint, fullPath))
        return True

    logging.info("Testing remote %s URL %s"%(linkword, endpoint))
    try:
        code = requests.head(endpoint, timeout=TIMEOUT_SECS).status_code
    except Exception as e:
        logging.warning("Error occurred: %s" % e)
        code = 500
    if code == 405 or code == 404:
        #HEAD didn't work, maybe GET will?
        try:
            code = requests.get(endpoint, timeout=TIMEOUT_SECS).status_code
        except Exception as e:
          logging.warning("Error occurred: %s" % e)
          code = 500

    if code < 200 or code >= 400:
        logging.warning("Broken remote %s in %s to %s"%(linkword, fullPath, endpoint))
        broken_links.append( (fullPath, endpoint) )
        return False
    else:
        logging.info("...success.")
        externalCache.append(endpoint)
        return True

def checkLinks(offline=False):
    externalCache = []
    broken_links = []
    num_links_checked = 0
    last_checkin = time()
    for dirpath, dirnames, filenames in os.walk(config["out_path"]):
      if time() - last_checkin > CHECK_IN_INTERVAL:
        last_checkin = time()
        print("... still working (dirpath: %s) ..." % dirpath)
      if os.path.abspath(dirpath) == os.path.abspath(config["template_path"]):
        # don't try to parse and linkcheck the templates
        continue
      for fname in filenames:
        if time() - last_checkin > CHECK_IN_INTERVAL:
          last_checkin = time()
          print("... still working (file: %s) ..." % fname)
        fullPath = os.path.join(dirpath, fname)
        if "/node_modules/" in fullPath or ".git" in fullPath:
          logging.debug("skipping ignored dir: %s" % fullPath)
          continue
        if fullPath.endswith(".html"):
          soup = getSoup(fullPath)
          links = soup.find_all('a')
          for link in links:
            if time() - last_checkin > CHECK_IN_INTERVAL:
              last_checkin = time()
              print("... still working (link: %s) ..." % link)
            if "href" not in link.attrs:
              #probably an <a name> type anchor, skip
              continue

            endpoint = link['href']
            if not endpoint.strip():
              logging.warning("Empty link in %s" % fullPath)
              broken_links.append( (fullPath, endpoint) )
              num_links_checked += 1

            elif endpoint == "#":
              continue

            elif "mailto:" in endpoint:
              logging.info("Skipping email link in %s to %s"%(fullPath, endpoint))
              continue

            elif "://" in endpoint:
              if offline:
                logging.info("Offline - Skipping remote URL %s"%(endpoint))
                continue

              num_links_checked += 1
              check_remote_url(endpoint, fullPath, broken_links, externalCache)


            elif '#' in endpoint:
              if fname in config["ignore_anchors_in"]:
                logging.info("Ignoring anchor %s in dynamic page %s"%(endpoint,fname))
                continue
              logging.info("Testing local link %s from %s"%(endpoint, fullPath))
              num_links_checked += 1
              filename,anchor = endpoint.split("#",1)
              if filename == "":
                fullTargetPath = fullPath
              else:
                fullTargetPath = os.path.join(dirpath, filename)
              if not os.path.exists(fullTargetPath):
                logging.warning("Broken local link in %s to %s"%(fullPath, endpoint))
                broken_links.append( (fullPath, endpoint) )

              elif filename in config["ignore_anchors_in"]:
                  #Some pages are populated dynamically, so BeatifulSoup wouldn't
                  # be able to find anchors in them anyway
                  logging.info("Skipping anchor link in %s to dynamic page %s" %
                        (fullPath, endpoint))
                  continue

              elif fullTargetPath != "../":
                num_links_checked += 1
                targetSoup = getSoup(fullTargetPath)
                if not targetSoup.find(id=anchor) and not targetSoup.find(
                        "a",attrs={"name":anchor}):
                  logging.warning("Broken anchor link in %s to %s"%(fullPath, endpoint))
                  broken_links.append( (fullPath, endpoint) )
                else:
                  logging.info("...anchor found.")
                continue

            elif endpoint[0] == '/':
              #can't really test links out of the local field
              logging.info("Skipping absolute link in %s to %s"%(fullPath, endpoint))
              continue

            else:
              num_links_checked += 1
              if not os.path.exists(os.path.join(dirpath, endpoint)):
                logging.warning("Broken local link in %s to %s"%(fullPath, endpoint))
                broken_links.append( (fullPath, endpoint) )

          #Now check images
          imgs = soup.find_all('img')
          for img in imgs:
            num_links_checked += 1
            if "src" not in img.attrs or not img["src"].strip():
              logging.warning("Broken image with no src in %s" % fullPath)
              broken_links.append( (fullPath, img["src"]) )
              continue

            src = img["src"]
            if "://" in src:
              check_remote_url(src, fullPath, broken_links, externalCache, isImg=True)

            else:
              logging.info("Checking local image %s in %s" % (src, fullPath))
              if os.path.exists(os.path.join(dirpath, src)):
                logging.info("...success")
              else:
                logging.warning("Broken local image %s in %s" % (src, fullPath))
                broken_links.append( (fullPath, src) )
    return broken_links, num_links_checked



def load_config(config_file=DEFAULT_CONFIG_FILE):
    """Reload config from a YAML file."""
    global config
    logging.info("loading config file %s..." % config_file)
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
    parser.add_argument("--quiet", "-q", action="store_true",
                        help="Reduce output to just failures and final report")
    args = parser.parse_args()

    if not args.quiet:
        logging.basicConfig(level=logging.INFO)

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
