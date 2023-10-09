export interface DebugDataElements {
  videoIDsCPN: HTMLSpanElement;
  viewportFrames: HTMLSpanElement;
  currentOptimalRes: HTMLSpanElement;
  volumeNormalized: HTMLSpanElement;
  codecs: HTMLSpanElement;
  color: HTMLSpanElement;
  connectionSpeed: HTMLSpanElement;
  networkActivity: HTMLSpanElement;
  bufferHealth: HTMLSpanElement;
  mysteryText: HTMLSpanElement;
  date: HTMLSpanElement;
}

export interface DebugDataChunk {
  videoID: string | null;
  sCPN: string | null;
  viewport: string | null;
  droppedFrames: string | null;
  totalFrames: string | null;
  currentResolution: string | null;
  optimalResolution: string | null;
  volume: string | null;
  normalizedVolume: string | null;
  codecs: string | null;
  color: string | null;
  connectionSpeed: string | null;
  networkActivity: string | null;
  bufferHealth: string | null;
  mysteryText: string | null;
  date: string | null;

  timestamp: string | null;
}
