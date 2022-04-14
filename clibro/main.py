"""A CLI web browser that doesn't move focus away from your current tasks."""

import argparse
from route import route_request
from display import display_page
from history import write_history

config={
    'tmp_history': '/tmp/clibro.txt',
    'tmp_image':'/tmp/clibro.png',
    'tmp_data':'/tmp/clibro.json',
    'font':'Arial.ttf'
}

parser = argparse.ArgumentParser(prog='clibro')
parser.add_argument("destination", nargs='?', default=False, type=str, help="URL to open or link to follow, or omit for last page visited")
parser.add_argument("-w", "--browser-width", default=1200, help="The browser width")
parser.add_argument("-f", "--browser-fold", default=800, help="The amount of page to show")
parser.add_argument("-z", "--image-zoom", default=100, help="Reduce or englarge the image")
parser.add_argument("-s", "--label-size", type=int, default=22, help="Customize label size")
parser.add_argument("-x", "--label-offset-x", type=int, default=-22, help="X offset of the labels")
parser.add_argument("-y", "--label-offset-y", type=int, default=-22, help="Y offset of the labels")

args=parser.parse_args()

url,position=route_request(
    dest=args.destination,
    history_file=config['tmp_history'],
    links_file=config['tmp_data']
)

if url==False:
    print("\nNo Clibro browse history found. Please provide a URL.\n")
    parser.print_help()
    print("\n")
    quit()

display_page(
    url=url,
    width=args.browser_width,
    position=position, 
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

write_history(
    url=url,
    position=position,
    file=config['tmp_history']
)
