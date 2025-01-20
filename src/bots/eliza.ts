import { configs } from '../configs';
import { Scraper } from 'agent-twitter-client';
import * as fs from 'fs';
import * as path from 'path';
import { Cookie } from 'tough-cookie';

// File path for storing cookies
const COOKIES_FILE = path.join(__dirname, '../../cookies/twitter-cookies.json');

const saveCookies = async (cookies: unknown) => {
  try {
    await fs.promises.writeFile(COOKIES_FILE, JSON.stringify(cookies));
    console.log('Cookies saved successfully');
  } catch (error) {
    console.error('Error saving cookies:', error);
  }
};

const loadCookies = async (): Promise<string[] | null> => {
  try {
    if (fs.existsSync(COOKIES_FILE)) {
      const cookiesData = await fs.promises.readFile(COOKIES_FILE, 'utf-8');
      const parsedData = JSON.parse(cookiesData);
      return parsedData.map((cookie: unknown) =>
        Cookie.fromJSON(JSON.stringify(cookie))?.toString()
      );
    }
  } catch (error) {
    console.error('Error loading cookies:', error);
  }
  return null;
};

const login = async (scraper: Scraper) => {
  // Try to load existing cookies
  const savedCookies = await loadCookies();
  if (savedCookies) {
    await scraper.setCookies(savedCookies);
    const isLoggedIn = await scraper.isLoggedIn();
    if (isLoggedIn) {
      console.log('Successfully logged in using saved cookies');
      return;
    }
  }

  // If no valid cookies, login normally
  await scraper.login(
    configs.twitter.username,
    configs.twitter.password,
    configs.twitter.email,
    undefined,
    configs.twitter.api_key,
    configs.twitter.api_secret_key,
    configs.twitter.access_token,
    configs.twitter.access_token_secret
  );
  const isLoggedIn = await scraper.isLoggedIn();
  if (isLoggedIn) {
    // Get and save new session cookies
    const cookies = await scraper.getCookies();
    await saveCookies(cookies);
    console.log('Successfully logged in and new cookies are saved');
  }
};

const run = async () => {
  const scraper = new Scraper();

  // login in twitter
  await login(scraper);

  // Get logged-in user's profile
  // const me = await scraper.me();
  // console.log(me);

  // get a specific tweet
  // const tweet = await scraper.getTweet('1880635491667865953');
  // console.log(tweet);

  // get first 10 tweets from a username
  // for await (const tweet of scraper.getTweets('elonmusk', 10)) {
  //   console.log(tweet);
  // }

  // send tweet to a tweet
  // await scraper.sendTweet('Hello World', '1880635491667865953');
  // console.log('Tweet is posted');
};

export default { run };
