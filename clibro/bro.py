"""A CLI web browser that doesn't move focus away from your current tasks."""

import argparse
import time
import sys
import os
import tempfile
import validators
from PIL import Image
from clibro.history import store_location, lookup_location, store_links, lookup_link
from clibro.grab import fetch_page
from clibro.render import label_image, display_image


def main():

    start = time.perf_counter()

    def finish() -> None:
        '''Function to display time to complete the request'''
        end = time.perf_counter()
        print(f"Completed in {end-start:.2f}s")
        sys.exit()

    tmp_dir = tempfile.gettempdir()

    config = {
        'history_path': os.path.join(tmp_dir, 'clibro.txt'),
        'image_path': os.path.join(tmp_dir, 'clibro.png'),
        'links_path': os.path.join(tmp_dir, 'clibro.json')
    }

    parser = argparse.ArgumentParser(
        prog="bro",
        description="A visual, asynchronous, CLI web browser that doesn't move\
        focus away from your current tasks.",
        epilog="Example: Try 'bro python.org',  'bro D', and 'bro 108'."
    )
    parser.add_argument(
        "destination", nargs='?', default=False,
        type=str, help="A URL, a numerically-labeled link, or U/D for\
        scrolling up or down.")
    parser.add_argument("-w", "--browser-width", type=int, default=1200,
                        help="The browser width")
    parser.add_argument("-f", "--browser-fold", type=int, default=600,
                        help="The amount of page to show")
    parser.add_argument("-s", "--label-size", type=int, default=18,
                        help="Customize label size")

    args = parser.parse_args()

    def by_url(to_url: str, with_args: dict[str, str]) -> None:
        '''Group functionality for fetching and storing a url'''
        screenshot, links = fetch_page(with_args, to_url)
        ss_labeled = label_image(with_args, links, screenshot)
        display_image(with_args, 0, ss_labeled)
        store_links(links, config['links_path'])
        store_location(to_url, 0, config['history_path'])
        ss_labeled.save(config['image_path'])
        finish()

    # no dest, so get last visited, no need to fetch links
    if not args.destination:
        url, pos = lookup_location(config['history_path'])
        print(f"Reloading {url}")
        by_url(url, args)

    # scroll Down
    elif args.destination.lower() == 'd':
        url, pos = lookup_location(config['history_path'])
        print(f"Scrolling down {url}")
        pos = int(pos)+1
        store_location(url, pos, config['history_path'])
        image = Image.open(config['image_path'])
        display_image(args, pos, image)
        finish()

    # scroll Up
    elif args.destination.lower() == 'u':
        url, pos = lookup_location(config['history_path'])
        print(f"Scrolling up {url}")
        pos = int(pos)-1
        if pos >= 0:
            store_location(url, pos, config['history_path'])
            image = Image.open(config['image_path'])
            display_image(args, pos, image)
        else:
            print("You're already at the top of this page.")
        finish()

    # if a url is provided, we're going to it
    elif "." in args.destination:
        if validators.url(args.destination):
            to_url = args.destination
        else:
            to_url = f"http://{args.destination}"
        print(f"Loading {to_url}")
        by_url(to_url, args)

    # by label number
    elif args.destination.isnumeric():
        to_url = lookup_link(args.destination, config['links_path'])
        print(f"Linking to {to_url}")
        by_url(to_url, args)

    else:
        print("\n")
        parser.print_help()
