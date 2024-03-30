import { ErrorWithReasonCode, IConnackPacket, IPublishPacket, connect } from 'mqtt';
import { nostrSendDM } from './nostr/sendDM';
import { log } from '.';

export function startMqttClient() {
  log({ msg: `nostr_client: connecting to MQTT [${process.env.BROKER_URL}]` })

  const mqttClient = connect(`${process.env.BROKER_URL}`, { clientId: process.env.APP_NAME, protocol: 'mqtt' })

  mqttClient.on('connect', (packet: IConnackPacket) => {
    log({ msg: `nostr_client: connected ${JSON.stringify(packet)}` })

    log({ msg: `nostr_client: subscribing to [${process.env.BROKER_TOPIC}]` })
    mqttClient.subscribe(`${process.env.BROKER_TOPIC}`, { qos: 2 }, (error, granted) => {
      if (error) {
        log({ msg: `nostr_client: Could not connect to ${process.env.BROKER_TOPIC}` })
      }

      log({ msg: `${JSON.stringify(granted)} -  nostr_client: subscribed` })
    })
  })

  mqttClient.on('message', async (topic: string, payload: Buffer, _packet: IPublishPacket) => {
    log({ msg: `nostr_client: Message topic: ${topic}` })
    log({ msg: `nostr_client: Message : ${payload}` })
    await nostrSendDM({ message: `[${topic}] [${payload.toString()}]` })
  })

  mqttClient.on('error', (error: Error | ErrorWithReasonCode) => {
    log({ msg: `nostr_client: ${error}` })
  })

  mqttClient.on('disconnect', () => {
    log({ msg: `nostr_client: disconnected` })
  })

  mqttClient.on('reconnect', () => {
    log({ msg: `nostr_client: reconnecting` })
  })
}