import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Missing search query" });
    }

    try {
      const youtube = google.youtube({
        version: "v3",
        auth: process.env.YOUTUBE_API_KEY,
      });

      const response = await youtube.search.list({
        part: "snippet",
        q: q,
        type: "video",
        maxResults: 10,
      });

      const videos = response.data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
      }));

      res.status(200).json(videos);
    } catch (error) {
      console.error("Error searching YouTube:", error);
      res.status(500).json({ error: "Error searching YouTube" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
