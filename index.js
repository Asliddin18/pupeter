const app = require("express")();
const puppeteer=require("puppeteer")

let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}

app.get("/api", async (req, res) => {
  let options = {};

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    };
  }

  try {
    let browser = await puppeteer.launch(options);

    let page = await browser.newPage();
    await page.goto(req.body.pages);
    await page.waitForSelector("#prodImgdiv1 > div")
    var exp = await page.$eval("#prodImgdiv1 > div", (el)=>el.innerHTML)
    res.send(exp);
  } catch (err) {
    console.error(err);
    return null;
  }
});


module.exports = app;