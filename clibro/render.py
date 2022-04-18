from PIL import Image, ImageFont, ImageDraw
from pixcat import Image as Pix 

def label_image(args, links, img_path):
    '''Prepare the screenshotted image for display'''
    img=Image.open(img_path)
    fnt=ImageFont.truetype('Arial.ttf', args.label_size)
    color=(255,0,255)

    editable=ImageDraw.Draw(img)

    for index, value in enumerate(links):
        x = value['x'] + args.label_offset_x 
        y = value['y'] + args.label_offset_y
        i = str(index)
        editable.text((x, y), f"[{i}]", color, font=fnt)
    
    img.save(img_path)

def display_image(args, pos, img_path):
    
    img=Image.open(img_path)

    left = 0
    top = int(pos) * int(args.browser_fold)
    right = img.size[0]
    bottom = top + int(args.browser_fold)

    cropped = img.crop((left, top, right, bottom))

    Pix(cropped).show()
