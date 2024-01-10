
const notAdminURL = "/";

let admin = null;

function verifyAdminOrReturnToIndex(onSuccessCallback) {
    verifySignInOrReturnToIndex(() => {
        let adminData = retrieveAdminFromStorage();
        if (adminData) {
            admin = adminData;
            if (onSuccessCallback) {
                onSuccessCallback(adminData);
            }
        }
        else {
            verifyAdminThroughFirebase(userUID).then((adminData) => {
                if (adminData) {
                    saveAdminToStorage(adminData);
                    admin = adminData;
                    if (onSuccessCallback) {
                        onSuccessCallback(adminData);
                    }
                }
                else {
                    redirectToIndex();
                }
            });
        }
    })
}

// Firestore Read Get
function verifyAdminThroughFirebase(userUID) {
    return adminDB.doc(userUID).get().then((adminDoc) => {

        if (adminDoc.exists) {
            console.log(`Admin Doc ${userUID} exists.`);
            console.log(adminDoc.data());
            return adminDoc.data();
        }
        console.log(`Admin Doc ${userUID} does not exist.`);
        return null;

    }).catch((error) => {
        console.error(`Admin Doc ${userUID} failed to retrieve.`);
        console.error(error);
        return null;
    });
}

function retrieveAdminFromStorage() {
    let adminStr = sessionStorage.getItem(localAdminID);
    if (!adminStr) {
        return null;
    }
    let adminData = JSON.parse(adminStr);
    if (adminData) {
        if (listHasAllElements(Object.keys(adminData), validAdminKeys)) {
            return adminData;
        }
    }
    return null;
}

function saveAdminToStorage(adminData) {
    // Using session storage because admin is more sensitive
    sessionStorage.setItem(localAdminID, JSON.stringify(adminData));
}

function redirectToIndex() {
    window.location.href = notAdminURL;
}
