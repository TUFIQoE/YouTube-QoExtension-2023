export interface ExperimentVariables {
  running: boolean
  nextBitrateChange: string | null
  experimentID: number | null

  nextAssessment: string | null
  experimentFinishes: string | null
  assessmentStarted: boolean
  assessmentWaitingForVideo: boolean
}

export interface ExperimentSettings {
  experimentDurationMs: number
  bitrateScenario: number[] | null
  bitrateIntervalMs: number
  assessmentTimeoutMs: number
  assessmentRetryTimeoutMs: number
  assessmentQuestion: string
  assessmentJitterRangeMs: [number, number]

  useJitter: boolean
  useAssessments: boolean
}

const ExperimentVariablesDefault: ExperimentVariables = {
  running: false,
  nextBitrateChange: null,
  experimentID: null,
  experimentFinishes: null,

  nextAssessment: null,
  assessmentStarted: false,
  assessmentWaitingForVideo: false,
}

export const ExperimentSettingsDefault: ExperimentSettings = {
  experimentDurationMs: 40 * 1e3 * 60,
  bitrateScenario: [375, 375, 375, 375, 800e3, 900e3], // bps
  bitrateIntervalMs: 15e3, // time between network throttling changes
  assessmentTimeoutMs: 3e4, // time before next assessment panel shows up, jitter is applied to it
  assessmentRetryTimeoutMs: 10e3, // retry time if the assessment was opened outside of the video
  assessmentQuestion: 'Proszę ocenić jakość serwisu od strony audio-wizualnej', // text visible on the assessment panel
  assessmentJitterRangeMs: [5000, 20000], // range of jitter in ms

  useJitter: true, // enable/disable jitter
  useAssessments: true, // enable/disable assessments
}

export const StorageDefault = {
  ...ExperimentVariablesDefault,
  ...ExperimentSettingsDefault,
}
