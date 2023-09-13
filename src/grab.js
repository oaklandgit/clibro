import puppeteer from "puppeteer"

const pageDetails = {
  links: [],
}

export const takeScreenshot = async (url, path, config) => {
  const browser = await puppeteer.launch({ headless: "new" })
  const page = await browser.newPage()
  await page.setViewport({
    width: config.w,
    height: config.h ? config.h : 720,
    deviceScaleFactor: config.s,
  })
  await page.goto(url, { waitUntil: "networkidle0" })
  await page.screenshot({ path: path, fullPage: config.h ? false : true })
  pageDetails.links = await page.$$eval("a", (links) =>
    links.map((link) => ({
      url: link.href,
      text: link.innerText,
      top: link.getBoundingClientRect().top,
      left: link.getBoundingClientRect().left,
    }))
  )
  browser.close()
  return pageDetails
}
