import { startMqttClient } from "./mqtt"
import { startNostr } from "./nostr/sendDM"

export function log({ msg }: { msg: string }) {
  console.log(`[${new Date().toISOString()}]  ${msg}`)
}

log({ msg: `nostr_client: starting up` })

log({ msg: `nostr_client: APP_NAME => [${process.env.APP_NAME}]` })

log({ msg: `nostr_client: BROKER_URL => [${process.env.BROKER_URL}]` })
log({ msg: `nostr_client: BROKER_TOPIC => [${process.env.BROKER_TOPIC}]` })

log({ msg: `nostr_client: PRIVATE_KEY => [${process.env.PRIVATE_KEY}]` })
log({ msg: `nostr_client: RELAYS => [${process.env.RELAYS}]` })

log({ msg: `nostr_client: CRON_SCHEDULE => [${process.env.CRON_SCHEDULE}]` })
log({ msg: `nostr_client: MAX_MESSAGE_PER_CRON_TICK => [${process.env.MAX_MESSAGE_PER_CRON_TICK}]` })

startMqttClient()
await startNostr()
