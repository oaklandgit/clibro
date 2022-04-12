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

from display import display_page

config={
    'tmp_image':'/tmp/clibro.png',
    'tmp_data':'/tmp/clibro.json',
    'font':'Arial.ttf'
}

# set up argument parser
parser = argparse.ArgumentParser()
parser.add_argument("dest", type=str, help="URL to open or link to follow")
parser.add_argument("-w", "--browser-width", default=1200, help="The browser width")
parser.add_argument("-f", "--browser-fold", default=800, help="The amount of page to show")
parser.add_argument("-z", "--image-zoom", default=100, help="Reduce or englarge the image")
parser.add_argument("-s", "--label-size", type=int, default=22, help="Customize label size")
parser.add_argument("-x", "--label-offset-x", type=int, default=-22, help="X offset of the labels")
parser.add_argument("-y", "--label-offset-y", type=int, default=-22, help="Y offset of the labels")

args = parser.parse_args()

# is it a link code or a new url?
if args.dest.isnumeric() and exists(config['tmp_data']):
    with open(config['tmp_data'], 'r', encoding='utf8') as read_file:
        link_data=json.load(read_file)
        dest=link_data[int(args.dest)]['url']

elif validators.url(args.dest):
    link_data=[]
    dest=args.dest

else:
    print("Enter a valid URL or link label.")
    quit()
    
display_page(
    url=dest,
    data=link_data,
    width=args.browser_width,
    fold=args.browser_fold,
    zoom=args.image_zoom,
    size=args.label_size,
    offx=args.label_offset_x,
    offy=args.label_offset_y,
    img_path=config['tmp_image'],
    data_path=config['tmp_data'],
    font=config['font'],
    color=(255, 0, 255)
)
