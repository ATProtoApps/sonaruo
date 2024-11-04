type RSVP =
  | "events.smokesignal.calendar.rsvp#going"
  | "events.smokesignal.calendar.rsvp#notgoing"
  | "events.smokesignal.calendar.rsvp#interested";

type Mode =
  | "events.smokesignal.calendar.event#virtual"
  | "events.smokesignal.calendar.event#inperson"
  | "events.smokesignal.calendar.event#hybrid";

type Status =
  | "events.smokesignal.calendar.event#scheduled"
  | "events.smokesignal.calendar.event#rescheduled"
  | "events.smokesignal.calendar.event#cancelled"
  | "events.smokesignal.calendar.event#postponed";

interface Place {
  country: string; // Default: "US"
  postalCode?: string;
  region?: string;
  locality?: string;
  street?: string;
  name?: string;
}

interface Virtual {
  url: string;
}

type Hybrid = Place & Virtual;

interface SmokeSignalEvent {
  uri: string;
  cid: string;
  value: {
    name: string;
    text: string;
    createdAt: string;
    startsAt: string;
    endsAt: string;
    mode?: Mode;
    status?: Status;
    location?: Place | Virtual | Hybrid;
  };
}
