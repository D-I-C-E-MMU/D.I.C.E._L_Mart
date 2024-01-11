
// Firebase's Firestore Database
const firestoreDB = firebase.firestore();

const playerDB = firestoreDB.collection("players");
const storagePlayerID = "firebase-local-player";
const validPlayerKeys = ["email", "name"]

const adminDB = firestoreDB.collection("admins");
const storageAdminID = "firebase-local-admin";
const validAdminKeys = []



function listHasAllElements(list, elements) {
    const checker = (arr, target) => target.every(v => arr.includes(v));
    return checker(list, elements);
}