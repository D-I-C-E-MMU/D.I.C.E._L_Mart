
async function checkIfSeeded() {
    return adminsDB.doc("lypfuBmpWHRrpxVTE4Ytk1pTWrw1").get().then((doc) => {
        if (doc.exists) {
            return true;
        }
        return false;
    }).catch(() => {
        return false;
    });
}

async function seedFinalRuleCheck() {
    return playersDB.doc("lypfuBmpWHRrpxVTE4Ytk1pTWrw1").set({
        "email": "ravenlimzhexuan1@gmail.com",
        "name": "Raven",
    });
}

async function seedPlayers() {

}

async function seedAdmins() {
    // ravenlimzhexuan1@gmail admin
    await adminsDB.doc("lypfuBmpWHRrpxVTE4Ytk1pTWrw1").set({});
}

async function seedPlayerCharacters() {

}

async function seedPlayerCharacterTiers() {
    await playerCharacterTiersDB.doc("tier1").set({
        "name": "Tier 1",
        "optionDescription": "Tier 1 - Level 1",
        "level": 1,
        "gold": 100,
    });
    await playerCharacterTiersDB.doc("tier2").set({
        "name": "Tier 2",
        "optionDescription": "Tier 2 - Level 3",
        "level": 3,
        "gold": 500,
    });
    await playerCharacterTiersDB.doc("tier3").set({
        "name": "Tier 3",
        "optionDescription": "Tier 3 - Level 5",
        "level": 5,
        "gold": 1000,
    });
}

window.addEventListener("load", async () => {
    
    if (await checkIfSeeded()) {
        console.log("Already Seeded");
        return;
    }

    let seeds = [
        seedPlayers(),
        seedAdmins(),
        seedPlayerCharacters(),
        seedPlayerCharacterTiers(),
    ];
    await Promise.all(seeds);
    await seedFinalRuleCheck();
    console.log("Finished Seeding");

});
