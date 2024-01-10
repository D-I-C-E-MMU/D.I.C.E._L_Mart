
async function loadHTML(url) {
    let response = await fetch(url);
    let html = await response.text();
    return html;
}

async function injectComponentToNode(componentURL, node) {
    let component = await loadHTML(componentURL);
    node.innerHTML = component;
}
