import { ApolloError } from 'apollo-server-express';
import ImgixClient from 'imgix-core-js';
import { EntityRepository, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { Asset, AssetEntity, AssetInput, AssetUrls, ImageHint } from './entities/Asset';
// import { s3 } from '../../utils/s3Promises';
import { config } from '../../config';
import { ScrapedVideoMetadata } from './resolvers/ScrapedVideoMetadata';

// tslint:disable
// const YoutubeDlWrap = require('youtube-dl-wrap');

class MySelectQueryBuider extends SelectQueryBuilder<Asset> {
  public scopeInTeam(teamId: string): MySelectQueryBuider {
    return this.andWhere('asset.scope = :scope', {
      scope: AssetEntity.team,
    }).andWhere('asset.id = :id', { id: teamId });
  }
}

@EntityRepository(Asset)
export class AssetRepository extends Repository<Asset> {
  public createQueryBuilder(_alias?: string, queryRunner?: QueryRunner): MySelectQueryBuider {
    return new MySelectQueryBuider(super.createQueryBuilder('asset', queryRunner));
  }

  public async scrapeVideoMetaFromURL(teamId: string, url: string): Promise<ScrapedVideoMetadata> {
    /*
      JSON Output:

    {
      upload_date: '20170317',
      protocol: 'https',
      extractor: 'youtube',
      series: null,
      format: '22 - 1280x720 (720p)',
      format_note: '720p',
      chapters: null,
      height: 720,
      acodec: 'mp4a.40.2',
      like_count: 145952,
      duration: '2:27',
      fulltitle: '박재범 - 몸매 | BisMe Choreography',
      player_url: '/s/player/68f00b39/player_ias.vflset/en_US/base.js',
      playlist_index: null,
      album: 'Worldwide',
      view_count: 8937048,
      playlist: null,
      title: '박재범 - 몸매 | BisMe Choreography',
      _filename: '박재범 - 몸매 _ BisMe Choreography-8HMzWwlIUXo.mp4',
      creator: '박재범 Jay Park',
      ext: 'mp4',
      id: '8HMzWwlIUXo',
      dislike_count: 2119,
      average_rating: 4.9427571,
      abr: 192,
      uploader_url: 'http://www.youtube.com/channel/UCO_HutTdw0PTxGPK7FG1fRA',
      categories: ['Entertainment'],
      fps: 30,
      season_number: null,
      annotations: null,
      webpage_url_basename: 'watch',
      filesize: null,
      display_id: '8HMzWwlIUXo',
      asr: 44100,
      automatic_captions: {},
      description:
        '박재범(Jay park) - 몸매(Mommae) | BisMe Choreography | MOVE Dance Studio(분당무브댄스학원)\n\nChoreography | 화목(주2회) 20:20~21:40\n\nMOVE Dance Studio, Bundang, Korea.\nMusic : 박재범 - 몸매\n\n#choreography #박재범 #몸매 #BisMe\n\nmovedance@naver.com\nKakao ID : movedance\n\n무브댄스 홈페이지\nhttp://www.movedance.co.kr\n\n페이스북\nhttps://www.facebook.com/movedancekorea\n\n인스타그램\nhttps://www.instagram.com/movedanstagram',
      tags: ['choreography', 'dance', '댄스', '무브댄스', '박재범', '몸매', 'BisMe'],
      track: '몸매 Mommae (Feat. Ugly Duck)',
      requested_subtitles: null,
      start_time: null,
      tbr: 1157.405,
      uploader: 'MOVE Dance Studio 무브댄스학원',
      extractor_key: 'Youtube',
      format_id: '22',
      episode_number: null,
      uploader_id: 'UCO_HutTdw0PTxGPK7FG1fRA',
      subtitles: {},
      release_year: null,
      http_headers: {
        'Accept-Language': 'en-us,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9; q = 0.8',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3543.4 Safari/537.36',
        'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.7',
        Referer: 'api.ewebinar.com',
      },
      thumbnails: [
        {
          url:
            'https://i.ytimg.com/vi/8HMzWwlIUXo/hqdefault.jpg?sqp=-oaymwEYCKgBEF5IVfKriqkDCwgBFQAAiEIYAXAB&rs=AOn4CLCZVaOEl3gVyNRAZFVv_lFvoo4leA',
          width: 168,
          resolution: '168x94',
          id: '0',
          height: 94,
        },
        ...
      ],
      license: null,
      artist: '박재범 Jay Park',
      url:
        'https://r5---sn-ni5f-t8gs.googlevideo.com/videoplayback?expire=1593479275&ei=Czz6XvaeEcWrkwaC3piYAw&ip=24.84.49.214&id=o-AFv9e3zUakHA-FPM1FVomzeaXzgwBrFljJfH8HoMYPTX&itag=22&source=youtube&requiressl=yes&mh=j7&mm=31%2C26&mn=sn-ni5f-t8gs%2Csn-vgqsrne6&ms=au%2Conr&mv=m&mvi=4&pl=22&initcwndbps=1951250&vprv=1&mime=video%2Fmp4&ratebypass=yes&dur=146.982&lmt=1576328437478785&mt=1593457595&fvip=5&c=WEB&txp=5535432&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cratebypass%2Cdur%2Clmt&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIhAL9TANGULY1NeEIEvzMmVOenY7o1dT2ByOuL5cWHS6P7AiAGk0N121X4DEn1T7NUheKFlqvUKGF3LzDfGckkmTnDCQ%3D%3D&sig=AOq0QJ8wRAIgAs0z56S2zOZOjgTNrnFmgKcF-TKJIFSYcw37m1_e6ZMCICKqOSosBKolZ3HCZQGrYXViVIADq6AbvMKQzNkjeWTH',
      age_limit: 0,
      release_date: null,
      alt_title: '몸매 Mommae (Feat. Ugly Duck)',
      thumbnail: 'https://i.ytimg.com/vi_webp/8HMzWwlIUXo/maxresdefault.webp',
      channel_id: 'UCO_HutTdw0PTxGPK7FG1fRA',
      is_live: null,
      width: 1280,
      end_time: null,
      webpage_url: 'https://www.youtube.com/watch?v=8HMzWwlIUXo',
      formats: [
        {
          asr: 48000,
          tbr: 49.409,
          protocol: 'https',
          format: '249 - audio only (tiny)',
          url:
            'https://r5---sn-ni5f-t8gs.googlevideo.com/videoplayback?expire=1593479275&ei=Czz6XvaeEcWrkwaC3piYAw&ip=24.84.49.214&id=o-AFv9e3zUakHA-FPM1FVomzeaXzgwBrFljJfH8HoMYPTX&itag=249&source=youtube&requiressl=yes&mh=j7&mm=31%2C26&mn=sn-ni5f-t8gs%2Csn-vgqsrne6&ms=au%2Conr&mv=m&mvi=4&pl=22&initcwndbps=1951250&vprv=1&mime=audio%2Fwebm&gir=yes&clen=859467&dur=146.941&lmt=1576325741938469&mt=1593457595&fvip=5&keepalive=yes&c=WEB&txp=5531432&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRgIhAKcrXl24iRknz9LYLa-SqxV3nZJfwUZ9inXNGVInj5ZgAiEAxM8ng1Jc7QvJltN3bIW5c6NW2c4yzzIyyFvm0Eyfk7w%3D&sig=AOq0QJ8wRAIgQpkxF0xfSH3h37csTDxXxSkcaCDaNQB6z9qZc4Reo1YCIElS04ogip5XMemGzWsnfYMWFWjQG-qwbS0VOgWIVTKh&ratebypass=yes',
          vcodec: 'none',
          format_note: 'tiny',
          abr: 50,
          player_url: '/s/player/68f00b39/player_ias.vflset/en_US/base.js',
          downloader_options: [Object],
          width: null,
          ext: 'webm',
          filesize: 859467,
          fps: null,
          format_id: '249',
          height: null,
          http_headers: [Object],
          acodec: 'opus',
        },
        ...
      ],
      channel_url: 'http://www.youtube.com/channel/UCO_HutTdw0PTxGPK7FG1fRA',
      vcodec: 'avc1.64001F',
      _duration_raw: 147,
      _duration_hms: '00:02:27',
    }
    */

    // const notSupportedError = 'Video URL not supported.  Please try uploading the video from your computer.';

    return new Promise(async (resolve, reject) => {
      try {
        // const youTubeDlPath = 'dist/youtube-dl';
        // const youtubeDlWrap = new YoutubeDlWrap(youTubeDlPath);

        let info: ScrapedVideoMetadata;
        const data: ScrapedVideoMetadata | ScrapedVideoMetadata[] = [];

        if (Array.isArray(data)) {
          info = (data as ScrapedVideoMetadata[])[0];
        } else {
          info = data as ScrapedVideoMetadata;
        }

        console.log('VIDEO SCRAPER INFO: ', info);

        if (info.thumbnail) {
          // Thumbnail can be WEBP format - YouTube lies in the URL as to the
          // type of file.  We will instead host it oursleves by downloading it to S3
          // and create an IMGIX URL

          info.thumbnail = await this.newAssetFromUrl(
            {
              entity: AssetEntity.team,
              entityId: teamId,
              name: 'scrapedMainMedia',
              image: {
                height: 500,
                width: 300,
                hint: ImageHint.forceJpeg,
              },
            },
            info.thumbnail
          );
        }

        resolve(info);
      } catch (err) {
        console.error(`ERROR: Scraping ${url}: `, JSON.stringify(err));

        const genericError = (msg?: string) => {
          return `${msg ?? 'Unable to find video in URL'} - Try uploading a local file.`;
        };

        const matchesYouTubeSaid = err.stderr.match(/Youtube said:\s*(.*\n)+/i);
        if (matchesYouTubeSaid && matchesYouTubeSaid.length > 1) {
          // Extract error
          return reject(new ApolloError(genericError(matchesYouTubeSaid[1])));
        } else {
          const matchesError = err.stderr.match(/ERROR:\s*(.*\n)+/i);
          if (matchesError && matchesError.length > 1) {
            // Extract error
            return reject(new ApolloError(genericError(matchesError[1])));
          }
        }

        return reject(new ApolloError(genericError(JSON.stringify(err))));
      }
    });
  }

  public async createUploadUrl(asset: AssetInput): Promise<AssetUrls> {
    let type: AssetEntity = AssetEntity.ewebinar;

    if (!asset.entityId) {
      // The only case where scopeId might not be present is for Invited Users.
      // Teams and EWebinars are created before any media is set uploaded.

      if (asset.entity !== AssetEntity.user) {
        throw new ApolloError('No scope ID specified for Asset upload');
      }
    }

    if (!asset.image) {
      throw new ApolloError('No ImageAsset data passed in');
    }

    const image = asset.image;

    switch (asset.entity) {
      case AssetEntity.user:
        type = AssetEntity.user;
        break;
      case AssetEntity.team:
        type = AssetEntity.team;
        break;
      default:
        type = AssetEntity.ewebinar;
    }

    const filepath = `drafts/${type}/${asset.entityId}/${asset.name}-${new Date().getTime()}-draft`;
    const uploadUrl = '';

    const imgClient = new ImgixClient({
      domain: config.IMGIX_DOMAIN,
      secureURLToken: config.IMGIX_SECURE_TOKEN,
    });

    let buildParams: any = {
      fit: 'clip',
      w: image.width,
      h: image.height,
      dpr: 2,
    };

    switch (image.hint) {
      case ImageHint.profile:
        buildParams = {
          ...buildParams,
          fit: 'facearea',
          faceindex: 1,
          facepad: 5,
          mask: 'ellipse',
          fm: 'png',
        };
        break;
    }

    const url = imgClient.buildURL(filepath, buildParams);

    const draftAsset = this.create({ url, ...asset });
    await this.save(draftAsset);

    return new AssetUrls(url, uploadUrl);
  }

  public async newAssetFromUrl(asset: AssetInput, url: string): Promise<string | null> {
    let type: AssetEntity = AssetEntity.ewebinar;

    if (!asset.entityId) {
      // The only case where scopeId might not be present is for Invited Users.
      // Teams and EWebinars are created before any media is set uploaded.

      if (asset.entity !== AssetEntity.user) {
        throw new ApolloError('No scope ID specified for Asset upload');
      }
    }

    if (!asset.image) {
      throw new ApolloError('No ImageAsset data passed in');
    }

    const image = asset.image;

    switch (asset.entity) {
      case AssetEntity.user:
        type = AssetEntity.user;
        break;
      case AssetEntity.team:
        type = AssetEntity.team;
        break;
      default:
        type = AssetEntity.ewebinar;
    }

    const filepath = `${type}/${asset.entityId}/${asset.name}-${new Date().getTime()}`;
    try {
    //   await s3.UploadFromUrlToS3(url, filepath);
    } catch (e) {
      console.warn('WARNING: Unable to download scraped thumbnail: ', url);
      return null;
    }

    const imgClient = new ImgixClient({
      domain: config.IMGIX_DOMAIN,
      secureURLToken: config.IMGIX_SECURE_TOKEN,
    });

    let buildParams: any = {
      fit: 'clip',
      w: image.width,
      h: image.height,
      dpr: 2,
    };

    switch (image.hint) {
      case ImageHint.profile:
        buildParams = {
          ...buildParams,
          fit: 'facearea',
          faceindex: 1,
          facepad: 5,
          mask: 'ellipse',
          fm: 'png',
        };
        break;

      case ImageHint.forceJpeg:
        buildParams = {
          ...buildParams,
          fm: 'jpg',
          bg: 'FFFFFF',
        };
    }

    return imgClient.buildURL(filepath, buildParams);
  }

  public async makeAssetPermanent(draftUrl: string, origUrl?: string): Promise<string> {
    const url = new URL(draftUrl);

    const oldPathname = url.pathname;
    // Remove /drafts and -draft
    const newPathname = `/${oldPathname
      .substr(0, oldPathname.length - '-draft'.length)
      .split('/')
      .slice(2)
      .join('/')}`;

    console.log('makeAssetPermanent: ', oldPathname, ' -> ', newPathname);

    let params = url.search.replace(/s=[^&]+&?/, ''); // Same param set minus signature
    if (config.IMGIX_SECURE_TOKEN) {
      const imgClient = new ImgixClient({
        domain: config.IMGIX_DOMAIN,
        secureURLToken: config.IMGIX_SECURE_TOKEN,
      });

      params = imgClient._signParams(newPathname, params);
    }
    const newUrl = `https://${config.IMGIX_DOMAIN}${newPathname}${params}`;

    // if (await s3.fileExists(`${config.ASSETS_S3_BUCKET}${oldPathname}`)) {
    //   await s3.renameFile(
    //     `${config.ASSETS_S3_BUCKET}${oldPathname}`,
    //     `${config.ASSETS_S3_BUCKET}${newPathname}`
    //   );
    // }

    const draftAsset = await this.findOne({ url: draftUrl });
    const newAsset = await this.create({ ...draftAsset, url: newUrl });
    await this.save(newAsset);

    if (draftAsset) {
      await this.remove(draftAsset);
    } else {
      console.error(`ERROR: Asset with url ${draftAsset} not found in asset table.`);
    }

    // TODO: Increment on webinar dup
    await this.decrement({ url: origUrl }, 'useCount', 1);

    return newUrl;
  }
}
