import DiscordJS, { Intents } from 'discord.js'
import dotenv from 'dotenv'
import {getAllPlayerStats, checkStats, checkAllCommanderStats, getCommanderStats} from './requestFunctions'
import { reportGame, addPlayer, addCommander } from './postFunctions';

dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        //Intents are a way to tell Discord what it intends to do and what variables it needs
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.on('ready', () => {
    console.log('The bot is running...');
})

client.on('messageCreate', async (message) => {
    const playerName = message.author.username;
    const errorMessage = "Either I couldn't quite understand that or there is a problem with the server.\n" +
                        "Please try again and make sure your formatting is correct. \n" +
                        "Use mtg -help if you need help. \n"

    if(playerName != 'MTG Group Stats'){
    if(message.content === 'mtg -all player stats'){
        try {
        const stats: any[] = await getAllPlayerStats();
            stats.forEach(player => {
                const winRate = (player.Wins/player.Games) * 100;
                message.reply({
                    content: '**Name:** ' + player.Name + ' , **Games:** ' + player.Games + ' , **Wins:** ' + player.Wins + ', **Win Rate:** ' + winRate
                })
            });
        } catch(e){
            console.log(e);
            message.reply({
                content: errorMessage
            })
        }
    } else if(message.content === 'mtg -player stats'){
        try{
            const playerStats: any = await checkStats(playerName);
            const winRate = (playerStats.Wins/playerStats.Games) * 100;
            message.reply({
                content: '**Player:** ' + playerStats.Name + ' , **Games played:** ' + playerStats.Games + ' , **Wins:** ' + playerStats.Wins + ', **Win Rate:** ' + winRate + '%'
            })
        } catch(e){
            console.log(e);
            message.reply({
                content: errorMessage
            })
        }
    } else if(message.content.includes('mtg -report game')){
        var outcome: boolean = false;
        const wordsArray: string[] = [];
        const commanderName: string = message.content.toString().split('!')[1];
        console.log(commanderName);
        message.content.toString().split(' ').map(item => wordsArray.push(item));
        if(wordsArray[3].toString().toUpperCase() === 'w'.toUpperCase()){
            outcome = true;
            try{
                const player: any = await checkStats(playerName);
                console.log(player);
                const games = player.Games + 1;
                const wins = player.Wins + 1;
                try {
                    const success: any = await reportGame(playerName, commanderName, wins, games);
                    if(success){
                    message.reply({
                        content: "Good win. Stats saved."
                    })
                    } else{
                        message.reply({
                            content: errorMessage
                        })
                    }
                } catch(e){
                    console.log(e);
                    message.reply({
                        content: errorMessage
                    })
                }
            } catch(e){
                console.log(e);
                message.reply({
                    content: errorMessage
                })
            }
        } else if(wordsArray[3].toString().toUpperCase() === 'l'.toUpperCase()){
            outcome = false;
            try{
                const player: any = await checkStats(playerName);
                const games = player.Games + 1;
                const success: any = await reportGame(playerName, commanderName, player.Wins, games);
                    if(success){
                    message.reply({
                        content: "Game stats saved."
                    })
                    } else{
                        message.reply({
                            content: "The commander you entered does not exist. Please check the name and formatting and try again."
                        })
                    }
            } catch(e){
                console.log(e);
                message.reply({
                    content: errorMessage
                })
            }
        } else{
            message.reply({
                content: errorMessage
            })
        }
    } else if(message.content === 'mtg -commander stats'){
        try{
            const commanderStats: any[] = await checkAllCommanderStats();
            commanderStats.forEach(commander => {
                const winRate = (commander.Wins/commander.Games) * 100;
                message.reply({
                    content: '**Commander:** ' + commander.Name + ', **Commander Owner:** ' + commander.playerId + ' , **Games played:** ' + commander.Games + ' , **Wins:** ' + commander.Wins + ', **Win Rate:** ' + winRate + '%'
                })
            });
        } catch(e){
            console.log(e);
            message.reply({
                content: errorMessage 
            })
        }
    } else if(message.content.includes('mtg -commander stats !')){
        const commanderName: string = message.content.toString().split('!')[1];
        try{
            const commanderStats: any = await getCommanderStats(commanderName);
            const winRate = (commanderStats.Wins/commanderStats.Games) * 100;
            message.reply({
                content: '**Commander:** ' + commanderStats.Name + ', **Commander Owner:** ' + commanderStats.playerId + ' , **Games played:** ' + commanderStats.Games + ' , **Wins:** ' + commanderStats.Wins + ', **Win Rate:** ' + winRate + '%'
            })
        } catch (e){
            console.log(e);
            message.reply({
                content: errorMessage
            })
        }
    } else if(message.content === 'mtg -add player'){
        try{
        await addPlayer(playerName).then(() => {
                message.reply({
                    content: playerName + ' added to players.'
                })
        })
        }catch(e){
            console.log(e);
            message.reply({
                content: errorMessage
            })
        }
    } else if(message.content.includes('mtg -add commander !')){
        const commanderName: string = message.content.toString().split('!')[1];
        try{
            await addCommander(playerName, commanderName).then(() => {
                message.reply({
                    content: commanderName + ' added to commanders.'
                })
        })
        } catch(e){
            console.log(e);
            message.reply({
                content: errorMessage
            })
        }
    } else if(message.content === 'mtg -help'){
        message.reply({
            content: '**Get stats for all players:** `mtg -all player stats` \n' + 
            '**Get stats for you:** `mtg -player stats` \n' +
            '**Get stats for all commanders:** `mtg -commander stats` \n' +
            '**Get stats for a specific commander:** `mtg -commander stats !COMMANDER_NAME` \n' +
            '**Add a player:** `mtg -add player` \n' +
            '**Add a commander:** `mtg -add commander !COMMANDER_NAME` \n' +
            '**Report a game:** `mtg -report game w !COMMANDER_NAME` *use `l` if you lost* \n' +
            '**For help:** `mtg -help`'
        })
    } 
  }
})

client.login(process.env.TOKEN);
