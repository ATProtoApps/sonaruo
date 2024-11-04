/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { isObj, hasProp } from '../../../../util'
import { lexicons } from '../../../../lexicons'
import { CID } from 'multiformats/cid'

export interface Record {
  /** The time zone of the profile. */
  tz?: string
  [k: string]: unknown
}

export function isRecord(v: unknown): v is Record {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    (v.$type === 'events.smokesignal.app.profile#main' ||
      v.$type === 'events.smokesignal.app.profile')
  )
}

export function validateRecord(v: unknown): ValidationResult {
  return lexicons.validate('events.smokesignal.app.profile#main', v)
}
