#!/usr/bin/env bun

import meow from "meow"
import puppeteer from "puppeteer"
import fs from "node:fs"
import ansiEscapes from "ansi-escapes"

const Jimp = require("jimp")

const SCREENSHOT = "screenshot.png"

const isUrl = (str) => {
  let url
  try {
    url = new URL(str)
  } catch (_) {
    return false
  }
  return url.protocol === "http:" || url.protocol === "https:"
}

const cli = meow("meow!", {
  importMeta: import.meta,
  flags: {
    width: {
      type: "number",
      shortFlag: "w",
    },
  },
})

const takeScreenshot = async (url, path, w = 1280, h = 720) => {
  const browser = await puppeteer.launch({ headless: "new" })
  const page = await browser.newPage()
  await page.setViewport({ width: w, height: h })
  await page.goto(url, { waitUntil: "networkidle0" })
  await page.screenshot({ path: path })
  await browser.close()
}

const renderImage = async (path) => {
  const image = fs.readFileSync(path)
  console.log(ansiEscapes.image(image))
}

const prepareThenRenderImage = async (path) => {
  Jimp.read(path)
    .then((image) => {
      image.flip(true, true)
      image.write(path, () => renderImage(path))
      console.log("Done in X seconds")
    })
    .catch((err) => {
      console.log(err)
    })
}

const handleUserInput = (input) => {
  if (isUrl(input)) {
    handleUrlRequest(input)
  } else if (isUrl("http://" + input)) {
    handleUrlRequest("http://" + input)
  } else {
    switch (input) {
      case "A":
        console.log("option A selected")
        break

      case "B":
        console.log("option B selected")
        break

      default:
        console.log("Please provide a valid URL")
        break
    }
  }
}

const handleUrlRequest = (url) => {
  console.log(`Grabbing screenshot of ${url}...`)
  takeScreenshot(url, SCREENSHOT)
  prepareThenRenderImage(SCREENSHOT)
}

handleUserInput(cli.input[0])
