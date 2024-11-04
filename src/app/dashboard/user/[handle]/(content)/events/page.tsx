import EventsContainer from "@/containers/events/EventsContainer";

interface Props {
  params: {
    handle: string;
  };
}

export default async function Page(props: Props) {
  const { params } = props;

  return <EventsContainer handle={params.handle} />;
}
