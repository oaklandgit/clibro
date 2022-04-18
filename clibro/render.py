from PIL import Image, ImageFont, ImageDraw
from pixcat import Image as Pix 

def label_image(args, links, img_path):
    '''Prepare the screenshotted image for display'''
    img=Image.open(img_path)
    fnt=ImageFont.truetype('Arial.ttf', args.label_size)
    color=(255,0,255)

    editable=ImageDraw.Draw(img)

    for index, value in enumerate(links):
        i = str(index)
        label = f"{i}"
        charWidth, charHeight = editable.textsize(label)
        x = value['x'] + value['width']/2 - charWidth/2
        y = value['y']
        editable.text((x, y), label, color, font=fnt)
    
    img.save(img_path)

def display_image(args, pos, img_path):
    
    img=Image.open(img_path)

    left = 0
    top = int(pos) * int(args.browser_fold)
    right = img.size[0]
    bottom = top + int(args.browser_fold)

    cropped = img.crop((left, top, right, bottom))

    Pix(cropped).fit_screen(enlarge=True).show()
