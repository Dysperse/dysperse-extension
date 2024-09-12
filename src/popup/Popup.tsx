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

  const t = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0]
      chrome.runtime.sendMessage({ action: 'open_side_panel', activeTab })
    })
  }

  const host = 'https://app.dysperse.com'

  return (
    <>
      <button onClick={t}>Open Side Panel</button>
      <iframe
        src={`${host}/chrome-extension?pageData=${encodeURIComponent(JSON.stringify(data))}`}
        width={400}
        height={400}
        style={{ border: 0, margin: 0 }}
      />
    </>
  )
}

export default Popup
