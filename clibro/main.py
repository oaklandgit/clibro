"""A CLI web browser that doesn't move focus away from your current tasks."""

import argparse
import time
import validators
import json
from urllib.parse import urlparse
from history import store_location, lookup_location, store_links, lookup_link, get_links
from browse import fetch_page
from render import label_image, display_image

start_time=time.time()

def finish():
    duration="{:.2f}".format(time.time() - start_time)
    print(f"Completed in {duration}s")
    quit()

config={
    'history_path': '/tmp/clibro.txt',
    'image_path':'/tmp/clibro.png',
    'links_path':'/tmp/clibro.json',
}

parser = argparse.ArgumentParser(
        prog="bro",
        description="A visual, asynchronous, CLI web browser that doesn't move focus away from your current tasks.",
        epilog="Example: Try 'bro python.org',  'bro D', and 'bro 108'."
        )
parser.add_argument("destination", nargs='?', default=False, type=str, help="A URL, a numerically-labeled link, or U/D for scrolling up or down.")
parser.add_argument("-w", "--browser-width", type=int, default=1200, help="The browser width")
parser.add_argument("-f", "--browser-fold", type=int, default=600, help="The amount of page to show")
parser.add_argument("-s", "--label-size", type=int, default=18, help="Customize label size")

args=parser.parse_args()

# no dest, so get last visited, no need to fetch links 
if not args.destination:
    url,pos=lookup_location(config['history_path'])
    print(f"Reloading {url}…")
    links=fetch_page(url, config['image_path'])
    label_image(args, links, config['image_path'])
    display_image(args, pos, config['image_path'])
    finish()

# scroll Down 
elif args.destination.lower() == 'd':
    url,pos=lookup_location(config['history_path'])
    print(f"Scrolling down {url}…")
    pos=int(pos)+1
    store_location(url, pos, config['history_path'])
    display_image(args, pos, config['image_path'])
    finish()

# scroll Up
elif args.destination.lower() == 'u':
    url,pos=lookup_location(config['history_path']) 
    print(f"Scrolling up {url}…")
    pos=int(pos)-1
    if pos>=0:
        store_location(url, pos, config['history_path'])
        display_image(args, pos, config['image_path'])
    else:
        print("You're already at the top of this page.")
    finish()

# if a url is provided, we're going to it
elif "." in args.destination:
    if validators.url(args.destination):
        url=args.destination
    else:
        url=f"http://{args.destination}"

    print(f"Loading {url}…")
    links=fetch_page(url, config['image_path'])
    store_links(links, config['links_path'])
    store_location(url, 0, config['history_path'])
    label_image(args, links, config['image_path'])
    display_image(args, 0, config['image_path'])
    finish() 

# by label number
elif args.destination.isnumeric():
    url=lookup_link(args.destination, config['links_path'])
    print(f"Linking to {url}…")
    links=fetch_page(url, config['image_path'])
    store_links(links, config['links_path'])
    store_location(url, 0, config['history_path'])
    label_image(args, links, config['image_path'])
    display_image(args, 0, config['image_path'])
    finish()

else:
    print("\n")
    parser.print_help()
