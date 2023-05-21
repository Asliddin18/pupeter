const app = require("express")();

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
    await page.goto("https://www.diamondsfactory.com/design/white-gold-round-diamond-engagement-ring-clrn34901");
    await page.waitForSelector("#prodImgdiv1 > div")
    var exp = await page.$eval("#prodImgdiv1 > div", (el)=>el.innerHTML)
    res.send(exp);
  } catch (err) {
    console.error(err);
    return null;
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});

module.exports = app;
/* app.post('/category', async (req,res)=>{
  try{
  console.log("test");
const browser = await puppeteer.launch({ headless:true,args:['--no-sandbox']});
const page = await browser.newPage();
var page2='#page-heading'
await page.goto(req.body.pages);
await page.waitForSelector(page2)
var exp=await page.$eval(page2, (el)=>el.innerHTML)
await browser.close();
res.status(200).send(exp)
}catch(err){
  console.log("test2");
  const browser = await puppeteer.launch({
      headless:true,args:['--no-sandbox']
});
}
}) */