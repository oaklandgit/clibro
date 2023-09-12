#!/usr/bin/env bun

import meow from "meow"
import puppeteer from "puppeteer"
import fs from "node:fs"
import ansiEscapes from "ansi-escapes"

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

const takeScreenshot = async (url, w = 1280, h = 720) => {
  const browser = await puppeteer.launch({ headless: "new" })
  const page = await browser.newPage()
  await page.setViewport({ width: w, height: h })
  await page.goto(url, { waitUntil: "networkidle0" })
  await page.screenshot({ path: SCREENSHOT })
  await browser.close()
}

const renderImage = (path) => {
  const image = fs.readFileSync(path)
  console.log(ansiEscapes.image(image))
}

if (isUrl(cli.input.at(0))) {
  console.log("Grabbing screenshot...")
  await takeScreenshot(cli.input.at(0))
  renderImage(SCREENSHOT)
} else {
  console.log("Please provide a valid URL")
}
