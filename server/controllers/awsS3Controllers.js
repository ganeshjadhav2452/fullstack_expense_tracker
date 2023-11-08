const { response } = require('express');
const Expense = require('../models/expenseModel')
const AWS = require('aws-sdk');


const uploadToS3 = async (data, fileName) => {
    const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
    const IAM_USER_KEY = process.env.AWS_IAM_USER_KEY;
    const IAM_USER_SECRETE = process.env.AWS_IAM_USER_SECRETE;

    let s3Bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRETE,

    })
    let params = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: data,
        ACL: "public-read"
    }


    return new Promise((resolve,reject)=>{
        s3Bucket.upload(params, (err, s3Response) => {
            if (err) {
                reject(err)

            } else{
                 resolve(s3Response.Location)
            }
        })
    })

}

module.exports = awsS3Controllers = {
    downloadExpenses: async (req, res) => {
        try {
            const expenses = await Expense.findAll({ where: { userId: req.userId } });
            const stringyfiedExpenses = JSON.stringify(expenses)
            const fileName = `expenses${req.userId}${new Date()}.txt`;
            const fileUrl = await uploadToS3(stringyfiedExpenses, fileName)
          
            res.status(200).json({ downloadUrl: fileUrl })
            
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'sorry something went wrong' })
        }
    }
}