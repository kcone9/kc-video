const express=require("express")
const router=express.Router();
const pool=require("../pool");
router.get('/',(req,res)=>{
    var sql='select * from details where lid!=0 order by lid';
    pool.query(sql,[],(err,result)=>{
        if(err) console.log(err);
    res.writeHead(200,{
        'Access-Control-Allow-Origin':'*'
    });
res.write(JSON.stringify(result));
res.end();
    })
})
router.get('/nav',(req,res)=>{
    var sql='select * from index_nav'
    pool.query(sql,(err,result)=>{
        if(err) throw err;
        if(result.length>0){
            res.writeHead(200,{
                'Access-Control-Allow-Origin':'*'
            });
            res.write(JSON.stringify(result)); 
            res.end();
            //res.send(result)
        }else{
            res.send('查询失败')
        }
    })
})
router.get("/list",(req,res)=>{
	var obj=[{title:"个人资料",s:["我的信息","我的头像","修改密码"]},
		{title:"消息中心",s:["回复我的","收到的赞"]},{title:"我的视频",s:["上传视频","观看记录","视频管理"]},
		{title:"我的收藏",s:["收藏夹"]},{title:"我的订阅",s:["个人频道"]},{title:"我的动态",s:["查看动态"]}]
	res.send(obj)
    })
router.get("/adlist",(req,res)=>{
    var obj=[{ti:"查看视频",s:["所有视频","用户中挑选"],cb:true},{ti:"管理用户",s:["管理用户权限","创建新用户"],cb:true},{ti:"待审核视频",s:["审核表","未通过名单"],cb:true},{ti:"限制名单",s:["禁止用户"],cb:true}]
    res.send(obj)
})

module.exports=router;







