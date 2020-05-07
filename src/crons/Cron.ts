export interface Cron {
  delay: number;
  repeat: number;
  run(): Promise<void>;
}
