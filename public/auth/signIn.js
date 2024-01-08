
const playerDB = firestoreDB.collection("players")

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

function verifySignInThroughFirebase(user) {
    let uid = user.uid;
    return playerDB.doc(uid).get().then((playerDoc) => {

        if (playerDoc.exists) {
            console.log(`Player Doc ${uid} exists.`);
            console.log(playerDoc.data());
            return playerDoc.data();
        }
        console.log(`Player Doc ${uid} does not exist.`);
        return null;

    }).catch((error) => {
        console.log(`Player Doc ${uid} failed to retrieve.`);
        console.log(error);
        return null;
    });
}

function createNewPlayerThroughFirebase(user) {
    console.log(`Creating a new player: ${user.uid}, ${user.displayName}, ${user.email}`);
    let player = {
        email: user.email,
        name: user.displayName,
    }

    return playerDB.doc(user.uid).set(player).then(() => {
        console.log("New player created");
        return player;
        
    }).catch((error) => {
        console.log(error);
        console.log("Failed to create new player");
        return null;
    });
}

function saveAndSignInToUser(user) {
    saveSignInToLocalStorage(user);
    window.location.href = "/player.html";
}

function saveSignInToLocalStorage(user) {
    // Do NOT save the uid or accessToken to localStorage
    localStorage.setItem("user", JSON.stringify(user));
}
