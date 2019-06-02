const pool = require('../pool.js');
const express = require('express');
const router = express.Router()
router.get("/scroll", (req, res) => {
    var sql = "select  price,offer,src from scroll where lid=1 "
    pool.query(sql, (err, result) => {
        if (err) throw err
        if (result.length > 0) {
            res.send({ code: 1, reg: result })
        }
    })
})
router.get("/nav", (req, res) => {
    var list = [{ name: "推荐" }, { name: "手机" }, { name: "电脑" }, { name: "充值" }, { name: "智能数码" }, { name: "旅游/票务" }, { name: "运动" }, { name: "户外" },
    { name: "名表" }, { name: "美妆" }, { name: "时尚鞋服" }, { name: "家电" },
    { name: "珠宝首饰" }, { name: "分期购车" }, { name: "箱包奢品" }, { name: "乐器" }, { name: "食品保健" }, { name: "礼品" }, { name: "教育" }, { name: "优选平台" }]
    res.send(list)
})
router.get("/rec", (req, res) => {
    var obj = {}
    var list = parseInt(req.query.list)
    if (list == 1) {
        var sql = "select logo,src from com where nid=1 and zid=1"
        pool.query(sql, (err, result) => {
            if (err) throw err
            if (result.length > 0) {
                obj.a1 = result
                var sql = "select logo,src from com where nid=1 and zid=2"
                pool.query(sql, (err, result) => {
                    if (err) throw err
                    if (result.length > 0) {
                        obj.a2 = result
                        var sql = "select logo,src from com where nid=1 and zid=3"
                        pool.query(sql, (err, result) => {
                            if (err) throw err
                            if (result.length > 0) {
                                obj.a3 = result
                                res.send(obj)
                            }
                        })
                    }
                })
            }
        })
    } else if (list == 2) {
        var sql = "select logo,src from com where nid=2 and zid=1"
        pool.query(sql, (err, result) => {
            if (err) throw err
            if (result.length > 0) {
                obj.a1 = result
                res.send(obj)
            }
        })
    } else if (list == 3) {
        var sql = "select logo,src from com where nid=3 and zid=1"
        pool.query(sql, (err, result) => {
            if (err) throw err
            if (result.length > 0) {
                obj.a1 = result
                var sql = "select logo,src from com where nid=3 and zid=2"
                pool.query(sql, (err, result) => {
                    if (err) throw err
                    if (result.length > 0) {
                        obj.a2 = result
                        var sql = "select logo,src from com where nid=3 and zid=3"
                        pool.query(sql, (err, result) => {
                            if (err) throw err
                            if (result.length > 0) {
                                obj.a3 = result
                                res.send(obj)
                            }
                        })
                    }
                })
            }
        })
    } else if (list == 4) {
        var sql = "select logo,src from com where nid=4 and zid=1"
        pool.query(sql, (err, result) => {
            if (err) throw err
            if (result.length > 0) {
                obj.a1 = result
                res.send(obj)
            }
        })
    } else if (list == 5) {
        var sql = "select src,title,pro from hot "
        pool.query(sql, (err, result) => {
            if (err) throw err
            if (result.length > 0) {
                obj.a1 = result
                res.send(obj)
            }
        })
    } else if (list == 6) {
        var sql = "select src,title,pro,ass,num from rank "
        pool.query(sql, (err, result) => {
            if (err) throw err
            if (result.length > 0) {
                obj.a1 = result
                res.send(obj)
            }
        })
    } else if (list == 7) {
        var sql = [{ n: 2, title: "优惠卷" }, { n: 1, title: "收藏" }]
        res.send(sql)
    } else if (list == 8) {
        var sql = [{ src: "http://mall.m.fenqile.com/res/img/app/wallet_index/i_cart.png", title: "我的购物车", hid: "" },
        { src: "http://cres.fenqile.cn/mobile/img/app/wallet_index/invite_ico.png", title: "邀好友得返现", hid: "瓜分200万现金" },
        { src: "http://cc.m.fenqile.com/res/img/v1/card/card-icon.png", title: "我的银行卡", hid: "" },
        { src: "http://m.mall.fenqile.com/res/img/app/wallet_index/i_sub.png", title: "我的预约", hid: "" },
        { src: "http://m.mall.fenqile.com/res/img/app/wallet_index/i_safe.png", title: "安全中心", hid: "" },
        { src: "http://help.fenqile.com/res/img/m/help/i_help_service--0ec6e096ce.png", title: "客服支持", hid: "" }]
        res.send(sql)
    } else if (list == 9) {
        var sql = [{ src: "https://cimgs1.fenqile.com/product2/M00/20/6A/oWgGAFfQfkOASuMEAABJBXBCaCs145_180x180.jpg", title: "Apple iPhone 7 国行正品 4G智能手机", pro: "月供：¥137.28x36" },
        { src: "https://cimgs1.fenqile.com/product3/M00/6E/02/RrQHAFu8bxqAFlSZAAJ220bpUAE144_180x180.png", title: "腾讯Q币", pro: "月供：¥4.53x36" },
        { src: "https://cimgs1.fenqile.com/product/M00/26/38/hBoGAFhSLluAGDdqAABG-7kPpeU548_180x180.jpg", title: "New Balance 574系列三原色 男女复古鞋跑步鞋ML574VG /VB /VN", pro: "月供：¥18.16x36 " },
        { src: "https://cimgs1.fenqile.com/product/M00/23/3E/hRoGAFhCdsWAL2BOAAVsLa3Ty4M830_180x180.jpg", title: "NIKE耐克男鞋男子运动休闲板鞋减震休闲跑步鞋 844838HC", pro: "月供：¥24.78x36" },
        { src: "https://cimgs1.fenqile.com/product/M00/1C/76/hBoGAFg7ozKAHdUYAADynv7Nruc293_180x180.jpg", title: "vivo X9 | X9Plus  全网通智能4G手机", pro: "月供：¥97x36" },
        { src: "https://cimgs1.fenqile.com/product/M00/AD/8C/hhoGAFkL792AKR85AAC3t-uxYhY243_180x180.jpg", title: "DNF地下城与勇士", pro: "月供：¥13.58x36" },
        { src: "https://cimgs1.fenqile.com/product2/M00/0D/3D/oWgGAFdyWeeARXhHAACdehYXR88278_180x180.jpg", title: "OPPO R9丨R9 Plus 全网通4G+手机 双卡双待", pro: "月供：¥72.77x36" },
        { src: "https://cimgs1.fenqile.com/product/M00/B9/40/hRoGAFkUUjyAIiUUAAGPnEPgLEA696_180x180.png", title: "英雄联盟LOL", pro: "月供：¥4.53x36" },
        { src: "https://cimgs1.fenqile.com/product/M00/0D/71/gxoGAFb532iACRk9AAHg1__Xfok307_180x180.jpg", title: "ADIDAS阿迪达斯三叶草新款经典情侣贝壳头 superstar限量款 C77124金标", pro: "月供：¥23.13x36" },
        { src: "https://cimgs1.fenqile.com/product/M00/1C/0B/gRoGAFcLlBeAIwPtAAEzubf91TY093_180x180.png", title: "雷蛇（Razer）BlackWidow Chroma 黑寡妇蜘蛛幻彩版 机械键盘", pro: "月供：¥34.64x36" },
        { src: "https://cimgs1.fenqile.com/product/M00/90/BA/hBoGAFj0kAWAOeQnAABGq-bBusM833_180x180.jpg", title: "【1年9折，2年免息且88折】QQ超级会员", pro: "月供：¥10.86x36" },
        { src: "https://cimgs1.fenqile.com/product/M00/41/9A/hhoGAFjKQxOAdh1RAABz9Bp03YM170_180x180.jpg", title: "【分小乐推荐】天梭(TISSOT)手表 力洛克系列机械男表", pro: "月供：¥113.74x36" },
        { src: "https://cimgs1.fenqile.com/product/M00/00/01/gRoGAFZ6lqSAffSRAAEhVMOulNU433_180x180.png", title: "iPad Air 2 平板电脑", pro: "月供：¥124.38x36" },
        { src: "https://cimgs1.fenqile.com/product2/M00/09/FA/o2gGAFdnw--AVW4XAABpsfFg4Ag061_180x180.png", title: "Apple ID充值（中国区）", pro: "月供：¥4.71x36" },
        { src: "https://static.fenqile.com/app/product/image/20150116_032315199e3025cdfd8b45_180x180.jpg", title: "Swarovski 施华洛世奇新款天鹅水晶项链", pro: "月供：¥20.41x36" },
        { src: "https://cimgs1.fenqile.com/product/M00/10/81/hBoGAFgXLa2AP6AyAACTlAzqZcY385_180x180.jpg", title: "呼吸SU:M37惊喜水分水乳7件套盒", pro: "月供：¥26.85x36" },
        { src: "https://cimgs1.fenqile.com/product2/M00/12/C1/omgGAFePaZaAD_4AAACrhjDG5c4843_180x180.jpg", title: "纪梵希Givenchy 高级定制小羊皮唇膏/口红", pro: "月供：¥12.33x36" },
        { src: "https://cimgs1.fenqile.com/product/M00/BD/CD/hBoGAFl-jjqAVTvpAAG63_fd6IQ159_180x180.jpg", title: "春雨（papa recipe）蜂蜜胶孕妇可用竹炭面膜（盒装10片装）", pro: "月供：¥6.58x36" }]
        res.send(sql)
    }else if(list==10){
        var sql=["京东E卡","苹果","OPPO K3","华为","运动卫衣","【限时96折】多玩Y币","小米","篮球鞋","预存话费","华为P30"]
        res.send(sql)
    }else if(list==11){
        var sql=["魅族手机","蓝光眼睛"]
        res.send(sql)
    }else if(list==12){
        var sql="select cid,src from car"
        pool.query(sql,(err,result)=>{
            if(err) throw err
            if(result.length>0){
                obj.a=result
                var sql="select cid,src,title,pro,logo from cars"
                pool.query(sql,(err,result)=>{
                    if(err) throw err
                    if(result.length>0){
                        obj.s=result
                        res.send(obj)
                    }
                })
            }
        })
    }else if(list==13){
        var sql="select pid,src from phone"
        pool.query(sql,(err,result)=>{
            if(err) throw err
            if(result.length>0){
                obj.a=result
                var sql="select pid,src,title,red1,red2,red3,pro,pros,date,dates,make from phones"
                pool.query(sql,(err,result)=>{
                    if(err) throw err
                    if(result.length>0){
                        obj.s=result
                        res.send(obj)
                    }
                })
            }
        })
    }else if(list ==14){
        var page=req.query.page
        var size=req.query.size
        if(!page){
            page=1
        }
        if(!size)(
            size=6
        )
            page=size*(page-1)
        var sql="select id,src,back,title,pro,pros,date,dates,red1,red2,red3 from ionic_scroll limit ?,?"
        pool.query(sql,[page,size],(err,result)=>{
            if(err) throw err
            if(result.length>0){
                res.send(result)
            }
        })
    }
})
router.get("/lapp", (req, res) => {
    var list = parseInt(req.query.list)
    if (list == 1) {
        var obj = [{ src: "https://cimg1.fenqile.com/ibanner2/M00/32/C1/jqgHAFw0WP-AWPq0AAAMrL94UTU551.png", title: "乐花借钱", pro: "超长账期还债灵活" }, { src: "https://cimg1.fenqile.com/ibanner/M00/02/C6/wScJAFnoZgWANPZZAAACltRJFpI667.png", title: "大额借款", pro: "超大额度最高20万" }, { src: "https://cimg1.fenqile.com/ibanner2/M00/32/98/jagHAFtpQjWAB65dAABAgKqfJnw289.png", title: "乐还债", pro: "还信用卡实惠靠谱" }, { src: "https://cimg1.fenqile.com/ibanner2/M00/33/A4/jagHAFw9fWeAGS0YAAACv0tXDTw656.png", title: "橘子借贷", pro: "到账快速分期灵活" }, { src: "https://cimg1.fenqile.com/ibanner2/M00/05/FB/j6gHAFy3B2uAbqGjAAAHtoELCqg014.png", title: "乐花卡", pro: "绑定微信分期消费" }]
    } else if (list == 2) {
        var obj = [{ name: "关注即可提额", title: "最高提额500元", pro: "3秒提额 不填资料  无需审核", btn: "立即提额", src: "" }, { name: "借贷", title: "乐豆兑现金", pro: "10乐豆等值1元现金", btn: "去赚钱", src: "" }, { name: "安全小贴士", title: "新手防骗宝典", pro: "账户诈骗5大类 勤加了解多防备", btn: "立即了解", src: "" }]
    } else if (list == 3) {
        var obj = [{ src: "//cimg1.fenqile.com/product3/M00/08/B9/RrQHAFr5MpSAElClAAAnvR1yHO4766.png", title: "乐卡还信用卡", pro: "最高可分36期" }, { src: "//cimg1.fenqile.com/product3/M00/08/B9/RrQHAFr5MqCARSonAAAsMXbYCeE496.png", title: "微信还信用卡", pro: "零手续费" }]
    } else {
        var obj = [{ err: "error" }]
    }

    res.send(obj)
})
router.get("/recphone", (req, res) => {
    var sql = "select logo,src from recommend limit 34,45"
    pool.query(sql, (err, result) => {
        if (err) throw err
        if (result.length > 0) {
            res.send(result)
        } else {
            res.send({ err: "error" })
        }
    })
})
router.get("/card", (req, res) => {
    var sql = "select logo,src from recommend limit 46,52"
    pool.query(sql, (err, result) => {
        if (err) throw err
        if (result.length > 0) {
            res.send(result)
        } else {
            res.send({ err: "error" })
        }
    })
})
router.get("/com", (req, res) => {
    var com = parseInt(req.query.com)
    if (com == 1) {
        var sql = "select logo,src from recommend limit 53,57"
    } else if (com == 2) {

    } else if (com == 3) {

    }
    if (com > 0 && com < 4) {
        pool.query(sql, (err, result) => {
            if (err) throw err
            if (result.length > 0) {
                res.send(result)
            } else {
                res.send({ err: "error" })
            }
        })
    } else {
        res.send({ err: "error" })
    }


})
module.exports = router