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
exports.addCommander = exports.addPlayer = exports.reportGame = void 0;
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const firebaseConfig = require("./service_account/serviceAccountKey.json");
(0, app_1.initializeApp)(firebaseConfig);
const db = (0, firestore_1.getFirestore)();
function reportGame(playerName, commanderName, outcome) {
    return __awaiter(this, void 0, void 0, function* () {
        const commanderRef = (0, firestore_1.doc)(db, 'commanders', commanderName);
        const commanderStats = yield (yield (0, firestore_1.getDoc)(commanderRef));
        const commander = commanderStats === null || commanderStats === void 0 ? void 0 : commanderStats.data();
        const playerRef = (0, firestore_1.doc)(db, 'players', playerName);
        const playerStats = yield (yield (0, firestore_1.getDoc)(playerRef));
        const player = playerStats === null || playerStats === void 0 ? void 0 : playerStats.data();
        if (commander) {
            if (outcome) {
                try {
                    yield (0, firestore_1.updateDoc)((0, firestore_1.doc)(db, 'commanders', commanderName), {
                        Wins: commander.Wins + 1,
                        Games: commander.Games + 1,
                    });
                }
                catch (e) {
                    console.log(e);
                }
                try {
                    yield (0, firestore_1.updateDoc)((0, firestore_1.doc)(db, 'players', playerName), {
                        Wins: player.Wins + 1,
                        Games: player.Games + 1,
                    });
                }
                catch (e) {
                    console.log(e);
                }
            }
            else if (outcome == false) {
                try {
                    yield (0, firestore_1.updateDoc)((0, firestore_1.doc)(db, 'commanders', commanderName), {
                        Wins: commander.Wins,
                        Games: commander.Games + 1,
                    });
                }
                catch (e) {
                    console.log(e);
                }
                try {
                    yield (0, firestore_1.updateDoc)((0, firestore_1.doc)(db, 'players', playerName), {
                        Wins: player.Wins,
                        Games: player.Games + 1,
                    });
                }
                catch (e) {
                    console.log(e);
                }
            }
            return true;
        }
        else {
            return false;
        }
    });
}
exports.reportGame = reportGame;
function addPlayer(playerName) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, firestore_1.setDoc)((0, firestore_1.doc)(db, 'players', playerName), {
            Name: playerName,
            Games: 0,
            Wins: 0,
        });
    });
}
exports.addPlayer = addPlayer;
function addCommander(playerName, commanderName) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, firestore_1.setDoc)((0, firestore_1.doc)(db, 'commanders', commanderName), {
            Name: commanderName,
            Games: 0,
            Wins: 0,
            playerId: playerName,
        });
    });
}
exports.addCommander = addCommander;
