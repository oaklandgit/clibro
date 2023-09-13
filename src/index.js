#!/usr/bin/env bun

import meow from "meow"
import { takeScreenshot } from "./grab"
import { prepareThenRenderImage } from "./render"

const Spinner = require("cli-spinner").Spinner

const SCREENSHOT = "screenshot.png"

const cli = meow("Clibro", {
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
    invert: {
      type: "boolean",
      shortFlag: "i",
      default: false,
    },
  },
})

const urlPattern =
  /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g
const labelPattern = /[0-9]/g

const handleUserInput = (input) => {
  if (urlPattern.test(input)) {
    handleUrl(input)
  } else if (input === "D") {
    handleScroll(1)
  } else if (input === "U") {
    handleScroll(-1)
  } else if (labelPattern.test(input)) {
    handleLink(input)
  } else {
    console.log(`Invalid input: ${input}. Try 'bro --help' for help.`)
  }
}

const handleScroll = (dir) => {
  const spinner = new Spinner(`Scrolling ${dir < 0 ? "up" : "down"}... %s`)
  spinner.setSpinnerString("|/-\\")
  spinner.start()
  // TODO: scroll down
  spinner.stop()
}

const handleUrl = async (url) => {
  const start = Date.now()
  const spinner = new Spinner(`Grabbing ${url}... %s`)
  spinner.setSpinnerString("|/-\\")
  spinner.start()

  const pageDetails = await takeScreenshot(url, SCREENSHOT, {
    w: cli.flags.width,
    h: cli.flags.height,
    s: cli.flags.scale,
  })
  await prepareThenRenderImage(pageDetails, cli.flags.invert, SCREENSHOT)
  console.log()
  spinner.stop()
  console.log(`Done in ${(Date.now() - start) / 1000} seconds`)
}

const handleLink = (num) => {
  const spinner = new Spinner(`Loading link #${num} %s`)
  spinner.setSpinnerString("|/-\\")
  spinner.start()
  // TODO: load link
  spinner.stop()
}

handleUserInput(cli.input[0])
