import fs from "node:fs"
const Jimp = require("jimp")
import ansiEscapes from "ansi-escapes"

export const prepareThenRenderImage = async (details, path) => {
  const white = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE)
  const black = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK)

  Jimp.read(path)
    .then((image) => {
      ;[black, white].forEach((font, offset) => {
        details.links.forEach((link, index) => {
          image.print(
            font,
            link.top * 2 - offset,
            link.left * 2 + offset,
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
