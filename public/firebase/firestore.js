
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



//
// Firestore Queries
//

// Firestore Read Get
function getAdminFirestore(adminID) {

    return adminsDB.doc(adminID).get().then((adminDoc) => {

        if (adminDoc.exists) {
            let adminData = adminDoc.data();
            adminData.id = adminDoc.id;
            return adminData;
        }

        console.warn(`Admin Doc ${adminID} does not exist.`);
        return null;

    }).catch((error) => {
        console.error(`Admin Doc ${userUID} failed to retrieve.`);
        console.error(error);
        return null;
    });

}

// Firestore Read List
function getAdminsFirestore() {

    return adminsDB.get().then((adminDocs) => {

        let admins = [];

        adminDocs.forEach((adminDoc) => {
            let adminData = adminDoc.data();
            adminData.id = adminDoc.id;
            admins.push(adminData);
        })

        return admins;

    }).catch((error) => {
        console.error(`Admin Docs failed to retrieve.`);
        console.error(error);
        return null;
    });

}

// Firestore Write Create
function createAdminFirestore(adminID) {

    let adminData = {};

    return adminsDB.doc(adminID).set(adminData).then((adminDoc) => {

        adminData = adminDoc.data();
        adminData.id = adminDoc.id;
        return adminData;

    }).catch((error) => {
        console.error(`Admin Doc ${adminID} failed to create.`);
        console.error(error);
        return null;
    });

}

// Firestore Write Delete
function deleteAdminFirestore(adminID) {

    return adminsDB.doc(adminID).delete().then(() => {

        let adminData = {
            id: adminID,
        };
        return adminData;

    }).catch((error) => {
        console.error(`Admin Doc ${adminID} failed to delete.`);
        console.error(error);
        return null;
    });

}

// Firestore Read Get
function getPlayerFirestore(playerID) {

    return playersDB.doc(playerID).get().then((playerDoc) => {

        if (playerDoc.exists) {
            let playerData = playerDoc.data();
            playerData.id = playerDoc.id;
            return playerData;
        }
        
        console.warn(`Player Doc ${playerID} does not exist.`);
        return null;

    }).catch((error) => {
        console.error(`Player Doc ${playerID} failed to retrieve.`);
        console.error(error);
        return null;
    });

}

// Firestore Read List
function getPlayersFirestore() {

    return playersDB.get().then((playerDocs) => {

        let players = [];

        playerDocs.forEach((playerDoc) => {
            let playerData = playerDoc.data();
            playerData.id = playerDoc.id;
            players.push(playerData);
        });

        return players;

    }).catch((error) => {
        console.error(`Player Docs failed to retrieve.`);
        console.error(error);
        return null;
    });

}

// Firestore Write Create
function createPlayerFirstore(playerID, playerData) {

    return playersDB.doc(playerID).set(playerData).then((playerDoc) => {

        playerData = playerDoc.data();
        playerData.id = playerDoc.id;
        return playerData;

        return null;

    }).catch((error) => {
        console.error(`Player Doc ${playerData} failed to create.`);
        console.error(error);
        return null;
    });

}

// Firestore Read Get
function getPlayerCharacterFirestore(playerCharacterID) {

    return playerCharactersDB.doc(playerCharacterID).get().then((playerCharacterDoc) => {

        if (playerCharacterDoc.exists) {
            let playerCharacterData = playerCharacterDoc.data();
            playerCharacterData.id = playerCharacterDoc.id;
            return playerCharacterData;
        }

        console.warn(`Player Character Doc ${playerCharacterID} does not exist.`);
        return null;


    }).catch((error) => {
        console.error(`Player Character Doc ${playerCharacterID} failed to retrieve.`);
        console.error(error);
        return null;
    });

}

// Firestore Read List
function getPlayerCharactersFirestore() {

    return playerCharactersDB.get().then((playerCharacterDocs) => {

        let playerCharacters = [];

        playerCharacterDocs.forEach((playerCharacterDoc) => {
            let playerCharacterData = playerCharacterDoc.data();
            playerCharacterData.id = playerCharacterDoc.id;
            playerCharacters.push(playerCharacterData);
        });

        return playerCharacters;

    }).catch((error) => {
        console.error(`Player Character Docs failed to retrieve.`);
        console.error(error);
        return null;
    });

}

// Firestore Read List Where
function getPlayerOwnedPlayerCharactersFirestore(playerID) {

    return playerCharactersDB.where("playerID", "==", playerID).get().then((playerCharacterDocs) => {

        let playerCharactersData = [];
        playerCharacterDocs.forEach((playerCharacterDoc) => {
            let playerCharacterData = playerCharacterDoc.data();
            playerCharacterData.id = playerCharacterDoc.id;
            playerCharactersData.push(playerCharacterData);
        });
        return playerCharactersData;

    }).catch((error) => {
        console.error(`Player Characters for Player ID ${playerID} failed to retrieve.`);
        console.error(error);
        return null;
    });

}

// Firestore Write Create
function createPlayerCharacterFirestore(playerCharacterData) {

    return playerCharactersDB.add(playerCharacterData).then((playerCharacterDoc) => {

        playerCharacterData = playerCharacterDoc.data();
        playerCharacterData.id = playerCharacterDoc.id;
        return playerCharacterData;

    }).catch((error) => {
        console.error(`Player Character Doc ${playerCharacterData} failed to create.`);
        console.error(error);
        return null;
    });

}

// Firestore Write Update
function updatePlayerCharacterFirestore(playerCharacterID, playerCharacterData) {

    if (playerCharacterData.id) {
        delete playerCharacterData.id;
    }

    return playerCharactersDB.doc(playerCharacterID).update(playerCharacterData).then((playerCharacterDoc) => {

        playerCharacterData = playerCharacterDoc.data();
        playerCharacterData.id = playerCharacterID;
        return playerCharacterData;

    }).catch((error) => {
        console.error(`Player Character Doc ${playerCharacterID} failed to update.`);
        console.error(error);
        return null;
    });

}

// Firestore Read List
function getPlayerCharacterTiersFirestore() {

    return playerCharacterTiersDB.get().then((playerCharacterTierDocs) => {

        let playerCharacterTiers = [];

        playerCharacterTierDocs.forEach((playerCharacterTierDoc) => {
            let playerCharacterTierData = playerCharacterTierDoc.data();
            playerCharacterTierData.id = playerCharacterTierDoc.id;
            playerCharacterTiers.push(playerCharacterTierData);
        });

        return playerCharacterTiers;

    }).catch((error) => {
        console.error(`Player Character Tier Docs failed to retrieve.`);
        console.error(error);
        return null;
    });

}
