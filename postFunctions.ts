import { async } from '@firebase/util';
import {initializeApp} from 'firebase/app'
import {collection, getFirestore, getDocs, doc, setDoc, query, where, onSnapshot} from 'firebase/firestore'
import { player, commander } from './models';

const firebaseConfig = require("./service_account/serviceAccountKey.json");

initializeApp(firebaseConfig);
  
const db = getFirestore();

//This is the only one that doesn't work
export async function reportGame(playerName: string,commanderName: string, outcome: boolean){
    console.log(playerName, commanderName, outcome);
}

export async function addPlayer(playerName: string) {
    const playerRef = doc(db, 'players', playerName)
    await setDoc(doc(db, 'players', playerName), {
        Name: playerName,
        Games: 0,
        Wins: 0,
    })
}

export async function addCommander(playerName: string, commanderName: string){
    const commanderRef = doc(db, 'commanders', commanderName)
    await setDoc(doc(db, 'commanders', commanderName), {
        Name: commanderName,
        Games: 0,
        Wins: 0,
        playerId: playerName,
    })
}