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
              let links = document.querySelectorAll('td.jd-linkcol');
              
              links.forEach(link => {
                results.push(link.firstChild.href)
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
    fs.writeFileSync('./links.json', JSON.stringify(_links));
});
  