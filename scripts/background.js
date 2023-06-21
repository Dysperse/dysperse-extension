chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getSessionData") {
    fetch("https://my.dysperse.com/api/session")
      .then((res) => res.json())
      .then((data) => {
        sendResponse(data); // Send the session data back to the content script
      })
      .catch((error) => {
        console.error(error);
        sendResponse(null); // If an error occurs, send null back to the content script
      });

    return true; // Indicates that the response will be sent asynchronously
  }

  if (message.action == "useApi") {
    // { action: "useApi", endpoint, params },
    const { endpoint, params } = message;
    fetch(
      `https://my.dysperse.com/api/${endpoint}?${new URLSearchParams(params)}`
    )
      .then((res) => res.json())
      .then((data) => {
        sendResponse(data);
      })
      .catch((error) => {
        console.error(error);
        sendResponse(null);
      });
  }
});
