import { DateTime } from 'luxon';

export class Logger {
  private readonly prefix: string;
  private readonly enabled: boolean;

  constructor(prefix: string, enabled: boolean = true) {
    this.prefix = prefix;
    this.enabled = enabled;
  }

  public log = (message: string): void => {
    if (this.enabled) {
      console.log(`[${DateTime.now().toISO()}] ${this.prefix}: ${message}`);
    }
  };

  public error = (message: string): void => {
    if (this.enabled) {
      console.error(`[${DateTime.now().toISO()}] ${this.prefix}: ${message}`);
    }
  };

  public warn = (message: string): void => {
    if (this.enabled) {
      console.warn(`[${DateTime.now().toISO()}] ${this.prefix}: ${message}`);
    }
  };
}
