axios.defaults.withCredentials=true
var obj={
    asi:{witdth:'20%',visibility:"visible",opacity:"1"},name:"",pass:"",phone:"",email:"",sign:"",sex:"",birth:"",
    body:{width:'80%'},user:["未登录",0,false,"http://127.0.0.1:5050/head/login.png"],rec:[],page:1,
    vid:{height:"36%"},index:[0,0,0,0,0,0],allvid:[],ut:true,uf:false,puser:[],pinput:"",playvid:["","","",""],
    asi_hu:{visibility:"visible"},search:"",userlist:[],searchuser:"",uvid:[],aud:[],ulift:[],
    num:1,list:[],admin:[{id:0,ad:false},{id:1,ad:true},{id:2,ad:true},{id:3,ad:true},{id:4,ad:true},{id:5,ad:true},{id:6,ad:true},{id:7,ad:true},{id:8,ad:true}]
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
        bodys(e,i,$,l){
            if(e=="true"){
                for(var a of this.admin){
                    a.ad=true
                }
                this.admin[0].ad=false
            }else if(e=="false"){
                axios.get("http://127.0.0.1:5050/complex/gvid?del=1&vid="+i).then(res=>{
                    if(res.data.code==1){
                        if($){
                            //删除对应下标
                            this.uvid.splice($,1)
                        }else{
                            this.public()
                        }
                    }else{
                        alert("删除失败")
                    }
                })  
            }else if(e=="search"){
                if(this.search==""){
                    alert("输入内容为空")
                }else{
                    axios.get(`http://127.0.0.1:5050/complex/vidse?title=${this.search}`).then(res=>{
                        if(res.data.code==1){
                            var rows=res.data.reg
                                for(var i=0;i<rows.length;i++){
                                    var type=res.data.reg[i].time
                                    var ty=type.indexOf("T")
                                    var types=type.slice(0,ty)
                                    rows[i].times=types
                                }
                                if(!$){
                                    this.allvid=rows
                                }else{
                                    this.puser=rows
                                }
                        }else{
                            alert("搜索结果为空")
                        }
                    })  
                }
            }else if(e=="searchuser"){
                if(!i){
                    var sea=this.searchuser
                }else{
                    var sea=this.pinput
                }
                if(sea){
                axios.get("http://127.0.0.1:5050/complex/vidse?ulike=1&name="+sea).then(res=>{
                    if(res.data.code==1){
                        if(!i){
                            this.userlist=res.data.reg
                            this.uf=false
                            this.ut=true
                        }else{
                            var row=res.data.reg
                        for(var r of row){
                            if(r.com=="1"){
                                r.comd="该用户已被禁言"
                            }else{
                                r.comd="禁止该用户评论"
                            }
                            if(r.bvid=="1"){
                                r.bvidd="用户已被禁止"
                            }else{
                                r.bvidd="禁止该用户发布视频"
                            }
                        }
                            this.puser=row
                        }
                    }else if(res.data.code==0){
                        alert("搜索结果为空")
                    }
                })  
                }else{
                    alert("输入内容为空")
                }
            }else if(e=="see"){
                $.preventDefault()
                axios.get("http://127.0.0.1:5050/complex/uidvid?uid="+i).then(res=>{
                    if(res.data.code==1){
                        var rows=res.data.reg
                                for(var i=0;i<rows.length;i++){
                                    var type=res.data.reg[i].time
                                    var ty=type.indexOf("T")
                                    var types=type.slice(0,ty)
                                    rows[i].times=types
                                }
                                this.uvid=rows
                                this.uf=true
                                this.ut=false
                    }else{
                        alert("该用户未发布任何视频")
                    }
                })
            }else if(e=="res"){
                $.preventDefault()
                if(this.name!="" && this.pass!="" && this.phone!="" && this.email!="" && this.sign!="" && this.sex!="" && this.birth!=""){
                    var postdata=`name=${this.name}&pass=${this.pass}&phone=${this.phone}&email=${this.email}&sign=${this.sign}&sex=${this.sex}&birth=${this.birth}`
                    axios.post("http://127.0.0.1:5050/complex/add",postdata).then(res=>{
                        if(res.data.code==1){
                            alert("用户添加成功")
                        }else{
                            alert("用户添加失败")
                        }
                    })
                }else{
                    alert("请将信息填写完整")
                }
            }else if(e=="del"){
                $.preventDefault()
                var firm=confirm("确定删除此用户？")
                if(firm){
                    // axios,get().then()
                    this.puser.splice(l,1)
                }
            }else if(e=="ban"){
                $.preventDefault()
                axios.get("http://127.0.0.1:5050/complex/uidvid?ban=1&uid="+i).then(res=>{
                    if(res.data.code==1){
                        this.puser[l].comd="该用户已被禁言"
                        console.log(this.puser)
                        // this.public()
                    }else{
                        alert("禁言失败")
                    }
                })
            }else if(e=="banvid"){
                $.preventDefault()
                axios.get("http://127.0.0.1:5050/complex/uidvid?ban=1&banvid=1&uid="+i).then(res=>{
                    if(res.data.code){
                        this.puser[l].bvidd="该视频已被禁止"
                        console.log(this.puser)
                        // this.public()
                    }else{
                        alert("操作失败")
                    }
                })
            }else if(e=="uban"){
                $.preventDefault()
                axios.get("http://127.0.0.1:5050/complex/ulift?uid="+i).then(res=>{
                    if(res.data.code==1){
                        this.ulift[l].comd="该用户已解除"
                    }else{
                        alert("评论解除失败")
                    }
                })
            }else if(e=="uvid"){
                $.preventDefault()
                axios.get("http://127.0.0.1:5050/complex/ulift?video=1&uid="+i).then(res=>{
                    if(res.data.code=1){
                        this.ulift[l].bvidd="该用户已解除"
                    }else{
                        alert("视频解除失败")
                    }
                })
            }else if(e=="yes"){
                axios.get("http://127.0.0.1:5050/complex/aud?rec=yes&vid="+i).then(res=>{
                    if(res.data.code==1){
                        this.aud.splice(l,1)
                        this.public()
                    }else{
                        alert("操作失败")
                    }
                })
            }else if(e=="no"){
                var pro=prompt("不允许的理由是？")
                if(pro!=null){
                if(pro.length >0 && pro.length<=32){
                    axios.get(`http://127.0.0.1:5050/complex/aud?rec=no&vid=${i}&record=${pro}`).then(res=>{
                        if(res.data.code==1){
                            this.aud.splice(l,1)
                            this.public()
                        }else{
                            alert('操作失败')
                        }
                    })
                }else{
                    alert("内容太多，请简短陈述")
                }   }
                    
            }
            else if(e=="next"){
                i.preventDefault()
                this.page++
                this.pages()  
            }else if(e=="prev"){
                i.preventDefault()
                this.page=this.page-1
                if(this.page<1){
                    this.page=1
                }
                this.pages() 
            }else if(e=="play"){
                $.preventDefault()
                // location.href="http://127.0.0.1:5050/html/video.html?vid="+i
                
                for(var v of this.admin){
                    v.ad=true
                }
                this.admin[8].ad=false
            }
        },
        pages(){
            axios.get("http://127.0.0.1:5050/complex/gvidpage?idx="+this.page).then(res=>{
                if(res.data.code==1){
                    var rows=res.data.reg
                                for(var i=0;i<rows.length;i++){
                                    var type=res.data.reg[i].time
                                    var ty=type.indexOf("T")
                                    var types=type.slice(0,ty)
                                    rows[i].times=types
                                }
                        this.allvid=rows
                }else if(res.data.code==0){
                    this.page=this.page-1
                    alert("无法翻页，本页以是最后一页")
                }
            })
        },
        ban(e,i,$,l){
            if(e=="ban"){
                $.preventDefault()
                axios.get("http://127.0.0.1:5050/complex/uidvid?ban=1&uid="+i).then(res=>{
                    if(res.data.code==1){
                        this.puser[l].comd="该用户已被禁言"
                        console.log(this.puser)
                        // this.public()
                    }else{
                        alert("禁言失败")
                    }
                })
            }else if(e=="banvid"){
                $.preventDefault()
                axios.get("http://127.0.0.1:5050/complex/uidvid?ban=1&banvid=1&uid="+i).then(res=>{
                    if(res.data.code){
                        this.puser[l].bvidd="该视频已被禁止"
                        console.log(this.puser)
                        // this.public()
                    }else{
                        alert("操作失败")
                    }
                })
            }
        },
        playvids(e,time,name,title,video){
            e.preventDefault()
            for(var v of this.admin){
                v.ad=true
            }
            this.admin[8].ad=false
            this.playvid[0]=time
            this.playvid[1]=name
            this.playvid[2]=title
            this.playvid[3]=video
        },
        items(i,e){
            e.preventDefault();
            for(var l of this.list){
                l.cb=true
            }
            this.list[i].cb=false
        },
        jump(i,e){
            for(var a of this.admin){
                a.ad=true
            }
            if(i==0){
                if(e==0){
                    this.admin[1].ad=false
                }else if(e==1){
                    this.admin[2].ad=false
                    this.public()
                }
            }else if(i==1){
                if(e==0){
                    this.admin[3].ad=false
                }else if(e==1){
                    this.admin[4].ad=false
                }
            }else if(i==2){
                if(e==0){
                    this.admin[5].ad=false
                }else if(e==1){
                    this.admin[6].ad=false
                }
            }else if(i==3){
                if(e==0){
                    this.admin[7].ad=false
                }
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
                    axios.get('http://127.0.0.1:5050/complex/adnum').then(res=>{
                    this.index[0]=res.data.video
                    this.index[1]=res.data.uid
                    this.index[2]=res.data.play
                    this.index[3]=res.data.comment
                    this.index[4]=res.data.hits
                    this.index[5]=res.data.aud
                 })
                 axios.get("http://127.0.0.1:5050/complex/gvid").then(res=>{
                     if(res.data.code==1){
                        var rows=res.data.reg
                                for(var i=0;i<rows.length;i++){
                                    var type=res.data.reg[i].time
                                    var ty=type.indexOf("T")
                                    var types=type.slice(0,ty)
                                    rows[i].times=types
                                }
                        this.allvid=rows
                     }else if(res.data.code==0){
                        alert("目前无任何用户发布视频")
                     }
                 })
                 axios.get("http://127.0.0.1:5050/complex/vidse").then(res=>{
                    if(res.data.code==1){
                        this.userlist=res.data.reg
                        var row=res.data.reg
                        for(var r of row){
                            if(r.com=="1"){
                                r.comd="该用户已被禁言"
                            }else{
                                r.comd="禁止该用户评论"
                            }
                            if(r.bvid=="1"){
                                r.bvidd="用户已被禁止"
                            }else{
                                r.bvidd="禁止该用户发布视频"
                            }
                        }
                        this.puser=row
                    }else{
                        alert("系统无用户")
                    }
                 })
                 axios.get("http://127.0.0.1:5050/complex/ulift?sec=1").then(res=>{
                    if(res.data.code==1){
                        var row=res.data.reg
                        for(var r of row){
                            if(r.com=="1"){
                                r.comd="解除评论"
                            }else{
                                r.comd="未限制评论"
                            }
                            if(r.bvid=="1"){
                                r.bvidd="解除视频权限"
                            }else{
                                r.bvidd="视频未限权"
                            }
                        }
                        this.ulift=row
                    }else{
                        //无用户违规用户
                    }
                 })
                 axios.get("http://127.0.0.1:5050/complex/aud?first=1").then(res=>{
                            if(res.data.code==1){
                                var rows=res.data.reg
                                for(var i=0;i<rows.length;i++){
                                    var type=res.data.reg[i].time
                                    var ty=type.indexOf("T")
                                    var types=type.slice(0,ty)
                                    rows[i].times=types
                                }
                                this.aud=rows
                            }else{
                                this.aud=[]
                                //视频已全审核完毕
                            }
                        })
                axios.get("http://127.0.0.1:5050/complex/aud?first=0").then(res=>{
                        if(res.data.code==1){
                            var rows=res.data.reg
                                for(var i=0;i<rows.length;i++){
                                    var type=res.data.reg[i].time
                                    var ty=type.indexOf("T")
                                    var types=type.slice(0,ty)
                                    rows[i].times=types
                                }
                            this.rec=rows
                        }else if(res.data.code==0){
                            //未有审核记录
                        }
                })
                // for(var i=0;i<this.admin.length;i++){
                //     if(i==0){
                //         this.admin[i].ad=false
                //     }
                //         this.admin[i].ad=true
                // }
                }else{
                    this.user[0]="未登录"
                    this.user[2]=false
                    this.user[3]='http://127.0.0.1:5050/head/login.png'
                    location.replace("http://127.0.0.1:5050/html/index.html")
                }
            })
            axios.get('http://127.0.0.1:5050/index/adlist').then(res=>{
                this.list=res.data
            })
            axios.get("http://127.0.0.1:5050/complex/adnum?hits=1")
        }
    },
    created(){
        this.public()
    }
})
axios.get("http://127.0.0.1:5050/complex/adnum").then(res=>{
    var admin=res.data
    var ech=document.getElementById("echarts")
            var myech=echarts.init(ech)
            var option={
                title: {
                    text: '系统总体概况柱状图',
                    subtext: '视频学习系统'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: ['待审核视频','系统访问量','视频互动总数','视频播放量','用户数','视频发布数']
                },
                series: [
                    {
                        name: '视频学习系统',
                        type: 'bar',
                        data: [admin.aud, admin.hits, admin.comment, admin.play, admin.uid, admin.video]
                    }
                ]
            }
        myech.setOption(option)
})

