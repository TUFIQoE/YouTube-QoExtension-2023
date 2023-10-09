import { Logger } from '../../../../utils/Logger'
import { DebugDataChunk } from '../../../../types/debugData.type'
import { DebugDataElements } from '../../../../types/debugData.type'
import { DateTime } from 'luxon'
import { v4 as uuidv4 } from 'uuid'
import { api } from '../../../../API/api'
import { VariablesStorage } from '../../../../utils/storage/ChromeStorage'

const HtmlQueryElements = {
  video: 'video', // <-- tag
  playerContextMenuButton: '.ytp-menuitem', // <-- class
  playerDebugDataContainer: '.html5-video-info-panel', // <-- class
  playerDebugDataContent: '.html5-video-info-panel-content', // <-- class
}

export class DebugDataMonitor {
  private logger: Logger = new Logger('[NetworkThrottler]', false)
  private debugDataElements: DebugDataElements | null = null
  private interval: ReturnType<typeof setInterval> | null = null
  private sessionID: string | null = null // <-- ID generated on every video enter
  private experimentID: string | null = null

  public init = async (): Promise<void> => {
    this.experimentID = String(await VariablesStorage.getItem('experimentID'))

    // Check if the debug stats are already opened
    const playerDebugDataContainer = document.querySelector(HtmlQueryElements.playerDebugDataContainer) as HTMLElement
    if (!playerDebugDataContainer) {
      this.openDebugMenu()
      this.getDebugDataElements()
    }

    this.stop()
    this.start()
  }

  /**
   * Starts monitoring the debug data by periodically analyzing it.
   * @returns {void}
   */
  private start = (): void => {
    this.sessionID = uuidv4()
    this.interval = setInterval(() => {
      this.analyze()
    }, 250)
  }

  public stop = (): void => {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null // <-- nulling the interval
    }
  }

  private analyze = async (): Promise<void> => {
    if (!this.debugDataElements) {
      throw new Error('Debug data elements not initialized')
    }
    const chunk: object = {
      sessionID: this.sessionID,
      experimentID: this.experimentID,
      videoID: this.debugDataElements.videoIDsCPN.innerText.split('/')[0] || null,
      sCPN: this.debugDataElements.videoIDsCPN.innerText.split('/')[1] || null,
      viewport: this.debugDataElements.viewportFrames.innerText.split('/')[0] || null,
      droppedFrames: this.debugDataElements.viewportFrames.innerText.split('/')[1].split('dropped of')[0] || null,
      totalFrames: this.debugDataElements.viewportFrames.innerText.split('/')[1].split('dropped of')[1] || null,
      currentResolution: this.debugDataElements.currentOptimalRes.innerText.split('/')[0] || null,
      optimalResolution: this.debugDataElements.currentOptimalRes.innerText.split('/')[1] || null,
      volume: this.debugDataElements.volumeNormalized.innerText.split('/')[0] || null,
      normalizedVolume: this.debugDataElements.volumeNormalized.innerText.split('/')[1] || null,
      codecs: this.debugDataElements.codecs.innerText || null,
      color: this.debugDataElements.color.innerText || null,
      connectionSpeed: this.debugDataElements.connectionSpeed.innerText || null,
      networkActivity: this.debugDataElements.networkActivity.innerText || null,
      bufferHealth: this.debugDataElements.bufferHealth.innerText || null,
      mysteryText: this.debugDataElements.mysteryText.innerText || null,
      date: this.debugDataElements.date.innerText || null,
      timestamp: DateTime.now().toISO(),
    }

    for (const key in chunk) {
      const k = key as keyof DebugDataChunk
      if (chunk[k]) {
        chunk[k] = chunk[k]!.trimStart().trimEnd()
      }
    }

    // Send the data
    try {
      api.debugData.post(chunk)
    } catch (err) {
      throw err
    }
  }

  private getDebugDataElements = () => {
    const container = document.querySelector(HtmlQueryElements.playerDebugDataContent) as HTMLElement
    const content = container.children

    this.debugDataElements = {
      videoIDsCPN: content[0].querySelector('span') as HTMLSpanElement,
      viewportFrames: content[1].querySelector('span') as HTMLSpanElement,
      currentOptimalRes: content[2].querySelector('span') as HTMLSpanElement,
      volumeNormalized: content[3].querySelector('span') as HTMLSpanElement,
      codecs: content[4].querySelector('span') as HTMLSpanElement,
      color: content[6].querySelector('span') as HTMLSpanElement,
      connectionSpeed: content[8].querySelector('span')?.querySelectorAll('span')[1] as HTMLSpanElement,
      networkActivity: content[9].querySelector('span')?.querySelectorAll('span')[1] as HTMLSpanElement,
      bufferHealth: content[10].querySelector('span')?.querySelectorAll('span')[1] as HTMLSpanElement,
      mysteryText: content[14].querySelector('span') as HTMLSpanElement,
      date: content[16].querySelector('span') as HTMLSpanElement,
    }
  }

  private openDebugMenu = (): void => {
    // Opens player context menu
    const videoPlayer = document.querySelector(HtmlQueryElements.video) // select the video player element
    const contextMenuEvent = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      view: window,
    })
    if (videoPlayer) {
      videoPlayer.dispatchEvent(contextMenuEvent) // dispatch the contextmenu event on the video player element
    }

    // Clicks debug stats button
    const menuButtons = document.querySelectorAll(HtmlQueryElements.playerContextMenuButton)
    const debugDataButton = menuButtons[menuButtons.length - 1] as HTMLElement
    debugDataButton.click()

    // Make invisible and unclickable
    const container = document.querySelector(HtmlQueryElements.playerDebugDataContainer) as HTMLElement
    if (container) {
      container.style.opacity = '0'
      container.style.pointerEvents = 'none'
    }
  }
}
