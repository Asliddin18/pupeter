const app = require("express")();
const cheerio = require("cheerio")
const { default:axios } = require("axios");
const cors = require("cors")

let chrome = {};
let puppeteer;
app.use(cors())


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
    await page.goto(req.query.pages);
    await page.waitForSelector("#product-product > div.containerSticky")
    var exp = await page.$eval("#product-product > div.containerSticky" , (el)=>el.innerHTML)
    res.status(200).json({ pages:(JSON.stringify(exp).replaceAll("888-888-3959", "+7 965 222 44 22")) })
  } catch (err) {
    console.error(err);
    return null;
  }
});


app.get("/product/:category/:minicategory/:padcategory", async (req, res) => {
  var url = `https://www.diamondsfactory.com/${req.params.category}/${req.params.minicategory}/${req.params.padcategory}?page=${req.quary.number}`
  const { data } = await axios({
      method: 'GET',
      url: url
  })
  var select = "div.middle-container div.categoryDiv2"
  var a = []
  const $ = cheerio.load(data)
  $(select).each((index, item) => {
      $(item).children().each((index, data) => {
          var pushdata = JSON.parse($(data).attr().onclick.slice(15, -2))
                      var d=$(data, "div.showbox").html()
          var b=d.indexOf('class="sale-label">SALE</div>\n<a')
   

          var t=d.indexOf('tabindex="1" class="catLink"')
      
          var y=d.slice(0,b+33)+d.slice(t)
          pushdata.code = `${y}`
          pushdata.img = $(data).find('img').attr("src")
          a.push(pushdata)
      }
      )
  })
  
  res.status(200).send(a)


})
app.get("/product/:category/:minicategory", async (req, res) => {
  var url = `https://www.diamondsfactory.com/${req.params.category}/${req.params.minicategory}?page=${req.query.number}`
  const { data } = await axios({
      method: 'GET',
      url: url
  })
  var select = "div.middle-container div.categoryDiv2"
  var a = []
  const $ = cheerio.load(data)
  $(select).each((index, item) => {
      $(item).children().each((index, data) => {
          var pushdata = JSON.parse($(data).attr().onclick.slice(15, -2))
                      var d=$(data, "div.showbox").html()
          var b=d.indexOf('class="sale-label">SALE</div>\n<a')
   

          var t=d.indexOf('tabindex="1" class="catLink"')
      
          var y=d.slice(0,b+33)+d.slice(t)
          pushdata.code = `${y}`
          pushdata.img = $(data).find('img').attr("src")
          a.push(pushdata)
      }
      )
  })
 
  res.status(200).send(a)


})

app.get("/product/:category", async (req, res) => {
  var url = `https://www.diamondsfactory.com/${req.params.category}?page=${req.query.number}`
  const { data } = await axios({
      method: 'GET',
      url: url
  })
  var select = "div.middle-container div.categoryDiv2"
  var a = []
  const $ = cheerio.load(data)
  $(select).each((index, item) => {
      $(item).children().each((index, data) => {
          var pushdata = JSON.parse($(data).attr().onclick.slice(15, -2))
          var d=$(data, "div.showbox").html()
          var b=d.indexOf('class="sale-label">SALE</div>\n<a')
   

          var t=d.indexOf('tabindex="1" class="catLink"')
      
          var y=d.slice(0,b+33)+d.slice(t)
          pushdata.code = `${y}`
          pushdata.img = $(data).find('img').attr("src")
          a.push(pushdata)
      }
      )
  })
 
  res.status(200).send(a)


})
app.get('/page/:category/:minicategory', async (req, res) => {
  var url = `https://www.diamondsfactory.com/${req.params.category}/${req.params.minicategory}`
  var a = 0
  const { data } = await axios({
      method: 'GET',
      url: url
  })
  var select = "div.row.row-compact div.col-sm-12.col-xs-12.text-center div.pagination div.links a.paginationlink"

  const $ = cheerio.load(data)
  $(select).each((index, item) => {
    
      if ($(item).text().length <= 3) {
          a = $(item).text()
      }
  })
  res.status(200).send(`${a}`)
})

app.get('/page/:category/:minicategory/:padcategory', async (req, res) => {
  var url = `https://www.diamondsfactory.com/${req.params.category}/${req.params.minicategory}/${req.params.padcategory}`
  var a = 0
  const { data } = await axios({
      method: 'GET',
      url: url
  })
  var select = "div.row.row-compact div.col-sm-12.col-xs-12.text-center div.pagination div.links a.paginationlink"

  const $ = cheerio.load(data)
  $(select).each((index, item) => {
    
      if ($(item).text().length <= 3) {
          a = $(item).text()
      }
  })
  res.status(200).send(`${a}`)
})
app.get('/page/:category', async (req, res) => {
  var url = `https://www.diamondsfactory.com/${req.params.category}`
  var a = 0
  const { data } = await axios({
      method: 'GET',
      url: url
  })
  var select = "div.row.row-compact div.col-sm-12.col-xs-12.text-center div.pagination div.links a.paginationlink"

  const $ = cheerio.load(data)
  $(select).each((index, item) => {
      
      if ($(item).text().length <= 3) {
          a = $(item).text()
      }
  })
  res.status(200).send(`${a}`)
})



app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});

module.exports = app;
