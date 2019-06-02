const express=require('express');
const bodyparser=require('body-parser');
const userrouter=require('./router/user.js');
const details=require('./router/details.js');
const index=require('./router/index.js');
const video=require('./router/video.js');
const ionic=require('./router/ionic.js');
const cors=require('cors');
const session=require('express-session');
var server =express();
server.listen(5050);
console.log('服务器已启动')
server.use(bodyparser.urlencoded({
extended:false  
}));
server.use(session({
	secret:'key',
	resave:false,
	saveUninitialized:true,
    cookie:{
   maxAge:1000*60*60*80
    }
  }))
server.use(cors({
  origin:['http://127.0.0.1:8090','http://localhost:8090','http://127.0.0.1:8080','http://127.0.0.1:5500',"http://127.0.0.1:4200",'*'],
  credentials:true
}))
server.get('/',(req,res)=>{
res.sendFile(__dirname+'/public/html/index.html')
});
server.use(express.static('./public'))
server.use('/user',userrouter);
server.use('/complex',details);
server.use('/index',index);
server.use('/video',video)
server.use('/ionic',ionic)