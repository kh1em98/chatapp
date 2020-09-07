const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require('../models/User');
const {
    issueJwt
} = require("../lib/utils");
const {
    authenticate
} = require("../middlewares/auth");

const {
    commonEmitter
} = require('../config/emitter');

// Khởi tạo biến cấu hình cho việc lưu trữ file upload
const diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        // Định nghĩa nơi file upload sẽ được lưu lại
        callback(null, "/users/84933/desktop/chat app/client/src/assets/imgs");
    },
    filename: (req, file, callback) => {
        // ở đây các bạn có thể làm bất kỳ điều gì với cái file nhé.
        // Mình ví dụ chỉ cho phép tải lên các loại ảnh png & jpg
        const match = ["image/png", "image/jpeg"];
        if (match.indexOf(file.mimetype) === -1) {
            const errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
            return callback(errorMess, null);
        }
        let extensionFile;
        if (file.mimetype === "image/png") {
            extensionFile = "png";
        } else {
            extensionFile = "jpg";
        }

        // Tên của file thì mình nối thêm một cái nhãn thời gian để đảm bảo không bị trùng.
        const filename = `${Date.now()}.${extensionFile}`;
        callback(null, filename);
    }
});

// Khởi tạo middleware uploadFile với cấu hình như ở trên,
// Bên trong hàm .single() truyền vào name của thẻ input, ở đây là "file"
let uploadFile = multer({
    storage: diskStorage
}).single("avatar");

// Route này Xử lý khi client thực hiện hành động upload file
router.post("/", authenticate, async (req, res) => {
    // Thực hiện upload file, truyền vào 2 biến req và res

    // Không sử dụng multer nữa, sử dụng imgur api
    /*  uploadFile(req, res, async (error) => {
         if (error) {
             res.json({
                 isError: true,
                 err: "Lỗi xử lý file upload"
             });
         } else {
             try {
                 req.decoded.avatar = `${req.file.filename}`;
                 issueJwt(req.decoded, res);
                 await User.findByIdAndUpdate(req.decoded._id, {
                     $set: {
                         avatar: req.decoded.avatar
                     }
                 })
                 commonEmitter.emit('coNguoiThayAvatar', ({
                     _id: req.decoded._id,
                     avatar: req.decoded.avatar
                 }))
                 res.json({
                     isError: false
                 })
             } catch (error) {
                 res.json({
                     isError: true,
                     err: error
                 })
             }
         }
     }) */

    const {
        _id,
        avatar
    } = req.body;
    req.decoded.avatar = avatar;
    issueJwt(req.decoded, res);
    await User.findByIdAndUpdate(_id, {
        $set: {
            avatar
        }
    })
    commonEmitter.emit('coNguoiThayAvatar', ({
        _id: req.decoded._id,
        avatar: req.decoded.avatar
    }))
    res.json({
        isError: false
    })


})

module.exports = router;