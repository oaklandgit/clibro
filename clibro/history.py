import json

def write_history(url, position, file):
    '''Captures the url and vertical position in a log file'''
    with open(file, 'a', encoding='utf8') as write_file:
        write_file.write(f"{url},{position}\n")

def get_recent_page(file):
    '''Returns an array with the most-recent history record'''
    with open(file, 'r', encoding='utf8') as read_file:
        for line in read_file:
            pass
        return line.split(',')

def get_url_by_id(label, file):
    '''Gets the url associated with the link label'''
    with open(file, 'r', encoding='utf8') as read_file:
        link_data=json.load(read_file)
        return link_data[int(label)]['url']
