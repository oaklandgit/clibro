#!/usr/bin/env python3

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from PIL import Image, ImageFont, ImageDraw
import subprocess
import sys
import json
import validators
from os.path import exists
 
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


def displayPage(url):
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
        x = value.location['x']
        y = value.location['y'] - 12
        i = str(index)
        # white border
        editable.text((x-1, y), i, (255,255,255), font=fnt)
        editable.text((x+1, y), i, (255,255,255), font=fnt)
        editable.text((x, y-1), i, (255,255,255), font=fnt)
        editable.text((x, y+1), i, (255,255,255), font=fnt)
        # label
        editable.text((x, y), i, config['label_color'], font=fnt)

        # build json
        data.append({
            'title': value.text,
            'url': value.get_attribute('href'),
            'x': x,
            'y': y,
        })

    img.save(config['tmp_img'])
    file = open(config['tmp_data'],'w')
    json_data = json.dumps(data, indent=4)    
    file.write(json_data)
    file.close()

    # display the image
    out = subprocess.call(f"viu -w {config['image_cols']} {config['tmp_img']}", shell=True)

# is it a link code or a new url?
if arg.isnumeric() and exists(config['tmp_data']):
    file = open(config['tmp_data'], 'r')
    data = json.load(file)
    displayPage(data[int(arg)]['url'])

elif validators.url(arg):
    data = []
    displayPage(arg)
else:
    print('Usage notes…')
