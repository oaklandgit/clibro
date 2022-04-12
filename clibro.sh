#!/usr/bin/env python3
"""A CLI web browser that doesn't move focus away from your current tasks."""

import argparse
import math
import subprocess
import sys
import json
from os.path import exists
import validators
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from PIL import Image, ImageFont, ImageDraw

chrome_options = Options()
chrome_options.add_argument('--headless')
driver = webdriver.Chrome(options=chrome_options)

config = {
    'tmp_img': '/tmp/clibro-img.png',
    'tmp_data': '/tmp/clibro-data.json',
    'label_color': (255, 0, 255) #magenta
}

# set up argument parser
parser = argparse.ArgumentParser()
parser.add_argument("dest", type=str, help="URL to open or link to follow")
parser.add_argument("-w", "--width", default=940, help="The browser width")
parser.add_argument("-f", "--fold", default=600, help="The amount of page to show")
parser.add_argument("-z", "--zoom", default=100, help="Reduce or englarge the imag")

args = parser.parse_args()
dest = args.dest

def display_page(url):
    '''Takes in a url, outputs a screenshot of that page in a supported terminal.'''

    # display the url
    print(f"\nLoading {url}\n")

    driver.get(url)
    driver.set_window_size(args.width, args.fold)
    driver.find_element(by=By.TAG_NAME, value='body').screenshot(config['tmp_img'])

    # gather links
    links = driver.find_elements(By.TAG_NAME, 'a')

    # prepare to label the image
    img = Image.open(config['tmp_img'])
    fnt = ImageFont.load_default()

    editable = ImageDraw.Draw(img)

    # label image and create json
    for index, value in enumerate(links):

        # label image
        link_x = value.location['x']
        link_y = value.location['y'] - 12
        i = str(index)
        # white border
        editable.text((link_x-1, link_y), i, (255,255,255), font=fnt)
        editable.text((link_x+1, link_y), i, (255,255,255), font=fnt)
        editable.text((link_x, link_y-1), i, (255,255,255), font=fnt)
        editable.text((link_x, link_y+1), i, (255,255,255), font=fnt)
        # label
        editable.text((link_x, link_y), i, config['label_color'], font=fnt)

        # build json
        data.append({
            'title': value.text,
            'url': value.get_attribute('href'),
            'x': link_x,
            'y': link_y,
        })

    img.save(config['tmp_img'])

    json_data = json.dumps(data, indent=4)
    with open(config['tmp_data'], 'w', encoding='utf8') as write_file:
        write_file.write(json_data)


    # display the image
    subprocess.call(f"viu -w {math.floor(80.0 * float(args.zoom) * 0.01)} {config['tmp_img']}", shell=True)

    # line break
    print("\n")

# is it a link code or a new url?
if dest.isnumeric() and exists(config['tmp_data']):
    with open(config['tmp_data'], 'r', encoding='utf8') as read_file:
        data = json.load(read_file)
    display_page(data[int(dest)]['url'])

elif validators.url(dest):
    data = []
    display_page(dest)
