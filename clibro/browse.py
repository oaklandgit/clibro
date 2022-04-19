import json
from time import sleep
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options as FirefoxOptions

def connect():
    '''connect to the webdriver'''
    options=FirefoxOptions()
    options.add_argument('--headless')
    driver = webdriver.Firefox(options=options)

    return driver


def fetch_page(url, img_path):
    '''screenshot a page and return its links'''
    driver=connect()
    driver.get(url)
    sleep(0.25)
    driver.save_full_page_screenshot(img_path) 
    
    # gather links
    linkElements = driver.find_elements(By.TAG_NAME, 'a')

    links = []
    for index, value in enumerate(linkElements):
        links.append({
            'title': value.text,
            'url': value.get_attribute('href'),
            'x': value.location['x'],
            'y': value.location['y'],
            'width': value.rect['width'],
            'height': value.rect['height']
        })

    # done with driver
    driver.quit()
   
    return links 
