import fs from "node:fs"
const Jimp = require("jimp")
import ansiEscapes from "ansi-escapes"

export const prepareThenRenderImage = async (details, invert, path) => {
  const labels = [Jimp.FONT_SANS_32_WHITE, Jimp.FONT_SANS_32_BLACK]
  const background = await Jimp.loadFont(labels[invert ? 1 : 0])
  const foreground = await Jimp.loadFont(labels[invert ? 0 : 1])

  Jimp.read(path)
    .then((image) => {
      ;[background, foreground].forEach((font, offset) => {
        details.links.forEach((link, index) => {
          image.print(
            font,
            link.left + offset * 3,
            link.top - offset * 3,
            index.toString()
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
  const image = fs.readFileSync(path)
  console.log(ansiEscapes.image(image))
}
