import { useInView } from "react-intersection-observer";
import useAgent from "./useAgent";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getFeed, getTimeline } from "../api/bsky/feed";

export default function useFeed(feed: string) {
  const agent = useAgent();
  const { ref, inView } = useInView();
  const {
    status,
    data: timeline,
    error,
    isLoading,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [feed],
    queryFn: ({ pageParam }) =>
      feed === "timeline"
        ? getTimeline(agent, pageParam)
        : getFeed(agent, feed, pageParam),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.data.cursor,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return {
    observerRef: ref,
    feedStatus: status,
    feedData: timeline,
    feedError: error,
    isLoadingFeed: isLoading,
    isFetchingFeed: isFetching,
    isFetchingFeedNextPage: isFetchingNextPage,
    feedHasNextPage: hasNextPage,
  };
}
