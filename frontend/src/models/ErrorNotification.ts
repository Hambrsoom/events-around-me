export interface ErrorNotification {
    message: string,
    severity: Severity
}

export enum Severity {
    Error="error",
    Warning="warning",
    Info="info",
    Success="success"
}