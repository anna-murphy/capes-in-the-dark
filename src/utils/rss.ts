import type { RSSFeedItem, RSSOptions } from "@astrojs/rss";

const XMLNS_VALUES = {
  itunes: "http://www.itunes.com/dtds/podcast-1.0.dtd",
  atom: "http://www.w3.org/2005/Atom",
  cc: "http://web.resource.org/cc/",
  media: "http://search.yahoo.com/mrss/",
  content: "http://purl.org/rss/1.0/modules/content/",
  podcast: "https://podcastindex.org/namespace/1.0",
  googleplay: "http://www.google.com/schemas/play-podcasts/1.0",
  rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
} as const;

export function formatRssFeed(
  channel: PodcastChannel,
  episodes: PodcastEpisode[],
): RSSOptions {
  const rssFeed = formatRssChannel(channel);
  rssFeed.items = episodes.map((episode) => formatRssFeedItem(episode));
  return rssFeed;
}

export function formatRssChannel(channel: PodcastChannel): RSSOptions {
  const rssChannelOptions: RSSOptions = {
    title: channel.title,
    description: channel.description,
    site: channel.contact.site,
    items: [],
    xmlns: XMLNS_VALUES,
    customData: [
      formatChannelLanguage(channel),
      formatChannelAuthor(channel),
      formatChannelSummary(channel),
      formatChannelImage(channel),
      formatChannelCategory(channel),
      formatChannelOwner(channel),
      formatChannelExplicit(channel),
      formatChannelType(channel),
      formatChannelFeedUrl(channel),
      formatChannelDocs(channel),
      formatChannelLocked(channel),
      formatChannelComplete(channel),
    ].join(""),
  };
  return rssChannelOptions;
}

export function formatRssFeedItem(episodeData: PodcastEpisode): RSSFeedItem {
  const feedItem: RSSFeedItem = {
    title: episodeData.title,
    link: episodeData.fileData.url,
    pubDate: episodeData.publishDate,
    description: episodeData.description,
    enclosure: {
      length: episodeData.fileData.size,
      type: "audio/mpeg",
      url: episodeData.fileData.url,
    },
    customData: [
      formatItemDuration(episodeData),
      formatItemImage(episodeData),
      formatItemExplicit(episodeData),
      formatItemSeasonNumber(episodeData),
      formatItemEpisodeNumber(episodeData),
      formatItemEpisodeType(episodeData),
      formatItemTranscript(episodeData),
    ].join(""),
  };
  return feedItem;
}

function formatChannelLanguage(channel: PodcastChannel): string {
  return `<language>${channel.metadata.language}</language>`;
}

function formatChannelAuthor(channel: PodcastChannel): string {
  return `<itunes:author>${channel.contact.author}</itunes:author>`;
}

function formatChannelSummary(channel: PodcastChannel): string {
  return `<itunes:summary><![CDATA[${channel.description}]]></itunes:summary>`;
}

function formatChannelImage(channel: PodcastChannel): string {
  return `<itunes:image href="${channel.image}"/>`;
}

function formatChannelCategory(channel: PodcastChannel): string {
  return channel.metadata.categories
    .map(({ category, subCategory }) => {
      if (subCategory === undefined)
        return `<itunes:category text="${category}"/>`;
      return `
    <itunes:category text="${category}">
      <itunes:category text="${subCategory}"/>
    </itunes:category>
    `;
    })
    .join();
}

function formatChannelOwner(channel: PodcastChannel): string {
  return `
  <itunes:owner>
    <itunes:name><![CDATA[${channel.contact.owner}]]></itunes:name>
    <itunes:email>${channel.contact.email}</itunes:email>
  </itunes:owner>
  `;
}

function formatChannelExplicit(channel: PodcastChannel): string {
  return `<itunes:explicit>${channel.metadata.explicit}</itunes:explicit>`;
}

function formatChannelType(channel: PodcastChannel): string {
  return `<itunes:type>${channel.metadata.type}</itunes:type>`;
}

function formatChannelFeedUrl(channel: PodcastChannel): string {
  return `<itunes:new-feed-url>${channel.feedUrl}</itunes:new-feed-url><atom:link href="${channel.feedUrl}" rel="self" type="application/rss+xml" />`;
}

function formatChannelDocs(channel: PodcastChannel): string {
  return `<docs>${channel.contact.site}</docs>`;
}

function formatChannelLocked(channel: PodcastChannel): string {
  return `<podcast:locked>${channel.metadata.locked}</podcast:locked>`;
}

function formatChannelComplete(channel: PodcastChannel): string {
  return `<itunes:complete>${channel.metadata.complete}</itunes:complete>`;
}

function formatItemDuration(episodeData: PodcastEpisode): string {
  return `<itunes:duration>${episodeData.fileData.duration}</itunes:duration>`;
}

function formatItemImage(episodeData: PodcastEpisode): string {
  return `<itunes:duration>${episodeData.imageLink}</itunes:duration>`;
}

function formatItemExplicit(episodeData: PodcastEpisode): string {
  return `<itunes:explicit>${episodeData.metadata.explicit}</itunes:explicit>`;
}

function formatItemSeasonNumber(episodeData: PodcastEpisode): string {
  return `<itunes:season>${episodeData.metadata.season}</itunes:season>`;
}

function formatItemEpisodeNumber(episodeData: PodcastEpisode): string {
  return `<itunes:episode>${episodeData.metadata.episode}</itunes:episode>`;
}

function formatItemEpisodeType(episodeData: PodcastEpisode): string {
  const episodeType = episodeData.metadata.type ?? "full";
  return `<itunes:episodeType>${episodeType}</itunes:episodeType>`;
}

function formatItemTranscript(episodeData: PodcastEpisode): string {
  if (episodeData.metadata.transcriptUrl === undefined) return "";
  return `<podcast:transcript url="${episodeData.metadata.transcriptUrl}" type="text/html" />`;
}
