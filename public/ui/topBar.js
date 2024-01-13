
function initTopBarLogo() {
    const topBarLogo = document.querySelector("#top-bar-logo");
    topBarLogo.addEventListener("click", () => {
        window.location.href = homeURL;
    });
}

function initTopBarAccount() {
    const topBarAccountProfile = document.querySelector("#top-bar-account-profile");
    topBarAccountProfile.addEventListener("click", () => {
        // Only redirect to the login page if the player is not already logged in
        if (!player) {
            window.location.href = signInURL;
        }
    });
    
}

function playerStateUpdated(player) {
    setTopBarPlayerDetails(player);

    const topBarSignInBtn = document.querySelector("#top-bar-sign-in-btn");
    const topBarSignOutBtn = document.querySelector("#top-bar-sign-out-btn");

    if (player) {
        topBarSignInBtn.hidden = true;
        topBarSignOutBtn.hidden = false;
    }
    else {
        topBarSignInBtn.hidden = false;
        topBarSignOutBtn.hidden = true;
    }
}

function setTopBarPlayerDetails(player) {
    let playerName = document.querySelector("#top-bar-player-name");
    let playerPhoto = document.querySelector("#top-bar-player-photo");
    let emptyUser = document.querySelector("#top-bar-empty-user");

    if (player) {

        if (player.name) {
            playerName.innerHTML = player.name;
        }
        if (player.photoURL) {
            playerPhoto.hidden = false;
            emptyUser.hidden = true;
            playerPhoto.src = player.photoURL;
        }
        else {
            playerPhoto.hidden = true;
            emptyUser.hidden = false;
        }
    }
    else {
        playerName.innerHTML = "";
        playerPhoto.src = "";
        playerPhoto.hidden = true;
        emptyUser.hidden = false;
    }
}

window.addEventListener("load", () => {
    initTopBarLogo();

    initTopBarAccount();

    addOnPlayerUpdated(playerStateUpdated);
});
