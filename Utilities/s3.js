const { S3Client } = require('@aws-sdk/client-s3')
const express = require('express')
const multer = require('multer')
const multerS3 = require('multer-s3')
const s3 = new S3Client({
    region:process.env.REGION,
    credentials:{
        accessKeyId:process.env.ACCESS_KEY,
        secretAccessKey:process.env.SECRET_ACCESS_KEY
    }
})
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    metadata: function (req, file, cb) {
      console.log(file);
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, `image-${Date.now()}.jpeg`)
    }
  })
})

module.exports=upload
