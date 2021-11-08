import {Options} from "selenium-webdriver/chrome";
import {ActionTimeout, ActionType, AuthenticationType} from "../dataType";
import {action} from "../fn";
require('dotenv').config();
const {Builder, By, until, } = require('selenium-webdriver')
const chai = require('chai');
const assert = chai.assert;

describe('1_marketplace_login', function () {

    this.timeout(300000)
    let driver
    let vars
    let getAllWindowHandles
    const password = process.env.PASSWORD
    const headless = process.env.HEADLESS
    const options = new Options()
    if (headless === "1") {
        options.headless()
    }

    before(async function () {
        driver = await new Builder()
            // .withCapabilities(caps)
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build()
        vars = {}

        await driver.get("https://wavesducks.com/")
        await driver.manage().window().setRect({width: 1440, height: 900})
        await driver.executeScript("window.open('https://waves.exchange/sign-up/', '_blank');")
        getAllWindowHandles = await driver.getAllWindowHandles()
        await driver.sleep(ActionTimeout.normal)
    })

    it('registration', async () => {
        await driver.switchTo().window(getAllWindowHandles[1])
        await driver.sleep(ActionTimeout.normal)
        await action(driver, By.css(".css-v28l6"), ActionType.click, ActionTimeout.short)
        await action(driver, By.css(".css-roynbj .css-15q5r51:nth-child(1) .css-1o78ni4"), ActionType.sendKeys, ActionTimeout.short, By.css(".css-roynbj .css-15q5r51:nth-child(1) .css-1o78ni4"), password)
        await action(driver, By.css(".css-roynbj .css-15q5r51:nth-child(2) .css-1o78ni4"), ActionType.sendKeys, ActionTimeout.short, By.css(".css-roynbj .css-15q5r51:nth-child(1) .css-1o78ni4"), password)
        await action(driver, By.css(".css-g013ys"), ActionType.click, ActionTimeout.short)
        await action(driver, By.css(".css-hw3m92"), ActionType.click, ActionTimeout.short)
        await driver.wait(until.elementLocated(By.css(".css-13ngssx")));
        const address = await driver.findElement(By.css(".css-13ngssx")).getText()
        await action(driver, By.css(".css-9ctqy3"), ActionType.click, ActionTimeout.short)
        await action(driver, By.css(".css-1s7zn1r"), ActionType.sendKeys, ActionTimeout.short, null, address)
        await action(driver, By.css(".css-10j114y"), ActionType.click, ActionTimeout.short)
        await driver.sleep(ActionTimeout.short)
    })


    it('authorization', async function () {
        await driver.switchTo().window(getAllWindowHandles[0])
        await driver.sleep(ActionTimeout.short)
        await action(driver, By.linkText("Start"), ActionType.click, ActionTimeout.normal)
        await driver.sleep(ActionTimeout.larges)
        getAllWindowHandles = await driver.getAllWindowHandles()
        await driver.switchTo().window(getAllWindowHandles[2])
        await action(driver, By.css("a.login-page__authorization_method.login-page__authorization_method_first_line"), ActionType.click, ActionTimeout.normal)
        await driver.sleep(ActionTimeout.larges)
        await driver.switchTo().frame(2)
        await action(driver, By.css(".css-1wyiskf"), ActionType.sendKeys, ActionTimeout.short, null, password)
        await action(driver, By.css(".css-14ilpg8"), ActionType.click, ActionTimeout.short)
        await driver.sleep(ActionTimeout.larges)
    })

    it('test: "All offers"', async function () {
        await action(driver, By.linkText("Marketplace"), ActionType.click, ActionTimeout.short)
        await driver.switchTo().frame(1)
        getAllWindowHandles = await driver.getAllWindowHandles()
        await driver.switchTo().window(getAllWindowHandles[2])
        await driver.sleep(ActionTimeout.larges)
        const allOffersText = await driver.findElement(By.css(".tabs-block__tab--active")).getText()
        assert.equal(allOffersText, "All offers");
    })

    after(async () => driver.quit());

})