import math
import subprocess
import sys
import json
from os.path import exists
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from PIL import Image, ImageFont, ImageDraw

def display_page(
        url,
        img_path,
        data_path,
        data,
        width,
        fold,
        zoom,
        size,
        offx,
        offy,
        font,
        color
    ):
    '''Takes in a url, outputs a screenshot of that page in a supported terminal.'''

    chrome_options = Options()
    chrome_options.add_argument('--headless')
    driver = webdriver.Chrome(options=chrome_options)

    # display the url
    print(f"\nLoading {url}\n")

    driver.get(url)
    driver.set_window_size(width, fold)
    driver.find_element(by=By.TAG_NAME, value='body').screenshot(img_path)

    # gather links
    links = driver.find_elements(By.TAG_NAME, 'a')

    # prepare to label the image
    img = Image.open(img_path)
    # fnt = ImageFont.load_default()
    fnt = ImageFont.truetype(font, size) 
    print(font)
    editable = ImageDraw.Draw(img)

    # label image and create json
    for index, value in enumerate(links):

        i = str(index)

        # label image
        link_x = value.location['x'] + offx 
        link_y = value.location['y'] + offy

        # white border
        offset=size//8
        editable.text((link_x - offset, link_y), i, (255,255,255), font=fnt)
        editable.text((link_x + offset, link_y), i, (255,255,255), font=fnt)
        editable.text((link_x, link_y - offset), i, (255,255,255), font=fnt)
        editable.text((link_x, link_y + offset), i, (255,255,255), font=fnt)
        # label
        editable.text((link_x, link_y), i, color, font=fnt)

        # build json
        data.append({
            'title': value.text,
            'url': value.get_attribute('href'),
            'x': link_x,
            'y': link_y,
        })

    img.save(img_path)

    json_data = json.dumps(data, indent=4)
    with open(data_path, 'w', encoding='utf8') as write_file:
        write_file.write(json_data)

    # display the image
    subprocess.call(f"viu -w {math.floor(80.0 * float(zoom) * 0.01)} {img_path}", shell=True)

    # line break
    print("\n")
