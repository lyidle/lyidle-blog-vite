// types.ts
export interface PollingOptions {
  maxDelay?: number
  onPoll: () => Promise<boolean>
  onError?: (error: Error) => void
  onStatusChange?: (status: "running" | "paused" | "stopped") => void
}

export class PollingController {
  private status: "running" | "paused" | "stopped" = "stopped"
  private retryCount: number = 0
  private timer: NodeJS.Timeout | null = null
  private readonly maxDelay: number
  private readonly onPoll: () => Promise<boolean>
  private readonly onError?: (error: Error) => void
  private readonly onStatusChange?: PollingOptions["onStatusChange"]
  constructor(options: PollingOptions) {
    this.maxDelay = options.maxDelay ?? 5000
    this.onPoll = options.onPoll
    this.onError = options.onError
    this.onStatusChange = options.onStatusChange
    // 绑定方法上下文
    this.start = this.start.bind(this)
    this.pause = this.pause.bind(this)
    this.resume = this.resume.bind(this)
    this.stop = this.stop.bind(this)
    this.isRunning = this.isRunning.bind(this)
    this.isPaused = this.isPaused.bind(this)
  }

  start(): void {
    if (this.status !== "stopped") return
    this._changeStatus("running")
    this.retryCount = 0
    this._poll()
  }

  pause(): void {
    if (this.status !== "running") return
    this._changeStatus("paused")
    if (this.timer) clearTimeout(this.timer)
  }

  resume(): void {
    if (this.status !== "paused") return
    this._changeStatus("running")
    this._poll() // 立即执行一次检查
  }

  stop(): void {
    if (this.status === "stopped") return
    this._changeStatus("stopped")
    if (this.timer) clearTimeout(this.timer)
    this.retryCount = 0
  }

  private _changeStatus(newStatus: typeof this.status): void {
    this.status = newStatus
    this.onStatusChange?.(newStatus)
  }

  private async _poll(): Promise<void> {
    if (this.status !== "running") return

    try {
      const shouldContinue = await this.onPoll()
      if (shouldContinue) this.retryCount = 0
    } catch (error) {
      this.onError?.(error as Error)
    } finally {
      this.scheduleNextPoll()
    }
  }

  private scheduleNextPoll(): void {
    if (this.status !== "running") return

    const delay = Math.min(1000 * Math.pow(2, this.retryCount), this.maxDelay)
    this.retryCount++
    this.timer = setTimeout(() => this._poll(), delay)
  }

  // 状态查询方法
  isRunning(): boolean {
    return this.status === "running"
  }
  isPaused(): boolean {
    return this.status === "paused"
  }
}
