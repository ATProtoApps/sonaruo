/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { lexicons } from "../../../../lexicons";

export interface Record {
  subject: {
    cid: string;
    uri: string;
  };
  status:
    | "events.smokesignal.calendar.rsvp#interested"
    | "events.smokesignal.calendar.rsvp#going"
    | "events.smokesignal.calendar.rsvp#notgoing"
    | (string & {});
  [k: string]: unknown;
}

export function isRecord(v: unknown): v is Record {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    (v.$type === "events.smokesignal.calendar.rsvp#main" ||
      v.$type === "events.smokesignal.calendar.rsvp")
  );
}

export function validateRecord(v: unknown): ValidationResult {
  return lexicons.validate("events.smokesignal.calendar.rsvp#main", v);
}

/** Interested in the event */
export const INTERESTED = "events.smokesignal.calendar.rsvp#interested";
/** Going to the event */
export const GOING = "events.smokesignal.calendar.rsvp#going";
/** Not going to the event */
export const NOTGOING = "events.smokesignal.calendar.rsvp#notgoing";
