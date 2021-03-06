import {initializeApp} from 'firebase/app'
import {collection, getFirestore, getDocs, doc, getDoc} from 'firebase/firestore'

const firebaseConfig = require("./service_account/serviceAccountKey.json");

initializeApp(firebaseConfig);
  
const db = getFirestore();

export async function getAllPlayerStats(){
    const playerRef = collection(db, 'players');
    const snapshot = await getDocs(playerRef);
    const playerList = snapshot.docs
      .map(doc => doc.data());
    return playerList;
}

export async function checkStats(playerName: string){
    const playerRef = doc(db, 'players', playerName);
    const snapshot = await getDoc(playerRef);
    const player = snapshot?.data();
    return player;
}

export async function checkAllCommanderStats(){
    const commanderRef = collection(db, 'commanders');
    const snapshot = await getDocs(commanderRef);
    const commanderList = snapshot.docs
      .map(doc => doc.data());
    return commanderList;
}

export async function getCommanderStats(commanderName: string){
    const commanderRef = doc(db, 'commanders', commanderName);
    const snapshot = await getDoc(commanderRef);
    const commander = snapshot?.data();
    return commander;
}

export async function randomDeck(playerName: string){
    const commanderRef = collection(db, 'commanders');
    const snapshot = await getDocs(commanderRef);
    const commanderList = snapshot.docs
    const yourList: any = []
    commanderList.forEach((commander) => {
      if(commander.data().playerId === playerName){
        yourList.push(commander.data().Name);
      }
    })
    const randomIndex = Math.floor(Math.random() * yourList.length);
    const commander = yourList[randomIndex];
    return commander;
}