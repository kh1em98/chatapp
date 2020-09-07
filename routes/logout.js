const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    if (req.isAuthenticated()) {
        req.logout();
    }
    res.clearCookie('headerAndPayload');
    res.clearCookie('signature');
    res.clearCookie('connect.sid');
    res.json({
        isError: false
    });
})

module.exports = router;