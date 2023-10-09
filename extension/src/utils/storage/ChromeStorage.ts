import { ExperimentSettings, ExperimentVariables, StorageDefault } from '.'

export class ChromeStorage<T> {
  public setItem = async (key: keyof T, value: any): Promise<void> => {
    const storageObject: { [k: string]: any } = {}
    storageObject[key as string] = value
    await chrome.storage.local.set(storageObject)
  }

  public getItem = async (key: keyof T): Promise<any> => {
    const result = await chrome.storage.local.get([key as string])
    return result[key as string]
  }
}

export const VariablesStorage = new ChromeStorage<ExperimentVariables>()
export const SettingsStorage = new ChromeStorage<ExperimentSettings>()
