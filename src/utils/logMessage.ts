import { config } from "../config/config";

export default function logMessage(label: string, logContent: any) {
  if (config.env === "development") {
    console.log(`${label} => `, logContent);
  }
}
