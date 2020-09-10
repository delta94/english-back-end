import dotenv from 'dotenv';

dotenv.config();

const env =
  process.env.NODE_ENV === 'production'
    ? 'production'
    : process.env.NODE_ENV === 'staging'
    ? 'staging'
    : 'development';

const domain =
  process.env.NODE_ENV === 'production'
    ? 'ewebinar.com'
    : process.env.NODE_ENV === 'staging'
    ? 'staging.ewebinar.com'
    : process.env.NODE_ENV === 'development'
    ? 'dev.ewebinar.com'
    : process.env.DOMAIN || 'local.dawson.fm';

const protocol =
  process.env.PROTOCOL || ['production', 'staging', 'development'].includes(env)
    ? 'https://'
    : 'http://';

export const config = {
  env,
  port: process.env.PORT || 4000,

  cors: {
    credentials: true,
    origin: [
      'http://localhost:3000',
      'https://tingadev.github.io/english-front-end/',
      'http://tingadev.xyz'
    ],
  },

  SUBDOMAIN: process.env.SUBDOMAIN || null,

  PROTOCOL: process.env.PROTOCOL || protocol,
  MAIN_FRONTEND_URL: process.env.MAIN_FRONTEND_URL || `https://app.${domain}`,
  MAIN_BACKEND_URL: process.env.MAIN_BACKEND_URL || `https://api.${domain}`,

  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || 'NO_KEY!',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || 'NO_SECRET_KEY!',

  IMGIX_SECURE_TOKEN: process.env.IMGIX_SECURE_TOKEN || undefined,
  IMGIX_DOMAIN: process.env.IMGIX_DOMAIN || 'ewebinar-dev.imgix.net',
  ASSETS_S3_BUCKET: process.env.ASSETS_S3_BUCKET || 'ewebinar-assets-dev',



  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'access-token-2093842l',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'refresh-token-0293849322',
  PAGINATION_LIMIT: process.env.PAGINATION_LIMIT || 50,
  WELCOME_MESSAGE_TO_SHOW_AFTER_SECS: 20,

  SECONDS_PER_CHART_POINT: 5,
  SECONDS_PER_LIKE_POINT: 10,
  DEMO_WEBINAR_SETID: process.env.DEMO_WEBINAR_SETID || null,
  STAYED_TO_END_PERCENT: 95,
  isProduction: process.env.NODE_ENV === 'production',

  /*
   *  THE FOLLOWING SHOULD BE KEPT IN SYNC BETWEEN MODULES
   */

  UPLOAD_PROGRESS_MAX: process.env.UPLOAD_PROGRESS_MAX
    ? parseInt(process.env.UPLOAD_PROGRESS_MAX, 10)
    : 50, // Keep these synced between FRONTEND AND BACKEND

  MAX_VIDEO_SIZE: process.env.MAX_VIDEO_SIZE
    ? parseInt(process.env.MAX_VIDEO_SIZE, 10)
    : 10 * 1024 * 1024 * 1024, // Keep synced between BACKEND AND WORKER

};

export default config;
