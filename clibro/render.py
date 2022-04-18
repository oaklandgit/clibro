from PIL import Image, ImageFont, ImageDraw
from pixcat import Image as Pix 

def crop_label_display(pos, args, links, img_path):
    '''Prepare the screenshotted image for display'''
    print(f"Position {pos}")
    img=Image.open(img_path)
    fnt=ImageFont.truetype('Arial.ttf', args.label_size)
    color=(255,0,255)

    editable=ImageDraw.Draw(img)

    for index, value in enumerate(links):
        x = value['x'] + args.label_offset_x 
        y = value['y'] + args.label_offset_y
        i = str(index)
        editable.text((x, y), f"[{i}]", color, font=fnt)

    Pix(img).fit_screen(enlarge=True).show(crop_h=args.browser_fold)
