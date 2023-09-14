import { readFileSync } from "fs"
import ansiEscapes from "ansi-escapes"
const Jimp = require("jimp")

const SHADOW_DIST = 2
const LABELS = [Jimp.FONT_SANS_32_WHITE, Jimp.FONT_SANS_32_BLACK]

export const prepareThenRenderImage = async (details, invert, path) => {
  const background = await Jimp.loadFont(LABELS[invert ? 1 : 0])
  const foreground = await Jimp.loadFont(LABELS[invert ? 0 : 1])

  Jimp.read(path)
    .then((image) => {
      ;[background, foreground].forEach((font, offset) => {
        details.links.forEach((link, index) => {
          image.print(
            font,
            link.left + offset * SHADOW_DIST,
            link.top - offset * SHADOW_DIST,
            `[${index}]`
          )
        })
      })

      image.write(path, () => {
        outputImage(path)
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

export const outputImage = async (path) => {
  const image = readFileSync(path)
  console.log(ansiEscapes.image(image))
}
