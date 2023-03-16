require('dotenv').config()
const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')

const { TOKEN } = process.env

const SERVER_URL = "https://db63-115-77-57-154.ap.ngrok.io" 
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`
const URI = `/webhook/${TOKEN}`
const WEBHOOK_URL = SERVER_URL + URI

const conversationId = 1359425265 // get from telegram same here request req.body.message.chat.id

const app = express()
app.use(bodyParser.json())

const init = async () => {
    const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`)
    console.log(res.data)
}

app.get('/', async (req, res) => {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: conversationId,
        text: 'A New Request'
    })
    return res.status(200).send("Success")
})

app.post(URI, async (req, res) => {
    console.log(req.body)

    const chatId = req.body.message.chat.id
    const text = req.body.message.text

    await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId, 
        text: text
    })
    return res.send()
})

app.listen(process.env.PORT || 5000, async () => {
    console.log('🚀 app running on port', process.env.PORT || 5000)
    await init()
})