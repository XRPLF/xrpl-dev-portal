#!/usr/bin/env python3
from bs4 import BeautifulSoup
import requests
import os

externalCache = []
atRoot = True

broken_links = []

soupsCache = {}
def getSoup(fullPath):
  if fullPath in soupsCache.keys():
    soup = soupsCache[fullPath]
  else:
    with open(fullPath, 'r') as f:
      soup = BeautifulSoup(f.read(), "html.parser")
      soupsCache[fullPath] = soup
  return soup

for dirpath, dirnames, filenames in os.walk("../"):
  if atRoot:
    dirnames.remove('tool')
    atRoot = False
  for fname in filenames:
    fullPath = os.path.join(dirpath, fname);
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
        
        elif endpoint == "#":
          continue
        
        elif "mailto:" in endpoint:
          print("Skipping email link in %s to %s"%(fullPath, endpoint))
          continue

        elif "://" in endpoint:
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
          if not os.path.exists(os.path.join(dirpath, endpoint)):
            print("Broken local link in %s to %s"%(fullPath, endpoint))
            broken_links.append( (fullPath, endpoint) )

if not broken_links:
    print("Success! No broken links found.")
else:
    print("%d broken links found:"%(len(broken_links)))
    [print("File:",fname,"Link:",link) for fname,link in broken_links]
    
    #Tempfix: don't consider a failure if the only broken link is
    # the SSL validation failure on validators.ripple.com...
    if broken_links == [("../rippled-setup.html","https://validators.ripple.com")]:
        exit(0)
    exit(1)
