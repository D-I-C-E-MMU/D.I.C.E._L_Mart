
let runOnce = false;

async function loadPlayerCharacterComponent() {
    const mainContent = document.querySelector("#main-content");
    // Load in order
    await injectComponentToNode("/playerCharacter/playerCharacterList-component.html", mainContent);
    await injectScriptToNode("/playerCharacter/loadPlayerCharacters.js", mainContent);
    await injectScriptToNode("/playerCharacter/listPlayerCharacters.js", mainContent);
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
