/* tslint:disable */

import { ObjectType, Field, InputType } from 'type-graphql';

@ObjectType()
@InputType('VideoFormatMetadataInput')
export class VideoFormatMetadata {
  @Field({ nullable: true })
  public asr?: number; // 48000,
  @Field({ nullable: true })
  public tbr?: number; // 49.409,
  @Field({ nullable: true })
  public container?: string; // 'mp4_dash'
  @Field()
  public protocol!: string; // 'https' | 'http_dash_segments'
  @Field()
  public format!: string; // '249 - audio only (tiny)',
  @Field({ nullable: true })
  public url?: string; // 'https://r5---sn-ni5f-t8gs.googlevideo.com/videoplayback?expire=1593479275&ei=Czz6XvaeEcWrkwaC3piYAw&ip=24.84.49.214&id=o-AFv9e3zUakHA-FPM1FVomzeaXzgwBrFljJfH8HoMYPTX&itag=249&source=youtube&requiressl=yes&mh=j7&mm=31%2C26&mn=sn-ni5f-t8gs%2Csn-vgqsrne6&ms=au%2Conr&mv=m&mvi=4&pl=22&initcwndbps=1951250&vprv=1&mime=audio%2Fwebm&gir=yes&clen=859467&dur=146.941&lmt=1576325741938469&mt=1593457595&fvip=5&keepalive=yes&c=WEB&txp=5531432&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRgIhAKcrXl24iRknz9LYLa-SqxV3nZJfwUZ9inXNGVInj5ZgAiEAxM8ng1Jc7QvJltN3bIW5c6NW2c4yzzIyyFvm0Eyfk7w%3D&sig=AOq0QJ8wRAIgQpkxF0xfSH3h37csTDxXxSkcaCDaNQB6z9qZc4Reo1YCIElS04ogip5XMemGzWsnfYMWFWjQG-qwbS0VOgWIVTKh&ratebypass=yes',
  @Field({ nullable: true })
  public manifest_url?: string;
  @Field({ nullable: true })
  public vcodec?: string; // 'none' | 'avc1.64001e' | 'avc1.4d4014'
  @Field({ nullable: true })
  public acodec?: string; //
  @Field({ nullable: true })
  public format_note?: string; // 'tiny',
  @Field({ nullable: true })
  public abr?: number; // 50,
  @Field(_type => Number, { nullable: true })
  public width?: number | null; // null
  @Field()
  public ext!: string; // 'webm',
  @Field({ nullable: true })
  public filesize?: number; // 859467,
  @Field(_type => Number, { nullable: true })
  public fps?: null | number; // 60 | null
  @Field(_type => Number, { nullable: true })
  public height?: null | number; // null,
}

export class FullVideoFormatMetadata {
  public asr!: number; // 48000,
  public tbr!: number; // 49.409,
  public container?: string; // 'mp4_dash'
  public protocol!: string; // 'https' | 'http_dash_segments'
  public format!: string; // '249 - audio only (tiny)',
  public url?: string; // 'https://r5---sn-ni5f-t8gs.googlevideo.com/videoplayback?expire=1593479275&ei=Czz6XvaeEcWrkwaC3piYAw&ip=24.84.49.214&id=o-AFv9e3zUakHA-FPM1FVomzeaXzgwBrFljJfH8HoMYPTX&itag=249&source=youtube&requiressl=yes&mh=j7&mm=31%2C26&mn=sn-ni5f-t8gs%2Csn-vgqsrne6&ms=au%2Conr&mv=m&mvi=4&pl=22&initcwndbps=1951250&vprv=1&mime=audio%2Fwebm&gir=yes&clen=859467&dur=146.941&lmt=1576325741938469&mt=1593457595&fvip=5&keepalive=yes&c=WEB&txp=5531432&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRgIhAKcrXl24iRknz9LYLa-SqxV3nZJfwUZ9inXNGVInj5ZgAiEAxM8ng1Jc7QvJltN3bIW5c6NW2c4yzzIyyFvm0Eyfk7w%3D&sig=AOq0QJ8wRAIgQpkxF0xfSH3h37csTDxXxSkcaCDaNQB6z9qZc4Reo1YCIElS04ogip5XMemGzWsnfYMWFWjQG-qwbS0VOgWIVTKh&ratebypass=yes',
  public manifest_url?: string;
  public acodec?: string; //
  public vcodec?: string; // 'none' | 'avc1.64001e' | 'avc1.4d4014'
  public format_note?: string; // 'tiny',
  public abr?: number; // 50,
  public player_url?: string; // '/s/player/68f00b39/player_ias.vflset/en_US/base.js',
  public width?: number | null; // null
  public ext!: string; // 'webm',
  public filesize?: number; // 859467,
  public fps?: null | number; // 60 | null
  public height?: null | number; // null,
  public http_headers?: any;
  public downloader_options?: any; // [Object],
}

export class ScrapedVideoMetadata {
  public extractor!: string; // 'youtube',
  public format!: string; // '22 - 1280x720 (720p)',
  public format_note!: string; // '720p',
  public height!: number; // 720,
  public like_count!: number; //  145952,
  public container?: string; // 'mp4_dash'
  public duration!: string; //  '2:27',
  public fulltitle?: string; //  '박재범 - 몸매 | BisMe Choreography',
  public player_url?: string; //  '/s/player/68f00b39/player_ias.vflset/en_US/base.js',
  public view_count!: number; // 8937048,
  public title!: string; //  '박재범 - 몸매 | BisMe Choreography',
  public _filename!: string; //  '박재범 - 몸매 _ BisMe Choreography-8HMzWwlIUXo.mp4',
  public creator!: string; //  '박재범 Jay Park',
  public ext!: string; //  'mp4',
  public id!: string; //  '8HMzWwlIUXo',
  public dislike_count!: number; // 2119,
  public average_rating!: number; // 4.9427571,
  public categories!: string[]; // ['Entertainment'],
  public description!: string; // '박재범(Jay park) - 몸매(Mommae) | BisMe Choreography | MOVE Dance Studio(분당무브댄스학원)\n\nChoreography | 화목(주2회) 20:20~21:40\n\nMOVE Dance Studio, Bundang, Korea.\nMusic : 박재범 - 몸매\n\n#choreography #박재범 #몸매 #BisMe\n\nmovedance@naver.com\nKakao ID : movedance\n\n무브댄스 홈페이지\nhttp://www.movedance.co.kr\n\n페이스북\nhttps://www.facebook.com/movedancekorea\n\n인스타그램\nhttps://www.instagram.com/movedanstagram',
  public tags!: string[]; // ['choreography', 'dance', '댄스', '무브댄스', '박재범', '몸매', 'BisMe'],
  public track?: string; // '몸매 Mommae (Feat. Ugly Duck)',
  public subtitles?: { [s: string]: string }; // {},
  public thumbnails!: Array<{
    url: string; // 'https://i.ytimg.com/vi/8HMzWwlIUXo/hqdefault.jpg?sqp=-oaymwEYCKgBEF5IVfKriqkDCwgBFQAAiEIYAXAB&rs=AOn4CLCZVaOEl3gVyNRAZFVv_lFvoo4leA',
    width: number; // 168,
    resolution: string; // '168x94',
    id: string; // '0',
    height: number; // 94,
  }>;
  public artist?: string; // '박재범 Jay Park',
  public url!: string; // 'https://r5---sn-ni5f-t8gs.googlevideo.com/videoplayback?expire=1593479275&ei=Czz6XvaeEcWrkwaC3piYAw&ip=24.84.49.214&id=o-AFv9e3zUakHA-FPM1FVomzeaXzgwBrFljJfH8HoMYPTX&itag=22&source=youtube&requiressl=yes&mh=j7&mm=31%2C26&mn=sn-ni5f-t8gs%2Csn-vgqsrne6&ms=au%2Conr&mv=m&mvi=4&pl=22&initcwndbps=1951250&vprv=1&mime=video%2Fmp4&ratebypass=yes&dur=146.982&lmt=1576328437478785&mt=1593457595&fvip=5&c=WEB&txp=5535432&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cratebypass%2Cdur%2Clmt&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIhAL9TANGULY1NeEIEvzMmVOenY7o1dT2ByOuL5cWHS6P7AiAGk0N121X4DEn1T7NUheKFlqvUKGF3LzDfGckkmTnDCQ%3D%3D&sig=AOq0QJ8wRAIgAs0z56S2zOZOjgTNrnFmgKcF-TKJIFSYcw37m1_e6ZMCICKqOSosBKolZ3HCZQGrYXViVIADq6AbvMKQzNkjeWTH',
  public age_limit!: number; // 0,
  public alt_title?: string; // '몸매 Mommae (Feat. Ugly Duck)',
  public thumbnail!: string | null; // 'https://i.ytimg.com/vi_webp/8HMzWwlIUXo/maxresdefault.webp',
  public is_live?: boolean; // null,
  public width!: number; // 1280,
  public webpage_url!: string; // 'https://www.youtube.com/watch?v=8HMzWwlIUXo',
  public formats!: Array<VideoFormatMetadata>;
  public channel_url!: string; // 'http://www.youtube.com/channel/UCO_HutTdw0PTxGPK7FG1fRA',
  public vcodec!: string; // 'avc1.64001F',
  public _duration_raw!: number; //  147,
  public _duration_hms!: string; //  '00:02:27',
}
