import { api } from '../../../API/api'
import { Logger } from '../../../utils/Logger'
import { VariablesStorage } from '../../../utils/storage/ChromeStorage'
import { DateTime } from 'luxon'

export class KeyboardTracker {
  private experimentID: number | null = null
  private logger: Logger = new Logger('[KeyboardTracker]', true)
  private static instance: KeyboardTracker | null = null

  public static getInstance = () => {
    if (!KeyboardTracker.instance) {
      KeyboardTracker.instance = new KeyboardTracker()
    }
    return KeyboardTracker.instance
  }

  public init = async (): Promise<void> => {
    this.experimentID = await VariablesStorage.getItem('experimentID')
    window.onkeydown = (event: KeyboardEvent) => this.handleKeyEvent(event)
    window.onkeyup = (event: KeyboardEvent) => this.handleKeyEvent(event)
  }

  private handleKeyEvent = async (e: KeyboardEvent) => {
    const body = {
      experimentID: this.experimentID,
      timestamp: DateTime.now().toISO(),
      source: 'subject',
      type: e.type,
      location: window.location.href,
      details: {
        altKey: e.altKey,
        shiftKey: e.shiftKey,
        ctrlKey: e.ctrlKey,
        key: e.key,
        repeat: e.repeat,
      },
    }

    try {
      api.event.post(body)
    } catch (err) {
      console.log('Error sending keyboard event')
    }
  }
}
