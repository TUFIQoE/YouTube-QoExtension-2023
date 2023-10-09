import { Logger } from '../../../../utils/Logger'
import { VariablesStorage } from '../../../../utils/storage/ChromeStorage'
import { api } from '../../../../API/api'
import { DateTime } from 'luxon'

export type VideoEvent = 'playing' | 'paused' | 'seeking' | 'seeked' | 'buffering'

export class PlayerEventMonitor {
  private video: HTMLVideoElement | null = null
  private interval: ReturnType<typeof setInterval> | null = null
  private logger: Logger = new Logger('[VideoEventsMonitor]', false)
  private experimentID: number | null = null

  constructor() {}

  public init = async (): Promise<void> => {
    this.experimentID = await VariablesStorage.getItem('experimentID')
    const video = document.querySelector('video') as HTMLVideoElement
    if (!video) {
      setTimeout(() => {
        this.init() // <-- retrying in 500 ms
      }, 500)
      return
    }
    this.video = video

    this.stop()
    this.start()
  }

  private start = (): void => {
    if (this.video) {
      this.interval = setInterval(() => {
        this.checkBuffering()
      }, 50)

      this.video.onpause = (e) => {
        this.logger.log('PAUSED')
        this.handleEvent('paused')
      }

      this.video.onseeking = (e) => {
        this.logger.log('SEEKING')
        this.handleEvent('seeking')
      }

      this.video.onseeked = (e) => {
        this.logger.log('SEEKED')
        this.handleEvent('seeked')
      }

      this.video.onplaying = (e) => {
        this.logger.log('PLAYING')
        this.handleEvent('playing')
      }
    } else {
      throw new Error('Video element unavailable')
    }
  }

  private handleEvent = async (type: VideoEvent) => {
    const body = {
      experimentID: this.experimentID,
      timestamp: DateTime.now().toISO(),
      source: 'player',
      type: type,
      location: window.location.href,
      details: null,
    }

    try {
      await api.event.post(body)
    } catch (err) {
      console.log(err)
    }
  }

  public stop = (): void => {
    if (this.video) {
      this.video.onpause = null
      this.video.onplaying = null
    }
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  private isPlayerInBuffer = (): boolean => {
    if (!this.video) {
      throw new Error('Video element unavailable')
    }
    const buffered = this.video.buffered
    for (let i = 0; i < buffered.length; i++) {
      const start = buffered.start(i)
      const end = buffered.end(i)
      const currentTime = this.video.currentTime

      const inside = currentTime >= start && currentTime <= end
      if (inside) {
        return true
      }
    }
    return false
  }

  private checkBuffering = (): void => {
    const isBuffering = !this.isPlayerInBuffer()
    if (isBuffering === true) {
      this.logger.log('BUFFERING')
      this.handleEvent('buffering')
    }
  }
}
