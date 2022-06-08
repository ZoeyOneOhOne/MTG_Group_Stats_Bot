import { async } from '@firebase/util';
import {initializeApp} from 'firebase/app'
import {collection, getFirestore, getDocs, doc, setDoc, getDoc, query, where, onSnapshot, updateDoc} from 'firebase/firestore'
import { player, commander } from './models';

const firebaseConfig = require("./service_account/serviceAccountKey.json");

initializeApp(firebaseConfig);
  
const db = getFirestore();

//This is the only one that doesn't work
export async function reportGame(playerName: string,commanderName: string, outcome: number, gamesPlayed: number,  ){
    console.log(playerName, commanderName, outcome);
    const playerRef = doc(db, 'players', playerName);
    const commanderRef = doc(db, 'commanders', commanderName);
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