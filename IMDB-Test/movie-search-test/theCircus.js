const expect = require("chai").expect;
const puppeteer = require("puppeteer");

let browser1;
let directorName;
let writerName;
let starNames;
let page;

before(async () => {
  browser1 = await puppeteer.launch({
    headless: false,
    args: ["--window-size=1920,1080"],
  });
  page = await browser1.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
  });
});

after(async () => {
  await page.waitForTimeout(3000);
  await browser1.close();
});

describe("IMDB Senarios - The Circus", () => {
  it("Go to https://www.imdb.com/", async () => {
    await page.goto("https://www.imdb.com/", {
      waitUntil: "networkidle2",
    });
  });

  it("Click on the Menu button", async () => {
    await page.click("#imdbHeader-navDrawerOpen--desktop");
  });

  it("Click on the Oscars button", async () => {
    await page.waitForTimeout(1000);
    const [oscarButton] = await page.$x(
      "//nav[@id='imdbHeader']/div[2]/aside/div/div[2]/div/div[3]/span/div/div/ul/a"
    );
    await oscarButton.click();
  });

  it("Select 1929 value", async () => {
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    await page.waitForTimeout(1000);
    const [yearButton] = await page.$x("//a[contains(text(),'1929')]");
    await yearButton.click();
  });

  //If your pc is not in english this test step might fail
  it("Select The Circus (Charles Chaplin)", async () => {
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    const [theCircusButton] = await page.$x("//img[@alt='The Circus']");
    await theCircusButton.click();
  });

  it("Save Director, Writer and Stars information of the movie", async () => {
    await page.waitForTimeout(3000);
    const [directorElement] = await page.$x(
      "//*[contains(text(),'Director')]/following::a"
    );
    directorName = await page.evaluate((el) => el.textContent, directorElement);

    const [writerElement] = await page.$x(
      "//*[contains(text(),'Writer')]/following::a"
    );
    writerName = await page.evaluate((el) => el.textContent, writerElement);

    const [starElement] = await page.$x(
      "//*[contains(text(),'Stars')]/following::a"
    );
    starNames = await page.evaluate((el) => el.textContent, starElement);
  });

  it("Click on the IMDb button", async () => {
    await page.click("#home_img_holder");
  });

  it("Search The Circus", async () => {
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    await page.type("input[name=q]", "The Circus");
  });

  it("Click on the The Circus", async () => {
    await page.waitForTimeout(2000);
    const [theCircusButton] = await page.$x(
      "//*[@id='react-autowhatever-1--item-0']/a"
    );
    await theCircusButton.click();
  });

  it("Check wheter Director, Writer and Stars information of the movie", async () => {
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    await page.waitForTimeout(1000);
    const [directorElement] = await page.$x(
      "//*[contains(text(),'Director')]/following::a"
    );
    let expected = await page.evaluate((el) => el.textContent, directorElement);

    if (directorName) {
      expect(expected).to.equal(directorName);
    }

    const [writerElement] = await page.$x(
      "//*[contains(text(),'Writer')]/following::a"
    );

    expected = await page.evaluate((el) => el.textContent, writerElement);

    if (writerName) {
      expect(expected).to.equal(writerName);
    }

    const [starElement] = await page.$x(
      "//*[contains(text(),'Stars')]/following::a"
    );

    expected = await page.evaluate((el) => el.textContent, starElement);

    if (starNames) {
      expect(expected).to.equal(starNames);
    }
  });
  it("Click on the Photo Gallery", async () => {
    await page.waitForTimeout(1000);
    const [seeAllPhotosButton] = await page.$x(
      "//*[@id='titleImageStrip']/div[2]/a[2]"
    );
    const [photoGalleryButton] = await page.$x(
      "//*[@id='__next']/main/div/section[1]/div/section/div/div[1]/section[2]/div[1]/a"
    );

    if (seeAllPhotosButton) {
      await seeAllPhotosButton.click();
    } else {
      await photoGalleryButton.click();
    }

    await page.waitForNavigation({ waitUntil: "networkidle0" });

    const [nextButton] = await page.$x(
      "//*[@id='right']/a[contains(text(),'Next&nbsp;»')]"
    );

    do {
      await page.waitForTimeout(1000);
      const corruptImage = await page.$x(
        "//*[@id='media_index_thumbnail_grid']/a/img[@width='16']"
      );
      expect(corruptImage[0]).to.equal(undefined);
      const [nextButton] = await page.$x(
        "//*[@id='right']/a[contains(text(),'Next')]"
      );
      if (nextButton) {
        nextButton.click();
      }
    } while (nextButton);
  });
});
