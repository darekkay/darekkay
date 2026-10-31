const { readFileSync, writeFileSync } = require("fs");
const { join } = require("path");

const SUMMARY_URL = "https://dariuszwinkler.com/summary.json";
const README = join(__dirname, "README.md");

const renderDevPosts = (readmeContent, summary) => {
  const latestPosts = summary.postsDev.reduce(
    (acc, post) => `${acc}- [${post.title}](${post.url})\n`,
    "\n\n",
  );

  return readmeContent.replace(
    /<!-- @begin-dev -->([\s\S]*)<!-- @end-dev -->/,
    `<!-- @begin-dev -->${latestPosts}\n<!-- @end-dev -->`,
  );
};

const renderLifePosts = (readmeContent, summary) => {
  const latestPosts = summary.postsLife.reduce(
    (acc, post) => `${acc}- [${post.title}](${post.url})\n`,
    "\n\n",
  );

  return readmeContent.replace(
    /<!-- @begin-life -->([\s\S]*)<!-- @end-life -->/,
    `<!-- @begin-life -->${latestPosts}\n<!-- @end-life -->`,
  );
};

const renderLatestPhoto = (readmeContent, summary) => {
  const latestPhoto = summary.latestPhoto;

  return readmeContent.replace(
    /<!-- @begin-photography -->([\s\S]*)<!-- @end-photography -->/,
    `<!-- @begin-photography -->\n\n<img src="${latestPhoto.url}" alt="${latestPhoto.alt}" />\n\n<!-- @end-photography -->`,
  );
};

const fetchSummary = async () => {
  const response = await fetch(SUMMARY_URL);
  const data = await response.json();
  return data;
};

const sync = async () => {
  const summary = await fetchSummary();
  let readmeContent = readFileSync(README, "utf-8");

  readmeContent = renderDevPosts(readmeContent, summary);
  readmeContent = renderLifePosts(readmeContent, summary);
  readmeContent = renderLatestPhoto(readmeContent, summary);

  writeFileSync(README, readmeContent);
};

sync().catch((error) => console.error(error));
