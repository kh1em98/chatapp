const express = require('express');
const router = express.Router();
const {
    authenticate
} = require("../middlewares/auth");
const Message = require("../models/Message");

router.post('/get', authenticate, async (req, res) => {
    if (req.decoded._id !== req.body.myId) {
        res.json({
            isError: true,
            err: 'Hackerman cut'
        })
    } else {
        let conversationMessages = await Message.find({
            $or: [{
                $and: [{
                    'idSend': req.body.myId
                }, {
                    'idRecv': req.body.chatPartnerId
                }]
            }, {
                $and: [{
                    'idSend': req.body.chatPartnerId
                }, {
                    'idRecv': req.body.myId
                }]
            }]
        })

        conversationMessages = JSON.parse(JSON.stringify(conversationMessages));

        res.json(conversationMessages);
    }
})

router.post('/getOne', authenticate, async (req, res) => {
    if (req.decoded._id !== req.body.myId) {
        res.json({
            isError: true,
            err: 'Hackerman cut'
        })
    } else {
        let conversationMessages = await Message.findOne({
            $or: [{
                $and: [{
                    'idSend': req.body.myId
                }, {
                    'idRecv': req.body.chatPartnerId
                }]
            }, {
                $and: [{
                    'idSend': req.body.chatPartnerId
                }, {
                    'idRecv': req.body.myId
                }]
            }]
        }, {
            idSend: 1,
            content: 1,
            unseen: 1
        }, {
            sort: {
                'created': -1
            }
        })

        conversationMessages = JSON.parse(JSON.stringify(conversationMessages));

        res.json(conversationMessages);
    }
})

router.post('/post', authenticate, async (req, res) => {
    if (req.decoded._id !== req.body.idSend) {
        res.json({
            isError: true,
            err: 'Hackerman cut'
        })
    }
    const newMessage = new Message({
        idSend: req.body.idSend,
        idRecv: req.body.idRecv,
        content: req.body.content
    })
    await newMessage.save();

    res.json({
        _id: newMessage._id
    });
})

router.post('/unseen', authenticate, async (req, res) => {
    const id = req.body._id;
    await Message.updateOne({
        _id: id
    }, {
        $set: {
            unseen: false
        }
    });
})


module.exports = router;