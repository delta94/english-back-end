import multer from 'multer';
import path from 'path';
import cors from 'cors';
import express from 'express';
import { getCustomRepository } from 'typeorm';
import { AssetRepository } from '../modules/assets/AssetRepository';
import { AssetInput } from '../modules/assets/entities/Asset';
const fileTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'video/mp4', 'audio/mpeg'];
const ImgRouter = express.Router();
const storage = multer.diskStorage({
    destination: (req, _file, cb) => {
        console.log('qaaa',req.body)
        cb(null, './public/uploads/image');
    },
    filename: (_req, file, cb) => {
        cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
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
        fileSize: 1024 * 1024 * 5
    },
    fileFilter,
});

ImgRouter.route("/media").post(upload.single('file'), cors(), async (req, res, next) => {
    console.log('req.body', req.file);
    const assetRepository = getCustomRepository(AssetRepository);
    const assetInput: AssetInput = {
        name: req.body.name,
        type: req.body.type,
        typeFolder: req.body.typeFolder,
    };
    const asset = await assetRepository.createUploadUrl(assetInput);
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

