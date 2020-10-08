const Discord = require('discord.js')
const client = new Discord.Client()

module.exports = (channel, token) => ({
    sendMessage: async (message) => new Promise(resolve => {
        const send = async () => {
            await client.channels.cache.get(channel).send(message)
            resolve()
        }

        client.on('ready', async () => {
            send()
        })

        client.readyAt ? send() : client.login(token)
    })
})
