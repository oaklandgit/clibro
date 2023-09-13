#!/usr/bin/env bun

import meow from "meow"
import puppeteer from "puppeteer"
import fs from "node:fs"
import ansiEscapes from "ansi-escapes"

const Jimp = require("jimp")

const SCREENSHOT = "screenshot.png"

const cli = meow("meow!", {
  importMeta: import.meta,
  flags: {
    width: {
      type: "number",
      shortFlag: "w",
      default: 1280,
    },
    height: {
      type: "number",
      shortFlag: "h",
      // empty for full page
    },
    scale: {
      type: "number",
      shortFlag: "s",
      default: 1,
    },
  },
})

const pageDetails = {
  links: [],
}

const takeScreenshot = async (
  url,
  path,
  w = cli.flags.width,
  h = cli.flags.height
) => {
  const browser = await puppeteer.launch({ headless: "new" })
  const page = await browser.newPage()
  await page.setViewport({
    width: w,
    height: h ? h : 720,
    deviceScaleFactor: cli.flags.scale,
  })
  await page.goto(url, { waitUntil: "networkidle0" })
  await page.screenshot({ path: path, fullPage: h ? false : true })
  pageDetails.links = await page.$$eval("a", (links) =>
    links.map((link) => ({
      url: link.href,
      text: link.innerText,
      top: link.getBoundingClientRect().top,
      left: link.getBoundingClientRect().left,
    }))
  )
  await browser.close()
}

const outputImage = async (path) => {
  const image = fs.readFileSync(path)
  console.log(ansiEscapes.image(image))
}

const prepareThenRenderImage = async (path) => {
  const white = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE)
  const black = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK)

  Jimp.read(path)
    .then((image) => {
      ;[black, white].forEach((font, offset) => {
        pageDetails.links.forEach((link, index) => {
          image.print(
            font,
            link.top * 2 - offset,
            link.left * 2 + offset,
            index.toString()
          )
        })
      })

      image.write(path, () => outputImage(path))
      console.log("Done in X seconds")
    })
    .catch((err) => {
      console.log(err)
    })
}

const patterns = {
  url: /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g,
  code: /^[DU]$/g,
  label: /[0-9]/g,
}

const handleUserInput = (input) => {
  if (patterns.url.test(input)) {
    handleUrl(input)
  } else if (patterns.code.test(input)) {
    console.log("That was a code!")
  } else if (patterns.label.test(input)) {
    console.log("That was a numeric label!")
  } else {
    console.log("Unknown")
  }
}

const handleUrl = async (url) => {
  console.log(`Grabbing screenshot of ${url}...`)
  await takeScreenshot(url, SCREENSHOT)
  prepareThenRenderImage(SCREENSHOT)
}

handleUserInput(cli.input[0])
