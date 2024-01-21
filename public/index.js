
let runOnce = false;

async function loadPlayerCharacterComponent() {
    const mainContent = document.querySelector("#main-content");
    // Load in order
    await injectComponentToNode("/playerCharacters/listPC-component.html", mainContent);
    await injectScriptToNode("/playerCharacters/ui/pcGeneral.js", mainContent);
    await injectScriptToNode("/playerCharacters/loadPC.js", mainContent);
    await injectScriptToNode("/playerCharacters/listPC.js", mainContent);
}

addOnPlayerUpdated((player) => {
    if (!player) {
        return;
    }

    if (!runOnce) {
        loadPlayerCharacterComponent();
    }

    runOnce = true;

})

window.addEventListener('load', () => {

});
