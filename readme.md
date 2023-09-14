# Joey Bot
Joey bot is a Discord Music Bot built in mind with support for Youtube. Joey bot also comes packed with some additional commands such as customized dice rolling.

## Usage
Joey bot uses Discord's slash command system. Commands can be viewed in any discord channel by typing " / " and previewing the in-channel documentation. In addition to slash commands, Joey bot can also roll multi-sided dice with messages prefixed with " ! ". For example, in order to generate a number using a single 20 sided die use: `!r1d20` or `!r1d20+4` in order to add a certain amount to the final output.

## Development
Joey bot uses Typescript and Discord.js. Follow the [Discord Development Portal documentation](https://discord.com/developers/docs/intro) for creating a discord application and bot. Joey bot also uses the Command Handler from [Discord.js guide](https://discordjs.guide/).

## Installation
Clone the project
```bash
git clone https://github.com/ryGutierrez/joey-bot.git
cd joey-bot
```
### Install dependencies using Node v18+
```
npm install
yarn install
```

### Run the bot with 
```
npm start
yarn start
```

### Run the bot in development with
```
npm dev
yarn dev
```
