import { getEvents, getRsvpEvents } from "@/lib/api/smokeSignal";
import EventItem from "@/components/contentDisplay/eventItem/EventItem";
import Link from "next/link";
import Image from "next/image";
import SmokeSignalLogo from "@/assets/images/smokeSignalLogo.png";

interface Props {
  handle: string;
}

export default async function EventsContainer(props: Props) {
  const { handle } = props;
  const rsvpRecords = await getRsvpEvents(handle);
  const events = await getEvents(rsvpRecords);

  if (events.length === 0) {
    return (
      <section>
        <div className="flex flex-col flex-wrap items-center justify-center gap-2 bg-skin-base text-skin-base font-medium p-3 block border border-t-0 border-x-0 md:border-x border-skin-base md:rounded-b-2xl">
          <Image
            src={SmokeSignalLogo}
            alt="Smoke Signal logo"
            width={30}
            height={30}
            className="rounded"
          />
          <span>{handle} has no events</span>
          <span>
            You can view or create events on{" "}
            <Link
              href={`https://smokesignal.events`}
              target="_blank"
              className="text-skin-link-base hover:text-skin-link-hover"
            >
              Smoke Signal
            </Link>
          </span>
        </div>
      </section>
    );
  }

  return (
    <section>
      {events.map((event) => (
        <EventItem key={event.uri} event={event} rsvp={event.status} />
      ))}

      <div className="flex flex-col flex-wrap items-center justify-center gap-2 bg-skin-base text-skin-base font-medium p-3 block border border-x-0 md:border-x border-skin-base md:rounded-b-2xl">
        <Image
          src={SmokeSignalLogo}
          alt="Smoke Signal logo"
          width={30}
          height={30}
          className="rounded"
        />
        <span>
          You can view or create events on{" "}
          <Link
            href={`https://smokesignal.events`}
            target="_blank"
            className="text-skin-link-base hover:text-skin-link-hover"
          >
            Smoke Signal
          </Link>
        </span>
      </div>
    </section>
  );
}
