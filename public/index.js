
let runOnce = false;


async function loadLogSheetComponent() {
    const mainContent = document.querySelector("#main-content");
    const logSheetContent = document.createElement("div");
    mainContent.appendChild(logSheetContent);
    // Load in order
    await injectComponentToNode("/logSheets/logSheet-component.html", logSheetContent);
    await injectScriptToNode("/logSheets/ui/logSheetGeneral.js", logSheetContent);
    await injectScriptToNode("/logSheets/logSheet.js", logSheetContent);
}

async function loadPlayerCharacterComponent() {
    const mainContent = document.querySelector("#main-content");
    const playerContent = document.createElement("div");
    mainContent.appendChild(playerContent);
    // Load in order
    await injectComponentToNode("/playerCharacters/listPC-component.html", playerContent);
    await injectScriptToNode("/playerCharacters/ui/pcGeneral.js", playerContent);
    await injectScriptToNode("/playerCharacters/listPC.js", playerContent);
}

addOnPlayerUpdated((player) => {
    if (!player) {
        return;
    }

    if (!runOnce) {
        loadLogSheetComponent();
        loadPlayerCharacterComponent();
    }

    runOnce = true;

});
