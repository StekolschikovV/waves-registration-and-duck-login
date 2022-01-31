import {Options} from "selenium-webdriver/chrome";
import {ActionTimeout, ActionType, AuthenticationType} from "../dataType";
import {action} from "../fn";
require('dotenv').config();

import {BASE_WAVESDUCKS_URL, HEADLESS_MODE, PASSWORD} from "./env";

const {Builder, By, until,} = require('selenium-webdriver')
const chai = require('chai');
const assert = chai.assert;

describe('All offers', function () {

    this.timeout(300000)
    let driver
    let vars
    let getAllWindowHandles
    const options = new Options()
    if (HEADLESS_MODE === "1") {
        options.headless()
    }
    before(async function () {
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build()
        vars = {}

         driver.get(BASE_WAVESDUCKS_URL + "login")
        await driver.manage().window().setRect({width: 1440, height: 900})
        await driver.executeScript("window.open('https://waves.exchange/sign-up/', '_blank');")
        getAllWindowHandles = await driver.getAllWindowHandles()
        await driver.sleep(ActionTimeout.normal)
    })

    it('Registration', async () => {
        await driver.switchTo().window(getAllWindowHandles[1])
        await driver.sleep(ActionTimeout.normal)
        await action(driver, By.css(".css-v28l6"), ActionType.click, ActionTimeout.normal)
        await action(driver, By.css(".css-roynbj .css-15q5r51:nth-child(1) .css-1o78ni4"), ActionType.sendKeys, ActionTimeout.normal, By.css(".css-roynbj .css-15q5r51:nth-child(1) .css-1o78ni4"), PASSWORD)
        await action(driver, By.css(".css-roynbj .css-15q5r51:nth-child(2) .css-1o78ni4"), ActionType.sendKeys, ActionTimeout.short, By.css(".css-roynbj .css-15q5r51:nth-child(1) .css-1o78ni4"), PASSWORD)
        await action(driver, By.css(".css-g013ys"), ActionType.click, ActionTimeout.normal)
        await action(driver, By.css(".css-hw3m92"), ActionType.click, ActionTimeout.normal)
        await driver.wait(until.elementLocated(By.css(".css-13ngssx")));
        const address = await driver.findElement(By.css(".css-13ngssx")).getText()
        await action(driver, By.css(".css-9ctqy3"), ActionType.click, ActionTimeout.normal)
        await action(driver, By.css(".css-1s7zn1r"), ActionType.sendKeys, ActionTimeout.normal, null, address)
        await action(driver, By.css(".css-10j114y"), ActionType.click, ActionTimeout.normal)
        await driver.sleep(ActionTimeout.larges)
        await driver.sleep(ActionTimeout.larges)
    })

    it('Authorization', async function () {
        await driver.switchTo().window(getAllWindowHandles[0])
        await driver.sleep(ActionTimeout.larges)
        // await action(driver, By.linkText("Marketplace"), ActionType.click, ActionTimeout.normal)
        // await action(driver, By.css(".header-menu-items > .header-menu-item:nth-child(1)"), ActionType.click, ActionTimeout.normal)
        await action(driver, By.css(".login-page__authorization_method_first_line"), ActionType.click, ActionTimeout.normal)
        await driver.switchTo().frame(2)
        await action(driver, By.css(".css-1wyiskf"), ActionType.sendKeys, ActionTimeout.normal, null, PASSWORD)
        await action(driver, By.css(".css-14ilpg8"), ActionType.click, ActionTimeout.normal)
        await driver.sleep(ActionTimeout.larges)
    })

    it('Go to page: Marketplace', async () => {
        await action(driver, By.linkText("Start playing"), ActionType.click, ActionTimeout.short)
        getAllWindowHandles = await driver.getAllWindowHandles()
        await driver.sleep(ActionTimeout.larges)
        await driver.switchTo().window(getAllWindowHandles[2])
        await driver.sleep(ActionTimeout.larges)
        await action(driver, By.linkText("Marketplace"), ActionType.click, ActionTimeout.short)
        await driver.sleep(ActionTimeout.larges)
    })

    after(async () => driver.quit());

})
