axios.defaults.withCredentials=true
var obj={
    asi:{witdth:'20%',visibility:"visible",opacity:"1"},
    body:{width:'80%'},user:["未登录",0,false,"http://127.0.0.1:5050/head/login.png"],
    vid:{height:"36%"},likes:[],vidlike:[],
    asi_hu:{visibility:"visible"},
    num:1,list:[],mess:[{id:0,mes:false},{id:1,mes:true},{id:2,mes:true}]
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
        bodys(p){
            if(p=="true"){
                location.href="http://127.0.0.1:5050/html/body.html"
            }else if(p=="false"){

            }
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
                location.href="http://127.0.0.1:5050/html/primess.html?e="+e
            }else if(i==1){
                this.jumps(e)
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
        jumps(e){
            for(var a of this.mess){
                a.mes=true
            }
                if(e=='0'){
                    this.mess[0].mes=false
                }else if(e=="1"){
                    this.mess[1].mes=false
                }else if(e=="2"){
                    this.mess[2].mes=false
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
                    if(this.user[2]){
                        axios.get("http://127.0.0.1:5050/complex/comcon?uid="+this.user[1]).then(res=>{
                            if(res.data.code==1){
                                this.likes=res.data.reg
                            }else{
                                alert("您发布的内容未受任何用户评论")
                            }
                        })
                        axios.get("http://127.0.0.1:5050/complex/comcon?likes=1&uid="+this.user[1]).then(res=>{
                            if(res.data.code==1){
                                var rows=res.data.reg
                                for(var i=0;i<rows.length;i++){
                                    var type=rows[i].time
                                    var ty=type.indexOf("T")
                                    var types=type.slice(0,ty)
                                    rows[i].times=types
                                }
                                this.vidlike=rows
                            }else{
                                alert("未得到任何用户点赞")
                            }
                        })
                    }
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
            var id=location.search.split('=')[1]
            if(id){
                this.jumps(id)
            }
            axios.get("http://127.0.0.1:5050/complex/adnum?hits=1")
        }
    },
    created(){
        this.public()
    }
})









