const pool=require('../pool.js');
const express=require('express');
const router=express.Router()
//这是登录页面的数据操作
router.post('/login',(req,res)=>{
	var name= req.body.name;
	var pass=req.body.pass;
	console.log(name,pass)
	pool.query('select name,aid,head from admin where name=? and pass=?',[name,pass],(err,result)=>{
		if(err) throw err;
		if(result.length>0){
			req.session.uid=result[0].aid
			req.session.name=result[0].name
			req.session.head=result[0].head
			res.send({code:3,data:[result[0].name,result[0].aid]})
		}else{
			var sql='select uid,name,head from user where name=? and pass=?';
	pool.query(sql,[name,pass],(err,result)=>{
		if(err) throw err;//返回的数据不止用户名、密码、全部与该表有关的信息都会返回
		if(result.length>0){
			req.session.uid=result[0].uid;
			req.session.name=result[0].name;
			req.session.head=result[0].head
			res.send({code:1,data:[result[0].uid,result[0].name]});
		}else{
			res.send({code:0,data:'登录失败'});
		}
	})
		}
	}) 
});
router.get('/islogin',(req,res)=>{
	if(req.query.no==0){ //no为0就让它注销，不为0就用于判断是否登录
		req.session.uid=null;
		req.session.name=null;
		req.session.head=null;
		res.send({code:0,data:'用户已注销'})
	}else{
		if(req.session.uid!=null && req.session.name!=null && req.session.head!=null){
			var sql="select head from user where uid=?"
			pool.query(sql,[req.session.uid],(err,result)=>{
				if(err) throw err
				if(result.length>0){
					req.session.head=result[0].head
					res.send({code:1,data:[req.session.uid,req.session.name,req.session.head]})
				}
			})
		}else{
			res.send({code:0,data:'用户未登录'})
		}
	}
})
// 注册页面通过ajax发送用户名，查询是否存在
router.post('/uname',(req,res)=>{
	var obj=req.body;
	var sql='select * from user where ?';//加上字符串不成功可能是由于数据变更
pool.query(sql,[obj],(err,result)=>{//也就是affectedRows 现在的错误暂时只能用用这个来解释了
	if(err)throw err;
	if(result.length>0){
		res.send('1');
	}else{
		res.send('0');
	}
});
});
// 这是注册页面
router.post('/register',(req,res)=>{
	var user=req.body.user
	var pass=req.body.pass
	var phone=req.body.phone
	var email=req.body.email
	var sql="select uid from user where name=?"
	pool.query(sql,[user],(err,result)=>{
		if(err) throw err
		if(result.length>0){
			res.send({code:2,reg:"用户名已存在"})
		}else{
			var sql="insert into user (name,pass,phone,email) values(?,?,?,?)"
			pool.query(sql,[user,pass,phone,email],(err,result)=>{
				if(err) throw err
				if(result.affectedRows>0){
					res.send({code:1,reg:"注册成功"})
				}else{
					res.send({code:0,reg:"注册失败"})
				}
			})
		}
	})
});
//查询所有用户根据页面显示
router.get('/page',(req,res)=>{
	var pno=req.query.pno;
	var pagesize=req.query.pagesize;
	if(!pno){
		pno=1;
	}
	if(!pagesize){
		pagesize=7;
	}
	var offset=(pno-1)*pagesize;
	var ps=parseInt(pagesize)
	pool.query('select user_id,user_name,phone,email from user limit ?,? ',[offset,ps],(err,result)=>{
		if(err) throw err
		if(result.length>0){
			res.send(result)
		}else{
			res.send('查询失败')
		}
	})
})
//查询所有用户信息，随便取的用户总数
router.get('/all',(req,res)=>{
pool.query('select user_id,user_name,phone,email from user where user_id',(err,result)=>{
	if(err) throw err;
	if(result.length>0){
		res.send(result);
		pool.query('update admin_data set user_munber=? where id=1',[result.length],(err,result)=>{
			if(err) throw err;
			if(!result.affectedRows>0){
				console.log('改变用户总数失败')
			}
		}) 
	}else{
		res.send({code:500,data:'所有用户信息查询失败'})
	}
})
})
router.get("/info",(req,res)=>{
	var uid=req.query.uid
	var sign=req.query.sign
	var sex=parseInt(req.query.sex)
	var birth=req.query.birth
	var get=req.query.get
	var sql="select  u.uid,f.sex,f.sign,f.birth from uinfo f,user u where u.uid=? and f.uid=?"
	if(!get){
	pool.query(sql,[uid,uid],(err,result)=>{
		if(err) throw err
		if(result.length>0){
			var sql="update uinfo set sign=?,sex=?,birth=? where uid=?"
			pool.query(sql,[sign,sex,birth,uid],(err,result)=>{
				if(err) err
				if(result.affectedRows>0){
					res.send({code:1,reg:"修改成功"})
				}else{
					res.send({code:0,reg:"修改失败"})
				}
			})
		}else{
			var sql="insert into uinfo (uid,sign,sex,birth) values(?,?,?,?)"
			pool.query(sql,[uid,sign,sex,birth],(err,result)=>{
				if(err) throw err
				if(result.affectedRows>0){
					res.send({code:1,reg:"新用户信息已插入"})
				}else{
					res.send({code:0,reg:"新信息插入失败"})
				}
			})
		}
	})	}else{
		pool.query(sql,[uid,uid],(err,result)=>{
			if(err) throw err
			if(result.length>0){
				res.send({code:1,reg:result})
			}else{
				var sql="insert into uinfo (uid) values(?)"
				pool.query(sql,[uid],(err,result)=>{
					if(err) throw err
					if(result.affectedRows>0){
						res.send({code:0,reg:"该用户无详细信息，但已创建"})
					}
				})
			}
			
		})
	}
})
router.get("/sub",(req,res)=>{
	var uid=req.query.uid
	var wuid=req.query.wuid
	var sub=req.query.sub
	if(!sub){
		var sql="select sub from sub where uid=? and wuid=?"
		pool.query(sql,[uid,wuid],(err,result)=>{
		if(err) throw err
		if(result.length>0){
			if(result[0].sub=="1"){
				var sql="update sub set sub=0 where uid=? and wuid=?"
				var num=0
			}else{
				var sql="update sub set sub=1 where uid=? and wuid=?"
				var num=1
			}
			pool.query(sql,[uid,wuid],(err,result)=>{
				if(err) throw err
				if(result.affectedRows>0){
					if(num==1){
						res.send({code:1,reg:"已关注"})
					}else{
						res.send({code:0,reg:"已取消"})
					}
				}
			})
		}else{
			var sql="insert into sub (uid,wuid) values(?,?)"
			pool.query(sql,[uid,wuid],(err,result)=>{
				if(err) throw err
				if(result.affectedRows>0){
					res.send({code:1,reg:"已关注该用户"})
				}else{
					res.send({code:0,reg:"创建数据失败"})
				}
			})
		}
	})
		}else{
			var sql="select sub from sub where uid=? and wuid=?"
			pool.query(sql,[uid,wuid],(err,result)=>{
				if(err) throw err
				if(result.length>0){
					if(result[0].sub=="1"){
						res.send({code:1,reg:"该用户已关注"})
					}else{
						res.send({code:0,reg:"该用户未关注"})
					}
				}else{
					res.send({code:0,reg:"该用户无订阅数据"})
				}
			})
		}
})
router.get("/fsub",(req,res)=>{
	var uid=req.query.uid
	var sql="select s.wuid,u.name,u.head,u.uid,i.sign from sub s,user u,uinfo i where u.uid=s.wuid and s.wuid=i.uid and s.uid=? and s.sub=1"
	pool.query(sql,uid,(err,result)=>{
		if(err) throw err
		if(result.length>0){
			res.send({code:1,reg:result})
		}else{
			res.send({code:0,reg:"该账户未订阅"})
		}
	})
})
router.post("/mod",(req,res)=>{
	var uid=parseInt(req.body.uid)
	var pass=req.body.pass
	var passed=req.body.passed
	var sql="select uid from user where uid=? and pass=?"
	pool.query(sql,[uid,pass],(err,result)=>{
		if(err) throw err
		if(result.length>0){
			var sql="update user set pass=? where uid=? and pass=?"
			pool.query(sql,[passed,uid,pass],(err,result)=>{
				if(err) throw err
				if(result.affectedRows>0){
					res.send({code:1,reg:"修改成功"})
				}else{
					res.send({code:0,reg:"修改失败"})
				}
			})
		}else{
			res.send({code:0,reg:"修改失败"})
		}
	})
})
router.post("/forget",(req,res)=>{
	var name=req.body.name
	var phone=req.body.phone
	var email=req.body.email
	var uid=req.body.uid
	if(!uid){
	var sql="select uid from user where name=? and phone=? and email=?"
	pool.query(sql,[name,phone,email],(err,result)=>{
		if(err) throw err
		if(result.length>0){
			res.send({code:1,reg:result})
		}else{
			res.send({code:0,reg:"无结果"})
		}
	})	}else{
		var pass=req.body.pass
		var sql="update user set pass=? where uid=?"
		pool.query(sql,[pass,uid],(err,result)=>{
			if(err) throw err
			if(result.affectedRows>0){
				res.send({code:1,reg:"修改成功"})
			}else{
				res.send({code:0,reg:"更改失败"})
			}
		})
	}
})
router.get("/ulike",(req,res)=>{
	var cid=req.query.cid
	var liked=req.query.liked
	var sql="select liked,tread from comment where cid=?"
	pool.query(sql,[cid],(err,result)=>{
		if(err) throw err
		if(result.length>0){
			if(liked){
				var num=parseInt(result[0].liked)
				num=num+1
				var sql="update comment set liked=? where cid=?"
			}else{
				var num=parseInt(result[0].tread)
				num=num+1
				var sql="update comment set tread=? where cid=?"
			}
			pool.query(sql,[num,cid],(err,result)=>{
				if(err) throw err
				if(result.affectedRows>0){
					res.send({code:1,reg:"点赞成功"})
				}else{
					res.send({code:0,reg:"点赞失败"})
				}
			})
		}else{
			res.send({code:0,reg:"无该评论"})
		}
	})
	
})
module.exports=router














