const pool = require('../pool.js');
const express = require('express');
const router = express.Router()
router.get("/", (req, res) => {
    var uid = req.query.uid
    var sql = "select did from dynamic where uid=?"
    var obj = {}
    // type=1 是评论数与点赞数 2 自己发布的动态 3 别人发布的动态 4 别人对动态的评论
    pool.query(sql, [uid], (err, result) => {
        if (err) err
        if (result.length > 0) {
            var sql = "select u.head,u.name,v.time,v.title,v.play,v.vid,v.video,v.img,s.wuid,u.uid as wuid from sub s,video v,user u where s.wuid=v.uid and s.wuid=u.uid and s.uid=? and s.sub=1 and v.aud=1 and v.del=0 order by v.time desc"
            pool.query(sql, [uid], (err, result) => {
                if (err) throw err
                if (result.length > 0) {
                    obj.reg = result
                    var row = []
                    for (var v of result) {
                        row.push(v.vid)
                    }
                    var rows = []
                    for (var i = 0; i < row.length; i++) {
                        var sql = "SELECT count(cid) as c FROM comment WHERE vid=" + row[i]
                        pool.query(sql, (err, result) => {
                            if (err) throw err
                            if (result.length > 0) {
                                rows.push(result[0].c)
                            } else {
                                rows.push(0)
                            }
                            if (row.length == rows.length) {
                                for (var i = 0; i < rows.length; i++) {
                                    obj.reg[i].comment = rows[i]
                                }
                                var rowsl = []
                                for (var i = 0; i < row.length; i++) {
                                    var sql = "SELECT count(lid) as l FROM vidlike WHERE liked=1 and vid=" + row[i]
                                    pool.query(sql, (err, result) => {
                                        if (err) throw err
                                        if (result.length > 0) {
                                            rowsl.push(result[0].l)
                                        } else {
                                            rowsl.push(0)
                                        }
                                        if (rowsl.length == row.length) {
                                            for (var i = 0; i < rowsl.length; i++) {
                                                obj.reg[i].like = rowsl[i]
                                                obj.reg[i].type = 1
                                            }
                                            var sql = "select  d.utitle,d.did,d.dtime as time,u.head,u.name from dynamic d,user u where d.uid=u.uid and d.uid=? and d.del=0"
                                            pool.query(sql, [uid], (err, result) => {
                                                if (err) throw err
                                                if (result.length > 0) {
                                                    for (var r of result) {
                                                        r.type = 2
                                                        r.comment = "评论"
                                                        r.like = "点赞"
                                                        r.wuid = uid
                                                        obj.reg.push(r)
                                                    }
                                                    var sql = "select wuid from sub where uid=? and sub=1"
                                                    pool.query(sql, [uid], (err, result) => {
                                                        if (err) throw err
                                                        if (result.length > 0) {
                                                            var wuid = []
                                                            for (var r of result) {
                                                                wuid.push(r.wuid)
                                                            }
                                                            var wtitle = []
                                                            var wtitles = []
                                                            var wt=[]
                                                            for (var i = 0; i < wuid.length; i++) { 
                                                                var sql = `select u.name,u.head,d.dtime as time,d.utitle,d.uid as wuid,d.did from dynamic d,user u where d.uid=u.uid and d.uid=${wuid[i]} and d.del=0`
                                                                pool.query(sql, (err, result) => {
                                                                    if (err) throw err
                                                                    if (result.length > 0) {
                                                                        for(var r of result){
                                                                            wtitles.push(r)
                                                                        }
                                                                        wt.push(1)
                                                                        if (wt.length == wuid.length) {
                                                                            for (var d of wtitles) {
                                                                                wtitle.push(d)
                                                                            }
                                                                            for (var r of wtitle) {
                                                                                r.type = 3
                                                                                r.comment = "评论"
                                                                                r.like = "点赞"
                                                                                obj.reg.push(r)
                                                                            }
                                                                            var coms = []
                                                                            for (var c of obj.reg) {
                                                                                if (c.type == 2 || c.type==3) {
                                                                                    coms.push(c.did)
                                                                                }
                                                                            }
                                                                            var com = []
                                                                            var comk = []
                                                                            for (var i = 0; i < coms.length; i++) {
                                                                                var sql = "select m.uid as comuid,m.duid,m.dtitle,m.time,m.did as didc,u.name,u.uid as wuid from dycom m,user u where u.uid=m.uid and m.did=" + coms[i]
                                                                                pool.query(sql, (err, result) => {
                                                                                    if (err) throw err
                                                                                    comk.push(1)
                                                                                    if (result.length > 0) {
                                                                                        for(var r of result){
                                                                                            com.push(r)
                                                                                        }
                                                                                    }
                                                                                    if (comk.length == coms.length) {
                                                                                        if (com.length == 0) {
                                                                                            res.send({ code: 1, reg: obj })
                                                                                        } else {
                                                                                            for (var c of com) {
                                                                                                c.type = 4
                                                                                                obj.reg.push(c)
                                                                                            }
                                                                                            res.send({ code: 1, reg: obj })
                                                                                        }
                                                                                    }


                                                                                })
                                                                            }
                                                                            // res.send({code:1,reg:obj})
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        }
                                                    })
                                                } else {
                                                    //自己没分享任何信息，但是他可能关注别人
                                                    res.send({ code: 0, reg: obj, reg: "该用户无任何分享信息" })
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    }
                } else {
                    //该用户未订阅任何人 但它可能发了分享
                    var sql = "select d.utitle,d.did,d.dtime as time,u.head,u.name from dynamic d,user u where d.uid=u.uid and d.uid=? and d.del=0"
                    pool.query(sql, [uid], (err, result) => {
                        if (err) throw err
                        if (result.length > 0) {
                            obj.reg = result
                            for (var r of obj.reg) {
                                r.type = 2
                                r.comment = "评论"
                                r.like = "点赞"
                            }
                            res.send({ code: 1, reg: obj })
                        } else {
                            res.send({ code: 0, reg: obj, reg: "该用户无任何分享信息" })
                        }
                    })
                }
            })
        } else {
            // 自己没有发表动态
            var sql = "insert into dynamic (uid,dtime) values(?,now())"
            pool.query(sql, [uid], (err, result) => {
                if (err) throw err
                if (result.affectedRows > 0) {
                    var sql = "select u.head,u.name,v.time,v.title,v.play,v.vid,v.video,v.img,s.wuid from sub s,video v,user u where s.wuid=v.uid and s.wuid=u.uid and s.uid=? and s.sub=1 v.del=0 order by v.time desc"
                    pool.query(sql, [uid], (err, result) => {
                        if (err) throw err
                        if (result.length > 0) {
                            obj.reg = result
                            var row = []
                            for (var v of result) {
                                row.push(v.vid)
                            }
                            var rows = []
                            for (var i = 0; i < row.length; i++) {
                                var sql = "SELECT count(cid) as c FROM comment WHERE vid=" + row[i]
                                pool.query(sql, (err, result) => {
                                    if (err) throw err
                                    if (result.length > 0) {
                                        rows.push(result[0].c)
                                    } else {
                                        rows.push(0)
                                    }
                                    if (row.length == rows.length) {
                                        for (var i = 0; i < rows.length; i++) {
                                            obj.reg[i].comment = rows[i]
                                        }
                                        var rowsl = []
                                        for (var i = 0; i < row.length; i++) {
                                            var sql = "SELECT count(lid) as l FROM vidlike WHERE liked=1 and vid=" + row[i]
                                            pool.query(sql, (err, result) => {
                                                if (err) throw err
                                                if (result.length > 0) {
                                                    rowsl.push(result[0].l)
                                                } else {
                                                    rowsl.push(0)
                                                }
                                                if (rowsl.length == row.length) {
                                                    for (var i = 0; i < rowsl.length; i++) {
                                                        obj.reg[i].like = rowsl[i]
                                                        obj.reg[i].type = 1
                                                        obj.reg[i].type = ""
                                                    }
                                                    var sql = "select  d.utitle,d.did,d.dtime as time,u.head,u.name from dynamic d,user u where d.uid=u.uid and d.uid=? and d.del=0"
                                                    pool.query(sql, [uid], (err, result) => {
                                                        if (err) throw err
                                                        if (result.length > 0) {
                                                            for (var r of result) {
                                                                r.type = 2
                                                                r.comment = "评论"
                                                                r.like = "点赞"
                                                                obj.reg.push(r)
                                                            }
                                                            res.send({ code: 1, reg: obj })
                                                        } else {
                                                            res.send({ code: 1, reg: obj, reg: "该用户无任何分享信息" })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                } else {
                    res.send({ code: 0, reg: "创建失败" })
                }
            })
        }
    })
})
router.get("/dy", (req, res) => {
    var utitle = req.query.utitle
    var uid = req.query.uid
    var del = req.query.del
    var did = req.query.did
    if (!del) {
        var sql = "insert into dynamic (utitle,uid) values(?,?) "
        pool.query(sql, [utitle, uid], (err, result) => {
            if (err) throw err
            if (result.affectedRows > 0) {
                res.send({ code: 1, reg: "动态创建成功" })
            } else {
                res.send({ code: 0, reg: "动态创建失败" })
            }
        })
    } else {
        var sql = "update dynamic set del=1 where did=?"
        pool.query(sql, [did], (err, result) => {
            if (err) throw err
            if (result.affectedRows > 0) {
                res.send({ code: 1, reg: "修改成功" })
            } else {
                res.send({ code: 0, reg: "修改失败" })
            }
        })
    }
})
router.get("/comcon", (req, res) => {
    var uid = req.query.uid
    var likes = req.query.likes
    var obj = []
    if (!likes) {
        var sql = "select c.time,c.content,c.uid from user u,video v,comment c where u.uid=v.uid and v.vid=c.vid and u.uid=? order by v.time desc"
        pool.query(sql, [uid], (err, result) => {
            if (err) throw err
            if (result.length > 0) {
                obj = result
                var rows = []
                for (var r of result) {
                    rows.push(r.uid)
                }
                var row = []
                for (var i = 0; i < rows.length; i++) {
                    var sql = "select name,head from user where uid=" + rows[i]
                    pool.query(sql, (err, result) => {
                        if (err) throw err
                        if (result.length > 0) {
                            row.push(result[0])
                            if (row.length == rows.length) {
                                for (var i = 0; i < row.length; i++) {
                                    obj[i].name = (row[i].name)
                                    obj[i].head = (row[i].head)
                                }
                                res.send({ code: 1, reg: obj })
                            }
                        }
                    })
                }
            } else {
                res.send({ code: 0, reg: "无人回复" })
            }
        })
    } else {
        var sql = "select l.time,v.title,l.uid from user u,vidlike l,video v where u.uid=v.uid and v.vid=l.vid and l.liked=1 and u.uid=? and v.del=0"
        pool.query(sql, [uid], (err, result) => {
            if (err) throw err
            if (result.length > 0) {
                var obj = result
                var rows = []
                for (var r of result) {
                    rows.push(r.uid)
                }
                for (var i = 0; i < rows.length; i++) {
                    var sql = "select name from user where uid=" + rows[i]
                    var row = []
                    pool.query(sql, (err, result) => {
                        if (err) throw err
                        if (result.length > 0) {
                            row.push(result[0].name)
                            if (rows.length == row.length) {
                                for (var i = 0; i < row.length; i++) {
                                    obj[i].name = row[i]
                                }
                                res.send({ code: 1, reg: obj })
                            }
                        }
                    })
                }
            } else {
                res.send({ code: 0, reg: "当前未有用户点赞您的视频" })
            }
        })
    }
})
router.get("/adnum", (req, res) => {
    var hits = req.query.hits
    if (!hits) {
        var sql = "select count(vid) as v from video where del=0"
        var i = 0
        var obj = {}
        pool.query(sql, (err, result) => {
            if (err) throw err
            if (result.length > 0) {
                obj.video = result[0].v
            } else {
                obj.video = 0
            }
            i = i + 10
            if (i == 50) {
                res.send(obj)
            }
        })
        var sql1 = "select count(uid) as u from user"
        pool.query(sql1, (err, result) => {
            if (err) throw err
            if (result.length > 0) {
                obj.uid = result[0].u
            } else {
                obj.uid = 0
            }
            i = i + 10
            if (i == 50) {
                res.send(obj)
            }
        })
        var sql2 = "select play as v from video where del=0"
        pool.query(sql2, (err, result) => {
            if (err) throw err
            if (result.length > 0) {
                var num = 0
                for (var i = 0; i < result.length; i++) {
                    num = parseInt(result[i].v) + num
                }
                obj.play = num
                i = i + 10
                if (i == 50) {
                    res.send(obj)
                }
            }
        })
        var sql3 = "select count(cid) as c from comment"
        pool.query(sql3, (err, result) => {
            if (err) throw err
            if (result.length > 0) {
                obj.comment = result[0].c
            } else {
                obj.comment = 0
            }
            i = i + 10
            if (i == 50) {
                res.send(obj)
            }
        })
        var sql4 = "select hits as c from system"
        pool.query(sql4, (err, result) => {
            if (err) throw err
            if (result.length > 0) {
                obj.hits = result[0].c
            } else {
                obj.hits = 0
            }
            i = i + 10
            if (i == 50) {
                res.send(obj)
            }
        })
        var sql5 = "select count(aud) as a from video where aud=0 and record='' and del=0"
        pool.query(sql5, (err, result) => {
            if (err) throw err
            if (result.length > 0) {
                obj.aud = result[0].a
            } else {
                obj.aud = 0
            }
            i = i + 10
            if (i == 50) {
                res.send(obj)
            }
        })
    } else {
        var sql = "select hits from system "
        pool.query(sql, (err, result) => {
            if (err) throw err
            if (result.length > 0) {
                var hits = parseInt(result[0].hits)
                hits = hits + 1
                var sql = "update system set hits=? where sid=1"
                pool.query(sql, [hits], (err, result) => {
                    if (err) throw err
                    if (result.affectedRows > 0) {
                        res.send({ code: 1, reg: "刷新成功" })
                    }
                })
            } else {
                var hits = 0
                hits = hits + 1
                var sql = "update system set hits=? where sid=1"
                pool.query(sql, [hits], (err, result) => {
                    if (err) throw err
                    if (result.affectedRows > 0) {
                        res.send({ code: 1, reg: "刷新成功" })
                    }
                })
            }
        })
    }
})
router.get("/gvid", (req, res) => {
    var del = req.query.del
    var vid = req.query.vid
    if (!del) {
        var sql = "select uid,title,video,img,time,vid from video where del=0 order by time desc limit 0,12"
        var obj = []
        var row = []
        pool.query(sql, (err, result) => {
            if (err) throw err
            if (result.length > 0) {
                obj = result
                for (var r of result) {
                    row.push(r.uid)
                }
                for (var i = 0; i < row.length; i++) {
                    var sql = "select name from user where uid=" + row[i]
                    var rows = []
                    pool.query(sql, (err, result) => {
                        if (err) throw err
                        if (result.length > 0) {
                            rows.push(result[0].name)
                            if (row.length == rows.length) {
                                for (var i = 0; i < row.length; i++) {
                                    obj[i].name = rows[i]
                                }
                                res.send({ code: 1, reg: obj })
                            }
                        }
                    })
                }
            } else {
                res.send({ code: 0, reg: "目前系统无任何用户发布视频" })
            }
        })
    } else if (del) {
        var sql = "update video set del=1 where vid=?"
        pool.query(sql, [vid], (err, result) => {
            if (err) throw err
            if (result.affectedRows > 0) {
                res.send({ code: 1, reg: "删除成功" })
            } else {
                res.send({ code: 0, reg: "vid错误" })
            }
        })
    }
})
router.get("/gvidpage", (req, res) => {
    var idx = req.query.idx
    var page = req.query.page
    if (!idx) {
        idx = 1
    }
    if (!page) {
        page = 12
    }
    var set = (idx - 1) * page
    var page = parseInt(page)
    var sql = "select uid,title,video,img,time,vid from video where del=0 order by time desc limit ?,?"
    pool.query(sql, [set, page], (err, result) => {
        if (err) throw err
        if (result.length > 0) {
            res.send({ code: 1, reg: result })
        } else {
            res.send({ code: 0, reg: "无页数或已到最后一页" })
        }
    })
})
router.get("/vidse", (req, res) => {
    var title = req.query.title
    var ulike = req.query.ulike
    var name = req.query.name
    if (title) {
        var sql = `select uid,title,video,img,time,vid from video where del=0 and title like '%${title}%' order by time desc`
        var obj = []
        pool.query(sql, (err, result) => {
            if (err) throw err
            if (result.length > 0) {
                obj = result
                var row = []
                for (var r of result) {
                    row.push(r.uid)
                }
                var rows = []
                for (var i = 0; i < row.length; i++) {
                    var sql = "select name from user where uid=" + row[i]
                    pool.query(sql, (err, result) => {
                        if (err) throw err
                        if (result.length > 0) {
                            rows.push(result[0].name)
                            if (row.length == rows.length) {
                                for (var i = 0; i < rows.length; i++) {
                                    obj[i].name = rows[i]
                                }
                                res.send({ code: 1, reg: obj })
                            }
                        }
                    })
                }
            } else {
                res.send({ code: 0, reg: "搜索结果为空" })
            }
        })
    } else {
        if (!ulike) {
            var sql = "select u.name,u.head,i.sign,u.uid,u.com,u.bvid from user u,uinfo i where u.uid=i.uid and u.com=0 and u.bvid=0"
            pool.query(sql, (err, result) => {
                if (err) throw err
                if (result.length > 0) {
                    res.send({ code: 1, reg: result })
                } else {
                    res.send({ code: 0, reg: "系统无用户" })
                }
            })
        } else {
            var sql = `select u.name,u.head,i.sign,u.uid,u.com,u.bvid from user u,uinfo i where u.uid=i.uid and u.name like '%${name}%'`
            pool.query(sql, (err, result) => {
                if (err) throw err
                if (result.length > 0) {
                    res.send({ code: 1, reg: result })
                } else {
                    res.send({ code: 0, reg: "无搜索结果" })
                }
            })
        }
    }
})
router.get("/ulift", (req, res) => {
    var uid = req.query.uid
    var video = req.query.video
    var sec = req.query.sec
    if (sec) {
        var sql = "select head,name,uid,com,bvid from user u where  com=1 or bvid=1 "
        var row = []
        pool.query(sql, (err, result) => {
            if (err) throw err
            if (result.length > 0) {
                var obj = result
                for (var r of result) {
                    row.push(r.uid)
                }
                var rows = []
                for (var i = 0; i < row.length; i++) {
                    var sql = "select sign from uinfo where uid=" + row[i]
                    pool.query(sql, (err, result) => {
                        if (err) throw err
                        if (result.length > 0) {
                            rows.push(result[0].sign)
                            if (rows.length == row.length) {
                                for (var i = 0; i < rows.length; i++) {
                                    obj[i].sign = rows[i]
                                }
                                res.send({ code: 1, reg: obj })
                            }
                        }
                    })
                }
            } else {
                res.send({ code: 0, reg: "无需要解封用户" })
            }
        })
    } else {
        if (!video) {
            var sql = "update user set com=0 where uid=? "
            pool.query(sql, [uid], (err, result) => {
                if (err) throw err
                if (result.affectedRows > 0) {
                    res.send({ code: 1, reg: "评论权限已解除" })
                } else {
                    res.send({ code: 0, reg: "解除失败" })
                }
            })
        } else {
            var sql = "update user set bvid=0 where uid=?"
            pool.query(sql, [uid], (err, result) => {
                if (err) throw err
                if (result.affectedRows > 0) {
                    res.send({ code: 1, reg: "视频权限已解除" })
                } else {
                    res.send({ code: 0, reg: "视频解除失败" })
                }
            })
        }
    }
})
router.get("/uidvid", (req, res) => {
    var ban = req.query.ban
    var uid = req.query.uid
    if (!ban) {
        var sql = "select v.vid from user u,video v where u.uid=v.uid and v.del=0 and v.aud=1 and u.uid=?"
        var obj = []
        pool.query(sql, [uid], (err, result) => {
            if (err) throw err
            if (result.length > 0) {
                var row = result
                for (var i = 0; i < row.length; i++) {
                    var sql = `select uid,title,video,img,time,vid,video from video where del=0 and aud=1 and vid=${row[i].vid}`
                    pool.query(sql, (err, result) => {
                        if (err) throw err
                        if (result.length > 0) {
                            obj.push(result[0])
                            if (obj.length == row.length) {
                                res.send({ code: 1, reg: obj })
                            }
                        }
                    })
                }
            } else {
                res.send({ code: 0, reg: "无该用户" })
            }
        })
    } else {
        var banvid = req.query.banvid
        if (!banvid) {
            var sql = "update user set com=1 where uid=?"
            pool.query(sql, [uid], (err, result) => {
                if (err) throw err
                if (result.affectedRows > 0) {
                    res.send({ code: 1, reg: "禁言成功" })
                } else {
                    res.send({ code: 0, reg: "禁言失败" })
                }
            })
        } else {
            var sql = "update user set bvid=1 where uid=?"
            pool.query(sql, [uid], (err, result) => {
                if (err) throw err
                if (result.affectedRows > 0) {
                    res.send({ code: 1, reg: "视频禁止成功" })
                } else {
                    res.send({ code: 0, reg: "视频禁止失败" })
                }
            })
        }
    }
})
router.post("/add", (req, res) => {
    var name = req.body.name
    var pass = req.body.pass
    var email = req.body.email
    var phone = parseInt(req.body.phone)
    var sign = req.body.sign
    var sex = parseInt(req.body.sex)
    var birth = req.body.birth
    var sql = "insert into user (name,pass,phone,email) values(?,?,?,?)"
    pool.query(sql, [name, pass, phone, email], (err, result) => {
        if (err) throw err
        if (result.affectedRows > 0) {
            var sql = "select count(uid) as u from user "
            pool.query(sql, (err, result) => {
                if (err) throw err
                if (result.length > 0) {
                    var num = parseInt(result[0].u) - 1
                    var sql = "select uid from user"
                    pool.query(sql, (err, result) => {
                        if (err) throw err
                        if (result.length > 0) {
                            var uid = result[num].uid
                            var sql = "insert into uinfo (uid,sign,sex,birth) values(?,?,?,?)"
                            pool.query(sql, [uid, sign, sex, birth], (err, result) => {
                                if (err) throw err
                                if (result.affectedRows > 0) {
                                    res.send({ code: 1, reg: "用户添加成功" })
                                } else {
                                    res.send({ code: 0, reg: "用户添加失败" })
                                }
                            })
                        }
                    })
                }
            })
        } else {
            res.send({ code: 0, reg: "添加用户失败" })
        }
    })
})
router.get("/aud", (req, res) => {
    var first = req.query.first
    var rec = req.query.rec
    if (first == "1") {
        var sql = "select v.vid,v.time,v.title,v.video,v.img,u.name from video v,user u where u.uid=v.uid and v.aud=0 and v.del=0 and v.record='' order by v.time desc"
        pool.query(sql, (err, result) => {
            if (err) throw err
            if (result.length > 0) {
                res.send({ code: 1, reg: result })
            } else {
                res.send({ code: 0, reg: "已将审核视频处理完毕" })
            }
        })
    } else if (first == "0") {
        var sql = "select v.vid,v.time,v.title,v.video,v.img,u.name,v.record from video v,user u where u.uid=v.uid and v.aud=0 and v.del=0 and v.record!='' order by v.time desc"
        pool.query(sql, (err, result) => {
            if (err) throw err
            if (result.length > 0) {
                res.send({ code: 1, reg: result })
            } else {
                res.send({ code: 0, reg: '无操作记录' })
            }
        })
    } else {
        var vid = req.query.vid
        if (rec == "yes") {
            var sql = "update video set record='',aud=1 where vid=?"
            pool.query(sql, [vid], (err, result) => {
                if (err) throw err
                if (result.affectedRows > 0) {
                    res.send({ code: 1, reg: "视频已通过审核" })
                } else {
                    res.send({ code: 0, reg: "视频操作失败" })
                }
            })
        } else if (rec == "no") {
            var record = req.query.record
            var sql = "update video set record=?,aud=0 where vid=?"
            pool.query(sql, [record, vid], (err, result) => {
                if (err) throw err
                if (result.affectedRows > 0) {
                    res.send({ code: 1, reg: "视频未通过审核" })
                } else {
                    res.send({ code: 0, reg: "视频操作失败" })
                }
            })
        }
    }
})
router.get("/play", (req, res) => {
    var vid = req.query.vid
    var sql = "select play from video where vid=?"
    pool.query(sql, [vid], (err, result) => {
        if (err) throw err
        if (result.length > 0) {
            var play = parseInt(result[0].play)
            play = play + 1
            var sql = "update video set play=? where vid=?"
            pool.query(sql, [play, vid], (err, result) => {
                if (err) throw err
                if (result.affectedRows > 0) {
                    res.send({ code: 1, reg: "视频播放量加一" })
                }
            })
        } else {
            res.send({ code: 0, reg: "该视频不存在" })
        }
    })
})
router.get("/comment", (req, res) => {
    var did = req.query.did
    var uid = req.query.uid
    var dtitle = req.query.dtitle
    var duid = req.query.duid
    var sql = "insert into dycom (did,uid,duid,dtitle) values(?,?,?,?)"
    pool.query(sql, [did, uid, duid, dtitle], (err, result) => {
        if (err) throw err
        if (result.affectedRows > 0) {
            res.send({ code: 1, reg: "发表成功" })
        } else {
            res.send({ code, reg: "发表失败" })
        }
    })
})
module.exports = router




