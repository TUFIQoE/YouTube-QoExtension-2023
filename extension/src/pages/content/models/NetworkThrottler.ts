import { message } from '../../../types/messages'
import { ExperimentVariables } from '../../../utils/storage'
import { SettingsStorage } from '../../../utils/storage/ChromeStorage'

import { VariablesStorage } from '../../../utils/storage/ChromeStorage'
import { Logger } from '../../../utils/Logger'
import { api } from '../../../API/api'

export class NetworkThrottler {
  private static instance: NetworkThrottler | null = null
  private interval: ReturnType<typeof setInterval> | null = null

  private bitrates: number[] | null = null
  private bitrateIntervalMs: number | null = null
  private bitrateIndex: number = 0

  private logger: Logger = new Logger('[NetworkThrottler]', false)

  constructor() {}

  public static getInstance = () => {
    if (!NetworkThrottler.instance) {
      NetworkThrottler.instance = new NetworkThrottler()
    }
    return NetworkThrottler.instance
  }

  public init = async (): Promise<void> => {
    // Get bitrate scenario
    this.bitrates = await SettingsStorage.getItem('bitrateScenario')
    this.bitrateIntervalMs = await SettingsStorage.getItem('bitrateIntervalMs')

    this.logger.log(`Bitrate interval set to ${this.bitrateIntervalMs}`)
    this.logger.log(`Bitrate setting: ${this.bitrates}`)

    // Attach debugger
    const msg: message = { flag: 'DEBUGGER_ATTACH' }
    const res: message = await chrome.runtime.sendMessage(msg)
    console.log(`${res.flag} ${res.msg}`)

    // Check if next bitrate change is already scheduled
    const scheduled = await VariablesStorage.getItem('nextBitrateChange')
    if (!scheduled) {
      this.executeBitrateChange()
      await this.scheduleNextBitrateChange()
      this.start()
    } else {
      console.log('Bitrate changes already scheduled')
      this.start()
    }
  }

  private start = () => {
    if (!this.bitrateIntervalMs) {
      throw new Error('Bitrate interval is unavailable')
    }
    this.interval = setInterval(async () => {
      const next = new Date(JSON.parse(await VariablesStorage.getItem('nextBitrateChange')))
      const now = new Date()
      if (now.getTime() > next.getTime()) {
        this.executeBitrateChange()
        await this.scheduleNextBitrateChange()
      }
    }, this.bitrateIntervalMs)
  }

  private executeBitrateChange = async () => {
    this.logger.log('Bitrate change')
    if (!this.bitrates || this.bitrates.length === 0) {
      throw new Error('Bitrates are unavailable')
    }
    const value = this.bitrates[this.bitrateIndex]

    // Send command to change throttling value
    const msg: message = {
      flag: 'NETWORK_THROTTLE',
      data: {
        bitrate: value,
      },
    }
    // Sending msg to service worker (background)
    const res: message = await chrome.runtime.sendMessage(msg)
    this.logger.log(res.msg!)

    const body = {
      experimentID: await VariablesStorage.getItem('experimentID'),
      timestamp: new Date().toISOString(),
      source: 'network',
      type: 'throttle',
      location: window.location.href,
      details: {
        bitrate: value,
      },
    }
    // Send msg to backend
    api.event
      .post(body)
      .then(() => {})
      .catch((err) => {
        console.log(err)
      })

    if (this.bitrateIndex < this.bitrates.length - 1) {
      this.bitrateIndex += 1
    } else {
      this.bitrateIndex = 0
    }
  }

  private scheduleNextBitrateChange = async () => {
    const now = new Date()
    const next = JSON.stringify(new Date(now.setSeconds(now.getSeconds() + 10)))
    await VariablesStorage.setItem('nextBitrateChange', next)
  }
}
