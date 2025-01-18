import dotenv from 'dotenv';

dotenv.config();

const config = {
  twitter: {
    username: process.env.TWITTER_USERNAME,
    password: process.env.TWITTER_PASSWORD,
    email: process.env.TWITTER_EMAIL,
    proxyUrl: process.env.PROXY_URL,

    // Twitter API v2 credentials for tweet and poll functionality
    api_key: process.env.TWITTER_API_KEY,
    api_secret_key: process.env.TWITTER_API_SECRET_KEY,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  },
};

export default config;
