const {exec} = require("child_process")
const fs = require('fs')
const {Telegraf} = require('telegraf')
require('dotenv').config();
const bot = new Telegraf(process.env.BOT_TOKEN)

let needToAnswer = []
let isRunning: boolean = false

const createReport = () => {
    console.log("+createReport")
    if (!isRunning) {
        isRunning = true
        exec("npm run test", (error, data, getter) => {
            if (error) {
                isRunning = false
                return
            }
            if (getter)  {
                isRunning = false
                return
            }
            isRunning = false
            sendReport()
        })
    }

}

const sendReport = () => {
    const report = fs.readFileSync('report.txt', 'utf8')
    needToAnswer.forEach(id => {
        bot.telegram.sendMessage(id, report)
    })
    needToAnswer = []
}

bot.command('getreport', (ctx) => {
    if (!needToAnswer.includes(ctx.message.chat.id)) {
        needToAnswer.push(ctx.message.chat.id)
    }
    ctx.reply('Checking is running, await a response')
    createReport()
})

bot.launch()
