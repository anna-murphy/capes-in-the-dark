import type { APIContext } from "astro";
import rss from "@astrojs/rss";
import { assembleFeedData } from "../../utils/queryFeed";
import { formatRssFeed } from "../../utils/rss";

const FEED_NAME = "Capes in the West March";

export async function GET(_context: APIContext): ReturnType<typeof rss> {
  try {
    const feedData = await assembleFeedData(FEED_NAME);
    if (feedData === undefined)
      throw new Error(
        `Unable to find RSS feed information for "${FEED_NAME}".`,
      );
    return await rss(formatRssFeed(feedData.feed, feedData.episodes));
  } catch (ex) {
    console.error(ex);
    return new Response(null, {
      status: 500,
      statusText: "whoopsies",
    });
  }
}
