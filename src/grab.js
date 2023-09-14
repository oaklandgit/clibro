import puppeteer from "puppeteer"

export const takeScreenshot = async (url, path, width) => {
  const pageDetails = {
    visited: url,
    links: [],
  }

  const browser = await puppeteer.launch({ headless: "new" })
  const page = await browser.newPage()
  await page.setViewport({
    width,
    height: 720, // won't matter. Screenshot will be full page
    deviceScaleFactor: 1,
  })
  await page.goto(url, { waitUntil: "networkidle0" })
  await page.screenshot({ path: path, fullPage: true })
  pageDetails.links = await page.$$eval("a", (links) =>
    links.map((link) => ({
      url: link.href,
      text: link.innerText,
      left: link.getBoundingClientRect().left,
      top: link.getBoundingClientRect().top,
    }))
  )

  await Bun.write("data.json", JSON.stringify(pageDetails))

  browser.close()
  return pageDetails
}
