#!/usr/bin/env bun

import meow from "meow"
import { mkdirSync } from "fs"
import { unlink } from "fs/promises"
import { takeScreenshot } from "./grab"
import { prepareThenRenderImage } from "./render"

const Spinner = require("cli-spinner").Spinner

const HOME = process.env.HOME
const DATA_DIR = `${HOME}/Library/Application Support/clibro`
const CACHE_DIR = `${HOME}/Library/Caches/clibro`
const DATA_PATH = `${DATA_DIR}/data.json`
const SCREENSHOT = `${CACHE_DIR}/screenshot.png`

mkdirSync(DATA_DIR, { recursive: true })
mkdirSync(CACHE_DIR, { recursive: true })

const HELP_TEXT = `

 ######  ##       #### ########  ########   #######  
##    ## ##        ##  ##     ## ##     ## ##     ## 
##       ##        ##  ##     ## ##     ## ##     ## 
##       ##        ##  ########  ########  ##     ## 
##       ##        ##  ##     ## ##   ##   ##     ## 
##    ## ##        ##  ##     ## ##    ##  ##     ## 
 ######  ######## #### ########  ##     ##  #######  

Requires:         Any graphics-capable terminal on macOS (iTerm2, Kitty, Ghostty) and Bun.

Usage:

  $ bro <url>     Present a screenshot of the url in the terminal. Must include http:// or https://
  $ bro <number>  Follow a link by the numbered label in the previous screenshot
  $ bro clear     Clear history (deletes saved URL, links, and screenshot)

Flags:

  -w, --width     Set the width of the virtual browser's viewport (default: 1280)
  -i, --invert    Invert the labels if needed for better readabiliy
  -h, --help      Show this help message

Visit https://github.com/oaklandgit/clibro for more information.

=====
`

const cli = meow(HELP_TEXT, {
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

const handleClear = async () => {
  await Promise.all([
    Bun.file(DATA_PATH)
      .exists()
      .then((exists) => exists && unlink(DATA_PATH)),
    Bun.file(SCREENSHOT)
      .exists()
      .then((exists) => exists && unlink(SCREENSHOT)),
  ])
  console.log("History cleared.")
}

const handleUserInput = (input) => {
  if (input === "clear") {
    handleClear()
  } else if (urlPattern.test(input)) {
    handleUrl(input)
  } else if (labelPattern.test(input)) {
    handleLink(input)
  } else {
    handleEmpty(input)
  }
}

const handleEmpty = async () => {
  const file = Bun.file(DATA_PATH)
  try {
    const data = await file.json()
    handleUrl(data.visited)
  } catch (_) {
    cli.showHelp()
  }
}

const handleUrl = async (url) => {
  const start = Date.now()
  const spinner = new Spinner(`Grabbing ${url}... %s`)
  spinner.setSpinnerString("|/-\\")
  spinner.start()

  try {
    const pageDetails = await takeScreenshot(
      url,
      SCREENSHOT,
      DATA_PATH,
      cli.flags.width,
    )
    await prepareThenRenderImage(pageDetails, cli.flags.invert, SCREENSHOT)
    console.log()
    spinner.stop()
    console.log(`Done in ${(Date.now() - start) / 1000} seconds`)
  } catch (err) {
    spinner.stop()
    console.error(
      `\nCouldn't load "${url}". Make sure it's a valid URL including http:// or https://.`,
    )
  }
}

const handleLink = async (num) => {
  const spinner = new Spinner(`Loading link #${num} %s`)
  spinner.setSpinnerString("|/-\\")
  spinner.start()

  const contents = await Bun.file(DATA_PATH).json()
  spinner.stop()

  if (contents.links[num].url) {
    handleUrl(contents.links[num].url)
  } else {
    console.log(`Link #${num} doesn't exist, bro.`)
  }
}

if (process.argv.includes("-h")) {
  cli.showHelp()
} else {
  handleUserInput(cli.input[0])
}
