const { readFileSync, writeFileSync } = require("fs");
const { join } = require("path");

const axios = require("axios");

const README = join(__dirname, "README.md");

const syncLatestBlogPosts = async (readmeContent) => {
  const URL_BLOG_FEED = "https://darekkay.com/feed.json";
  const response = await axios.get(URL_BLOG_FEED);
  const feed = response.data;

  const latestPosts = feed.items
    .slice(0, 3)
    .map((entry) => ({
      title: entry.title,
      url: entry.url,
    }))
    .reduce((acc, post) => `${acc}- [${post.title}](${post.url})\n`, "\n\n");

  return readmeContent.replace(
    /<!-- @begin-blog-posts -->([\s\S]*)<!-- @end-blog-posts -->/,
    `<!-- @begin-blog-posts -->${latestPosts}\n<!-- @end-blog-posts -->`
  );
};

const sync = async () => {
  let readmeContent = readFileSync(README, "utf-8");
  readmeContent = await syncLatestBlogPosts(readmeContent);

  writeFileSync(README, readmeContent);
};

sync().catch((error) => console.error(error));
