const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbconfig = require('../database.js');
const conn = mysql.createConnection(dbconfig);

router.post('/addPlan', function (req, res) {
    if (req.session.authId) {
        const allPlan = JSON.parse(Object.keys(req.body));
        const planTitle = allPlan[0].plan_title;
        const totalDay = allPlan[0].total_day;
        const memberId = allPlan[0].member_id;
        const bigCity = allPlan[0].big_city;
        const smallCity = allPlan[0].small_city;
        const startDay = allPlan[0].start_day;
        const finishDay = allPlan[0].finish_day;
        const onePlanSql = "insert into one_plan (plan_title, member_id, start_day, finish_day, big_city, small_city, total_day) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const params = [planTitle, memberId, startDay, finishDay, bigCity, smallCity, totalDay];
        const detailPlan = [];
        let planId = 0;
        conn.query(onePlanSql, params, function (err, result) {
            if (err) throw err;
            else {
                planId = result.insertId;
                allPlan.forEach(function (e, index) {
                    detailPlan[index] = [planId, e.day, e.start_time, e.finish_time, e.plan_content, e.tour_flag, new Date()];
                })
                const detailPlanSql = "insert into detail_plan (plan_id, day, start_time, finish_time, plan_content, tour_flag, insert_date) VALUES ?";
                conn.query(detailPlanSql, [detailPlan], function (err, result) {
                    if (err) {
                        res.send({ result: "fail" });
                    }
                    else {
                        res.send({ result: "success" });
                    }
                });
            }
        });
    }
    else {
        res.redirect('/');
    }
})

router.get('/getPlan', function (req, res) {
    const sql = "select day, DATE_FORMAT(start_time, '%k시 %i분') AS start_time, DATE_FORMAT(finish_time, '%k시 %i분') AS finish_time, plan_content, tour_flag from detail_plan where plan_id = ? order by start_time";
    conn.query(sql, req.query.planId, function (err, result) {
        if (err) {
            throw err;
        } else {
            res.send({ result: result });
        }
    })
})

router.get('/getAllLocation', function(req, res, next){
    const userId = req.session.authId;
    const planCount = req.query.count;
    const orderStandard = req.query.order;
    let length = 0;
    let goodPlanId = [];
    const goodSql = "select plan_id from like_table where user_name = ?";
    conn.query(goodSql, userId, function (err, result) {
        if (err) {
            throw err;
        } else {
            for(let i = 0; i < result.length; i++){
                goodPlanId[i] = result[i].plan_id;
            }
        }
    })
    const sqlLength = "select count(*) AS length from one_plan";
    conn.query(sqlLength, function (err, result) {
        if (err) {
            throw err;
        } else {
            length = result;
        }
    })
    const sql = "select plan_id, plan_title, DATE_FORMAT(start_day, '%Y년 %c월 %d일') AS start_day, DATE_FORMAT(finish_day, '%Y년 %c월 %d일') AS finish_day, good, total_day, big_city, small_city from one_plan order by " + orderStandard + " desc limit " + planCount +",6";
    conn.query(sql, function (err, result) {
        if (err) {
            throw err;
        } else {
            res.send({ result: result, length: length, goodPlanId : goodPlanId });
        }
    })
})

router.get('/getOneLocation',function(req, res, next){
    const userId = req.session.authId;
    const smallCity = req.query.smallCity;
    const orderStandard = req.query.order;
    const planCount = req.query.count;
    let length = 0;
    let goodPlanId = [];
    const goodSql = "select plan_id from like_table where user_name = ?";
    conn.query(goodSql, userId, function (err, result) {
        if (err) {
            throw err;
        } else {
            for(let i = 0; i < result.length; i++){
                goodPlanId[i] = result[i].plan_id;
            }
        }
    })
    const sqlLength = "select count(*) AS length from one_plan where small_city= ?";
    conn.query(sqlLength, smallCity, function (err, result) {
        if (err) {
            throw err;
        } else {
            length = result;
        }
    })
    const sql = "select plan_id, plan_title, DATE_FORMAT(start_day, '%Y년 %c월 %d일') AS start_day, DATE_FORMAT(finish_day, '%Y년 %c월 %d일') AS finish_day, good, total_day, big_city, small_city from one_plan where small_city= ? order by " + orderStandard + " desc limit " + planCount +",6";
    conn.query(sql, smallCity, function (err, result) {
        if (err) {
            throw err;
        } else {
            res.send({ result: result, length: length, goodPlanId: goodPlanId });
        }
    })
})

router.post('/like_table', function (req, res) {
    var user_name = req.body.user_name;
    var plan_id = req.body.plan_Id;
    console.log(plan_id);
    const sql = "select * from `like_table` where user_name =? and plan_id = ?";

    conn.query(sql, [user_name,plan_id], function (err, result) {
        if (err) { console.log("select sql error"); }
        else {
            var flag = result[0];//결과 
            console.log(flag)
            if (!flag) {//좋아요 누름
                console.log('좋아요누름 들어옴')
                var insertq = 'insert into like_table (`user_name`, `plan_id`) values(?,?);' //like_table에 항목 추가 (눌럿다는것을 표기)
                conn.query(insertq,[user_name, plan_id],function(err,result1){
                    if(err){
                        console.log(err);
                    }else{
                        var increase_good = 'update one_plan set good = good + 1 where plan_id = ?;';//good증가
                        conn.query(increase_good,[plan_id],function(err,result3){
                            if(err){ console.log('hgvhbjk');}
                            else{
                                res.send({ result: 'count1', result1 : result1, result3 : result3 });
                            }
                        })
                        
                    }
                })
            } else {//좋아요 취소함
                 var decrease_good = 'update one_plan set good = good - 1 where plan_id = ?;';
                 var delete_like_table = 'DELETE FROM like_table WHERE user_name = ? and plan_id = ?;'
                 conn.query(decrease_good,[plan_id],function(err,result4){
                     if(err){
                        console.log('좋아요취소함 에러')
                     }else{
                         conn.query(delete_like_table,[user_name, plan_id],function(err,result5){
                            if(err){
                                console.log('좋아요아래 에러');
                            }else{
                                res.send({ result5 : result5});
                            }
                         })
                        
                     }
                 })
            }
        }
    })
})
module.exports = router;