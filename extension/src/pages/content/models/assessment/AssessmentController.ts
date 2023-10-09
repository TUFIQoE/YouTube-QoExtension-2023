import { DateTime, Duration } from 'luxon'
import { SettingsStorage } from '../../../../utils/storage/ChromeStorage'
import { Logger } from '../../../../utils/Logger'
import { VariablesStorage } from '../../../../utils/storage/ChromeStorage'
import { AssessmentPanel } from './AssessmentPanel'
import { Video } from '../video/Video'
import { api } from '../../../../API/api'

export interface HandleAssessmentSubmit {
  (value: number, description: string): Promise<void>
}

export class AssessmentController {
  private static instance: AssessmentController
  private assessmentInterval: ReturnType<typeof setInterval> | null = null
  private videoInterval: ReturnType<typeof setInterval> | null = null
  private logger: Logger = new Logger('[AssessmentController]', true)
  private assessmentPanel: AssessmentPanel = new AssessmentPanel()

  private assessmentTimeoutMs: number | null = null
  private assessmentRetryTimeoutMs: number | null = null

  private asmtStart: DateTime | null = null

  public static getInstance(): AssessmentController {
    if (!AssessmentController.instance) {
      AssessmentController.instance = new AssessmentController()
    }
    return AssessmentController.instance
  }

  public init = async () => {
    const useAssessments = await SettingsStorage.getItem('useAssessments')
    if (useAssessments === false) {
      this.logger.log('Assessment module disabled. Exiting.')
      return
    }
    this.assessmentPanel.init(this.handleAssessmentSubmit)

    const started = await VariablesStorage.getItem('assessmentStarted')
    if (started === true) {
      const waitingForVideo = await VariablesStorage.getItem('assessmentWaitingForVideo')
      if (waitingForVideo === true) {
        this.logger.log('Waiting for the subject to enter YT video')
        this.waitForVideo()
      } else {
        this.logger.log('Waiting for the next assessment')
        this.waitForAssessment()
      }
    } else {
      this.logger.log('Starting assessment')
      this.scheduleNextAssessment('long')
      await VariablesStorage.setItem('assessmentStarted', true)
      this.waitForAssessment()
    }
  }

  private waitForAssessment = () => {
    this.assessmentInterval = setInterval(async () => {
      this.logger.log('Waiting for next assessment time')
      const now = DateTime.now()
      const nextISO = await VariablesStorage.getItem('nextAssessment')
      const next = DateTime.fromISO(nextISO)
      if (now > next) {
        if (this.assessmentInterval) {
          clearInterval(this.assessmentInterval)
        }
        if (window.location.href.includes('https://www.youtube.com/watch?v=')) {
          this.stopWaitingForAssessment()
          this.showAssessmentPanel()
        } else {
          await VariablesStorage.setItem('assessmentWaitingForVideo', true)
          this.waitForVideo()
        }
      }
    }, 1000)
  }

  private stopWaitingForAssessment = () => {
    this.logger.log("Stopping assessment's waiting")
    if (this.assessmentInterval) {
      clearInterval(this.assessmentInterval)
    }
  }

  private waitForVideo = () => {
    this.videoInterval = setInterval(async () => {
      this.logger.log('Waiting for video')
      if (window.location.href.includes('https://www.youtube.com/watch?v=')) {
        this.stopWaitingForVideo()
        await VariablesStorage.setItem('assessmentWaitingForVideo', false)
        this.scheduleNextAssessment('short')
        this.waitForAssessment()
      }
    }, 1000)
  }

  private stopWaitingForVideo = () => {
    this.logger.log('Stopping waiting for video')
    if (this.videoInterval) {
      clearInterval(this.videoInterval)
    }
  }

  private scheduleNextAssessment = async (type: 'short' | 'long') => {
    let delta: number
    switch (type) {
      case 'short':
        delta = await SettingsStorage.getItem('assessmentRetryTimeoutMs')
        break
      case 'long':
        delta = await SettingsStorage.getItem('assessmentTimeoutMs')
        break
      default:
        delta = await SettingsStorage.getItem('assessmentTimeoutMs')
        break
    }
    const useJitter = await SettingsStorage.getItem('useJitter')
    const next = DateTime.now().plus({ milliseconds: delta })
    if (useJitter === true && type === 'long') {
      const jittered = await this.applyJitter(next)
      this.logger.log(`Next jittered assessment at: ${jittered.toISO()}`)
      await VariablesStorage.setItem('nextAssessment', jittered.toISO())
    } else {
      this.logger.log(`Next assessment without jitter at: ${next.toISO()}`)
      await VariablesStorage.setItem('nextAssessment', next.toISO())
    }
  }

  private applyJitter = async (next: DateTime) => {
    const jitterRangeMs = await SettingsStorage.getItem('assessmentJitterRangeMs')
    const sign = [-1, 1][Math.floor(Math.random() * 2)]
    const randomJitterMs = Math.floor(Math.random() * (jitterRangeMs[1] - jitterRangeMs[0] + 1)) + jitterRangeMs[0]
    if (sign === 1) {
      this.logger.log(`Applying jitter of PLUS ${randomJitterMs} ms`)
      return next.plus({ milliseconds: randomJitterMs })
    } else {
      this.logger.log(`Applying jitter of MINUS ${randomJitterMs} ms`)
      return next.minus({ milliseconds: randomJitterMs })
    }
  }

  private handleAssessmentSubmit: HandleAssessmentSubmit = async (value: number, description: string) => {
    const started = this.asmtStart as DateTime
    const timestamp = DateTime.now()
    const diff = timestamp.diff(started)

    const data = {
      experimentID: await VariablesStorage.getItem('experimentID'),
      value: value,
      description: description,
      started: started.toISO(),
      timestamp: timestamp.toISO(),
      duration: diff.toMillis(),
    }

    api.assessment
      .post(data)
      .then(() => {
        this.logger.log('Assessment submitted')
      })
      .then(() => {})
      .catch((err) => {
        console.log(err)
      })

    this.logger.log('Resuming playback after sending assessment.')
    Video.play()
    this.assessmentPanel.hide()
    this.scheduleNextAssessment('long')
    this.waitForAssessment()
  }

  private showAssessmentPanel = () => {
    Video.pause()
    this.assessmentPanel.show()
    this.asmtStart = DateTime.now()
  }
}
