import { message } from '../../types/messages'
import { StorageDefault } from '../../utils/storage'

chrome.runtime.onInstalled.addListener(async () => {
  console.log('Extension loaded')
  // Initialize local storage || WARNING --> THIS RESETS ALL chrome.storage KEYS TO DEFAULT VALUES
  // await ChromeStorage.setDefault() // <-- it crashes the app

  await chrome.storage.local.set(StorageDefault)
})

chrome.action.onClicked.addListener(async (tab) => {
  if (tab && tab.id) {
    await chrome.tabs.update(tab.id, {
      url: 'setup.html',
    })
  }
})

// Message listeners
chrome.runtime.onMessage.addListener((msg: message, sender: chrome.runtime.MessageSender, sendResponse: (msg: message) => void) => {
  if (msg.flag === 'TAB_ID') {
    sendResponse({
      flag: 'TAB_ID',
      data: {
        tabID: sender.tab?.id,
      },
    })
  } else if (msg.flag === 'DEBUGGER_ATTACH') {
    if (sender.tab && sender.tab.id) {
      /* no await */ attach(sender.tab.id, sendResponse)
    } else {
      throw new Error('Cannot get tab ID and attach debugger')
    }
  } else if (msg.flag === 'NETWORK_THROTTLE') {
    if (sender.tab && sender.tab.id) {
      /* no await */ throttleBandwidth(sender.tab.id, msg.data.bitrate, sendResponse)
    }
  } else if (msg.flag === 'FINISHED') {
    if (sender.tab && sender.tab.id) {
      finishExperiment(sender.tab.id, sendResponse)
    }
  }

  return true // <-- essential
})

const attach = async (tabID: number, sendResponse): Promise<void> => {
  try {
    await chrome.debugger.attach({ tabId: tabID }, '1.2')
    sendResponse({ flag: 'DEBUGGER_ATTACH', msg: 'Debugger attached' })
  } catch (error: any) {
    sendResponse({ flag: 'DEBUGGER_ATTACH', msg: error.message })
  }
}

const finishExperiment = async (tabID: number, sendResponse): Promise<void> => {
  try {
    await chrome.debugger.detach({ tabId: tabID })
    await chrome.tabs.update(tabID, {
      url: 'finished.html',
    })
    sendResponse({ flag: 'FINISHED', msg: 'Redirected to finished.html' })
  } catch (error: any) {
    console.error(error)
    sendResponse({ flag: 'FINISHED', msg: error.message })
  }
}

const throttleBandwidth = async (tabID, bitrate, sendResponse): Promise<void> => {
  try {
    await chrome.debugger.sendCommand({ tabId: tabID }, 'Network.emulateNetworkConditions', {
      offline: false,
      latency: 0,
      downloadThroughput: bitrate,
      uploadThroughput: 0,
    })
    sendResponse({
      flag: 'NETWORK_THROTTLE',
      msg: `Network bitrate set to ${bitrate} bps`,
    } as message)
  } catch (error: any) {
    sendResponse({ flag: 'NETWORK_THROTTLE', msg: error.message } as message)
  }
}
