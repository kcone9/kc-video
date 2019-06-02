axios.defaults.withCredentials=true
Vue.prototype.$http=axios
var obj={
    asi:{witdth:'20%',visibility:"visible",opacity:"1"},
    body:{width:'80%'},user:["未登录",0,false,"http://127.0.0.1:5050/head/login.png"],
    vid:{height:"36%"},rec:[],
    asi_hu:{visibility:"visible"},vidmin:[],
    num:1,list:[],myvideo:[{id:0,my:false},{id:1,my:true},{id:2,my:true}],govid:{width:"25%",height:"28%"},
    act1:true,act2:true,act3:true
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
                this.govid.width="20%"
                this.govid.height="28%"
            }else{
                this.body.width='80%';
                this.asi.width='20%';
                this.asi.visibility="visible"
                this.asi_hu.visibility="visible"
                this.asi.opacity="1"
                this.vid.height="36%"
                this.govid.width="25%"
                this.govid.height="28%"
            }
        },
        bodys(e,i,id){
            if(e=="jump"){
                location.href="http://127.0.0.1:5050/html/body.html"
            }else if(e=="all"){
                if(this.user[2]){
                    var frim=confirm("您确定删除全部视频吗？")
                    if(frim){
                        if(this.vidmin.length>0){
                            axios.get("http://127.0.0.1:5050/video/vidmin?del=all&uid="+this.user[1]).then(res=>{
                                if(res.data.code==1){
                                    this.public()
                                }
                            })
                        }else{
                            alert("无视频")
                        }
                    }
                }else{
                    alert("未登录")
                }
            }else if(e=="only"){
                if(this.user[2]){
                    axios.get("http://127.0.0.1:5050/video/vidmin?del=only&vid="+i).then(res=>{
                        if(res.data.code==1){
                            this.public()
                        }else{
                            alert("删除失败")
                        }
                    })
                }else{
                    alert("未登录")
                }
            }else if(e=="play"){
                location.href="http://127.0.0.1:5050/html/video.html?vid="+id
            }else if(e=="?"){

            }
        },
        videtail(e){
            location.href="http://127.0.0.1:5050/html/video.html?vid="+e
        },
        del(e){
            if(this.user[2]){
                if(e=="all"){
                    var firm=confirm("您确定清空所有浏览记录?")
                    if(firm){
                        axios.get("http://127.0.0.1:5050/video/delrec?all=1&uid="+this.user[1]).then(res=>{
                        if(res.data.code==1){
                            this.public()
                            alert("您已清空浏览记录，请手动刷新")
                        }else{
                            alert("错误！无法清空")
                        }
                    })
                    }
                }else{
                    axios.get("http://127.0.0.1:5050/video/delrec?rid="+e).then(res=>{
                        if(res.data.code==1){
                            this.public()
                        }else{
                            alert("数据错误！")
                        }
                    })
                }
            }else{
                alert("您未登录!")
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
                location.href="http://127.0.0.1:5050/html/message.html?e="+e
            }else if(i==2){
                this.jumps(e)
            }else if(i==3){
                location.href="http://127.0.0.1:5050/html/fav.html?e="+0
            }else if(i==4){
                location.href="http://127.0.0.1:5050/html/fav.html?e="+1
            }else if(i==5){
                location.href="http://127.0.0.1:5050/html/fav.html?e="+2
            }
        },
        jumps(e){
            for(var a of this.myvideo){
                a.my=true
            }
                if(e=='0'){
                    this.myvideo[0].my=false
                }else if(e=="1"){
                    this.myvideo[1].my=false
                }else if(e=="2"){
                    this.myvideo[2].my=false
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
        go(e){
            e.preventDefault()
            var up=document.getElementById("up");
            if(up.value!=""){
                var postdata=new FormData() 
                postdata.append("uid",this.user[1]) 
                postdata.append("file",up.files[0])
                postdata.append("pose","video")
                windowURL = window.URL || window.webkitURL;
                videoURL = windowURL.createObjectURL(up.files[0]);
                var video=document.getElementById("video")
                video.src=videoURL
                var config={
                    headers:{
                        "Content-Type":"multipart/form-data"
                    }
                }
                if(this.user[2]){
                    var pro=prompt("请给您的视频取一个标题","20个字符以内")
                    if(pro !=null && pro !="" && pro.length<=20){
                        postdata.append("title",pro)
                        video.addEventListener("loadeddata",()=>{
                            var canvas = document.createElement("canvas");
                            canvas.width = video.videoWidth * 0.8;
                            canvas.height = video.videoHeight * 0.8;
                            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                            var img = canvas.toDataURL("image/jpg");
                            var imagefile=dataURLtoFile(img,"videocut.png")
                            postdata.append("filem",imagefile)
                            function dataURLtoFile(dataurl, filename) {
                                var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                                while(n--){
                                    u8arr[n] = bstr.charCodeAt(n);
                                    }
                                return new File([u8arr], filename, {type:mime});
                            }
                            axios.post("http://127.0.0.1:5050/video/party",postdata,config).then(res=>{
                                if(res.data.code==1){
                                    alert("视频上传成功")
                                }else{
                                    alert("视频上传失败")
                                }
                            })
                        })
                    }else{
                        alert("标题为空或标题字符太长")
                    }
                }else{
                    alert("您未登录")
                }
            }else{
                alert("您未选择文件！")
            }
        },
        public(){
            axios.get("http://127.0.0.1:5050/user/islogin").then(res=>{
                if(res.data.code==1){
                    this.user[0]=res.data.data[1]
                    this.user[1]=res.data.data[0]
                    this.user[2]=true
                    this.user[3]=res.data.data[2]
                        axios.get(`http://127.0.0.1:5050/video/rec?uid=${this.user[1]}`).then(res=>{
                            if(res.data.code==1){
                                var type=res.data.reg.time
                                var rows=res.data.reg
                                for(var i=0;i<res.data.reg.length;i++){
                                    var type=res.data.reg[i].time
                                    var ty=type.indexOf("T")
                                    var types=type.slice(0,ty)
                                    rows[i].times=types
                                }
                                this.rec=rows
                            }else{
                                alert("无观看记录，您未观看视频")
                            }
                        })
                        axios.get("http://127.0.0.1:5050/video/vidmin?uid="+this.user[1]).then(res=>{
                            if(res.data.code==1){
                                var rows=res.data.reg
                                for(var i=0;i<rows.length;i++){
                                    var type=res.data.reg[i].time
                                    var ty=type.indexOf("T")
                                    var types=type.slice(0,ty)
                                    rows[i].times=types
                                }
                                for(var r of rows){
                                    if(r.aud=="0"){
                                        r.audd=false
                                    }else{
                                        r.audd=true
                                    }
                                    if(r.record==''){
                                        r.rec="请耐心等待管理员审核"
                                        r.yes=true
                                        r.no=false
                                    }else{
                                        r.rec=r.record
                                        r.yes=false
                                        r.no=true
                                    }
                                }
                                this.vidmin=rows
                                if(this.vidmin.length==0){
                                    alert("无视频可操作，请发布视频")
                                }
                            }
                        })
                        
                }else{
                    this.user[0]="未登录"
                    this.user[2]=false
                    this.user[3]='http://127.0.0.1:5050/head/login.png'
                    this.user[1]=null
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
        },
        actshow(e){
            if(e==1){
                this.act1=false
            }else if (e==2){
                this.act1=true
            }else if(e==3){
                this.act2=false
            }else if(e==4){
                this.act2=true
            }else if(e==5){
                this.act3=false
            }else if(e==6){
                this.act3=true
            }
        }
    },
    created(){
        this.public()
    }
})




