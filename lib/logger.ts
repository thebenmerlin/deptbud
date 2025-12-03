type LogLevel = "info" | "warn" | "error" | "debug";

export class Logger {
  static log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (data) {
      console[level === "debug" ? "log" : level](logMessage, data);
    } else {
      console[level === "debug" ? "log" : level](logMessage);
    }
  }

  static info(message: string, data?: any) {
    this.log("info", message, data);
  }

  static warn(message: string, data?: any) {
    this.log("warn", message, data);
  }

  static error(message: string, data?: any) {
    this.log("error", message, data);
  }

  static debug(message: string, data?: any) {
    this.log("debug", message, data);
  }
}
