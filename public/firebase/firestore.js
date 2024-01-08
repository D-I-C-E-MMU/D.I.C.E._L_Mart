
// Firebase's Firestore Database
const firestoreDB = firebase.firestore();

const playerDB = firestoreDB.collection("players");
const localPlayerID = "firebase-local-player";
const validPlayerKeys = ["email", "name"]

const adminDB = firestoreDB.collection("admins");
const localAdminID = "firebase-local-admin";
const validAdminKeys = ["rank"]