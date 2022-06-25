"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomDeck = exports.getCommanderStats = exports.checkAllCommanderStats = exports.checkStats = exports.getAllPlayerStats = void 0;
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const firebaseConfig = require("./service_account/serviceAccountKey.json");
(0, app_1.initializeApp)(firebaseConfig);
const db = (0, firestore_1.getFirestore)();
function getAllPlayerStats() {
    return __awaiter(this, void 0, void 0, function* () {
        const playerRef = (0, firestore_1.collection)(db, 'players');
        const snapshot = yield (0, firestore_1.getDocs)(playerRef);
        const playerList = snapshot.docs
            .map(doc => doc.data());
        return playerList;
    });
}
exports.getAllPlayerStats = getAllPlayerStats;
function checkStats(playerName) {
    return __awaiter(this, void 0, void 0, function* () {
        const playerRef = (0, firestore_1.doc)(db, 'players', playerName);
        const snapshot = yield (0, firestore_1.getDoc)(playerRef);
        const player = snapshot === null || snapshot === void 0 ? void 0 : snapshot.data();
        return player;
    });
}
exports.checkStats = checkStats;
function checkAllCommanderStats() {
    return __awaiter(this, void 0, void 0, function* () {
        const commanderRef = (0, firestore_1.collection)(db, 'commanders');
        const snapshot = yield (0, firestore_1.getDocs)(commanderRef);
        const commanderList = snapshot.docs
            .map(doc => doc.data());
        return commanderList;
    });
}
exports.checkAllCommanderStats = checkAllCommanderStats;
function getCommanderStats(commanderName) {
    return __awaiter(this, void 0, void 0, function* () {
        const commanderRef = (0, firestore_1.doc)(db, 'commanders', commanderName);
        const snapshot = yield (0, firestore_1.getDoc)(commanderRef);
        const commander = snapshot === null || snapshot === void 0 ? void 0 : snapshot.data();
        return commander;
    });
}
exports.getCommanderStats = getCommanderStats;
function randomDeck(playerName) {
    return __awaiter(this, void 0, void 0, function* () {
        const commanderRef = (0, firestore_1.collection)(db, 'commanders');
        const snapshot = yield (0, firestore_1.getDocs)(commanderRef);
        const commanderList = snapshot.docs;
        const yourList = [];
        commanderList.forEach((commander) => {
            if (commander.data().playerId === playerName) {
                yourList.push(commander.data().Name);
            }
        });
        const randomIndex = Math.floor(Math.random() * yourList.length);
        const commander = yourList[randomIndex];
        return commander;
    });
}
exports.randomDeck = randomDeck;
