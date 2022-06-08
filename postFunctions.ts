import {initializeApp} from 'firebase/app'
import {getFirestore, doc, setDoc, updateDoc, getDoc} from 'firebase/firestore'

const firebaseConfig = require("./service_account/serviceAccountKey.json");

initializeApp(firebaseConfig);
  
const db = getFirestore();

export async function reportGame(playerName: string,commanderName: string, outcome: number, gamesPlayed: number,  ){
    const commanderRef = doc(db, 'commanders', commanderName);
    const commanderStats: any = await (await getDoc(commanderRef));
    const commander = commanderStats?.data();
    console.log(commander);
    if(commander){
    try { 
        await updateDoc(doc(db, 'commanders', commanderName), {
            Wins:  outcome,
            Games: gamesPlayed,
        })
        return true;
    } catch(e){
        console.log(e);
    }
    try {
        await updateDoc(doc(db, 'players', playerName), {
            Wins:  outcome,
            Games: gamesPlayed,
        })
        return true;
    } catch(e){
        console.log(e);
    }
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