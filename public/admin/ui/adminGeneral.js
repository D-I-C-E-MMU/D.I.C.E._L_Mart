
const adminHomeURL = "/admin/home"
const adminManagementURL = "/admin/adminManagement"

let onAdminUpdatedCallbacks = [];
let onAdminUpdatedCallbackEmitted = false;

function initAdminManagement() {
    const adminManagementBtn = document.querySelectorAll(".admin-management-btn");
    adminManagementBtn.forEach((button) => {
        button.addEventListener("click", () => {
            window.location.href = adminManagementURL;
        });
    });
}

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

window.addEventListener('load', () => {
    initAdminManagement();
});