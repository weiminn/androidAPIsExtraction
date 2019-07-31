const puppeteer = require('puppeteer');
const fs = require('fs');

var scrapePermission = async (link) => {
  return new Promise(async (resolve, reject) => {
      try {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.goto(link);
          
          let permissions = await page.evaluate(() => {
            let results = [];
            let items = document.querySelectorAll('h3.api-name');
            items.forEach((item) => {
              let apiName = item.textContent;
              let div = item.parentElement.parentElement;
              let sibs = div.children;
              for(var i = 0; i < sibs.length; i++){
                if(sibs[i].textContent.includes("Manifest.permission.")){
                  results.push({
                    'api': apiName,
                    'permission': sibs[i].textContent
                  });
                  break;
                }
              }
            });
            return results;
          });
          browser.close();
          return resolve(permissions);
      } catch (e) {
          return reject(e);
      }
  });
}

var links = JSON.parse(fs.readFileSync('./links.json'));
var permissions = [];

var recursiveScrape = () => {
  var _link = links.pop();
  scrapePermission(_link).then((_per) => {

    // console.log(_link, links.length);
    // console.log(_per);

    permissions = permissions.concat(_per);

    if(links.length > 0){
      recursiveScrape();
    } else {
      fs.writeFileSync('./permissions2.json', JSON.stringify(permissions));
    }
  });
}

recursiveScrape();