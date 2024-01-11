
const adminHomeURL = "/admin/home"

let onAdminUpdatedCallbacks = [];
let onAdminUpdatedCallbackEmitted = false;

function onAdminUpdated(admin) {
    onAdminUpdatedCallbackEmitted = true;
    onAdminUpdatedCallbacks.forEach((callback) => {
        callback(admin);
    });
}

function addOnAdminUpdated(callback) {
    onAdminUpdatedCallbacks.push(callback);
    if (onAdminUpdatedCallbackEmitted) {
        callback(admin);
    }
}