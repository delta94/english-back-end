import AWS from './aws';
import {
  DeleteObjectRequest,
  CopyObjectRequest,
  GetObjectAclRequest,
  PutObjectRequest,
} from 'aws-sdk/clients/s3';
import config from '../config';
import request from 'request';

const s3AWS = new AWS.S3();

export class S3 {
  public async uploadDraftFile(filename: string, fileType?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: config.ASSETS_S3_BUCKET,
        Key: filename,
        ContentType: fileType,
        ACL: 'public-read',
      };

      s3AWS.getSignedUrl('putObject', params, (err, url) => {
        if (err) {
          console.error(`[S3 Error] Upload File: ${err}`);
          reject(err);
        } else {
          resolve(url);
        }
      });
    });
  }

  public async UploadFromUrlToS3(url: string, destPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      request(
        {
          url,
          encoding: null,
        },
        async (err: any, res: request.Response, body: any) => {
          if (err) {
            reject(err);
          }

          const params: PutObjectRequest = {
            Bucket: config.ASSETS_S3_BUCKET,
            Key: destPath,
            ContentType: res.headers['content-type'],
            ContentLength: res.headers['content-length']
              ? parseInt(res.headers['content-length'], 10)
              : undefined,
            Body: body,
            ACL: 'public-read',
          };

          await s3AWS.putObject(params).promise();
          resolve();
        }
      );
    });
  }

  public async copyFile(oldFilepath: string, newFilepath: string): Promise<void> {
    const parts = newFilepath.split('/');
    const newBucket = parts.shift()!;
    const newKey = parts.join('/');

    return new Promise((resolve, reject) => {
      const params: CopyObjectRequest = {
        CopySource: encodeURI(oldFilepath),
        Bucket: newBucket,
        Key: newKey,
        ACL: 'public-read',
      };

      s3AWS.copyObject(params, (err, _data) => {
        if (err) {
          console.error(`[S3 Error] Copy File: ${err}`);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public async deleteFile(filepath: string): Promise<void> {
    const parts = filepath.split('/');
    const bucket = parts.shift()!;
    const key = parts.join('/');

    return new Promise((resolve, reject) => {
      const params: DeleteObjectRequest = {
        Bucket: bucket,
        Key: key,
      };

      s3AWS.deleteObject(params, (err, _data) => {
        if (err) {
          console.error(`[S3 Error] Delete File: ${err}`);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public async renameFile(oldFilename: string, newFilename: string): Promise<void> {
    await this.copyFile(oldFilename, newFilename);
    await this.deleteFile(oldFilename);
  }

  public async fileExists(filepath: string): Promise<boolean> {
    const parts = filepath.split('/');
    const bucket = parts.shift()!;
    const key = parts.join('/');

    return new Promise((resolve, _reject) => {
      const params: GetObjectAclRequest = {
        Bucket: bucket,
        Key: key,
      };

      s3AWS.getObjectAcl(params, (err, _data) => {
        if (err) {
          console.error(`[S3 Error] Get Object [bucket: ${bucket} ${key}] ACL: ${err.message}`);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}

export const s3 = new S3();
