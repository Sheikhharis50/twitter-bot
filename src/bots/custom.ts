import { configs } from '../configs';
import { Client } from 'twitter-api-sdk';

export class CustomBot {
  public readonly client: Client;

  constructor() {
    this.client = new Client(configs.twitter.bearer_token);
  }
}
