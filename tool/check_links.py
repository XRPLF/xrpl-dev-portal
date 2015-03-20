#!/usr/bin/env python3
from bs4 import BeautifulSoup
import requests
import os

externalCache = []
atRoot = True

for dirpath, dirnames, filenames in os.walk("../"):
  if atRoot:
    dirnames.remove('tool')
    atRoot = False
  for fname in filenames:
    fullPath = os.path.join(dirpath, fname);
    if fullPath.endswith(".html"):
      f = open(fullPath, 'r')
      soup = BeautifulSoup(f.read())
      links = soup.find_all('a')
      for link in links:
        endpoint = link['href']
        if "://" in endpoint:
          if endpoint not in externalCache:
            print("Testing remote URL %s"%(endpoint))
            code = requests.head(endpoint).status_code
            if code < 200 or code >= 400:
              print("Broken remote link in %s to %s"%(fullPath, endpoint))
            else:
              externalCache.append(endpoint)
        elif endpoint[0] == '#':
          continue
        elif endpoint[0] == '/':
          continue
        else:
          if not os.path.exists(os.path.join(dirpath, endpoint)):
            print("Broken local link in %s to %s"%(fullPath, endpoint))
