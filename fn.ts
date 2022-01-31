import {ActionTimeout, ActionType} from "./dataType";
import {By} from "selenium-webdriver";
import {PASSWORD} from "./test/env";
const {until} = require('selenium-webdriver')

export const action = async (driver, target, type: ActionType, timeout: ActionTimeout, waitTarget = null, sendValue = null) => {
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
