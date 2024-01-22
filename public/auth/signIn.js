
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
        getPlayerFirestore(user.uid).then((playerData) => {
            if (playerData) {
                console.log("Gonna login with playerData")
                saveAndSignInToUser(playerData);
            }
            else {
                console.log("no player data to login with");
                createNewPlayer(user.uid, user).then((playerData) => {
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

function createNewPlayer(user) {
    console.log(`Creating a new player: ${user.uid}, ${user.displayName}, ${user.email}`);
    let playerData = {
        email: user.email,
        name: user.displayName,
    }

    return createPlayerFirstore(playerData);
}

function saveAndSignInToUser(user) {
    saveSignInToStorage(user);
    window.location.href = signedInURL;
}

function saveSignInToStorage(user) {
    // Do NOT save the uid or accessToken to localStorage
    localStorage.setItem(storagePlayerID, JSON.stringify(user));
}
