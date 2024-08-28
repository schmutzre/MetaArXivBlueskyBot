import Parser from 'rss-parser';
import fs from 'fs';

interface Paper {
  title: string;
  link: string;
}

const FEED_URL = 'https://osfpreprints-feed.herokuapp.com/MetaArXiv.rss';
const POSTED_PAPERS_PATH = './postedPapers.json';
const postedPapers = JSON.parse(fs.readFileSync(POSTED_PAPERS_PATH, 'utf8'));

const ONE_DAY = 60 * 60 * 1000;  // One hour in milliseconds

export default async function getPostText() {
  const parser = new Parser();
  const feed = await parser.parseURL(FEED_URL);
  const papersToPost = [];

  for (const item of feed.items) {
    const publicationDate = item.pubDate ? new Date(item.pubDate) : new Date();
    const currentDate = new Date();

    const isAlreadyPosted = postedPapers.papers.some((paper: Paper) => paper.title === item.title && paper.link === item.link);
const formattedText = `${item.title}: ${item.link}`;
    const isWithinLengthLimit = formattedText.length <= 290;

    if (!isAlreadyPosted && (currentDate.getTime() - publicationDate.getTime() <= ONE_DAY) && isWithinLengthLimit) {
      papersToPost.push({
        title: item.title,
        link: item.link,
        formattedText: `${item.title}: ${item.link}`
      });
    }
  }

  return papersToPost.length > 0 ? papersToPost : null;
}