import FeedList from "@/components/contentDisplay/feedList/FeedList";
import FeedListSkeleton from "@/components/contentDisplay/feedList/FeedListSkeleton";
import SavedFeedList from "@/components/contentDisplay/savedFeedList/SavedFeedList";
import SavedFeedListSkeleton from "@/components/contentDisplay/savedFeedList/SavedFeedListSkeleton";
import Search from "@/components/filter/search/Search";
import { Suspense } from "react";

interface Props {
  searchParams: {
    query?: string;
  };
}

export default async function Page(props: Props) {
  const { searchParams } = props;
  const query = searchParams?.query || "";

  return (
    <section className="flex flex-col gap-5">
      <section>
        <h2 className="text-2xl font-semibold mx-3 sm:mx-0 mb-2">My feeds</h2>
        <Suspense fallback={<SavedFeedListSkeleton />}>
          <SavedFeedList />
        </Suspense>
      </section>
      <section>
        <div>
          <div className="flex flex-wrap justify-between gap-x-12 gap-y-2 mb-2">
            <h2 className="flex-auto text-2xl font-semibold mx-3 sm:mx-0 mb-2">
              Popular feeds
            </h2>
            <Search placeholder="Search for feeds" />
          </div>
          <Suspense key={query} fallback={<FeedListSkeleton />}>
            <FeedList query={query} />
          </Suspense>
        </div>
      </section>
    </section>
  );
}
