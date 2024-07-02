import { Timestamp } from "firebase-admin/firestore";
import MarkdownIt from "markdown-it";

import { PodcastChannel, PodcastEpisode } from "./types";

const Markdown = MarkdownIt();

export function makeRss(feed: PodcastChannel, episodes: PodcastEpisode[]) {
  const rssString = `<?xml version="1.0" encoding="UTF-8"?>
    <rss
        version="2.0"
        xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
        xmlns:atom="http://www.w3.org/2005/Atom"
        xmlns:cc="http://web.resource.org/cc/"
        xmlns:media="http://search.yahoo.com/mrss/"
        xmlns:content="http://purl.org/rss/1.0/modules/content/"
        xmlns:podcast="https://podcastindex.org/namespace/1.0"
        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    >
    ${makeChannel(feed, episodes.map((episode) => makeItem(episode)).join(""))}
    </rss>`;
  return rssString;
}

function makeChannel(channel: PodcastChannel, items: string) {
  return `<channel>
        <title><![CDATA[${channel.title}]]></title>
        <description><![CDATA[${channel.description}]]></description>
        <link><![CDATA[${channel.contact.site}]]></link>
        <language>${channel.metadata.language}</language>
        <itunes:author>${channel.contact.author}</itunes:author>
        <itunes:summary><![CDATA[${channel.description}]]></itunes:summary>
        <itunes:image href="${channel.image}"/>
        ${formatCategories(channel.metadata.categories)}
        <itunes:owner>
            <itunes:name>${channel.contact.owner}</itunes:name>
            <itunes:email>${channel.contact.email}</itunes:email>
        </itunes:owner>
        <itunes:explicit>${channel.metadata.explicit}</itunes:explicit>
        <itunes:type>${channel.metadata.type}</itunes:type>
        <itunes:new-feed-url><![CDATA[${channel.feedUrl}]]></itunes:new-feed-url>
        <atom:link href="${channel.feedUrl}" rel="self" type="application/rss+xml"/>
        <docs><![CDATA[${channel.contact.site}]]></docs>
        <podcast:locked>${channel.metadata.locked}</podcast:locked>
        ${items}
        </channel>`;
  // <itunes:complete>${channel.metadata.complete}</itunes:complete>
}

function formatCategories(
  categories: PodcastChannel["metadata"]["categories"],
) {
  return categories
    .map(({ category, subCategory }) => {
      if (subCategory === undefined)
        return `<itunes:category text="${category}"/>`;
      return `
      <itunes:category text="${category}">
        <itunes:category text="${subCategory}"/>
      </itunes:category>
      `;
    })
    .join("");
}
function makeItem(episodeData: PodcastEpisode) {
  return `<item>
        <title>${episodeData.title}</title>
        <link><![CDATA[${episodeData.fileData.url}]]></link>
        <guid isPermaLink="true"><![CDATA[${episodeData.fileData.url}]]></guid>
        <description><![CDATA[${Markdown.render(episodeData.description)}]]></description>
        <pubDate>${new Timestamp(episodeData.publishDate.seconds, episodeData.publishDate.nanoseconds).toDate().toUTCString()}</pubDate>
        <itunes:duration>${episodeData.fileData.duration}</itunes:duration>
        <itunes:explicit>${episodeData.metadata.explicit}</itunes:explicit>
        <itunes:season>${episodeData.metadata.season}</itunes:season>
        <itunes:episode>${episodeData.metadata.episode}</itunes:episode>
        <itunes:episodeType>${episodeData.metadata.type || "full"}</itunes:episodeType>
        <enclosure url="${episodeData.fileData.url.replace("&", "&amp;")}" length="${episodeData.fileData.size}" type="audio/mpeg"/>
    </item>`;
}
