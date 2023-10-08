const puppeteer = require("puppeteer-core");
const fs = require("fs");
const pupProp = {
    headless: false,
    // headless: true,
    args: [
        // `--no-sandbox`,
        // `--disable-setuid-sandbox`,
        // `--disable-dev-shm-usage`,
        // `--disable-accelerated-2d-canvas`,
        // `--no-first-run`,
        // `--no-zygote`,
        // `--single-process`, // <- this one doesn't works in Windows
        // `--disable-gpu`,
    ],
    // executablePath: `/usr/bin/google-chrome-stable`,
    // executablePath: `C:/Program Files (x86)/Google/Chrome/Application/chrome.exe`,
    executablePath: `C:/Program Files/Google/Chrome/Application/chrome.exe`,
};
exports.browser = null;

const sleep = (msg, ms) => {
    if (msg) console.log(msg);
    if (!ms) return Promise.resolve(0);
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

async function clickFormat(page, format) {
    return await page.evaluate(async (format) => {
        const select = document.querySelector("#formatSelect");
        let options = Array.from(select);
        options = options.filter(
            (option) => option.getAttribute("data-format") === format
        );
        const opsi = options[0];
        const mp3Option = select.querySelector(
            `option[data-format="${format}"][value="${opsi.value}"]`
        );
        mp3Option.selected = true;
        select.dispatchEvent(new Event("change"));
        const [quality, size] = opsi.textContent.split(" (");
        return {
            format,
            quality,
            size: size.replace(")", "").trim(),
            desc: opsi.textContent.trim(),
        };
    }, format);
}

exports.yt5s = async (url, format) => {
    if (!url) return Promise.resolve({ text: "Missing query 'url' !" });
    let result = {};
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
        result = {
            text: "URL yang dimasukkan tidak valid. Masukkan URL YouTube yang valid!",
        };
        return Promise.resolve(result);
    }
    const browser = await puppeteer.launch(pupProp);
    const page = await browser.newPage();
    try {
        await page.goto("https://yt5s.com/");
        await page.waitForSelector("#s_input");
        await page.type("#s_input", url);
        await page.click("#search-form button");
        await page.waitForSelector("#formatSelect");
        result = await clickFormat(page, format || "mp4");
        result.thumbnail = await page.$eval("div.thumbnail img", (el) =>
            el.getAttribute("src")
        );
        result.title = await page.$eval(
            "div.content h3",
            (el) => el.textContent
        );
        result.channel = await page.$$eval(
            "div.content p",
            (el) => el[0].textContent
        );
        result.duration = await page.$eval(
            "div.content p.mag0",
            (el) => el.textContent
        );
        await page.click("#btn-action");
        await page.waitForSelector("#cnext.form-control.mesg-convert");
        await page.waitForSelector(
            "a#asuccess.form-control.mesg-convert.success"
        );
        let href = "https://yt5s.com";
        while (href.startsWith("https://yt5s.com")) {
            await sleep("", 2000);
            href = await page.$eval("a#asuccess", (elm) => elm.href);
        }
        result.link = href;
        await browser.close();
    } catch (e) {
        const isErrDiv = await page.evaluate(() => {
            const options = Array.from(
                document.querySelectorAll("div.error p")
            );
            return options.length != 0;
        });
        if (isErrDiv)
            result.text = await page.$eval(
                "div.error p",
                (el) => el.textContent
            );
        else {
            result.text = e.message || "Ada error!\n\n" + e;
        }
        await browser.close();
    }
    return Promise.resolve(result);
};

exports.tikvideo = async (url) => {
    if (!url) return Promise.resolve({ text: "Missing query 'url' !" });
    let result = {};
    if (!url.includes("tiktok") && !url.includes("douyin")) {
        result = {
            text: "URL yang dimasukkan tidak valid. Masukkan URL TikTok yang valid!",
        };
        return Promise.resolve(result);
    }
    const browser = await puppeteer.launch(pupProp);
    const page = await browser.newPage();
    try {
        await page.goto("https://tikvideo.app/id");
        await page.type("#s_input", url);
        await page.click("#search-form button");
        await page.waitForSelector("div.dl-action");
        result = await page.evaluate(() => {
            const Ps = document.querySelectorAll("div.dl-action p");
            let data = {};
            Ps.forEach((p) => {
                const a = p.children[0];
                let item = a.textContent
                    .trim()
                    .replace(/[^a-zA-Z0-9\s]/g, "")
                    .toLowerCase();
                item = item.replace("unduh", "").trim();
                item = item.replace(/ /g, "_");
                data[item] = a.href;
            });
            return data;
        });
        result.thumbnail = await page.$eval("div.image-tik img", (el) =>
            el.getAttribute("src")
        );
        result.desc = await page.$eval(
            "div.content h3",
            (el) => el.textContent
        );
        await browser.close();
    } catch (e) {
        const isErrDiv = await page.evaluate(() => {
            const options = Array.from(
                document.querySelectorAll("div.error p")
            );
            return options.length != 0;
        });
        if (isErrDiv)
            result.text = await page.$eval(
                "div.error p",
                (el) => el.textContent
            );
        else {
            result.text = e.message || "Ada error!\n\n" + e;
        }
        await browser.close();
    }
    return Promise.resolve(result);
};

exports.tikvideo = async (url) => {
    if (!url) return Promise.resolve({ text: "Missing query 'url' !" });
    let result = {};
    if (!url.includes("tiktok") && !url.includes("douyin")) {
        result = {
            text: "URL yang dimasukkan tidak valid. Masukkan URL TikTok yang valid!",
        };
        return Promise.resolve(result);
    }
    const browser = await puppeteer.launch(pupProp);
    const page = await browser.newPage();
    try {
        await page.goto("https://tikvideo.app/id");
        await page.type("#s_input", url);
        await page.click("#search-form button");
        await page.waitForSelector("div.dl-action");
        await sleep("", 1000);
        result = await page.evaluate(() => {
            const Ps = document.querySelectorAll("div.dl-action p");
            let data = {};
            Ps.forEach((p) => {
                const a = p.children[0];
                let item = a.textContent
                    .trim()
                    .replace(/[^a-zA-Z0-9\s]/g, "")
                    .toLowerCase();
                item = item.replace("unduh", "").trim();
                item = item.replace(/ /g, "_");
                data[item] = a.href;
            });
            return data;
        });
        result.thumbnail = await page.$eval("div.image-tik img", (el) =>
            el.getAttribute("src")
        );
        result.desc = await page.$eval(
            "div.content h3",
            (el) => el.textContent
        );
        await browser.close();
    } catch (e) {
        const isErrDiv = await page.evaluate(() => {
            const options = Array.from(
                document.querySelectorAll("div.error p")
            );
            return options.length != 0;
        });
        if (isErrDiv)
            result.text = await page.$eval(
                "div.error p",
                (el) => el.textContent
            );
        else {
            result.text = e.message || "Ada error!\n\n" + e;
        }
        await browser.close();
    }
    return Promise.resolve(result);
};

exports.snapinsta = async (url) => {
    if (!url) return Promise.resolve({ text: "Missing query 'url' !" });
    let result = {};
    if (!url.includes("instagram")) {
        result = {
            text: "URL yang dimasukkan tidak valid. Masukkan URL Instagram yang valid!",
        };
        return Promise.resolve(result);
    }
    const browser = await puppeteer.launch(pupProp);
    const page = await browser.newPage();
    try {
        await page.goto("https://snapsave.app/");
        await page.type("#url", url);
        await page.click("button#send");
        await page.waitForSelector("div.download-items__btn");
        await sleep("", 1000);
        result = await page.evaluate(() => {
            const divs = document.querySelectorAll("div.download-items__btn");
            let links = [];
            divs.forEach((div) => {
                const a = div.children[0];
                links.push(a.href);
            });
            return { links };
        });
        result.thumbnail = await page.$$eval(
            "div.download-items__thumb",
            (el) => el[0].children[0].getAttribute("src")
        );
    } catch (e) {
        const isErrDiv = await page.evaluate(() => {
            const options = Array.from(document.querySelectorAll("div#alert"));
            return options.length != 0;
        });
        if (isErrDiv)
            result.text = await page.$eval("div#alert", (el) => el.textContent);
        else {
            result.text = e.message || "Ada error!\n\n" + e;
        }
    }
    await browser.close();
    return Promise.resolve(result);
};

exports.snapsave = async (url) => {
    if (!url) return Promise.resolve({ text: "Missing query 'url' !" });
    let result = {};
    if (!url.includes("facebook") && !url.includes("fb.")) {
        result = {
            text: "URL yang dimasukkan tidak valid. Masukkan URL Facebook yang valid!",
        };
        return Promise.resolve(result);
    }
    const browser = await puppeteer.launch(pupProp);
    const page = await browser.newPage();
    try {
        await page.goto("https://snapsave.app/");
        await page.type("#url", url);
        await page.click("button#send");
        await page.waitForSelector("table.table.is-fullwidth");
        await sleep("", 1000);
        result = await page.evaluate(() => {
            const tables = document.querySelector("table.table.is-fullwidth");
            let links = [];
            tables.children[1].childNodes.forEach((tr) => {
                const tds = tr.children;
                if (tds[1].textContent.toLowerCase() == "no")
                    links.push({
                        quality: tds[0].textContent,
                        link: tds[2].children[0].href,
                    });
            });
            return { links };
        });
        result.thumbnail = await page.$$eval("p.image img", (el) =>
            el[0].getAttribute("src")
        );
        await browser.close();
    } catch (e) {
        const isErrDiv = await page.evaluate(() => {
            const options = Array.from(document.querySelectorAll("div#alert"));
            return options.length != 0;
        });
        if (isErrDiv)
            result.text = await page.$eval("div#alert", (el) => el.textContent);
        else {
            result.text = e.message || "Ada error!\n\n" + e;
        }
        await browser.close();
    }
    return Promise.resolve(result);
};

exports.snaptwitter = async (url) => {
    if (!url) return Promise.resolve({ text: "Missing query 'url' !" });
    let result = {};
    if (
        !url.includes("twitt") &&
        !url.includes("tweet") &&
        !url.includes("x.com")
    ) {
        result = {
            text: "URL yang dimasukkan tidak valid. Masukkan URL Twitter yang valid!",
        };
        return Promise.resolve(result);
    }
    const browser = await puppeteer.launch(pupProp);
    const page = await browser.newPage();
    const base = "https://snaptwitter.com";
    try {
        await page.goto(base);
        await page.type("#url", url);
        await page.click("button#send");
        await page.waitForSelector("div.abuttons a");
        await sleep("", 1000);
        result.link = await page.$eval(
            "div.abuttons a",
            (el, base) => base + el.getAttribute("href"),
            base
        );
        result.thumbnail = await page.$$eval("div.videotikmate img", (el) =>
            el[0].getAttribute("src")
        );
    } catch (e) {
        const isErrDiv = await page.evaluate(() => {
            const options = Array.from(document.querySelectorAll("div#alert"));
            return options.length != 0;
        });
        if (isErrDiv)
            result.text = await page.$eval("div#alert", (el) => el.textContent);
        else {
            result.text = e.message || "Ada error!\n\n" + e;
        }
    }
    await browser.close();
    return Promise.resolve(result);
};

exports.imglargerCartoonizer = async (imgData) => {
    if (!url) return Promise.resolve({ text: "Missing query 'url' !" });
    let result = {};
    if (!imgData) {
        result = {
            text: "Image yang dimasukkan tidak valid. Masukkan Image yang valid!",
        };
        return Promise.resolve(result);
    }
    const imgPath = "./img" + Math.round(Math.random() * 1000) + ".png";
    fs.writeFileSync(imgPath, imgData, { encoding: "base64" });
    const browser = await puppeteer.launch(pupProp);
    const page = await browser.newPage();
    try {
        await page.goto("https://imglarger.com/Cartoonizer");
        await page.waitForSelector("#file");
        await page.waitForTimeout(1000);
        const input = await page.$("#file");
        await input.uploadFile(imgPath);
        await page.waitForSelector(
            "button.btn.btn-Uploader.btn-skyblue.btn-Start-Button.start"
        );
        await page.waitForTimeout(1000);
        await page.click(
            "button.btn.btn-Uploader.btn-skyblue.btn-Start-Button.start"
        );
        page.on("dialog", async (dialog) => {
            result.text = dialog.message();
            await dialog.accept();
        });
        const abtn = await page.waitForSelector(
            "a.btn.btn-Uploader.btn-blue.btn-Start-Button.preview-image"
        );
        try {
            await page.waitForFunction(
                `(document.querySelector("a.btn.btn-Uploader.btn-blue.btn-Start-Button.preview-image").getAttribute("href") != null)`
            );
        } catch (error) {
            await browser.close();
            fs.unlinkSync(imgPath);
            return Promise.resolve(result);
        }
        result.links = await page.evaluate(() => {
            const As = document.querySelectorAll(
                "a.btn.btn-Uploader.btn-Start-Button.preview-image"
            );
            let links = [];
            As.forEach((a) => {
                const type = a.children[1].textContent;
                links.push({ type, link: a.getAttribute("href") });
            });
            return links;
        });
    } catch (e) {
        result.text = e.message || "Ada error!\n\n" + e;
    }
    await browser.close();
    fs.unlinkSync(imgPath);
    return Promise.resolve(result);
};

exports.y2mate = async (urls) => {
    if (!url) return Promise.resolve({ text: "Missing query 'url' !" });
    let result = {};
    if (!urls.includes("youtube.com") && !urls.includes("youtu.be")) {
        result = {
            text: "URL yang dimasukkan tidak valid. Masukkan URL YouTube yang valid!",
        };
        return Promise.resolve(result);
    }
    const browser = await puppeteer.launch(pupProp);
    const page = await browser.newPage();
    await page.goto("https://www.y2mate.com/youtube/" + urls);

    await page.waitForSelector(".table-bordered tbody");

    const index = 2;
    await page.evaluate((index) => {
        const tr = document.querySelectorAll(".table-bordered tbody tr")[index];
        const td3 = tr.querySelector("td:nth-child(3) > button");
        td3.click();
    }, index);

    await page.waitForSelector("#process-result .btn-file[href]");
    const href = await page.$eval(
        "#process-result .btn-file[href]",
        (link) => link.href
    );

    const title = await page.$eval(`.thumbnail .caption`, (el) => el.innerText);
    const thumbnail = await page.$eval(`.thumbnail img`, (el) =>
        el.getAttribute("src")
    );

    const td1 = await page.$eval(
        `.table-bordered tbody tr:nth-child(${index + 1}) td:nth-child(1)`,
        (el) => el.innerText
    );
    const td2 = await page.$eval(
        `.table-bordered tbody tr:nth-child(${index + 1}) td:nth-child(2)`,
        (el) => el.innerText
    );

    result = {
        title: title,
        thumbnail: thumbnail,
        quality: td1,
        size: td2,
        link: href,
    };

    await browser.close();
    return Promise.resolve(result);
};

exports.savefrom = async (url, format) => {
    if (!url) return Promise.resolve({ text: "Missing query 'url' !" });
    let result = {};
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
        result = {
            text: "URL yang dimasukkan tidak valid. Masukkan URL YouTube yang valid!",
        };
        return Promise.resolve(result);
    }
    const browser = await puppeteer.launch(pupProp);
    const page = await browser.newPage();
    try {
        await page.goto("https://id.savefrom.net/");
        await page.waitForSelector("#sf_url");
        await page.type("#sf_url", url);
        await page.click("#sf_submit");
        await page.waitForSelector(".result-box");
        // await page.screenshot({ path: "./yts.png" });
        result.thumbnail = await page.$eval("a.clip img", (el) =>
            el.getAttribute("src")
        );
        result.title = await page.$eval("div.title", (el) => el.textContent);
        result.duration = await page.$eval(
            "div.duration",
            (el) => el.textContent
        );
        result.video = await page.$eval(".def-btn-box a", (el) => {
            let res = {};
            res.type = el.dataset.type;
            res.quality = el.dataset.quality;
            res.link = el.href;
            return res;
        });
        await browser.close();
    } catch (e) {
        const isErrDiv = await page.evaluate(() => {
            const options = Array.from(
                document.querySelectorAll("div.error p")
            );
            return options.length != 0;
        });
        if (isErrDiv)
            result.text = await page.$eval(
                "div.error p",
                (el) => el.textContent
            );
        else {
            result.text = e.message || "Ada error!\n\n" + e;
        }
        await browser.close();
    }
    return Promise.resolve(result);
};
