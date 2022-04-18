import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

def fetch_page(url, img_path):
    '''controller for screenshotting a page and returning its links'''

    # headless browse 
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    driver = webdriver.Chrome(options=chrome_options)
    driver.maximize_window()
    driver.get(url)
    
    # screenshot
    s = driver.get_window_size()
    #w = driver.execute_script('return document.body.parentNode.scrollWidth')
    h = driver.execute_script('return document.body.parentNode.scrollHeight')
    driver.set_window_size(1200, h)
    driver.find_element(by=By.TAG_NAME, value='body').screenshot(img_path)

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
