"""A CLI web browser that doesn't move focus away from your current tasks."""

import argparse
import time
import validators
from history import store_location, lookup_location, store_links, lookup_link
from browse import fetch_page
from render import crop_label_display

start_time=time.time()

def finish():
    print(f"Completed in {time.time() - start_time}s")
    quit()

config={
    'history_path': '/tmp/clibro.txt',
    'image_path':'/tmp/clibro.png',
    'links_path':'/tmp/clibro.json',
}

parser = argparse.ArgumentParser(prog='clibro')
parser.add_argument("destination", nargs='?', default=False, type=str, help="URL to open or link to follow, or omit for last page visited")
parser.add_argument("-w", "--browser-width", type=int, default=1200, help="The browser width")
parser.add_argument("-f", "--browser-fold", type=int, default=800, help="The amount of page to show")
parser.add_argument("-z", "--image-zoom", type=int, default=100, help="Reduce or englarge the image")
parser.add_argument("-s", "--label-size", type=int, default=22, help="Customize label size")
parser.add_argument("-x", "--label-offset-x", type=int, default=12, help="X offset of the labels")
parser.add_argument("-y", "--label-offset-y", type=int, default=32, help="Y offset of the labels")

args=parser.parse_args()

# no dest, so get last visited, no need to fetch links 
if not args.destination:
    url,pos=lookup_location(config['history_path'])
    print(f"Reloading {url}…")
    links=fetch_page(url, config['image_path'])
    crop_label_display(pos, args, links, config['image_path'])
    finish()

# scroll Down 
elif args.destination == 'D':
    url,pos=lookup_location(config['history_path'])
    print(f"Scrolling down {url}…")
    links=fetch_page(url, config['image_path'])
    pos=int(pos)+1
    store_location(url, pos, config['history_path'])
    crop_label_display(pos, args, links, config['image_path'])
    finish()

# scroll Up
elif args.destination == 'U':
    url,pos=lookup_location(config['history_path']) 
    print(f"Scrolling up {url}…")
    links=fetch_page(url, config['image_path'])
    pos=int(pos)-1
    if pos>=0:
        crop_label_display(pos, args, links, config['image_path'])
        store_location(url, pos, config['history_path'])
    else:
        print("You're already at the top of this page.")
    finish()

# if a url is provided, we're going to it
elif validators.url(args.destination):
    url=args.destination
    print(f"Loading {url}…")
    links=fetch_page(url, config['image_path'])
    store_links(links, config['links_path'])
    store_location(url, 0, config['history_path'])
    crop_label_display(0, args, links, config['image_path'])
    finish() 

# by label number
elif args.destination.isnumeric():
    url=lookup_link(args.destination, config['links_path'])
    print(f"Linking to {url}…")
    links=fetch_page(url, config['image_path'])
    store_links(links, config['links_path'])
    store_location(url, 0, config['history_path'])
    crop_label_display(0, args, links, config['image_path'])
    finish()

else:
    print("How'd I get here?")
