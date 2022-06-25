"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importStar(require("discord.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const requestFunctions_1 = require("./requestFunctions");
const postFunctions_1 = require("./postFunctions");
dotenv_1.default.config();
const token = process.env.TOKEN;
const client = new discord_js_1.default.Client({
    intents: [
        //Intents are a way to tell Discord what it intends to do and what variables it needs
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES
    ]
});
client.on('ready', () => {
    console.log('The bot is running...');
});
client.on('messageCreate', (message) => __awaiter(void 0, void 0, void 0, function* () {
    const playerName = message.author.username;
    const errorMessage = "Either I couldn't quite understand that or there is a problem with the server.\n" +
        "Please try again and make sure your formatting is correct. \n" +
        "Use mtg -help if you need help. \n";
    if (playerName != 'MTG Group Stats') {
        if (message.content === 'mtg -all player stats') {
            try {
                const stats = yield (0, requestFunctions_1.getAllPlayerStats)();
                var allPlayersString = '**All Player Stats** \n';
                stats.forEach(player => {
                    const winRate = (player.Wins / player.Games) * 100;
                    allPlayersString = allPlayersString + '\n' + '**Name:** ' + player.Name + ' , **Games:** ' + player.Games + ' , **Wins:** ' + player.Wins + ', **Win Rate:** ' + winRate + '\n';
                });
                message.reply({
                    content: allPlayersString
                });
            }
            catch (e) {
                console.log(e);
                message.reply({
                    content: errorMessage
                });
            }
        }
        else if (message.content === 'mtg -player stats') {
            try {
                const playerStats = yield (0, requestFunctions_1.checkStats)(playerName);
                const winRate = (playerStats.Wins / playerStats.Games) * 100;
                message.reply({
                    content: '**Player:** ' + playerStats.Name + ' , **Games played:** ' + playerStats.Games + ' , **Wins:** ' + playerStats.Wins + ', **Win Rate:** ' + winRate + '%'
                });
            }
            catch (e) {
                console.log(e);
                message.reply({
                    content: errorMessage
                });
            }
        }
        else if (message.content.includes('mtg -player stats !')) {
            const playerName = message.content.toString().split('!')[1];
            try {
                const playerStats = yield (0, requestFunctions_1.checkStats)(playerName);
                const winRate = (playerStats.Wins / playerStats.Games) * 100;
                message.reply({
                    content: '**Player:** ' + playerStats.Name + ' , **Games played:** ' + playerStats.Games + ' , **Wins:** ' + playerStats.Wins + ', **Win Rate:** ' + winRate + '%'
                });
            }
            catch (e) {
                console.log(e);
                message.reply({
                    content: errorMessage
                });
            }
        }
        else if (message.content.includes('mtg -report game')) {
            var outcome = false;
            const wordsArray = [];
            const commanderName = message.content.toString().split('!')[1];
            message.content.toString().split(' ').map(item => wordsArray.push(item));
            if (wordsArray[3].toString().toUpperCase() === 'w'.toUpperCase()) {
                outcome = true;
                try {
                    const success = yield (0, postFunctions_1.reportGame)(playerName, commanderName, outcome);
                    if (success) {
                        message.reply({
                            content: "Good win. Stats saved."
                        });
                    }
                    else {
                        message.reply({
                            content: errorMessage
                        });
                    }
                }
                catch (e) {
                    console.log(e);
                    message.reply({
                        content: errorMessage
                    });
                }
            }
            else if (wordsArray[3].toString().toUpperCase() === 'l'.toUpperCase()) {
                outcome = false;
                try {
                    const success = yield (0, postFunctions_1.reportGame)(playerName, commanderName, outcome);
                    if (success) {
                        message.reply({
                            content: "Game stats saved."
                        });
                    }
                    else {
                        message.reply({
                            content: "The commander you entered does not exist. Please check the name and formatting and try again."
                        });
                    }
                }
                catch (e) {
                    console.log(e);
                    message.reply({
                        content: errorMessage
                    });
                }
            }
            else {
                message.reply({
                    content: errorMessage
                });
            }
        }
        else if (message.content === 'mtg -commander stats') {
            try {
                const commanderStats = yield (0, requestFunctions_1.checkAllCommanderStats)();
                var allCommanderString = '**All Commander Stats** \n';
                commanderStats.forEach(commander => {
                    const winRate = (commander.Wins / commander.Games) * 100;
                    allCommanderString = allCommanderString + '\n' + '**Commander:** ' + commander.Name + ', **Commander Owner:** ' + commander.playerId + ' , **Games played:** ' + commander.Games + ' , **Wins:** ' + commander.Wins + ', **Win Rate:** ' + winRate + '%' + '\n';
                });
                message.reply({
                    content: allCommanderString
                });
            }
            catch (e) {
                console.log(e);
                message.reply({
                    content: errorMessage
                });
            }
        }
        else if (message.content.includes('mtg -commander stats !')) {
            const commanderName = message.content.toString().split('!')[1];
            try {
                const commanderStats = yield (0, requestFunctions_1.getCommanderStats)(commanderName);
                const winRate = (commanderStats.Wins / commanderStats.Games) * 100;
                message.reply({
                    content: '**Commander:** ' + commanderStats.Name + ', **Commander Owner:** ' + commanderStats.playerId + ' , **Games played:** ' + commanderStats.Games + ' , **Wins:** ' + commanderStats.Wins + ', **Win Rate:** ' + winRate + '%'
                });
            }
            catch (e) {
                console.log(e);
                message.reply({
                    content: errorMessage
                });
            }
        }
        else if (message.content === 'mtg -add player') {
            try {
                yield (0, postFunctions_1.addPlayer)(playerName).then(() => {
                    message.reply({
                        content: playerName + ' added to players.'
                    });
                });
            }
            catch (e) {
                console.log(e);
                message.reply({
                    content: errorMessage
                });
            }
        }
        else if (message.content.includes('mtg -add commander !')) {
            const commanderName = message.content.toString().split('!')[1];
            try {
                yield (0, postFunctions_1.addCommander)(playerName, commanderName).then(() => {
                    message.reply({
                        content: commanderName + ' added to commanders.'
                    });
                });
            }
            catch (e) {
                console.log(e);
                message.reply({
                    content: errorMessage
                });
            }
        }
        else if (message.content === 'mtg -random deck') {
            const randomChoice = yield (0, requestFunctions_1.randomDeck)(playerName);
            message.reply({
                content: randomChoice
            });
        }
        else if (message.content === 'mtg -help') {
            message.reply({
                content: '\n' +
                    '**GETTING STARTED:** \n' +
                    'To begin using the mtg bot add yourself as a player: `mtg -add player` and then add your commander(s): `mtg -add commander !COMMANDER_NAME` \n' +
                    '\n' +
                    '**ALL COMMANDS:** \n' +
                    '*Enter all commands exactly in the format they appear* \n' +
                    '**Get stats for all players:** `mtg -all player stats` \n' +
                    '**Get stats for you:** `mtg -player stats` \n' +
                    '**Get stats for a specific player:** `mtg -player stats !PLAYER_NAME` \n' +
                    '**Get stats for all commanders:** `mtg -commander stats` \n' +
                    '**Get stats for a specific commander:** `mtg -commander stats !COMMANDER_NAME` \n' +
                    '**Add a player:** `mtg -add player` \n' +
                    '**Add a commander:** `mtg -add commander !COMMANDER_NAME` \n' +
                    '**Report a game:** `mtg -report game w !COMMANDER_NAME` use "l" if you lost \n' +
                    '**For help:** `mtg -help`'
            });
        }
    }
}));
client.login(process.env.TOKEN);
