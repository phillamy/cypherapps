import AsyncLock from "async-lock";
import { CronJob, CronJobParams } from "cron";
import { log } from "..";

let messageCounter: number
export const LOCK_KEY = `LOCK_SEND_MESSAGE_COUNTER`
export const lock = new AsyncLock()

export function startCronMsgCounter() {
  log({ msg: `Entering startCronMsgCounter` })

  if (!cronJobMsgCounter.running) {
    log({ msg: `Starting cron Msg Counter env=${process.env.NODE_ENV}` });
    cronJobMsgCounter.start();
  }
}

export function bumpMessageCounter({ increment = 1 }: { increment?: number })
  : { previousCount: number, newCount: number } {
  lock.acquire(LOCK_KEY, () => {
    messageCounter += increment
  })

  return { previousCount: messageCounter - increment, newCount: messageCounter }
}

/**
 * Single intance of cronjob - useful with code auto-reloading
 */
const globalForCronMsgCounter = globalThis as unknown as { cronMsgCounter: CronJob }

const cronParam: CronJobParams = {
  cronTime: process.env.CRON_SCHEDULE,
  runOnInit: true,
  onTick: function () {
    lock.acquire(LOCK_KEY, () => {
      messageCounter = 0
      log({ msg: `cron tick - message count reset` })
    })
  },
}

const cronJobMsgCounter = globalForCronMsgCounter.cronMsgCounter || CronJob.from(cronParam)

if (process.env.NODE_ENV !== 'production') globalForCronMsgCounter.cronMsgCounter = cronJobMsgCounter