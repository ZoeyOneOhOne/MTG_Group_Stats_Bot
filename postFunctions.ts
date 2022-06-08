import {initializeApp} from 'firebase/app'
import {getFirestore, doc, setDoc, updateDoc} from 'firebase/firestore'

const firebaseConfig = require("./service_account/serviceAccountKey.json");

initializeApp(firebaseConfig);
  
const db = getFirestore();

export async function reportGame(playerName: string,commanderName: string, outcome: number, gamesPlayed: number,  ){
    await updateDoc(doc(db, 'players', playerName), {
        Wins:  outcome,
        Games: gamesPlayed,
    })
    await updateDoc(doc(db, 'commanders', commanderName), {
        Wins:  outcome,
        Games: gamesPlayed,
    })
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