"use client";

import useAgent from "@/lib/hooks/bsky/useAgent";
import { getPostThread } from "@/lib/api/bsky/feed";
import { useQuery } from "@tanstack/react-query";
import { AppBskyFeedDefs } from "@atproto/api";
import { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import useOrganizeThread from "@/lib/hooks/bsky/feed/useOrganizeThread";
import FeedPost from "@/components/contentDisplay/feedPost/FeedPost";
import usePreferences from "@/lib/hooks/bsky/actor/usePreferences";
import useContentFilter from "@/lib/hooks/bsky/actor/useContentFilter";
import ThreadPost from "@/components/contentDisplay/threadPost/ThreadPost";
import BlockedEmbed from "@/components/dataDisplay/postEmbed/BlockedEmbed";
import NotFoundEmbed from "@/components/dataDisplay/postEmbed/NotFoundEmbed";
import Button from "@/components/actions/button/Button";
import { useRouter } from "next/navigation";
import FeedPostSkeleton from "@/components/contentDisplay/feedPost/FeedPostSkeleton";
import FeedAlert from "@/components/feedback/feedAlert/FeedAlert";

interface Props {
  id: string;
  handle: string;
}

export default function PostThreadContainer(props: Props) {
  const { id, handle } = props;
  const agent = useAgent();
  const router = useRouter();
  const MAX_REPLIES = 6;

  const {
    data: thread,
    isError,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["postThread", id],
    queryFn: async () => {
      const { data } = await agent.resolveHandle({ handle });
      if (!data) return;
      const uri = `at://${data.did}/app.bsky.feed.post/${id}`;
      return getPostThread(agent, uri);
    },
  });

  const { replyChains, parentChain } = useOrganizeThread({
    thread: thread,
  });

  const { preferences } = usePreferences();
  const contentFilter = useContentFilter(preferences);

  if (
    AppBskyFeedDefs.isBlockedPost(thread) ||
    AppBskyFeedDefs.isNotFoundPost(thread) ||
    AppBskyFeedDefs.isBlockedAuthor(thread) ||
    isError
  ) {
    return (
      <>
        <div className="sm:border  sm:border-x sm:rounded-t-2xl">
          <h2 className="text-xl text-center font-semibold px-3 py-2">
            Thread
          </h2>
        </div>
        <section className="border border-t-0 rounded-b-2xl p-3">
          {AppBskyFeedDefs.isBlockedPost(thread) && <BlockedEmbed depth={0} />}
          {AppBskyFeedDefs.isNotFoundPost(thread) && (
            <NotFoundEmbed depth={0} />
          )}
          {AppBskyFeedDefs.isBlockedAuthor(thread) && (
            <BlockedEmbed depth={0} />
          )}
          {isError && (
            <FeedAlert
              variant="badResponse"
              message="Something went wrong"
              standalone={true}
            />
          )}
          <div className="flex justify-center mt-3">
            <Button onClick={() => router.push("/dashboard/home")}>
              Go Home
            </Button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <div className="sm:border sm:border-b-0 border-b-0 sm:border-x sm:rounded-t-2xl">
        <h2 className="text-xl text-center font-semibold px-3 py-2">Thread</h2>
      </div>

      {(isFetching || isLoading) && <FeedPostSkeleton />}

      {parentChain && parentChain.length > 0 && (
        <div className="flex flex-col justify-between p-3 border border-x-0 sm:border-x  first:border-t-0 last:border-b last:rounded-b-2xl even:[&:not(:last-child)]:border-b-0 odd:[&:not(:last-child)]:border-b-0">
          {parentChain.map((parent, i) => (
            <div key={parent.post.uri}>
              {AppBskyFeedDefs.isBlockedPost(parent) && (
                <BlockedEmbed depth={0} />
              )}
              {AppBskyFeedDefs.isNotFoundPost(parent) && (
                <NotFoundEmbed depth={0} />
              )}
              {AppBskyFeedDefs.isBlockedAuthor(parent) && (
                <BlockedEmbed depth={0} />
              )}

              {AppBskyFeedDefs.isThreadViewPost(parent) && (
                <FeedPost
                  post={parent}
                  filter={contentFilter}
                  isParent={i < parentChain.length - 1}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {thread && (
        <ThreadPost post={thread?.post as PostView} filter={contentFilter} />
      )}

      {replyChains &&
        replyChains.map((replyArr, i) => (
          <div
            className="p-3 border border-x-0 sm:border-x first:border-t-0 last:border-b sm:last:rounded-b-2xl even:[&:not(:last-child)]:border-b-0 odd:[&:not(:last-child)]:border-b-0"
            key={i}
          >
            {replyArr.map((reply, j) => (
              <div className={reply.post.uri} key={reply.post.uri}>
                {AppBskyFeedDefs.isBlockedPost(reply) && (
                  <BlockedEmbed depth={0} />
                )}
                {AppBskyFeedDefs.isNotFoundPost(reply) && (
                  <NotFoundEmbed depth={0} />
                )}
                {AppBskyFeedDefs.isBlockedAuthor(reply) && (
                  <BlockedEmbed depth={0} />
                )}

                {AppBskyFeedDefs.isThreadViewPost(reply) && j < MAX_REPLIES && (
                  <FeedPost
                    post={reply}
                    filter={contentFilter}
                    isParent={j < replyArr.length - 1 && j < MAX_REPLIES - 1}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
    </>
  );
}