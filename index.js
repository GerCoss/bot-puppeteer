// const puppeteer = require('puppeteer');
// const fs = require('fs');

// async function run() {
//     const browser = await puppeteer.launch({
//         headless: false
//     });
//     const page = await browser.newPage();
//     await page.setViewport({ width: 1200, height: 1200 });
//     await page.goto('https://www.google.com/search?q=.net+core&rlz=1C1GGRV_enUS785US785&oq=.net+core&aqs=chrome..69i57j69i60l3j69i65j69i60.999j0j7&sourceid=chrome&ie=UTF-8');

//     const IMAGE_SELECTOR = '#tsf > div:nth-child(2) > div > div.logo > a > img';
//     let imageHref = await page.evaluate((sel) => {
//         return document.querySelector(sel).getAttribute('src').replace('/', '');
//     }, IMAGE_SELECTOR);

//     console.log("https://www.google.com/" + imageHref);
//     var viewSource = await page.goto("https://www.google.com/" + imageHref);
//     fs.writeFile(".googles-20th-birthday-us-5142672481189888-s.png", await viewSource.buffer(), function (err) {
//     if (err) {
//         return console.log(err);
//     }

//     console.log("The file was saved!");
// });

//     browser.close();
// }

// run();

const puppeteer = require('puppeteer');
const fs = require('fs');
const config = require('./config.json');
const cookies = require('./cookies.json');

(async () => {

    let browser = await puppeteer.launch({headless: false});
    let page = await browser.newPage();

    if(Object.keys(cookies).length){

        await page.setCookie(...cookies);

        await page.goto('https://www.facebook.com/', {waitUntil: 'networkidle2'});

    }else{

        await page.goto('https://www.facebook.com/login/', {waitUntil: 'networkidle0'});
        console.log(config.user);
        await page.type('#email', config.user, {delay: 30});
        await page.type('#pass', config.password, {delay: 30});

        await page.click('#loginbutton');

        await page.waitForNavigation({waitUntil: 'networkidle0'});
        await page.waitFor(15000);

        let currentCookies = await page.cookies();
        console.log(currentCookies);
        fs.writeFileSync('./cookies.json', JSON.stringify(currentCookies));

        try{
            await page.waitFor('[date-click="profile_icon"]');
        }catch(error){
            console.log('Failed to login.');
            process.exit(0);
        }

        //  currentCookies = await page.cookies();

        // fs.writeFileSync('./cookies.json', JSON.stringify(currentCookies));
    }

    debugger;

})();

// await page.waitFor(10000);
// const text = await page.evaluate(() => Array.from(document.querySelectorAll('td>a[href*="mega"]'), element => element.href));
// let word = text[0];
// console.log(decodeURIComponent(word.substr(word.indexOf("=ht")+1)));

// word=document.querySelectorAll('td>a[href*="mega"]')[0].href;
// link=word.substr(word.indexOf("=ht")+1);
// decodeURIComponent(link);