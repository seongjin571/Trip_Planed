const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbconfig = require('../database.js');
const conn = mysql.createConnection(dbconfig);

router.get('/', function (req, res) {
    if (req.session.authId) {
        res.render("main", { id: req.session.authId });
    } else {
        res.redirect('/');
    }
});

router.get('/mypage', function (req, res) {
    if (req.session.authId) {
        const sql = "select plan_id, plan_title, DATE_FORMAT(start_day, '%Y년 %c월 %d일') AS start_day, DATE_FORMAT(finish_day, '%Y년 %c월 %d일') AS finish_day, good, total_day, big_city, small_city from one_plan where member_id= ?;";
        conn.query(sql, [req.session.authId], function (err, result) {
            if (err) {
                res.send({ result: "fail" });
            } else {
                console.log(result);
                res.render('mypage', { result: result });
            }
        })
    } else {
        res.redirect('/');
    }
});

router.get('/plan', function (req, res) {
    if (req.session.authId) {
        res.render('plan', { title: "plan" });
    } else {
        res.redirect('/');
    }
});

router.get('/shareplan',function(req, res, next){
    if (req.session.authId) {
        res.render('share', { login_user: req.session.authId });
    } else {
        res.redirect('login');
    }
})

router.post('/makeplan', function (req, res) {
    if (req.session.authId) {
        const id = req.session.authId;
        const dayArr = getDay(req.body.start_day, req.body.finish_day, req.body.total_day);
        res.render("plan", { result: req.body, dayArr: dayArr, id: id })
    } else {
        res.redirect('/');
    }
})

function getDay(start_day, finish_day, total_day) {
    var arr1 = start_day.split('-');
    var arr2 = finish_day.split('-');

    var dat1 = new Date(arr1[0], arr1[1], arr1[2]);
    var dat2 = new Date(arr2[0], arr2[1], arr2[2]);
    var month = parseInt(dat1.getMonth());
    var day = parseInt(dat1.getDate());

    var result = [];
    for (i = 0; i < total_day; i++) {
        if (i == 0) {
            result[i] = month + "월" + day + "일";
            console.log(result[i])
            day = day + 1;
        }
        else {
            if ((month == 1) || (month == 3) || (month == 5) || (month == 7) || (month == 8) || (month == 10) || (month == 12)) {
                if (day > 31) {
                    month = month + 1;
                    day = day - 31;
                    result[i] = month + "월" + day + "일";
                    console.log(result[i])
                    day = day + 1;
                }
                else {
                    result[i] = month + "월" + day + "일";
                    day = day + 1;
                }
            }
            else if (month == 2) {
                if (day > 28) {
                    month = month + 1;
                    day = day - 28;
                    result[i] = month + "-" + day;
                    day = day + 1;
                }
                else {
                    result[i] = month + "-" + day;
                    day = day + 1;
                }
            }
            else {
                if (day > 30) {
                    month = month + 1;
                    day = day - 30;
                    result[i] = month + "월" + day + "일";
                    day = day + 1;
                }
                else {
                    result[i] = month + "월" + day + "일";
                    day = day + 1;
                }
            }
        }

    }
    return result;
}

module.exports = router;