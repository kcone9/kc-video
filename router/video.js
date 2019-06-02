const pool = require('../pool.js');
const express = require('express');
const multer = require('multer');
const fs = require('fs')
const multiparty = require("connect-multiparty")
const router = express.Router()
router.get('/vid', (req, res) => { //获取视频但没设置用户名
	var vid = req.query.vid
	var uid = req.query.uid
	if (vid) {
		var sql = "select v.vid,v.title,v.time,v.play,v.img,v.video,u.uid,u.name,u.head from video v,user u where u.uid=v.uid and v.aud=1 and v.del=0 and v.vid=" + vid
	} else if (uid) {
		var sql = "select v.vid,v.title,v.time,v.play,v.img,v.video,u.uid,u.name,u.head,r.progress,v.times from video v,user u,record r where u.uid=v.uid and v.vid=r.vid and v.aud=1 and v.del=0 and r.del=0 and u.uid=" + uid
	} else {
		var sql = 'select v.vid,v.title,v.time,v.play,v.img,v.video,u.uid,u.name,u.head from video v,user u where u.uid=v.uid and v.aud=1 and v.del=0  order by time desc limit 0,12;'
	}
	pool.query(sql, (err, result) => {
		if (err) throw err;
		if (result.length > 0) {
			res.send({ code: 1, reg: result })
		} else {
			res.send({ code: 0, reg: "error" })
		}
	})
})

router.get("/vidpage", (req, res) => {
	var idx = req.query.idx
	var page = req.query.page
	if (!idx) {
		idx = 1
	}
	if (!page) {
		page = 12
	}
	idx = parseInt(idx)
	var sizepage = (idx - 1) * page
	var sql = `select v.vid,v.title,v.time,v.play,v.img,v.video,u.uid,u.name,u.head from video v,user u where u.uid=v.uid and v.aud=1 and v.del=0 order by time desc limit ?,?`
	pool.query(sql, [sizepage, page], (err, result) => {
		if (err) throw err
		if (result.length > 0) {
			res.send({ code: 1, reg: result })
		} else {
			res.send({ code: 0, reg: "查询失败" })
		}
	})
})
router.get("/like", (req, res) => {
	var like = req.query.like
	var vid = req.query.vid
	var uid = req.query.uid
	var fav = req.query.fav
	if (like) {
		if (like == "1") {
			golike(like)
		} else {
			golike(like)
		}
		function golike(e) {
			var sql = "select lid from vidlike where uid=? and vid=?"
			pool.query(sql, [uid, vid], (err, result) => {
				if (err) throw err
				if (result.length > 0) {
					if (e == "1") {
						var sql = "update vidlike set liked=1,tread=0 where uid=? and vid=?"
					} else {
						var sql = "update vidlike set tread=1,liked=0 where uid=? and vid=?"
					}
					pool.query(sql, [uid, vid], (err, result) => {
						if (err) throw err
						if (result.affectedRows > 0) {
							res.send({ code: 111, reg: "修改成功" })
						} else {
							res.send({ code: 100, reg: "修改失败" })
						}
					})
				} else {
					if (e == "1") {
						var sql = "insert into vidlike (liked,tread,vid,uid,time) values(1,0,?,?,now())"
					} else {
						var sql = "insert into vidlike (liked,tread,vid,uid,time) values(0,1,?,?,now())"
					}
					pool.query(sql, [vid, uid], (err, result) => {
						if (err) throw err
						if (result.affectedRows > 0) {
							res.send({ code: 111, reg: "新like创建成功" })
						} else {
							res.send({ code: 100, reg: "创建失败" })
						}
					})
				}
			})
		}
	} else if (fav) {
		var sql = "select lid,fav from vidlike where uid=? and vid=?"
		pool.query(sql, [uid, vid], (err, result) => {
			if (err) throw err
			if (result.length > 0) {
				if (result[0].fav == "1") {
					var sql = "update vidlike set fav=0,time=now() where uid=? and vid=?"
					var isfav = false
				} else {
					var sql = "update vidlike set fav=1,time=now() where uid=? and vid=?"
					var isfav = true
				}
				pool.query(sql, [uid, vid], (err, result) => {
					if (err) throw err
					if (result.affectedRows > 0) {
						if (isfav) {
							res.send({ code: 200, reg: "已关注" })
						} else {
							res.send({ code: 211, reg: "取消关注" })
						}
					} else {
						res.send({ code: 300, reg: "关注失败" })
					}
				})
			} else {
				var sql = "insert into vidlike (vid,uid,time,fav) values(?,?,now(),1)"
				pool.query(sql, [vid, uid], (err, result) => {
					if (err) throw err
					if (result.affectedRows > 0) {
						res.send({ code: 200, reg: "新用户已关注" })
					} else {
						res.send({ code: 300, reg: "关注失败" })
					}
				})
			}
		})
	}
})
router.get("/fav", (req, res) => {
	var uid = req.query.uid
	var vid = req.query.vid
	var sql = "select fav from vidlike where vid=? and uid=?"
	pool.query(sql, [vid, uid], (err, result) => {
		if (err) throw err
		if (result.length > 0) {
			if (result[0].fav == "1") {
				res.send({ code: 1 })
			} else {
				res.send({ code: 0 })
			}
		} else {
			res.send({ code: 0, reg: "该用户无操作记录" })
		}
	})
})
router.get("/likes", (req, res) => {
	var vid = req.query.vid
	var sql1 = "select lid from vidlike where vid=? and liked=1"
	var sql2 = "select lid from vidlike where vid=? and fav=1"
	var sql3 = "select lid from vidlike where vid=? and tread=1"
	var obj = []
	pool.query("select lid from vidlike where vid=?", [vid], (err, result) => {
		if (err) throw err
		if (result.length > 0) {
			pool.query(sql1, [vid], (err, result) => {
				if (err) throw err
				if (result.length > 0) {
					obj.push(result.length)
				} else {
					obj.push(0)
				}
				pool.query(sql2, [vid], (err, result) => {
					if (err) throw err
					if (result.length > 0) {
						obj.push(result.length)
					} else {
						obj.push(0)
					}
					pool.query(sql3, [vid], (err, result) => {
						if (err) throw err
						if (result.length > 0) {
							obj.push(result.length)
							res.send(obj)
						} else {
							obj.push(0)
							res.send(obj)
						}
					})
				})
			})
		} else {
			res.send({ code: 0, reg: '无用户操作该视频' })
		}
	})
})
router.get("/comment", (req, res) => {
	var vid = req.query.vid
	var page = req.query.page
	var size = req.query.size
	if (!page) {
		page = 1
	}
	if (!size) {
		size = 12
	}
	var size = parseInt(size)
	var page = (page - 1) * size
	if (vid) {
		var sql = "select c.cid,u.uid,u.name,c.content,c.liked,c.tread,c.time from comment c,user u where u.uid=c.uid and c.vid=? order by time desc limit 0,12"
		pool.query(sql, [vid, page, size], (err, result) => {
			if (err) throw err
			if (result.length > 0) {
				res.send({ code: "1", reg: result })
			} else {
				res.send({ code: "0", reg: "该视频无用户评论" })
			}
		})
	}
})
router.post("/addcomment", (req, res) => {
	var uid = req.body.uid
	var sql = "select uid from user where uid=? and com=0"
	pool.query(sql, [uid], (err, result) => {
		if (err) throw err
		if (result.length > 0) {
			var vid = req.body.vid
			var content = req.body.content
			var sql = "insert into comment (content,uid,vid,time) values(?,?,?,now())"
			pool.query(sql, [content, uid, vid], (err, result) => {
				if (err) throw err
				if (result.affectedRows > 0) {
					res.send({ code: "1", reg: "评论成功" })
				} else {
					res.send({ code: "0", reg: "评论失败" })
				}
			})
		} else {
			res.send({ code: 10, reg: "评论失败，您被禁言" })
		}
	})
})
var upload = multer({ dest: './public/upload' })
router.post('/upload', upload.single('mypic'), (req, res) => {
	console.log("收到", req.file, req.body)
	res.send({ code: 1, reg: "收到消息" })
})
var tiparty = multiparty({ dest: './public/upload' })
router.post("/party", tiparty, (req, res) => {
	var pose = req.body.pose
	var uid = req.body.uid
	var title = req.body.title
	var type = req.files.file.type
	var ty = type.indexOf("/")
	var types = type.slice(0, ty)
	var scr = req.files.file.originalFilename;
	var i = scr.lastIndexOf('.');
	var suf = scr.substring(i);
	var ftime = new Date().getTime();
	var frn = Math.floor(Math.random() * 999);
	if (pose == "image") {
		var href = 'http://127.0.0.1:5050/upload/image/' + ftime + frn + suf
		var des = './public/upload/image/' + ftime + frn + suf;
	} else if (pose == "video") {
		var href = 'http://127.0.0.1:5050/upload/video/' + ftime + frn + suf
		var des = './public/upload/video/' + ftime + frn + suf;
	}
	if (pose == "image") {
		if (types == "image") {
			var sql = "update user set head=? where uid=?"
			pool.query(sql, [href, uid], (err, result) => {
				if (err) throw err
				if (result.affectedRows > 0) {
					fs.renameSync(req.files.file.path, des);
					res.send({ code: 10, reg: "图片上传成功" })
				} else {
					res.send({ code: 0, reg: "图片上传失败" })
				}
			})
		} else {
			res.send({ code: 0, reg: "上传失败，上传文件的不是图片" })
		}
	} else if (pose == "video") {
		if (types == "video") {
			var scrimg = req.files.filem.originalFilename
			if (scrimg) {
				var desm = './public/upload/image/' + ftime + frn + ".png";
				var hrefm = 'http://127.0.0.1:5050/upload/image/' + ftime + frn + ".png";
			}
			var sql = "insert into video (title,uid,time,video,img) values(?,?,now(),?,?)"
			pool.query(sql, [title, uid, href, hrefm], (err, result) => {
				if (err) throw err
				if (result.affectedRows > 0) {
					fs.renameSync(req.files.file.path, des);
					fs.renameSync(req.files.filem.path, desm);
					res.send({ code: 1, reg: "视频上传参数接收成功", data: [uid, title] })
				} else {
					res.send({ code: 0, reg: "视频上传失败" })
				}
			})
		} else {
			res.send({ code: 0, reg: "上传失败,不是视频文件" })
		}
	}
})
router.get("/rec", (req, res) => {
	var vid = req.query.vid
	var uid = req.query.uid
	var wuid = parseInt(req.query.wuid)
	var rec = req.query.rec
	var progress = req.query.progress
	var name = req.query.name
	var title = req.query.title
	var video = req.query.video
	// 视频图片路径
	if (rec) {
		var sql = "select rid from record where uid=? and vid=?"
		pool.query(sql, [uid, vid], (err, result) => {
			if (err) err
			if (result.length > 0) {
				var sql = "update record set time=now(),progress=?,del=0 where uid=? and vid=?"
				pool.query(sql, [progress, uid, vid], (err, result) => {
					if (err) throw err
					if (result.affectedRows > 0) {
						res.send({ code: 1, reg: "视频记录修改成功" })
					} else {
						res.send({ code: 0, reg: "视频记录修改失败" })
					}
				})
			} else {
				var sql = "insert into record (time,vid,uid,wuid,wtitle,wname,wvideo) values(now(),?,?,?,?,?,?)"
				pool.query(sql, [vid, uid, wuid, title, name, video], (err, result) => {
					if (err) throw err
					if (result.affectedRows > 0) {
						res.send({ code: 1, reg: "该用户的观看记录已生成" })
					} else {
						res.send({ code: 0, reg: "观看记录生成失败" })
					}
				})
			}
		})
	} else {
		var sql = "select rid,time,vid,progress,wuid,wname,wtitle,wvideo from record where uid=? and del=0;"
		pool.query(sql, [uid], (err, result) => {
			if (err) throw err
			if (result.length > 0) {
				res.send({ code: 1, reg: result })
			} else {
				res.send({ code: 0, reg: "查询失败，该用户无观看记录" })
			}
		})
	}
})
router.get("/delrec", (req, res) => {
	var rid = req.query.rid
	var uid = req.query.uid
	var all = req.query.all
	if (all) {
		var sql = "update record set del=1 where uid=" + uid
		del(sql)
	} else {
		var sql = "update record set del=1 where rid in (" + rid + ")"
		del(sql)
	}
	function del(sql) {
		pool.query(sql, (err, result) => {
			if (err) throw err
			if (result.affectedRows > 0) {
				res.send({ code: 1, reg: '删除成功' })
			} else {
				res.send({ code: 0, reg: "删除失败" })
			}
		})
	}

})
router.get("/vidmin", (req, res) => {
	var uid = req.query.uid
	var del = req.query.del
	var vid = req.query.vid
	if (del == "all") {
		var sql = "update video set del=1 where uid=?"
		pool.query(sql, [uid], (err, result) => {
			if (err) throw err
			if (result.affectedRows > 0) {
				res.send({ code: 1, reg: "该用户所有视频已删除" })
			} else {
				res.send({ code: 0, reg: "删除失败" })
			}
		})
	} else if (del == "only") {
		var sql = `update video set del=1 where vid in (${vid})`
		pool.query(sql, (err, result) => {
			if (err) throw err
			if (result.affectedRows > 0) {
				res.send({ code: 1, reg: "删除成功" })
			} else {
				res.send({ code: 0, reg: "删除失败" })
			}
		})
	} else {
		var sql = "select vid,title,uid,time,play,video,img,aud,record from video where uid=? and del=0"
		pool.query(sql, [uid], (err, result) => {
			if (err) throw err
			if (result.length > 0) {
				res.send({ code: 1, reg: result })
			} else {
				res.send({ code: 0, reg: "该用户无视频上传记录" })
			}
		})
	}
})
router.get("/favs", (req, res) => {
	var uid = req.query.uid
	var vid = req.query.vid
	var obj = {}
	if (vid) {
		var sql = "update vidlike set fav=0  where uid=? and vid=?"
		pool.query(sql, [uid, vid], (err, result) => {
			if (err) throw err
			if (result.affectedRows > 0) {
				res.send({ code: 1, reg: "取消成功" })
			} else {
				res.send({ code: 0, reg: "取消失败" })
			}
		})
	} else {
		var sql = "select l.time as liketime,v.time as reltime,v.title,v.play,v.vid,v.video,v.img,u.name from vidlike l,video v,user u where l.vid=v.vid and u.uid=v.uid and v.del=0 and v.aud=1 and l.uid=? and l.fav=1"
		pool.query(sql, [uid], (err, result) => {
			if (err) throw err
			if (result.length > 0) {
				obj.reg = result
				var rows = []
				for (var i = 0; i < result.length; i++) {
					rows.push(result[i].vid)
				}
				var favs = []
				for (var i = 0; i < rows.length; i++) {
					var sql = `select count(fav) as f from vidlike where vid in (${rows[i]})`
					pool.query(sql, (err, result) => {
						if (err) err
						if (result.length > 0) {
							favs.push(result[0].f)
							if (favs.length == rows.length) {
								obj.favs = favs
								res.send({ code: 1, obj })
							}
						}
					})
				}
			} else {
				res.send({ code: 0, reg: "该用户未收藏任何视频" })
			}
		})
	}
})
router.get("/favlike", (req, res) => {
	var uid = req.query.uid
	var title = req.query.title
	var sql = `select l.time as liketime,v.time as reltime,v.title,v.play,v.vid,v.video,v.img,u.name from vidlike l,video v,user u where l.vid=v.vid and u.uid=v.uid and l.uid=${uid} and l.fav=1 and v.title like '%${title}%'`
	var obj = {}
	pool.query(sql, (err, result) => {
		if (err) throw err
		if (result.length > 0) {
			obj.reg = result
			var rows = []
			for (var i = 0; i < result.length; i++) {
				rows.push(result[i].vid)
			}
			var favs = []
			for (var i = 0; i < rows.length; i++) {
				var sql = `select count(fav) as f from vidlike where vid in (${rows[i]})`
				pool.query(sql, (err, result) => {
					if (err) err
					if (result.length > 0) {
						favs.push(result[0].f)
						if (favs.length == rows.length) {
							obj.favs = favs
							res.send({ code: 1, obj })
						}
					}
				})
			}
		} else {
			res.send({ code: 0, reg: "无查询结果" })
		}
	})

})
router.get("/sea", (req, res) => {
	var title = req.query.title
	if (title) {
		var sql = `select v.title,v.time,v.play,v.vid,u.name,v.img from video v,user u where v.uid=u.uid and v.del=0 and v.aud=1 and v.title like '%${title}%'`
		pool.query(sql, [title], (err, result) => {
			if (err) throw err
			if (result.length > 0) {
				res.send({ code: 1, reg: result })
			} else {
				res.send({ code: 0, reg: "无结果" })
			}
		})
	} else {
		res.send({ code: 0, reg: "查询条件有误" })
	}
})
router.get("/vidtimes", (req, res) => {
	var vid = parseInt(req.query.vid)
	var progress = parseInt(req.query.progress)
	if (!progress) {
		var times = parseInt(req.query.times)
		var sql = `update video set times=${times} where vid=${vid}`
		if (times != null && times != NaN && times != undefined) {
			consql(sql)
		}
	} else {
		var uid = req.query.uid
		var sql = `update record set progress=${progress} where vid=${vid} and uid=${uid}`
	}
	function consql(sql) {
		pool.query(sql, (err, result) => {
			if (err) throw err
			if (result.affectedRows > 0) {
				res.send({ code: 1 })
			} else {
				res.send({ code: 0 })
			}
		})
	}
})
router.get("/aside", (req, res) => {
	var uid = req.query.uid
	var wuid = req.query.wuid
	if(uid!=undefined && wuid!=undefined){
	var sql = "select v.title,v.vid from video v,user u where u.uid=v.uid and v.aud=1 and v.del=0 and u.uid=" + wuid
	pool.query(sql, (err, result) => {
		if (err) throw err
		if (result.length > 0) {
			var row = result
			var rowp = []
			var rows = []
			var rowgo=[]
			for(var g of result){
				rowgo.push(g.vid)
			}
			for (var i = 0; i < result.length; i++) {
				var sql = `select progress,vid,rid from record where uid=${uid} and wuid=${wuid} and vid=${rowgo[i]} and del=0 order by vid asc`
				console.log(sql+i)
				pool.query(sql, (err, result) => {
					if (err) throw err
					if (result.length > 0) {
						rows.push(result[0].progress)
					}else{
						rows.push(0)
					}					
					rowp.push(1)
					if(row.length==rowp.length){
						var n=row.length
						var s=0
						for(var i=0;i<rows.length;i++){
							row[i].progress=rows[i]
						}
						for(var r of row){
							if(r.progress==0){
								s=s+1
							}
						}
						if(s==n){
							console.log("无记录",row)
							res.send({code:1,reg:row,data:"该用户所有视频无浏览记录"})
						}else{
							console.log("有得",row)
							res.send({code:0,reg:row})
						}	}	
				})
			}
		} else {
			res.send({ code: 0, reg: "该用户无其他视频" })
		}
	})
}
})




module.exports = router

