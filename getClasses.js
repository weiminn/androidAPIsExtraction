const puppeteer = require('puppeteer');
const fs = require('fs');

var getLinks = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto("https://developer.android.com/reference/classes");
            
            let l = await page.evaluate(() => {
              
              let results = [];
              let _batch = [];

              let links = document.querySelectorAll('td.jd-linkcol');
              
              links.forEach(link => {
                _batch.push(link.firstChild.href)
                if(_batch.length == 500){
                  results.push(_batch);
                  _batch = [];
                }
              });
  
              return results;
  
            });
            browser.close();
            return resolve(l);
        } catch (e) {
            return reject(e);
        }
    });
  }
  
getLinks().then(_links => {
  var batchNo = 1;
  _links.forEach(batch => {
    fs.writeFileSync(`./class_links/classes_${batchNo}.json`, JSON.stringify(batch));
    batchNo++;
  })
    
});
  