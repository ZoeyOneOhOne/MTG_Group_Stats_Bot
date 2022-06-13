import {initializeApp} from 'firebase/app'
import {getFirestore, doc, setDoc, updateDoc, getDoc} from 'firebase/firestore'

const firebaseConfig = require("./service_account/serviceAccountKey.json");

initializeApp(firebaseConfig);
  
const db = getFirestore();

export async function reportGame(playerName: string,commanderName: string, outcome: boolean,){
    const commanderRef = doc(db, 'commanders', commanderName);
    const commanderStats: any = await (await getDoc(commanderRef));
    const commander = commanderStats?.data();

    const playerRef = doc(db, 'players', playerName);
    const playerStats: any = await (await getDoc(playerRef));
    const player = playerStats?.data();
    if(commander){
        if(outcome){            
            try { 
                await updateDoc(doc(db, 'commanders', commanderName), {
                    Wins:  commander.Wins + 1,
                    Games: commander.Games + 1,
                })
            } catch(e){
                console.log(e);
            }
            try {
                await updateDoc(doc(db, 'players', playerName), {
                    Wins:  player.Wins +1,
                    Games: player.Games + 1,
                })
            } catch(e){
                console.log(e);
            }
        } else if(outcome == false){
            try { 
                await updateDoc(doc(db, 'commanders', commanderName), {
                    Wins:  commander.Wins,
                    Games: commander.Games + 1,
                })
            } catch(e){
                console.log(e);
            }
            try {
                await updateDoc(doc(db, 'players', playerName), {
                    Wins:  player.Wins,
                    Games: player.Games + 1,
                })
            } catch(e){
                console.log(e);
            }
        }
        return true;
  }
  else{
      return false;
  }
}

export async function addPlayer(playerName: string) {
    await setDoc(doc(db, 'players', playerName), {
        Name: playerName,
        Games: 0,
        Wins: 0,
    })
}

export async function addCommander(playerName: string, commanderName: string){
    await setDoc(doc(db, 'commanders', commanderName), {
        Name: commanderName,
        Games: 0,
        Wins: 0,
        playerId: playerName,
    })
}