
function initPlayers() {

    const pcPlayerSelect = document.querySelector("#pc-player-select");

    getPlayersFirestore().then((players) => {
        if (!players) {
            alert("Failed to retrieve players");
            return;
        }

        players.forEach((player) => {
            let option = document.createElement("option");
            option.value = player.id;
            option.innerHTML = player.name;
            pcPlayerSelect.appendChild(option);
        });
    });
}

window.addEventListener('load', () => {
    initPlayers();
});
