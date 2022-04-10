#!/usr/bin/env python3
"""A CLI web browser that doesn't move focus away from your current tasks."""

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
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')
chrome_options.add_argument('--headless')
driver = webdriver.Chrome(options=chrome_options)

config = {
    'tmp_img': '/tmp/clibro-img.png',
    'tmp_data': '/tmp/clibro-data.json',
    'image_cols': 80,
    'browser_width': 940,
    'browser_fold': 600,
    'label_color': (255, 0, 255) #magenta
}

# get argument
arg = sys.argv[1]


def display_page(url):
    '''Takes in a url, outputs a screenshot of that page in a supported terminal.'''
    driver.get(url)
    driver.set_window_size(config['browser_width'], config['browser_fold'])
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

    # display the url
    print(f"\n{url}\n")

    # display the image
    subprocess.call(f"viu -w {config['image_cols']} {config['tmp_img']}", shell=True)

    # line break
    print("\n")

# is it a link code or a new url?
if arg.isnumeric() and exists(config['tmp_data']):
    with open(config['tmp_data'], 'r', encoding='utf8') as read_file:
        data = json.load(read_file)
    display_page(data[int(arg)]['url'])

elif validators.url(arg):
    data = []
    display_page(arg)
else:
    print('Usage notes…')
