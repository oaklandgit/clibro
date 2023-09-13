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
    },
  },
})

const pageDetails = {
  links: [],
}

const takeScreenshot = async (url, path, w = 1280, h = 720) => {
  const browser = await puppeteer.launch({ headless: "new" })
  const page = await browser.newPage()
  await page.setViewport({ width: w, height: h })
  await page.goto(url, { waitUntil: "networkidle0" })
  await page.screenshot({ path: path })
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
  console.log(pageDetails.links)
}

const prepareThenRenderImage = async (path) => {
  Jimp.read(path)
    .then((image) => {
      image.flip(true, true)
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
