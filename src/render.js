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

const outputImageKitty = (imageBuffer) => {
  const b64 = imageBuffer.toString("base64")
  const chunkSize = 4096
  for (let i = 0; i < b64.length; i += chunkSize) {
    const chunk = b64.slice(i, i + chunkSize)
    const isFirst = i === 0
    const isLast = i + chunkSize >= b64.length
    const header = isFirst ? "a=T,f=100," : ""
    const more = isLast ? "m=0" : "m=1"
    process.stdout.write(`\x1b_G${header}${more};${chunk}\x1b\\`)
  }
  process.stdout.write("\n")
}

export const outputImage = async (path) => {
  const image = readFileSync(path)
  const term = process.env.TERM_PROGRAM ?? ""
  if (term === "iTerm.app") {
    console.log(ansiEscapes.image(image))
  } else {
    outputImageKitty(image)
  }
}
