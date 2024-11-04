/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { LexiconDoc, Lexicons } from '@atproto/lexicon'

export const schemaDict = {
  EventsSmokesignalAppProfile: {
    lexicon: 1,
    id: 'events.smokesignal.app.profile',
    defs: {
      main: {
        type: 'record',
        description: 'A declaration of a Smoke Signal profile.',
        key: 'literal:self',
        record: {
          type: 'object',
          properties: {
            tz: {
              type: 'string',
              description: 'The time zone of the profile.',
            },
          },
        },
      },
    },
  },
  EventsSmokesignalCalendarRsvp: {
    lexicon: 1,
    id: 'events.smokesignal.calendar.rsvp',
    defs: {
      main: {
        type: 'record',
        description: 'Record declaring an RSVP for an event.',
        key: 'tid',
        record: {
          type: 'object',
          required: ['subject', 'status'],
          properties: {
            subject: {
              type: 'ref',
              ref: 'lex:com.atproto.repo.strongRef',
            },
            status: {
              type: 'string',
              default: 'events.smokesignal.calendar.rsvp#interested',
              knownValues: [
                'events.smokesignal.calendar.rsvp#interested',
                'events.smokesignal.calendar.rsvp#going',
                'events.smokesignal.calendar.rsvp#notgoing',
              ],
            },
          },
        },
      },
      interested: {
        type: 'token',
        description: 'Interested in the event',
      },
      going: {
        type: 'token',
        description: 'Going to the event',
      },
      notgoing: {
        type: 'token',
        description: 'Not going to the event',
      },
    },
  },
}
export const schemas: LexiconDoc[] = Object.values(schemaDict) as LexiconDoc[]
export const lexicons: Lexicons = new Lexicons(schemas)
export const ids = {
  EventsSmokesignalAppProfile: 'events.smokesignal.app.profile',
  EventsSmokesignalCalendarRsvp: 'events.smokesignal.calendar.rsvp',
}
