import { Timestamp } from "firebase-admin/firestore";
import { PodcastChannel, PodcastEpisode } from "./types";

export function makeRss(feed: PodcastChannel, episodes: PodcastEpisode[]) {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <rss
        version="2.0"
        xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
        xmlns:atom="http://www.w3.org/2005/Atom"
        xmlns:cc="http://web.resource.org/cc/"
        xmlns:media="http://search.yahoo.com/mrss/"
        xmlns:content="http://purl.org/rss/1.0/modules/content/"
        xmlns:podcast="https://podcastindex.org/namespace/1.0"
        xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0"
        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    >
    ${makeChannel(feed, episodes.map((episode) => makeItem(episode)).join(""))}
    </rss>`;
}

function makeChannel(channel: PodcastChannel, items: string) {
    return `<channel>
        <title>${channel.title}</title>
        <description><![CDATA[${channel.description}]]></description>
        <link>${channel.contact.site}</link>
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
        <itunes:new-feed-url>${channel.feedUrl}</itunes:new-feed-url>
        <atom:link href="${channel.feedUrl}" rel="self" type="application/rss+xml"/>
        <docs>${channel.contact.site}</docs>
        <podcast:locked>${channel.metadata.locked}</podcast:locked>
        <itunes:complete>${channel.metadata.complete}</itunes:complete>
        ${items}
    </channel>`
}

function formatCategories(categories: PodcastChannel["metadata"]["categories"]) {
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
        <link${episodeData.fileData.url}</link>
        <guid isPermaLink="true"><![CDATA[${episodeData.fileData.url}]]></guid>
        <description><![CDATA[${episodeData.description}]]></description>
        <pubDate>${new Timestamp(episodeData.publishDate.seconds, episodeData.publishDate.nanoseconds).toDate().toUTCString()}</pubDate>
        <itunes:duration>${episodeData.fileData.duration}</itunes:duration>
        <itunes:explicit>${episodeData.metadata.explicit}</itunes:explicit>
        <itunes:season>${episodeData.metadata.season}</itunes:season>
        <itunes:episode>${episodeData.metadata.episode}</itunes:episode>
        <itunes:episodeType>${episodeData.metadata.type || "full"}</itunes:episodeType>
        <enclosure url="${episodeData.fileData.url}" length="${episodeData.fileData.size}" type="audio/mpeg"/>
    </item>`;
}
/*
const example = `
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:cc="http://web.resource.org/cc/" xmlns:media="http://search.yahoo.com/mrss/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:podcast="https://podcastindex.org/namespace/1.0" xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <channel>
        <title>Capes in the West March</title>
        <description>An Actual Play Archive of RAW Audio recordings of our Capes in the West March game.</description>
        <link>https://capes-in-the-dark.web.app/</link>
        <language>en-us</language>
        <itunes:author>Anna Murphy</itunes:author>
        <itunes:summary>An Actual Play Archive of RAW Audio recordings of our Capes in the West March game.</itunes:summary>
        <itunes:image href="https://capes-in-the-dark.web.app/images/Capes_in_the_West_March_Image.png"/>
        <itunes:category text="Fiction"/>
        <itunes:category text="Leisure"><itunes:category text="Games"/></itunes:category>
        <itunes:owner>
            <itunes:name>Anna Murphy</itunes:name>
            <itunes:email>curunilauro@gmail.com</itunes:email>
        </itunes:owner>
        <itunes:explicit>true</itunes:explicit>
        <itunes:type>serial</itunes:type>
        <itunes:new-feed-url>https://capes-in-the-dark.web.app/capes-in-the-west-march/rss</itunes:new-feed-url>
        <atom:link href="https://capes-in-the-dark.web.app/capes-in-the-west-march/rss" rel="self" type="application/rss+xml"/>
        <docs>https://capes-in-the-dark.web.app</docs>
        <podcast:locked>no</podcast:locked>
        <itunes:complete>no</itunes:complete>
        <item>
            <title>Example Episode</title>
            <link>http://127.0.0.1:9199/download/storage/v1/b/capes-in-the-dark.appspot.com/o/audio.mp3?generation=1710393500090&amp;alt=media</link>
            <guid isPermaLink="true">http://127.0.0.1:9199/download/storage/v1/b/capes-in-the-dark.appspot.com/o/audio.mp3?generation=1710393500090&amp;alt=media</guid>
            <description>A given description</description>
            <pubDate>Thu, 14 Mar 2024 05:18:19 GMT</pubDate>
            <itunes:duration>204</itunes:duration>
            <itunes:duration>https://capes-in-the-dark.web.app/images/Capes_in_the_West_March_Image.png</itunes:duration>
            <itunes:explicit>false</itunes:explicit>
            <itunes:season>0</itunes:season>
            <itunes:episode>1</itunes:episode>
            <itunes:episodeType>full</itunes:episodeType>
            <enclosure url="http://127.0.0.1:9199/download/storage/v1/b/capes-in-the-dark.appspot.com/o/audio.mp3?generation=1710393500090&amp;alt=media" length="1930551" type="audio/mpeg"/>
        </item>
    </channel>
</rss>
`;
*/