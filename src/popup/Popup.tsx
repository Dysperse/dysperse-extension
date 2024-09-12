import { useEffect, useState } from 'react'
import './Popup.css'

export const Popup = () => {
  const [data, setData] = useState({})

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0]
      setData(activeTab)
    })
  }, [])

  const openSidePanel = () => {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0]
        chrome.runtime.sendMessage({ action: 'open_side_panel', activeTab })
      })
    } catch (e) {
      console.log(e)
      window.open('https://app.dysperse.com')
    }
  }

  useEffect(() => {
    // Listen for messages from the iframe
    const handleMessage = (event: any) => {
      if (event.data === 'openSidePanel') {
        openSidePanel()
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  const host = 'https://app.dysperse.com'

  return (
    <iframe
      src={`${host}/chrome-extension?pageData=${encodeURIComponent(JSON.stringify(data))}`}
      width={400}
      height={400}
      style={{ border: 0, margin: 0 }}
    />
  )
}

export default Popup
