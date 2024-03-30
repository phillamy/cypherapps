import NDK, { NDKEvent, NDKKind, NDKPrivateKeySigner, NDKUser } from "@nostr-dev-kit/ndk";
import { randomUUID } from "crypto";
import "websocket-polyfill";
import { LOCK_KEY, bumpMessageCounter, lock, startCronMsgCounter } from "./cronMsgCounter";
import { log } from "..";

// See https://nostrtool.com/
// See https://www.youtube.com/watch?v=djUS6GvU9pM
// See https://github.com/nostr-dev-kit/ndk/tree/master

// NDK recommends using a singleton
let ndk: NDK
let signer: NDKPrivateKeySigner

export async function startNostr(): Promise<void> {
  signer = new NDKPrivateKeySigner(`${process.env.PRIVATE_KEY}`)

  ndk = new NDK({
    explicitRelayUrls: `${process.env.RELAYS}`.split(','),
    signer,
  });
  //ndk.pool.on("relay:connect", (r: NDKRelay) => { console.info(`Connected to relay ${r.url}`); });

  // connect to specified relays
  await ndk.connect(2000);

  startCronMsgCounter()
}

export async function nostrSendDM({ message }: { message: string }) {
  log({ msg: `Entering nostrSendDM ${message}` })
  let messageCountExceeded = false

  lock.acquire(LOCK_KEY, async () => {
    const { previousCount, newCount } = bumpMessageCounter({})
    if (newCount > +process.env.MAX_MESSAGE_PER_CRON_TICK) {
      log({ msg: `nostrSendDM - Skipping - Message counter ${newCount} is > ${+process.env.MAX_MESSAGE_PER_CRON_TICK}` })
      messageCountExceeded = true
    }
  })

  if (messageCountExceeded) {
    log({ msg: `nostrSendDM - Not sending` })
    return
  }

  const userNpubs = `${process.env.PUBLISHING_TO_NPUBS}`.split(',')

  for (const userNPub of userNpubs) {
    try {
      await publishDM({
        message,
        user: ndk.getUser({ npub: userNPub }),
      })
    }
    catch (e) {
      log({ msg: `Error publishing message` })
    }
  }

  return

}

async function publishDM({ message, user }: { message: string, user: NDKUser }) {
  log({ msg: `publishDM: [${user.pubkey}] - [${message}]` })

  const ndkEvent = new NDKEvent(ndk);
  ndkEvent.kind = NDKKind.EncryptedDirectMessage;
  ndkEvent.content = `${new Date().toISOString()} [${process.env.APP_NAME}] : [${message}]`
  ndkEvent.tag(user);
  ndkEvent.id = randomUUID();
  ndkEvent.generateTags();

  await ndkEvent.encrypt(user, signer);
  //log(`nostr_client: encrypting`, ndkEvent);

  // Relays are calculated by NDK - no relay set specified
  const relaySet = await ndkEvent.publish();

  for (const relay of relaySet) {
    log({ msg: `Relay status :${relay.status}` });
  }
}
