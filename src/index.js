#!/usr/bin/env bun

import meow from "meow"
import puppeteer from "puppeteer"
import fs from "node:fs"
import ansiEscapes from "ansi-escapes"

const SCREENSHOT = "screenshot.png"

const cli = meow("meow!", {
  importMeta: import.meta,
  flags: {
    rainbow: {
      type: "boolean",
      shortFlag: "r",
    },
  },
})

const takeScreenshot = async (url, w = 1280, h = 720) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({ width: w, height: h })
  await page.goto(url, { waitUntil: "networkidle0" })
  await page.screenshot({ path: SCREENSHOT })
  await browser.close()
}

await takeScreenshot(cli.input.at(0))

const image = fs.readFileSync(SCREENSHOT)

console.log(ansiEscapes.image(image))
console.log(cli.input.at(0), cli.flags)
