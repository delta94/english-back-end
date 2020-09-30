import multer from 'multer';
import path from 'path';
import cors from 'cors';
import express from 'express';
import { getCustomRepository } from 'typeorm';
import { AssetRepository } from '../modules/assets/AssetRepository';
import { AssetInput } from '../modules/assets/entities/Asset';
const fileTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'video/mp4', 'audio/mpeg'];
const ImgRouter = express.Router();
const time = new Date().getTime();
const corsOptions = {
    origin: ['http://localhost:3000', 'http://powper.vn'],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
  };
const storage = multer.diskStorage({
    destination: (_req, file, cb) => {
        const pathUpload = './public/uploads/' + file.mimetype.split('/')[0];
        cb(null, pathUpload);
    },
    filename: (_req, file, cb) => {
        cb(null, file.originalname + '-' + time + path.extname(file.originalname));
    }
});
const fileFilter = (_req: any, file: any, cb: any) => {
    if(fileTypes.includes(file.mimetype)){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
};
const upload = multer({ 
    storage,
    limits: {
        fileSize: 1024 * 1024 * 100
    },
    fileFilter,
});

ImgRouter.route("/media").post(upload.single('file'), cors(corsOptions), async (req, res, next) => {
    const assetRepository = getCustomRepository(AssetRepository);
    const assetInput: AssetInput = {
        name: req.body.name,
        type: req.body.type,
        typeFolder: req.body.typeFolder,
    };
    const file = req.file;
    const asset = await assetRepository.createUploadUrl(assetInput, time, path.extname(file.originalname));
    if(asset){
        res.status(200).json({
            success: true,
            data: asset,
        });
    }
    else{
        next();
    }
});

export default ImgRouter;

