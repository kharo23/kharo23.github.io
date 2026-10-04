#!/usr/bin/env python3
"""Notifica a IndexNow (Bing, Yandex e altri) gli URL del sitemap. DA ESEGUIRE SOLO DOPO LA PUBBLICAZIONE
(il file chiave https://kharonte.dev/426bd80580ca28dd1d4f4de2bbe94a3d.txt deve essere online).  Uso: python3 tools/indexnow.py"""
import re, json, urllib.request
KEY = "426bd80580ca28dd1d4f4de2bbe94a3d"
urls = re.findall(r"<loc>([^<]+)</loc>", open("sitemap.xml").read())
body = json.dumps({"host": "kharonte.dev", "key": KEY, "keyLocation": f"https://kharonte.dev/{KEY}.txt", "urlList": urls}).encode()
req = urllib.request.Request("https://api.indexnow.org/IndexNow", data=body, headers={"Content-Type": "application/json; charset=utf-8"})
print(len(urls), "URL ->", urllib.request.urlopen(req).status)
