console.log('Dysperse is running in the background!')

// to find the windowId of the active tab
let windowId: any
chrome.tabs.onActivated.addListener(function (activeInfo) {
  windowId = activeInfo.windowId
})

// to receive messages from popup script
chrome.runtime.onMessage.addListener((message, sender) => {
  ;(async () => {
    if (message.action === 'open_side_panel') {
      ;(chrome.sidePanel as any).open({ windowId: windowId, tabId: message.activeTab.id })
    }
  })()
})
