import type { APIContext } from "astro";
import rss, { type RSSFeedItem, type RSSOptions } from "@astrojs/rss";

export async function GET(context: APIContext): ReturnType<typeof rss> {
  const site = context.site?.toString() ?? "https://capes-in-the-dark.web.app";
  const feedUrl =
    "https://capes-in-the-dark.web.app/capes-in-the-west-march/rss";
  const resourceUrl = "gs://capes-in-the-dark.appspot.com/Moonlight Bay.mp3";
  const item: RSSFeedItem = {
    title: "Example Item",
    link: resourceUrl,
    pubDate: new Date(),
    description: "example description",
    enclosure: {
      length: 24986,
      type: "audio/mpeg",
      url: resourceUrl,
    },
    customData: `
    <itunes:duration>1801</itunes:duration>
    <itunes:image href="" />
    <itunes:explicit>true</itunes:explicit>
    <itunes:episode>1</itunes:episode>
    <itunes:season>1</itunes:season>
    <itunes:episodeType>full</itunes:episodeType>
    <podcast:transcript url="${site}" type="text/html" />`,
  };
  const rssOptions: RSSOptions = {
    title: "Capes in the West March",
    description:
      "An Actual Play Archive of RAW Audio recordings of our Capes in the West March game.",
    site,
    items: [item],
    xmlns: {
      itunes: "http://www.itunes.com/dtds/podcast-1.0.dtd",
      atom: "http://www.w3.org/2005/Atom",
      cc: "http://web.resource.org/cc/",
      media: "http://search.yahoo.com/mrss/",
      content: "http://purl.org/rss/1.0/modules/content/",
      podcast: "https://podcastindex.org/namespace/1.0",
      googleplay: "http://www.google.com/schemas/play-podcasts/1.0",
      rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    },
    customData: `
        <language>en-us</language>
        <itunes:author>Anna Murphy</itunes:author>
        <itunes:summary>An Actual Play Archive of RAW Audio recordings of our Capes in the West March game.</itunes:summary>
        <itunes:image href="https://example.com/podcast.jpg"/>
        <itunes:category text="Fiction"/>
        <itunes:category text="Leisure">
          <itunes:category text="Games"/>
        </itunes:category>
        <itunes:owner>
			    <itunes:name><![CDATA[Anna Murphy]]></itunes:name>
			    <itunes:email>curunilauro@gmail.com</itunes:email>
		    </itunes:owner>
        <itunes:explicit>true</itunes:explicit>
        <itunes:type>serial</itunes:type>
        <itunes:new-feed-url>${feedUrl}</itunes:new-feed-url>
        <docs>${site}</docs>
        <podcast:locked>no</podcast:locked>
        <itunes:complete>no</itunes:complete>
        <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
        `,
  };
  return await rss(rssOptions);
}
