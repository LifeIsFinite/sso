var express = require('express');
var router = express.Router();

/* GET test listing. */
router.get('/', function(req, res, next) {
    var msg;
    req.session.user?msg='已登录':msg='未登录';
    var result = {
        title: '单点登录-Demo',
        ip: req.host,
        msg: msg
    };
    res.render('SSOTest', result);
});

router.get('/login', function(req, res, next) {
    var url = require('url');
    var params = url.parse(req.url, true).query;
    var oldUrl = 'http://'+req.headers.host+req.originalUrl;
    // 获取token
    var token = params.token;
    // 如果token存在则验证token是否合法
    if(token) {
        if(valiToken(token)) {
            req.session.user = {'signed': true};
        }
    }
    res.redirect('http://180.76.151.88:8080/login?oldUrl='+oldUrl);
});

router.get('/logout', function(req, res, next) {
    var oldUrl = 'http://'+req.headers.host+req.originalUrl;
    res.redirect('http://180.76.151.88:8080/logout?oldUrl='+oldUrl);
});

function valiToken(token) {
    var request = require("request");
    var options = { method: 'POST',
        url: 'http://180.76.151.88:8080/valiTolen',
        qs: { token: token },
        headers:
            { 'content-type': 'application/x-www-form-urlencoded' } };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
        return body.status;
    });
}

module.exports = router;
