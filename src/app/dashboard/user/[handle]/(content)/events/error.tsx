"use client";

import FeedAlert from "@/components/feedback/feedAlert/FeedAlert";

export default function Error() {
  return (
    <section>
      <FeedAlert variant="badResponse" message="Could not load events" />
    </section>
  );
}
