## Add a .env file in nostr_client directory - see sample.env

.env:
```sh
APP_NAME='Cypernode nostr client'

# CN broker config
BROKER_URL='mqtt://broker'
BROKER_TOPIC='cn/logwatcher/#'

# Nostr configs
PRIVATE_KEY='ccf4249464a9000000000000000000000000000000000000000e575fb301ee0b1'
RELAYS='wss://relay.some.io,wss://relay.aaaaa'
PUBLISHING_TO_NPUBS='npub100000000000000000000000000000000000000000000000000000'
CRON_SCHEDULE='0 */10 * * * *' #every 10 minutes
MAX_MESSAGE_PER_CRON_TICK=5
```

## Example output - nostr_client

```sh
yarn run v1.22.19
$ tsc --noEmit && tsx --watch --watch-preserve-output -r dotenv/config ./src/index.ts
(node:47) ExperimentalWarning: Watch mode is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[2024-03-09T14:25:50.561Z]  cron tick - message count reset
[2024-03-09T14:25:50.563Z]  nostr_client: starting up
[2024-03-09T14:25:50.564Z]  nostr_client: APP_NAME => [Cypernode-staging02]
[2024-03-09T14:25:50.564Z]  nostr_client: BROKER_URL => [mqtt://broker]
[2024-03-09T14:25:50.564Z]  nostr_client: BROKER_TOPIC => [cn/logwatcher/#]
[2024-03-09T14:25:50.564Z]  nostr_client: PRIVATE_KEY => [ccf4249464a9548b2c7a759039e5aa36532fef93f640b1bb3ce575fb301ee0b1-burned]
[2024-03-09T14:25:50.564Z]  nostr_client: RELAYS => [wss://relay.damus.io,wss://relay.snort.social]
[2024-03-09T14:25:50.564Z]  nostr_client: CRON_SCHEDULE => [0 */10 * * * *]
[2024-03-09T14:25:50.564Z]  nostr_client: MAX_MESSAGE_PER_CRON_TICK => [5]
[2024-03-09T14:25:50.565Z]  nostr_client: connecting to MQTT [mqtt://broker]
[2024-03-09T14:25:50.778Z]  nostr_client: connected {"cmd":"connack","retain":false,"qos":0,"dup":false,"length":2,"topic":null,"payload":null,"sessionPresent":false,"returnCode":0}
[2024-03-09T14:25:50.778Z]  nostr_client: subscribing to [cn/logwatcher/#]
[2024-03-09T14:25:50.782Z]  [{"topic":"cn/logwatcher/#","qos":2}] -  nostr_client: subscribed
[2024-03-09T14:25:51.225Z]  Entering startCronMsgCounter
[2024-03-09T14:25:51.225Z]  Starting cron Msg Counter env=development
[2024-03-09T14:27:53.938Z]  nostr_client: Message topic: cn/logwatcher/pout
[2024-03-09T14:27:53.938Z]  nostr_client: Message : log message
[2024-03-09T14:27:53.938Z]  Entering nostrSendDM [cn/logwatcher/pout] [log message]
[2024-03-09T14:27:53.940Z]  publishDM: [9786366177586ecd87e7cd4ed11bf617b4aa952e2983c85405a276b6c438a15f] - [[cn/logwatcher/pout] [log message]]
```