import { type AtpAgent, AppBskyActorDefs } from "@atproto/api";
import { getAgent } from "../agent";
import { SavedFeed } from "../../../../../types/feed";

export const getPopularFeeds = async (search?: string) => {
  const agent = await getAgent();
  const popularFeeds = await agent.app.bsky.unspecced.getPopularFeedGenerators({
    query: search,
  });

  if (!popularFeeds.success) {
    throw new Error("Couldn't get popular feeds");
  }

  return popularFeeds.data.feeds;
};

export const getSavedFeeds = async (agent?: AtpAgent): Promise<SavedFeed[]> => {
  if (!agent) agent = await getAgent();
  const prefs = await agent.app.bsky.actor.getPreferences();
  if (!prefs.success) throw new Error("Could not fetch feeds");

  const feedsPref = prefs.data.preferences.find(
    (pref) =>
      AppBskyActorDefs.isSavedFeedsPref(pref) &&
      AppBskyActorDefs.validateSavedFeedsPref(pref).success
  ) as AppBskyActorDefs.SavedFeedsPref | undefined;

  if (!feedsPref || feedsPref.saved.length === 0) return [];

  const generators = await agent.app.bsky.feed.getFeedGenerators({
    feeds: feedsPref.saved,
  });
  if (!generators.success) {
    throw new Error("Could not fetch feed generators");
  }

  return generators.data.feeds.map((feed) => ({
    ...feed,
    pinned: feedsPref.pinned.includes(feed.uri),
  }));
};

export const togglePinFeed = async (agent: AtpAgent, feed: string) => {
  const prefs = await agent.app.bsky.actor.getPreferences();
  if (!prefs.success) throw new Error("Could not fetch feeds");

  for (const pref of prefs.data.preferences) {
    if (
      AppBskyActorDefs.isSavedFeedsPref(pref) &&
      AppBskyActorDefs.validateSavedFeedsPref(pref).success
    ) {
      if (pref.pinned.includes(feed)) {
        pref.pinned = pref.pinned.filter((f) => f !== feed);
      } else {
        pref.pinned.push(feed);
      }
    }
  }

  return await agent.app.bsky.actor.putPreferences({
    preferences: prefs.data.preferences,
  });
};

export const toggleSaveFeed = async (agent: AtpAgent, feed: string) => {
  const prefs = await agent.app.bsky.actor.getPreferences();
  if (!prefs.success) throw new Error("Could not fetch feeds");

  for (const pref of prefs.data.preferences) {
    if (
      AppBskyActorDefs.isSavedFeedsPref(pref) &&
      AppBskyActorDefs.validateSavedFeedsPref(pref).success
    ) {
      if (pref.saved.includes(feed)) {
        pref.pinned = pref.pinned.filter((f) => f !== feed);
        pref.saved = pref.saved.filter((f) => f !== feed);
      } else {
        pref.saved.push(feed);
      }
    }
  }

  return await agent.app.bsky.actor.putPreferences({
    preferences: prefs.data.preferences,
  });
};

export const likeFeed = async (agent: AtpAgent, uri: string, cid: string) => {
  const like = await agent.like(uri, cid);
  return like;
};

export const unlikeFeed = async (agent: AtpAgent, likeUri: string) => {
  await agent.deleteLike(likeUri);
};

export const getTimeline = async (agent: AtpAgent, cursor?: string) => {
  const timeline = await agent.getTimeline({ cursor: cursor });
  return timeline;
};

export const getFeed = async (agent: AtpAgent, uri: string, cursor: string) => {
  const feed = await agent.app.bsky.feed.getFeed({ feed: uri, cursor: cursor });
  return feed;
};

export const getFeedInfo = async (uri: string, agent?: AtpAgent) => {
  if (!agent) agent = await getAgent();
  const feed = await agent.app.bsky.feed.getFeedGenerator({ feed: uri });
  if (!feed.success) throw new Error("Could not fetch feed info");
  return feed.data;
};

export const getUserPosts = async (
  agent: AtpAgent,
  handle: string,
  cursor: string
) => {
  const posts = await agent.getAuthorFeed({
    actor: handle,
    cursor: cursor,
    filter: "posts_no_replies",
  });

  if (!posts.success) throw new Error("Could not fetch posts");
  return posts;
};

export const getUserReplyPosts = async (
  agent: AtpAgent,
  handle: string,
  cursor: string
) => {
  const posts = await agent.getAuthorFeed({
    actor: handle,
    filter: "posts_with_replies",
    cursor: cursor,
  });

  if (!posts.success) throw new Error("Could not fetch replies");
  return posts;
};

export const getUserMediaPosts = async (
  agent: AtpAgent,
  handle: string,
  cursor: string
) => {
  const posts = await agent.getAuthorFeed({
    actor: handle,
    filter: "posts_with_media",
    cursor: cursor,
  });

  if (!posts.success) throw new Error("Could not fetch media posts");
  return posts;
};

export const getUserLikes = async (
  agent: AtpAgent,
  handle: string,
  cursor: string
) => {
  if (!agent) agent = await getAgent();
  const likes = await agent.api.app.bsky.feed.getActorLikes({
    actor: handle,
    cursor: cursor,
  });

  if (!likes.success) throw new Error("Could not fetch likes");
  return likes;
};

export const likePost = async (agent: AtpAgent, uri: string, cid: string) => {
  try {
    const like = await agent.like(uri, cid);
    return like;
  } catch (e) {
    throw new Error("Could not like post");
  }
};

export const unlikePost = async (agent: AtpAgent, likeUri: string) => {
  try {
    const unlike = await agent.deleteLike(likeUri);
    return unlike;
  } catch (e) {
    throw new Error("Could not unlike post");
  }
};

export const repost = async (agent: AtpAgent, uri: string, cid: string) => {
  try {
    const like = await agent.repost(uri, cid);
    return like;
  } catch (e) {
    throw new Error("Could not repost");
  }
};

export const unRepost = async (agent: AtpAgent, repostUri: string) => {
  try {
    const unlike = await agent.deleteRepost(repostUri);
    return unlike;
  } catch (e) {
    throw new Error("Could not delete repost");
  }
};

export const removePost = async (agent: AtpAgent, uri: string) => {
  try {
    const post = await agent.deletePost(uri);
    return post;
  } catch (e) {
    throw new Error("Could not delete post");
  }
};

export const getPost = async (agent: AtpAgent, uri: string) => {
  try {
    const post = await agent.getPostThread({ uri: uri, depth: 1 });
    if (!post.success) throw new Error("Could not fetch post");
    return post;
  } catch (e) {
    throw new Error("Could not fetch post");
  }
};

export const getPostThread = async (uri: string, agent?: AtpAgent) => {
  if (!agent) agent = await getAgent();

  try {
    const posts = await agent.getPostThread({ uri: uri });
    return posts.data.thread;
  } catch (e) {
    throw e;
  }
};

export const getPostLikes = async (
  agent: AtpAgent,
  uri: string,
  cursor: string
) => {
  try {
    const likes = await agent.getLikes({ uri: uri, cursor: cursor, limit: 50 });
    return likes.data;
  } catch (e) {
    throw new Error("Could not fetch post likes");
  }
};

export const getPostReposts = async (
  agent: AtpAgent,
  uri: string,
  cursor: string
) => {
  try {
    const likes = await agent.getRepostedBy({
      uri: uri,
      cursor: cursor,
      limit: 50,
    });
    return likes.data;
  } catch (e) {
    throw new Error("Could not fetch post reposts");
  }
};

export const getPostQuotes = async (
  agent: AtpAgent,
  uri: string,
  cursor: string
) => {
  try {
    const quotes = await agent.app.bsky.feed.getQuotes({
      uri: uri,
      cursor: cursor,
      limit: 50,
    });
    return quotes.data;
  } catch (e) {
    throw new Error("Could not fetch post quotes");
  }
};
