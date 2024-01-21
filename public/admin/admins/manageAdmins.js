
// Players in this context refer to non admins

function loadAdminsAndPlayers() {
    let getAdmins = getAllAdmins();
    let getPlayers = getAllPlayers();
    Promise.all([getAdmins, getPlayers]).then((pair) => {
        let admins = pair[0];
        let players = pair[1];
        if (admins == null || players == null) {
            console.error("Failed to load admins or players")
            return;
        }
        organizeAdminsAndPlayers(admins, players);
        let adminsTable = document.querySelector("#admins-table");
        let playersTable = document.querySelector("#players-table");
        showTable(adminsTable, admins, "Remove", (adminID) => {
            let name = admins[adminID].name;
            if (confirm(`Are you sure you want to remove an admin: ${name}(${adminID})?`)) {
                removeAdmin(adminID);
            }
        });
        showTable(playersTable, players, "Add", (playerID) => {
            let name = players[playerID].name;
            if (confirm(`Are you sure you want to add an admin: ${name}(${playerID})?`)) {
                addAdmin(playerID);
            }
        });
    });
}

function showTable(table, users, actionName, action) {
    for (let userID in users) {
        let row = table.insertRow();
        let nameCell = row.insertCell(0);
        let emailCell = row.insertCell(1);
        let actionCell = row.insertCell(2);
        nameCell.innerHTML = users[userID].name;
        emailCell.innerHTML = users[userID].email;
        let actionButton = document.createElement("button");
        actionButton.innerHTML = actionName;
        actionButton.addEventListener("click", () => {
            action(userID);
        });
        actionCell.appendChild(actionButton);
    }
}

// Firestore Read Get
function getAllAdmins() {
    return adminsDB.get().then((adminDocs) => {

        let admins = {};
        adminDocs.forEach((adminDoc) => {
            admins[adminDoc.id] = adminDoc.data();
        })
        return admins;

    }).catch((error) => {
        console.error("Error getting admins");
        console.error(error);
        return null;
    });
}

// Firestore Read Get
function getAllPlayers() {
    return playersDB.get().then((playerDocs) => {

        let players = {};
        playerDocs.forEach((playerDoc) => {
            players[playerDoc.id] = playerDoc.data();
        })
        return players;

    }).catch((error) => {
        console.error("Error getting players");
        console.error(error);
        return null;
    });
}

// Firestore Delete
function removeAdmin(adminID) {
    adminsDB.doc(adminID).delete().then(() => {

        if (adminID == admin.id) {
            localStorage.removeItem(storageAdminID);
        }
        // Refresh
        window.location.reload();

    }).catch((error) => {
        console.error(`Failed to delete admin ${adminID}`);
        console.error(error);
    });
}

// Firestore Create
function addAdmin(playerID) {
    adminsDB.doc(playerID).set({}).then(() => {
        
        // Refresh
        window.location.reload();

    }).catch((error) => {
        console.error(`Failed to add admin ${playerID}`);
        console.error(error);
    });
}

function organizeAdminsAndPlayers(admins, players) {

    for (let adminID in admins) {
        let adminPlayer = players[adminID];
        if (adminPlayer) {
            admins[adminID].name = adminPlayer.name;
            admins[adminID].email = adminPlayer.email;
            // Remove admin from the players list
            delete players[adminID];
        }
        else {
            admins[adminID].player = {
                "name": adminID,
                "email": "Unknown"
            };
        }
    }

}

window.addEventListener('load', () => {
    loadAdminsAndPlayers();
});
