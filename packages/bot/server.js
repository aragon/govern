require('dotenv').config()

const Discord = require('discord.js')
const execa = require('execa')
const client = new Discord.Client()

const COMMAND = '!new'

client.on('message', async (message) => {
  if (message.content.startsWith(COMMAND)) {
    const name = message.content.split(' ').pop()

    if (!/^[a-zA-Z0-9]+$/.test(name)) {
      return console.error('bad name', name)
    }

    const script = `deploy-eaglet --network rinkeby --name ${name}`
    console.log('executing', script)

    await execa('yarn', script.split(' '))
  }
})

client.login(process.env.DISCORD_TOKEN)
