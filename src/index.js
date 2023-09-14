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
  } else if (labelPattern.test(input)) {
    handleLink(input)
  } else {
    handleEmpty(input)
  }
}

const handleEmpty = async () => {
  const path = "data.json"
  const file = Bun.file(path)
  const data = await file.json()
  handleUrl(data.visited)
}

const handleUrl = async (url) => {
  const start = Date.now()
  const spinner = new Spinner(`Grabbing ${url}... %s`)
  spinner.setSpinnerString("|/-\\")
  spinner.start()

  const pageDetails = await takeScreenshot(url, SCREENSHOT, cli.flags.width)
  await prepareThenRenderImage(pageDetails, cli.flags.invert, SCREENSHOT)
  console.log()
  spinner.stop()
  console.log(`Done in ${(Date.now() - start) / 1000} seconds`)
}

const handleLink = async (num) => {
  const spinner = new Spinner(`Loading link #${num} %s`)
  spinner.setSpinnerString("|/-\\")
  spinner.start()

  const path = "data.json"
  const data = Bun.file(path)
  const contents = await data.json()
  spinner.stop()

  if (contents.links[num].url) {
    handleUrl(contents.links[num].url)
  } else {
    console.log(`Link #${num} doesn't exist, bro.`)
  }
}

handleUserInput(cli.input[0])
