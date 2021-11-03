import {Options} from "selenium-webdriver/chrome";
require('dotenv').config();

const {Builder, By, Capabilities, until, Key} = require('selenium-webdriver')
// const assert = require('assert')
// const caps = new Capabilities();
// caps.setPageLoadStrategy("none");
//

enum AuthenticationType {
    registration = "registration",
    login = "login"
}

enum ActionType {
    click = "click",
    sendKeys = "sendKeys"
}

enum ActionTimeout {
    short = 200,
    normal = 2000,
    larges = 5000,
    wait = "wait",
}


describe('ducks tests', function () {

    this.timeout(300000)
    let driver
    let vars
    let getAllWindowHandles
    let address
    const password = process.env.PASSWORD
    const seed = process.env.SEED
    const headless = process.env.HEADLESS
    const options = new Options()
    if (headless === "1") {
        options.headless()
    }
    const authenticationType = process.env.AUTHENTICATION_TYPE || AuthenticationType.login

    const action = async (target, type: ActionType, timeout: ActionTimeout, waitTarget = null, sendValue = null) => {
        if (timeout === ActionTimeout.wait && waitTarget) {
            await driver.wait(until.elementLocated(waitTarget));
        } else {
            await driver.sleep(+timeout)
        }
        if (type === ActionType.click) {
            await driver.findElement(target).click()
        } else if (type === ActionType.sendKeys) {
            await driver.findElement(target).sendKeys(sendValue)
        }
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

    if (authenticationType === AuthenticationType.registration) {
        it('registration', async () => {
            await driver.switchTo().window(getAllWindowHandles[1])
            await driver.sleep(ActionTimeout.normal)
            await action(By.css(".css-v28l6"), ActionType.click, ActionTimeout.normal)
            await action(By.css(".css-roynbj .css-15q5r51:nth-child(1) .css-1o78ni4"), ActionType.sendKeys, ActionTimeout.normal, By.css(".css-roynbj .css-15q5r51:nth-child(1) .css-1o78ni4"), password)
            await action(By.css(".css-roynbj .css-15q5r51:nth-child(2) .css-1o78ni4"), ActionType.sendKeys, ActionTimeout.short, By.css(".css-roynbj .css-15q5r51:nth-child(1) .css-1o78ni4"), password)
            await action(By.css(".css-g013ys"), ActionType.click, ActionTimeout.normal)
            await action(By.css(".css-hw3m92"), ActionType.click, ActionTimeout.normal)
            await driver.wait(until.elementLocated(By.css(".css-13ngssx")));
            const address = await driver.findElement(By.css(".css-13ngssx")).getText()
            await action(By.css(".css-9ctqy3"), ActionType.click, ActionTimeout.normal)
            await action(By.css(".css-1s7zn1r"), ActionType.sendKeys, ActionTimeout.normal, null, address)
            await action(By.css(".css-10j114y"), ActionType.click, ActionTimeout.normal)
            await driver.sleep(ActionTimeout.normal)
        })
    } else if (authenticationType === AuthenticationType.login) {
        it('login', async () => {
            await driver.switchTo().window(getAllWindowHandles[1])
            await driver.sleep(ActionTimeout.normal)
            await action(By.css(".css-v28l6"), ActionType.click, ActionTimeout.short)
            await action(By.css(".css-roynbj .css-15q5r51:nth-child(1) .css-1o78ni4"), ActionType.sendKeys, ActionTimeout.short, By.css(".css-roynbj .css-15q5r51:nth-child(1) .css-1o78ni4"), password)
            await action(By.css(".css-roynbj .css-15q5r51:nth-child(2) .css-1o78ni4"), ActionType.sendKeys, ActionTimeout.short, By.css(".css-roynbj .css-15q5r51:nth-child(1) .css-1o78ni4"), password)
            await action(By.css(".css-g013ys"), ActionType.click, ActionTimeout.short)
            await action(By.css(".css-hw3m92"), ActionType.click, ActionTimeout.short)
            await driver.wait(until.elementLocated(By.css(".css-13ngssx")));
            address = await driver.findElement(By.css(".css-13ngssx")).getText()
            await action(By.css(".css-162eomj"), ActionType.click, ActionTimeout.short)
            await action(By.css(".css-1evtq2z"), ActionType.click, ActionTimeout.short)
            await action(By.tagName("textarea"), ActionType.sendKeys, ActionTimeout.short, null, seed)
            await action(By.css(".css-9ctqy3"), ActionType.click, ActionTimeout.short)
            await action(By.css(".css-1s7zn1r"), ActionType.sendKeys, ActionTimeout.short, null, "TEST")
            await action(By.css(".css-10j114y"), ActionType.click, ActionTimeout.short)
            await driver.sleep(ActionTimeout.normal)
        })
    }

    it('authorization', async function () {
        await driver.switchTo().window(getAllWindowHandles[0])
        await driver.sleep(2000)
        await action(By.linkText("Marketplace"), ActionType.click, ActionTimeout.normal)
        await action(By.css(".header-menu-items > .header-menu-item:nth-child(1)"), ActionType.click, ActionTimeout.normal)
        await action(By.css(".login-page__authorization_method_first_line"), ActionType.click, ActionTimeout.normal)
        await driver.switchTo().frame(2)
        await action(By.css(".css-1wyiskf"), ActionType.sendKeys, ActionTimeout.normal, null, password)
        await action(By.css(".css-14ilpg8"), ActionType.click, ActionTimeout.normal)
        await driver.sleep(2000)
    })

    it('ui test', async function () {
        await action(By.css(".icon-magnifier"), ActionType.click, ActionTimeout.normal)
        await action(By.css(".form-control"), ActionType.sendKeys, ActionTimeout.normal, null, "123456")
        await action(By.css(".form-control"), ActionType.sendKeys, ActionTimeout.normal, null, Key.ENTER)
        await action(By.css(".header-menu-items > .header-menu-item:nth-child(1)"), ActionType.click, ActionTimeout.normal)
        await action(By.css(".header-menu-items > .header-menu-item:nth-child(2)"), ActionType.click, ActionTimeout.normal)
        await action(By.css(".header-menu-items > .header-menu-item:nth-child(3)"), ActionType.click, ActionTimeout.normal)
        await action(By.css(".header-menu-items > .header-menu-item:nth-child(4)"), ActionType.click, ActionTimeout.normal)
        await driver.sleep(2000)
    })

    after(async () => driver.quit());

})
