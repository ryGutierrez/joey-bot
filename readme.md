# Joey Bot
Joey bot is a discord bot packed with a variety of helpful commands. Originally starting off as a music player Joey bot has been given all sorts of tricks such as rolling dice or replying to user messages with AI generated responses.

## Usage
Joey bot uses Discords slash command system. Commands can be viewed in any discord channel by typing " / " and previewing the in-channel documentation. In addition to slash commands, Joey bot can also roll multi-sided dice with messages prefixed with " ! ". For example, in order to generate a number using a single 20 sided die use: `!r1d20` or `!r1d20+4` in order to add a certain amount to the final output.

## Development
Joey bot uses Node.js and Javascript. Follow the [Discord Development Portal documentation](https://discord.com/developers/docs/intro) for creating a discord application and bot. Joey bot was also created following the [Discord.js guide](https://discordjs.guide/) and follows the same command structure as demonstrated.

## Installation
Clone the project and install with npm using Node v18+
```bash
git clone https://github.com/ryGutierrez/joey-bot.git
cd joey-bot
npm i
```
Register commands within /commands with 
### `node deploy-commands.js`:

Run the bot with 
### `node index.js`

Deploy commands and run bot concurrently with
### `npm start`
