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

    const script = `new-dao --name ${name}`
    console.log('executing', script)

    await message.reply(`got it! Will let you know when your new *${name}* DAO is ready`)

    try {
      const { stdout, stderr } = await execa('yarn', script.split(' '))
      await message.reply('alright, I\'m done!')
      await message.reply(stdout.split('--!--')[1])
    } catch (e) {
      await message.reply('something went wrong :(')
      // console.log(Object.keys(e), 'e', e.stderr, 'out', e.stdout, 'faaa', e.failed)
      await message.reply(e.stdout) // TODO: fix
    }
  }
})

client.login(process.env.DISCORD_TOKEN)
