import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";

import { getDataFromEvent, queryEpisodeByFeed, queryFeed, saveFeed } from "../utils/firestore";
import { PodcastEpisode } from "../utils/types"
import { makeRss } from "../utils/makeRss";

/**
 * Update the RSS Feed Document with a new episode once it's created.
 */
export const rebuildRssFeed = onDocumentCreated("api/v1/episodes/{episodeId}", async (event) => {
    try {
        const episodeData = getDataFromEvent<PodcastEpisode>(event);
        if (!episodeData) throw new Error("Unable to retrieve data for new episode");
        const feed = await queryFeed(episodeData.feed);
        const episodes = await queryEpisodeByFeed(episodeData.feed);
        const newRssFeed = makeRss(feed, episodes);
        saveFeed(episodeData.feed, newRssFeed);
    }
    catch (ex) {
        logger.error(ex);
        logger.error("Aborting...");
    }
});


