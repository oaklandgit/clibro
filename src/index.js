#!/usr/bin/env bun

import meow from "meow"
import { takeScreenshot } from "./grab"
import { prepareThenRenderImage } from "./render"

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
  const pageDetails = await takeScreenshot(url, SCREENSHOT, {
    w: cli.flags.width,
    h: cli.flags.height,
    s: cli.flags.scale,
  })
  prepareThenRenderImage(pageDetails, SCREENSHOT)
}

handleUserInput(cli.input[0])
