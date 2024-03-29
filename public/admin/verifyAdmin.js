
let admin = null;

function retrieveAdminFromStorage() {
    let adminStr = localStorage.getItem(storageAdminID);
    if (!adminStr) {
        return null;
    }
    let adminData = JSON.parse(adminStr);
    if (adminData) {
        if (listHasAllElements(Object.keys(adminData), validAdminKeys)) {
            return adminData;
        }
        // Remove invalid data
        localStorage.removeItem(storageAdminID);
    }
    return null;
}

function verifyAdminThroughFirebase(userUID) {
    return getAdminFirestore(userUID).then((admin) => {
        if (admin) {
            return admin;
        }
        return null;
    })
}

function saveAdminToStorage(adminData) {
    localStorage.setItem(storageAdminID, JSON.stringify(adminData));
}

// Only verifies that admin is verified through Firestore. Will not make a request to Firebase.
// Security: Even if the user can inject fake admin data into localStorage, the user will fail all checks setup in Firestore's rules.
function verifyLocalAdmin(onSuccessCallback) {
    verifySignIn(() => {
        let adminData = retrieveAdminFromStorage();
        if (adminData) {
            admin = adminData;
            if (onSuccessCallback) onSuccessCallback(adminData);
            return;
        }
        window.location.href = homeURL;
    })
}

// Verifies the admin. If the admin is not already verified (localStorage), verify if the user is an admin through Firestore.
function verifyFirestoreAdmin() {
    verifySignIn(() => {
        let adminData = retrieveAdminFromStorage();
        if (adminData) {
            admin = adminData;
            window.location.replace(adminHomeURL);
            return;
        }
        verifyAdminThroughFirebase(userUID).then((adminData) => {
            if (adminData) {
                saveAdminToStorage(adminData);
                admin = adminData;
                window.location.replace(adminHomeURL);
                return;
            }
            window.location.href = homeURL;
        });
    })
}
