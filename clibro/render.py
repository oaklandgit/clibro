'''Functions for displaying the Clibro request to the user'''
from PIL import ImageFont, ImageDraw, Image
from pixcat import Image as Pix

def label_image(
        args: dict[str,str],
        links: list[dict],
        image: Image
        ) -> Image:
    '''Prepare the screenshotted image for display'''
    fnt=ImageFont.truetype('Arial.ttf', args.label_size)
    black=(0,0,0)
    white=(255,255,255)

    ctx=ImageDraw.Draw(image)

    for index, value in enumerate(links):

        label_x = value['x'] + value['width']/2
        label_y = value['y']
        ctx.text((label_x, label_y), f"{index}", white, font=fnt,
                stroke_width=2, stroke_fill=black, anchor="mt")

    return image

def display_image(
        args: dict[str, str],
        pos: str,
        image: Image
        ) -> None:
    '''Crop and output the Clibro image to the terminal'''
    left = 0
    top = int(pos) * int(args.browser_fold)
    right = image.size[0]
    bottom = top + int(args.browser_fold)

    image = image.crop((left, top, right, bottom))

    Pix(image).fit_screen(enlarge=True).show()
