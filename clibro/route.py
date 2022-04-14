import validators
import json
from os.path import exists
from history import get_recent_page, get_url_by_id 

def route_request(dest, history_file, links_file):
    '''Takes the user-supplied destination and figures out where to go'''
    
    # if no destination provided, fetch the last URL from history 
    if dest == False and exists(history_file):
        record=get_recent_page(history_file)
        url=record[0]
        pos=record[1]
        return url, pos
    
    # if D (scroll Down) provided, fetch the last URL from history + scroll down
    if dest == 'D' and exists(history_file):
        record=get_recent_page(history_file)
        url=record[0]
        pos=int(record[1])+1
        return url, pos

    # if U (scroll Up) provided, fetch the last URL from history + scroll up
    if dest == 'U' and exists(history_file):
        record=get_recent_page(history_file)
        url=record[0]
        if record[1]==0:
            print("You're already at the top of this page.")
            quit()
        else:
            pos=int(record[1])-1
            return url, pos

    # if no destination provided and there's no browse history, return false
    if dest == False:
        return False, False

    # if a number is provided, we're following a link
    if dest.isnumeric() and exists(links_file):
        url=get_url_by_id(dest, links_file)
        return url, 0
    
    # if a url is provided, we're going to it
    if validators.url(dest):
        return dest, 0
