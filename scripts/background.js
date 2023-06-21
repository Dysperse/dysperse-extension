chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getSessionData") {
    fetch("https://my.dysperse.com/api/session")
      .then((res) => res.json())
      .then((data) => {
        sendResponse(data);
      })
      .catch((error) => {
        console.error(error);
        sendResponse(null);
      });

    return true;
  }

  if (message.action == "useApi") {
    const { endpoint, params } = message;
    fetch(
      `https://my.dysperse.com/api/${endpoint}?${new URLSearchParams(params)}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        sendResponse(data);
      })
      .catch((error) => {
        console.error(error);
        sendResponse(null);
      });
    return true;
  }
});
