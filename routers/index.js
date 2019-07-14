const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbconfig = require('../database.js');
const conn = mysql.createConnection(dbconfig);

router.get('/', function (req, res) {
    if (!req.session.authId) {
    res.render("login", { title: "로그인페이지" });
    }else{
        res.redirect("/users");
    }
});
router.post('/login', function (req, res) {
    var user_name = req.body.user_name;
    const password = req.body.password;
    const sql = "select * from `user` where user_name =?";

    conn.query(sql, [user_name], function (err, result) {
        if (err) { console.log("select sql error"); }
        else {
            var user = result[0];
            if (!user) {
                res.send({ result: 'noid' });
            } else if (password == user.password) {
                req.session.authId = user_name;
                req.session.save(function () {
                    res.send({ result: 'good' })
                })
            } else {
                res.send({ result: 'error' });
            }
        }
    })
})

router.get('/logout', function (req, res, next) {
    delete req.session.authId;
    res.redirect('/');
})

router.post('/kakao_signup', function (req, res, next) {
    var user_name = req.body.user_name;
    var password = req.body.password;
    var insertq = 'insert into user (`user_name`, `password`) values(?,?);'
    console.log("kakao)signup_post")
    conn.query(insertq, [user_name, password], function (error, result) {
        if (error) {
        } else {
            req.session.authId = user_name;
            req.session.save(function () {
                res.send({ result: 'kakao' });
            })
        }
    })
})

router.get('/signup', function (req, res) {
    res.render("signup", { title: "회원가입페이지" });
});

router.post('/signup', function (req, res, next) {
    var user_name = req.body.user_name;
    var password = req.body.password;
    var selectq = 'select * from user where user_name = ?'
    var insertq = 'insert into user (`user_name`, `password`) values(?,?);'

    conn.query(selectq, [user_name], function (error, result) {
        if (error) {
            console.log(error);
        } else if (result.length) {
            res.render('signup', {
                input: 'nonono already id'
            });
        } else {
            conn.query(insertq, [user_name, password], function (error, result) {
                if (error) {
                    console.log(error);
                } else {
                    req.session.authId = user_name;
                    req.session.save(function () {
                        res.redirect('/users');
                    })
                }
            })
        }
    })
})

router.post('/naver_signup', function (req, res, next) {
    var user_name = req.body.user_name;
    var password = req.body.password;
    var insertq = 'insert into user (`user_name`, `password`) values(?,?);'

    conn.query(insertq, [user_name, password], function (error, result) {
        if (error) {
        } else {
            req.session.authId = user_name;
            req.session.save(function () {
                res.send({ result: 'good2' });
            })
        }
    })
})

router.get('/naver', function (req, res) {
    res.render("naver", { title: "naver" });
});

router.get('/navercallback', function (req, res) {
    res.render("navercallback", { title: "navercallback" });
});

module.exports = router;