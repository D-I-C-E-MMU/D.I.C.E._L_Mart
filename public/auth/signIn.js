
// Sign in via Firebase. Executes only the first time the user is signed in, or when the user .
// Does not run when the user is already signed in (with the existence of 'login' in localStorage)
function signIn(firebaseUser) {
    let user;
    firebaseUser.getIdToken().then((accessToken) => {
        user = {
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            uid: firebaseUser.uid,
            accessToken: accessToken,
            providerData: firebaseUser.providerData
        }
    }).then(() => {
        verifySignInThroughFirebase(user).then((playerData) => {
            if (playerData) {
                console.log("Gonna login with playerData")
                saveAndSignInToUser(playerData);
            }
            else {
                console.log("no player data to login with");
                createNewPlayerThroughFirebase(user).then((playerData) => {
                    if (playerData) {
                        saveAndSignInToUser(playerData);
                    }
                    else {
                        console.error("Failed to create new player!");
                    }
                });
            }
        });
    });
}

// Firestore Read Get
function verifySignInThroughFirebase(user) {
    let uid = user.uid;
    return playerDB.doc(uid).get().then((playerDoc) => {

        if (playerDoc.exists) {
            console.log(`Player Doc ${uid} exists.`);
            console.log(playerDoc.data());
            let playerData = playerDoc.data();
            playerData.id = uid;
            return playerData;
        }
        console.log(`Player Doc ${uid} does not exist.`);
        return null;

    }).catch((error) => {
        console.error(`Player Doc ${uid} failed to retrieve.`);
        console.error(error);
        return null;
    });
}

// Firestore Write Create
function createNewPlayerThroughFirebase(user) {
    console.log(`Creating a new player: ${user.uid}, ${user.displayName}, ${user.email}`);
    let playerData = {
        email: user.email,
        name: user.displayName,
    }

    return playerDB.doc(user.uid).set(playerData).then(() => {
        console.log("New player created");
        playerData.id = user.uid;
        return playerData;
        
    }).catch((error) => {
        console.error(error);
        console.error("Failed to create new player");
        return null;
    });
}

function saveAndSignInToUser(user) {
    saveSignInToStorage(user);
    window.location.href = signedInURL;
}

function saveSignInToStorage(user) {
    // Do NOT save the uid or accessToken to localStorage
    localStorage.setItem(storagePlayerID, JSON.stringify(user));
}
