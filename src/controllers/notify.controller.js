const Notify = require('../models/Notify')
const admin = require("firebase-admin");
const serviceAccount = require("../../android-push-notificatio-37fc5-firebase-adminsdk-wda2w-fca197ecd8.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const getNotify = async (req, res, next) => {
    const notyfies = await Notify.find({
        user: req.user._id
    }).sort({ createdAt: -1 })

    setTimeout(() => {
        return res.status(200).json([...notyfies])
    }, 1000)
}

const index = async (req, res, next) => {
    const tokenDevice = 'cmVftXcQT5KvRRsqGML3ph:APA91bGeQ1TkWS4syeNPLGPS243FnqCbgt4K_Hmi0dZNQ0BavW5rP334nyndIFdVxFaQHqouUG0bYWOHmBIk_VWDl4zZIv57RNLPMvt0monFTK4LVGczXFNwzuP7KzN3unkMpEv3D-mZ'
    const tokenDevices = [
        'ec2Wl6GeTLWgQU3GbuCXfr:APA91bGPH9Yxwu2ALamUoKMyD1fPxD9EZ5bGB1iURCXn2iGaaBXYNPOHW0BVYfBDR5Xk-gxKWYGrV_rfspF4jBZS2C3JsoMGY4oZlVvqzpZhEeqh3EYCgw2jVc2mUC152tfEDMxJGRPY',
        // 'eYlE3KejR-SvMeZwjNJc0R:APA91bEIt2potjqNcz-rOB6i-YV4L2hYSIF-mTyypdxnkZhMeN2eqn70mHMdz3fn7QjIpNH05sCESEr1uIau0AWhKIQ2-BVaqDFwnl1ZP7CNB2ra8FvlU58t1RAVPK1g5aYGnA6cUa7Z',
        'fLoj0RiLRketc9pjfXiAIU:APA91bEiFo8IvUJzPSzTL-C_6KZqfhfqpcMAOJnmd3_brIHPfygTdCE2I6-HqssOy6lnXGm9EJeyHKXQK44sWa9y-6qwz-wB4SAGiEKRieAf6yjTTtuhx84B5crlti26LO2RQoPowvr_'
    ]
    
    const message = {
        notification: {
            title: 'Server send notification',
            body: 'Quyet gui.'
        },
        data: {
          _id: '123456',
          name: 'Quyet'
        },
        token: tokenDevice
    }

    // let android = {
    //     priority: "High", //mức độ ưu tiên khi push notification
    //     data: {
    //       title: 'Server send',
    //       body: 'Quyet'
    //     }
    // }
    
    // let message = {
    //     android: android,
    //     token: tokenDevice // token của thiết bị muốn push notification
    // }

    const msg = await admin.messaging().send(message)

    return res.status(200).json({
        msg
    })
}

const sendtoUser = async (tokenDevice, data) => {

    const message = {
        notification: {
            title: data.title,
            body: data.body
        },
        tokens: tokenDevice
    }

    const msg = await admin.messaging().sendMulticast(message)

    return msg
}

module.exports = {
    getNotify,
    index,
    sendtoUser
}