import { configs } from '../configs';
import { Scraper } from 'agent-twitter-client';
import * as fs from 'fs';
import * as path from 'path';
import { Cookie } from 'tough-cookie';

export class ElizaBot {
  private readonly cookies_file: string;
  public readonly scraper: Scraper;

  constructor() {
    this.scraper = new Scraper();
    this.cookies_file = path.join(
      __dirname,
      '../../cookies/twitter-cookies.json'
    );
  }

  /**
   * File path for storing cookies
   * @param cookies
   */
  private saveCookies = async (cookies: unknown): Promise<void> => {
    try {
      await fs.promises.writeFile(this.cookies_file, JSON.stringify(cookies));
      console.log('Cookies saved successfully');
    } catch (error) {
      console.error('Error saving cookies:', error);
    }
  };

  /**
   * Load cookies from the file
   * @returns
   */
  private loadCookies = async (): Promise<string[] | null> => {
    try {
      if (fs.existsSync(this.cookies_file)) {
        const cookiesData = await fs.promises.readFile(
          this.cookies_file,
          'utf-8'
        );
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

  /**
   * Login to Twitter
   */
  public login = async (): Promise<void> => {
    // Try to load existing cookies
    const savedCookies = await this.loadCookies();
    if (savedCookies) {
      await this.scraper.setCookies(savedCookies);
      const isLoggedIn = await this.scraper.isLoggedIn();
      if (isLoggedIn) {
        console.info('Successfully logged in using saved cookies');
        return;
      }
    }

    // If no valid cookies, login normally
    await this.scraper.login(
      configs.twitter.username,
      configs.twitter.password,
      configs.twitter.email,
      undefined,
      configs.twitter.api_key,
      configs.twitter.api_secret_key,
      configs.twitter.access_token,
      configs.twitter.access_token_secret
    );
    const isLoggedIn = await this.scraper.isLoggedIn();
    if (isLoggedIn) {
      // Get and save new session cookies
      const cookies = await this.scraper.getCookies();
      await this.saveCookies(cookies);
      console.info('Successfully logged in and new cookies are saved');
    }
  };
}
