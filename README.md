# chapterizer
Converts JSON chapters from Audible's web player to standard chapters.txt format

```
deno run --allow-read index.ts
```

## downloading chapters.json

`chapters.json` is created by extracting chapter data from the Audible web player.

You need your `licenserequest.json`, here's how to get that:
* Start playing a book in the Audible web player
* Open the Network tab of devtools (and then refresh the page)
* Look for `licenserequest.json`. The "type" column should be XHR
* Copy the response and save in a file named `licenserequest.json`

Once you have that, you can use jq to extract just the chapters for use with this script

```
jq '.content_license.content_metadata.chapter_info.chapters' <licenserequest.json >chapters.json
```
