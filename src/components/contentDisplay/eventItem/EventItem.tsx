"use client";

import { getDay, getHour, getMonth } from "@/lib/utils/time";
import { useRouter } from "next/navigation";
import { getEventParticipationStatus } from "@/lib/utils/text";
import { getEventModeIcon } from "@/lib/utils/icon";
import { AtUri } from "@atproto/syntax";
import Link from "next/link";

interface Props {
  event: SmokeSignalEvent;
  rsvp?: RSVP;
}

export default function EventItem(props: Props) {
  const { event, rsvp } = props;
  const router = useRouter();
  const modeIcon = getEventModeIcon(event.value.mode);
  const status = getEventParticipationStatus(rsvp);
  const uri = new AtUri(event.uri);
  const { name, startsAt, endsAt, text: description } = event.value;

  return (
    <Link
      href={`https://smokesignal.events/${uri.host}/${uri.rkey}`}
      target="_blank"
      className="flex flex-col p-3 bg-skin-base border border-x-0 md:border-x first:border-t-0 md:last:rounded-b-2xl odd:[&:not(:last-child)]:border-b-0 even:[&:not(:last-child)]:border-b-0 border-skin-base hover:bg-skin-secondary cursor-pointer"
    >
      <article>
        <div className="flex items-start gap-3">
          <div>
            <div className="bg-primary text-xs font-medium px-3 text-center rounded-t-lg py-0.5">
              <time
                dateTime={startsAt}
                className="text-skin-inverted font-semibold"
              >
                {getMonth(startsAt)}
              </time>
            </div>
            <div className="bg-skin-base px-3 py-0.5 text-center text-skin-base border-x border-b border-skin-base rounded-b-lg">
              <time dateTime={startsAt} className="text-skin-base font-medium">
                {getDay(startsAt)}
              </time>
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="text-skin-base font-medium">{name}</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-skin-tertiary font-medium">
                <time>
                  {getHour(startsAt)} - {getHour(endsAt)}
                </time>
              </span>
              <span className="text-skin-tertiary font-medium">{" · "}</span>
              <div className="flex flex-wrap items-center gap-1 text-skin-tertiary font-medium">
                {modeIcon}
              </div>
              <span className="text-skin-tertiary font-medium">
                {" · "} {status}
              </span>
            </div>
          </div>
        </div>
        <p className="text-skin-secondary line-clamp-3 mt-2">{description}</p>
      </article>
    </Link>
  );
}
