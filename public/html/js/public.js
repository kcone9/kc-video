/*公共js     name:'',
document.addEventListener('DOMContentLoaded',function(){ })
*/
axios.defaults.withCredentials=true
var obj={
    asi:{witdth:'20%',visibility:"visible",opacity:"1"},
    body:{width:'80%'},user:["未登录",0,false,"http://127.0.0.1:5050/head/login.png"],
    vid:{height:"36%"},
    asi_hu:{visibility:"visible"},
    num:1,list:[]
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
        }
    },
    created(){
        this.public()
    }
})

