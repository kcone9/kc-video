axios.defaults.withCredentials=true
var obj={
    asi:{witdth:'20%',visibility:"visible",opacity:"1"},
    body:{width:'80%'},user:["未登录",0,false,"http://127.0.0.1:5050/head/login.png",""],
    vid:{height:"36%"},pass1:"",pass2:"",
    asi_hu:{visibility:"visible"},info:[],sign:"",sex:"",birth:"",users:"",
    num:1,list:[],active:[{id:0,act:false},{id:1,act:true},{id:2,act:true}]
}
var data=new Vue({
    el:'#main',
    data:obj,
    methods:{
        work(e){
            e.preventDefault()
            this.num++;
            if((this.num)% 2== 0){
                this.body.width='100%';
                this.asi.width='0%';
                this.asi.visibility="hidden"
                this.asi_hu.visibility="hidden";
                this.asi.opacity="0"
                this.vid.height="48%"
            }else{
                this.body.width='80%';
                this.asi.width='20%';
                this.asi.visibility="visible"
                this.asi_hu.visibility="visible"
                this.asi.opacity="1"
                this.vid.height="36%"
            }
        },
        bodys(){
            location.href="http://127.0.0.1:5050/html/body.html"
        },
        save(){
            var sql=`http://127.0.0.1:5050/user/info?uid=${this.user[1]}&sign=${this.sign}&sex=${this.sex}&birth=${this.birth}`
            axios.get(sql).then(res=>{
                if(res.data.code==1){
                    alert("修改成功")
                    this.public()
                }else{
                    alert("修改失败")
                }
            })
        },
        items(i,e){
            e.preventDefault();
            for(var l of this.list){
                l.cb=true
            }
            this.list[i].cb=false
        },
        jump(i,e){
            if(i==0){
                this.jumps(e)
            }else if(i==1){
                location.href="http://127.0.0.1:5050/html/message.html?e="+e
            }else if(i==2){
                location.href="http://127.0.0.1:5050/html/myvideo.html?e="+e
            }else if(i==3){
                location.href="http://127.0.0.1:5050/html/fav.html?e="+0
            }else if(i==4){
                location.href="http://127.0.0.1:5050/html/fav.html?e="+1
            }else if(i==5){
                location.href="http://127.0.0.1:5050/html/fav.html?e="+2
            }
        },
        mod(e){
            e.preventDefault()
            if(this.pass1 !='' && this.pass2 !=""){
                    var post=`uid=${this.user[1]}&pass=${this.pass1}&passed=${this.pass2}`
                axios.post("http://127.0.0.1:5050/user/mod",post).then(res=>{
                    if(res.data.code==1){
                        alert("修改成功")
                        location.replace("http://127.0.0.1:5050/html/body.html")
                    }else{
                        alert("修改失败！，原密码错误！")
                        this.pass1="",this.pass2=""
                    }
                })
            }else{
                alert("输入内容不能为空")
            }
        },
        go(e){
            e.preventDefault()
            var image=document.getElementById("img")
            if(image.value!="" ){
            var up=document.getElementById("img");
            var postdata=new FormData()
                postdata.append("uid",this.user[1]) 
                postdata.append("file",up.files[0])
                postdata.append("mypic","jojo")
                postdata.append("pose","image")
                var config={
                    headers:{
                        "Content-Type":"multipart/form-data"
                    }
                }
            axios.post("http://127.0.0.1:5050/video/party",postdata,config).then(res=>{
                if(res.data.code==10){
                    this.public()
                    alert("图片修改成功！")
                }else{
                    alert("图片上传失败")
                }
                })  }else{
                    alert("未选择文件")
                }
        },
        login(e){
            if(e==1){
                if(this.user[2]==false){
                    location.href="http://127.0.0.1:5050/html/index.html"
                }
            }else{
                if(this.user[2]){
                    axios.get("http://127.0.0.1:5050/user/islogin?no=0").then(res=>{
                        if(res.data.code==0){
                            alert("用户已注销")
                            this.public()
                        }
                    })
                }else{
                    alert("您没登录无法注销")
                }
            }
        },
        public(){
            axios.get("http://127.0.0.1:5050/user/islogin").then(res=>{
                if(res.data.code==1){
                    this.user[0]=res.data.data[1]
                    this.user[1]=res.data.data[0]
                    this.user[2]=true
                    this.user[3]=res.data.data[2]
                    this.user[4]=""
                    axios.get(`http://127.0.0.1:5050/user/info?get=1&uid=${res.data.data[0]}`).then(res=>{
                        if(res.data.code==1){
                            var name=res.data.reg[0].birth;
                            var id=name.indexOf("T")
                            var s=name.slice(0,id)
                            this.birth=s
                            this.sign=res.data.reg[0].sign
                            this.sex=res.data.reg[0].sex
                        }else{
                            this.users="该用户未填写信息"
                        }
                    })
                }else{
                    this.user[0]="未登录"
                    this.user[2]=false
                    this.user[3]='http://127.0.0.1:5050/head/login.png'
                    alert("未登录")
                    location.replace("http://127.0.0.1:5050/html/index.html")
                }
            })
            axios.get('http://127.0.0.1:5050/index/list').then(res=>{
                for(var li of res.data){
                    li.cb=true
                }
                this.list=res.data
            })
            for(var l of this.list){
                l.cb=true
            }
            var id=location.search.split('=')[1]
            if(id){
                this.jumps(id)
            }
            axios.get("http://127.0.0.1:5050/complex/adnum?hits=1")
        },
        jumps(e){
            for(var a of this.active){
                a.act=true
            }
                if(e=='0'){
                    this.active[0].act=false
                }else if(e=="1"){
                    this.active[1].act=false
                }else if(e=="2"){
                    this.active[2].act=false
                }
        }
        
    },
    created(){
        this.public()
    }
})