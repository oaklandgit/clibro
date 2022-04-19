'''Functions for displaying the Clibro request to the user'''
from PIL import Image, ImageFont, ImageDraw
from pixcat import Image as Pix

def label_image(args, links, img_path):
    '''Prepare the screenshotted image for display'''
    img=Image.open(img_path)
    fnt=ImageFont.truetype('Arial.ttf', args.label_size)
    black=(0,0,0)
    white=(255,255,255)

    editable=ImageDraw.Draw(img)

    for index, value in enumerate(links):
        label = f"{index}"
        char_width, _char_height=editable.textsize(label)
        label_x = value['x'] + value['width']/2 - char_width/2
        label_y = value['y']
        editable.text((label_x, label_y), label, white, font=fnt, stroke_width=2, stroke_fill=black)
    img.save(img_path)

def display_image(args, pos, img_path):
    '''Crop and output the Clibro image to the terminal'''
    img=Image.open(img_path)

    left = 0
    top = int(pos) * int(args.browser_fold)
    right = img.size[0]
    bottom = top + int(args.browser_fold)

    cropped = img.crop((left, top, right, bottom))

    Pix(cropped).fit_screen(enlarge=True).show()
