/* eslint-disable @typescript-eslint/no-unused-vars */

import { ElizaBot } from './bots/eliza';
import { CustomBot } from './bots/custom';
import { configs } from './configs';
import { MediaPostRepository } from './repositories';
import { PollingService } from './services/polling';
import { IMediaPostTable, mediaPostSchema } from './schemas';
import { eq } from 'drizzle-orm';

(() => {
  const elizaBot = async () => {
    const eliza = new ElizaBot();
    await eliza.login();

    // Get logged-in user's profile
    // const me = await eliza.scraper.me();
    // console.log('LoggedIn user:', me);

    // get a specific tweet
    // const tweet = await eliza.scraper.getTweet('1880635491667865953');
    // console.log("Specific tweet", tweet);

    // get first 10 tweets from a username
    // console.log("Following are the elonmusk first 10 tweets: ")
    // for await (const tweet of eliza.scraper.getTweets('elonmusk', 10)) {
    //   console.log(tweet);
    // }

    // send tweet to a tweet
    // await eliza.scraper.sendTweet('Hello World', '1880635491667865953');
    // console.log('Tweet is posted');
  };

  const customBot = async () => {
    const custom = new CustomBot();

    const user = await custom.client.users.findUserByUsername(
      configs.twitter.username
    );
    console.log('User:', user.data);
  };

  const dbTest = async () => {
    const mediaPostRepo = new MediaPostRepository();
    const pollingService = new PollingService<IMediaPostTable>(
      async () => {
        return mediaPostRepo.findBy({
          filters: [eq(mediaPostSchema.status, 'new')],
        });
      },
      async (id: string) => {
        mediaPostRepo.update({
          set: { status: 'posted' },
          filters: [eq(mediaPostSchema.id, id)],
        });
      }
    );

    pollingService.pollDatabase();
  };

  // elizaBot();
  // customBot();
  dbTest();
})();
