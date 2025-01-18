/**
 * Attempt #01
 * using elizaOS twitter agent: https://github.com/elizaOS/agent-twitter-client
 */

import eliza from './bots/eliza';

eliza.run().catch((error) => {
  console.error('Error running the bot:', error);
});

/**
 * Attempt #02
 * using twitter sdk: https://www.npmjs.com/package/twitter-api-sdk
 */

// import custom from './bots/custom';

// custom.run().catch((error) => {
//   console.error('Error running the bot:', error);
// });
