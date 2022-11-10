const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3_access_key = 'AKIASC22BURNU32LTPXV';
const key_secret = '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';
const s3_region = 'us-east-1';


const s3Config = new aws.S3({
    accessKeyId: s3_access_key,
    secretAccessKey: key_secret,
    region: s3_region
});

const uploadImage = multer({
    storage: multerS3({
        s3: s3Config,
        bucket: 'image-user',
        metadata: function (req, file, cb){
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb){
            cb(null, req.params.id + file.originalname);
        },
    })
}).single('image');


function deleteStates(name){
    s3Config.deleteObject({Bucket:'image-user', Key:name}, (err, arDelete) =>{
        if(err){
            console.log(err);
        }else{
            console.log(arDelete)
        }
    }) 
}

module.exports = {
    uploadImage,
    deleteStates
}