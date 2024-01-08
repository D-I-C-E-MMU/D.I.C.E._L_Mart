
function initSignOutButton() {
    const signOutBtn = document.querySelector("#sign-out-btn");
    signOutBtn.addEventListener("click", () => {
        firebase.auth().signOut().then(() => {
            window.location.href = "/index.html";
        }).catch((error) => {
            console.log(error);
        });
    });
}

window.addEventListener('load', () => {
    initSignOutButton();
});
