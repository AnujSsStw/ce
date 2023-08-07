"use strict";

console.log("working");

let header = {};
let cookiesArray;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "logCookies") {
    cookiesArray = message.cookies;
  }
});

chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    if (details.tabId !== -1 && details.url.includes("updatesV2")) {
      const headers = details.requestHeaders;
      for (let i = 0; i < headers.length; i++) {
        header[headers[i].name] = headers[i].value;
      }
    }
  },
  { urls: ["https://www.linkedin.com/*"] },
  ["requestHeaders"]
);

chrome.webRequest.onCompleted.addListener(
  async (details) => {
    if (details.tabId !== -1 && details.url.includes("updatesV2")) {
      // console.log("header", header);
      // console.log("cookiesArray", cookiesArray);
      // console.log("details", details);

      const usefullData = [];

      fetch(details.url, {
        method: details.method,
        headers: {
          "Content-Type": "application/json",
          Cookie: cookiesArray, // Include the cookie string here
          ...header,
        },
      })
        .then(async (response) => {
          const te = await response.json();
          const d = te.included;
          for (let i = 0; i < d.length; i++) {
            const element = d[i];
            if (element.$type == "com.linkedin.voyager.feed.render.UpdateV2") {
              usefullData.push({
                actor: element.actor,
                header: element.header,
                commentary: element.commentary,
              });
            }
          }

          console.log("sending data");

          fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: usefullData,
            }),
          }).catch((error) => {
            // Handle errors
            console.log("error 1", error);
          });
        })
        .catch((error) => {
          // Handle errors
          console.log("error 2", error);
        });
    }
  },
  { urls: ["https://www.linkedin.com/*"] }
);

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "getTabInfo") {
    // Get tab information and send it back to content script
    chrome.tabs.query(
      { active: true, currentWindow: true },
      async function (tabs) {
        const tabInfo = {
          tabUrl: tabs[0].url,
        };

        const data = await fetchData(tabInfo);
        console.log("data", data);
        sendResponse(data);
      }
    );
    return true; // Required to indicate that the response will be sent asynchronously
  }
});

async function fetchData(tabInfo) {
  try {
    const response = await fetch("http://127.0.0.1:5000/comments", {
      method: "POST",
      body: JSON.stringify(tabInfo),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
