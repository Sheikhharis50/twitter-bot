import { configs } from '../configs';
import { Client } from 'twitter-api-sdk';

const run = async () => {
  console.log('Custom Bot is running');

  const client = new Client(configs.twitter.bearer_token);
  const user = await client.users.findUserByUsername(configs.twitter.username);
  console.log(user);
};

export default { run };
