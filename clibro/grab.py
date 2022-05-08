''' Functions for Clibro capturing web pages '''
import sys
from io import BytesIO
from PIL import Image
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options as FirefoxOptions

def connect() -> webdriver:
    '''connect to the webdriver'''
    options=FirefoxOptions()
    options.add_argument('--headless')
    driver = webdriver.Firefox(
            executable_path='/usr/local/bin/geckodriver',
            options=options
        )
    return driver

def fetch_page(url :str) -> tuple[Image, list[dict]]:
    '''visit a page, return screenshot and its links'''

    try:
        driver=connect()
        driver.get(url)

    except Exception as e:
        print(f"Sorry, Clibro couldn't load {url}.\U0001F641")
        print(f"\n=======\n{e}\n=======\n")
        driver.quit()
        sys.exit()

    image_data=driver.get_full_page_screenshot_as_png()
    image=Image.open(BytesIO(image_data))

    # gather links
    link_elements = driver.find_elements(By.TAG_NAME, 'a')

    links = []
    for value in link_elements:
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
    return image, links
