# Joey Bot
Joey bot, a personal project, is a Dungeons and Dragons based music bot, with a few additions to streamline online DND sessions.

## Usage
Joey bot uses Discords slash command system. Commands can be viewed in any discord channel by typing " / " and previewing the in-channel documentation.

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