const puppeteer = require('puppeteer');
const fs = require('fs');

var scrapePermission = async (link) => {
  return new Promise(async (resolve, reject) => {
      try {

          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.goto(link, {waitUntil: 'load', timeout: 0});
          
          let permissions = await page.evaluate(() => {
            let results = [];

            let items = document.querySelectorAll('h3.api-name');
            items.forEach((item) => {

              let div = item.parentElement.parentElement;
              let sibs = div.children;

              for(var i = 0; i < sibs.length; i++){
                if(sibs[i].textContent.includes("Manifest.permission.")){

                  results.push({
                    'class': document.querySelector('td.jd-inheritance-class-cell[colspan="1"]').textContent.trim(),
                    'api': item.textContent,
                    'permissionText': sibs[i].textContent.trim()
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

var batchNo = 1;
var links = JSON.parse(fs.readFileSync(`./class_links/classes_${batchNo}.json`));
var permissions = [];

var recursiveScrape = () => {

  var _link = links.pop();
  console.log(_link, links.length);

  scrapePermission(_link).then((_per) => {

    console.log(_per);
    permissions = permissions.concat(_per);

    if(links.length > 0){
      recursiveScrape();
    } else {
      fs.writeFileSync(`./output/apis_${batchNo}.json`, JSON.stringify(permissions));
    }
  });
}

recursiveScrape();