

export type flag = "TAB_ID" | "DEBUGGER_ATTACH" | "NETWORK_THROTTLE"

export interface message {
    flag: flag
    msg?: string
    data?: any
}