console.log("holi")
isExtensionScope = false
var dot
chrome.storage.sync.get((items) => {
    if(items && items.disturb) {
        generateDisturb(items.disturb)
    }
});