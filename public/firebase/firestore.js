
// Firebase's Firestore Database
const firestoreDB = firebase.firestore();

const playersDB = firestoreDB.collection("players");
const storagePlayerID = "firebase-local-player";
const validPlayerKeys = ["id", "email", "name"];

const adminsDB = firestoreDB.collection("admins");
const storageAdminID = "firebase-local-admin";
const validAdminKeys = ["id"];

const playerCharactersDB = firestoreDB.collection("playerCharacters");
const storagePlayerCharactersID = "firebase-local-player-characters"; // Session Storage
const validPlayerCharacterKeys = ["id", "playerID", "tierID", "name"];

const playerCharacterTiersDB = firestoreDB.collection("playerCharacterTiers");


function listHasAllElements(list, elements) {
    const checker = (arr, target) => target.every(v => arr.includes(v));
    return checker(list, elements);
}