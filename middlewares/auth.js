const jwt = require("jsonwebtoken");

module.exports = {
    authenticate: async (req, res, next) => {
        // Tránh CSRF
        if (req.headers["x-requested-with"] !== "XMLHttpRequest") {
            res.json({
                isError: true,
                err: 'authenticateFail'
            })
        } else {
            // Lấy full JWT từ 2 cookie
            const fullJwt = req.cookies.headerAndPayload + '.' + req.cookies.signature;
            try {
                req.decoded = await jwt.verify(fullJwt, process.env.SECRET_KEY);
                next();
            } catch (error) {
                res.json({
                    isError: true,
                    err: 'authenticateFail'
                })
            }
        }
    },
    verify: (req, res, next) => {
        if (!req.decoded.isVerified) {
            res.json({
                isError: true,
                err: "verifyFail"
            })
        } else {
            next();
        }
    },
    authenticateAndVerify: async (req, res, next) => {
        if (req.headers["x-requested-with"] !== "XMLHttpRequest") {
            res.json({
                isError: true
            })
        } else {
            const fullJwt = req.cookies.headerAndPayload + '.' + req.cookies.signature;
            try {
                req.decoded = await jwt.verify(fullJwt, process.env.SECRET_KEY);
                if (req.decoded.isVerified) {
                    next();
                } else {
                    res.json({
                        isError: true,
                        err: "verifyFail"
                    })
                }
            } catch (error) {
                res.json({
                    isError: true,
                    err: 'authenticateFail'
                })
            }
        }
    }
}