import {Options} from "selenium-webdriver/chrome";
import {ActionTimeout, ActionType, AuthenticationType} from "../dataType";
import {action} from "../fn";

require('dotenv').config();
const {Builder, By, until,} = require('selenium-webdriver')
const chai = require('chai');
const assert = chai.assert;

describe('Filter performance', function () {

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

    it('Go to page: Marketplace', async () => {
        await action(driver, By.linkText("Marketplace"), ActionType.click, ActionTimeout.short)
        await driver.switchTo().frame(1)
        getAllWindowHandles = await driver.getAllWindowHandles()
        await driver.switchTo().window(getAllWindowHandles[2])
        await driver.sleep(ActionTimeout.larges)
    })

    it('Get an error about lack of ducks when choosing a filter', async () => {
        const selectGroupActionNoneEls = await driver.findElements(By.css(".filters__select-group-action-none"));
        for (let i = 0; i < selectGroupActionNoneEls.length; i++) {
            selectGroupActionNoneEls[i].click()
        }
        await driver.sleep(ActionTimeout.larges)
        const alertWarningText = await driver.findElement(By.css(".alert-warning")).getText()
        assert.equal(alertWarningText, "There are no ducks with selected filter properties")
    })

    it('The genotype of all ducks contains the letter O', async () => {
        await driver.executeScript("document.querySelectorAll('.filters__select-group-action-all').forEach(el => el.click())")
        await driver.sleep(ActionTimeout.short)
        await driver.executeScript("document.querySelector('input[name=N]').click()")
        await driver.executeScript("document.querySelector('input[name=M]').click()")
        await driver.executeScript("document.querySelector('input[name=L]').click()")
        await driver.executeScript("document.querySelector('input[name=K]').click()")
        await driver.executeScript("document.querySelector('input[name=J]').click()")
        await driver.executeScript("document.querySelector('input[name=H]').click()")
        await driver.executeScript("document.querySelectorAll('input[name=G]')[1].click()")
        await driver.executeScript("document.querySelector('input[name=I]').click()")
        await driver.sleep(ActionTimeout.short)
        const bodySubtitleEls = await driver.findElements(By.css(".duck-item__body-subtitle"));
        for (let i = 0; i < bodySubtitleEls.length; i++) {
            const subtitle = await bodySubtitleEls[i].getText()
            assert.equal(subtitle.split("-")[2][0], "O")
        }
    })

    it('Checking whether filters are saved on reboot', async () => {
        await driver.sleep(ActionTimeout.short)
        let isChecked = await driver.executeScript("return document.querySelector('input[name=Y]').checked")
        assert.equal(isChecked, true)
        await driver.sleep(ActionTimeout.short)
        await driver.executeScript("document.querySelector('input[name=Y]').click()")
        isChecked = await driver.executeScript("return document.querySelector('input[name=Y]').checked")
        assert.equal(isChecked, false)
        await driver.navigate().refresh()
        await driver.sleep(ActionTimeout.larges)
        assert.equal(isChecked, false)
    });

    after(async () => driver.quit());

})
