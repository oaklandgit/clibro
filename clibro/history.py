'''Functions for storing Clibro URLs visited and links found'''
import json
import sys
from os.path import exists

def confirm_history(file):
    '''Gives feedback to user if no history file found'''
    if exists(file):
        return

    print("No browse history. Please provide a URL.")
    sys.exit()

def lookup_location(file):
    '''Returns an array with the most-recent history record'''

    confirm_history(file)

    line = None
    with open(file, 'r', encoding='utf8') as read_file:
        for line in read_file:
            pass
        return line.split(',')

def store_location(url, position, file):
    '''Writes the url and vertical position to a text file'''
    with open(file, 'a', encoding='utf8') as write_file:
        write_file.write(f"{url},{position}\n")

def lookup_link(label, file):
    '''Gets the url associated with the link label'''
    with open(file, 'r', encoding='utf8') as read_file:
        link_data=json.load(read_file)
    try:
        return link_data[int(label)]['url']
    except: # pylint: disable=bare-except
        print(f"Link {label} not found.")
        sys.exit()

def get_links(file):
    '''Gets most-recently stored links'''
    with open(file, 'r', encoding='utf8') as read_file:
        return json.load(read_file)

def store_links(links, file):
    '''Writes a link array to a json file'''
    json_data = json.dumps(links, indent=4)

    with open(file, 'w', encoding='utf8') as handler:
        handler.write(json_data)
