import { getAgent } from "../bsky/agent";
import { getPds } from "../bsky/pds";
import { AtUri } from "@atproto/syntax";
import type { Record as EventRecord } from "@/lexicon/types/events/smokesignal/calendar/rsvp";
import { isRecord as isEventRecord } from "@/lexicon/types/events/smokesignal/calendar/rsvp";

type RsvpRecord = {
  uri: string;
  cid: string;
  value: EventRecord;
};

export const getEvent = async (eventUri: AtUri) => {
  const eventOwnerPds = await getPds(eventUri.host);
  const eventUrl = new URL(`${eventOwnerPds}/xrpc/com.atproto.repo.getRecord`);

  eventUrl.searchParams.set("repo", eventUri.hostname);
  eventUrl.searchParams.set("collection", "events.smokesignal.calendar.event");
  eventUrl.searchParams.set("rkey", eventUri.rkey);

  const response = await fetch(eventUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Could not fetch event");
  }

  const record: SmokeSignalEvent = await response.json();

  return record;
};

export const getEvents = async (rsvpRecords: RsvpRecord[]) => {
  const events: (SmokeSignalEvent & { status?: RSVP })[] = await Promise.all(
    rsvpRecords.map(async (evt) => {
      const eventUri = new AtUri(evt.value.subject.uri);
      const event = await getEvent(eventUri);

      // attach user's RSVP status ("ex. going") to event record
      const rsvp = rsvpRecords.find(
        (r) => r.value.subject.uri === eventUri.toString(),
      )?.value.status;

      return {
        ...event,
        status: rsvp as RSVP,
      };
    }),
  );

  return events;
};

export const getRsvpEvents = async (handle: string) => {
  const agent = await getAgent();
  const { data: user } = await agent.resolveHandle({ handle });
  const userPds = await getPds(user.did);

  const listEventsUrl = new URL(`${userPds}/xrpc/com.atproto.repo.listRecords`);
  listEventsUrl.searchParams.set("repo", user.did);
  listEventsUrl.searchParams.set(
    "collection",
    "events.smokesignal.calendar.rsvp",
  );
  listEventsUrl.searchParams.set("limit", "12");

  const res = await fetch(listEventsUrl.toString());
  if (!res.ok) {
    throw new Error(`Failed to list records: ${res.statusText}`);
  }

  const result = await res.json();
  const records: RsvpRecord[] = result.records;

  for (const record of records) {
    if (!isEventRecord(record.value)) {
      throw new Error("Record is not an event");
    }
  }

  return records;
};
