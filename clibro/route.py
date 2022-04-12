import validators
import json
from os.path import exists

def route_request(dest, history_file, links_file):
    '''Takes the user-supplied destination and figures out where to go'''
    
    # if no destination provided, fetch the last URL from history 
    if dest == False and exists(history_file):
        with open(history_file, 'r', encoding='utf8') as read_file:
            for url in read_file:
                pass
            return url

    # if no destination provided and there's no browse history, return false
    if dest == False:
        return False

    # if a number is provided, we're following a link
    if dest.isnumeric() and exists(links_file):
        with open(links_file, 'r', encoding='utf8') as read_file:
            link_data=json.load(read_file)
            url=link_data[int(dest)]['url']
        with open(history_file, 'a', encoding='utf8') as write_file:
            write_file.write(f"{url}\n")
        return url
    
    # if a url is provided, we're going to it
    if validators.url(dest):
        with open(history_file, 'a', encoding='utf8') as write_file:
            write_file.write(f"{dest}\n")
        return dest
