var obj = {
    name: '', palytime: 0,
    asi: { witdth: '0%', visibility: "hidden", opacity: "0" },
    body: { width: '100%' }, sub: "订阅", fav: false, pro: 0,
    vid: { height: "48%" },
    asi_hu: { visibility: "hidden" }, user: ["未登录", 0, false, "http://127.0.0.1:5050/head/login.png", 0, 0, 0],
    num: 2, list: [], video: [], vidlist: [], comment: [], content: "",
    writer: { opacity: "1", visibility: "visible" }
}
axios.defaults.withCredentials = true
new Vue({
    el: '#main',
    data: obj,
    methods: {
        work(e) {
            e.preventDefault()
            this.num++;
            if ((this.num) % 2 == 0) {
                this.body.width = '100%';
                this.asi.width = '0%';
                this.asi.visibility = "hidden"
                this.asi_hu.visibility = "hidden";
                this.asi.opacity = "0"
                this.vid.height = "48%"
                this.writer.opacity = "1";
                this.writer.visibility = "visible"
            } else {
                this.body.width = '80%';
                this.asi.width = '20%';
                this.asi.visibility = "visible"
                this.asi_hu.visibility = "visible"
                this.asi.opacity = "1"
                this.vid.height = "36%"
                this.writer.opacity = "0"
                this.writer.visibility = "hidden"
            }
        },
        bodys(e, t) {
            e.preventDefault()
            if (t == true) {
                location.href = "http://127.0.0.1:5050/html/body.html"
            } else {
                if (this.user[2]) {
                    if (this.user[1] == this.video.uid) {
                        alert("不可订阅自己的内容")
                    } else {
                        axios.get(`http://127.0.0.1:5050/user/sub?uid=${this.user[1]}&wuid=${this.video.uid}`).then(res => {
                            if (res.data.code == 1) {
                                this.sub = "已订阅"
                            } else {
                                this.sub = "订阅"
                            }
                        })
                    }
                } else {
                    alert("未登录，无法订阅")
                }
            }
        },
        jump(i, e) {
            if (i == 0) {
                location.href = "http://127.0.0.1:5050/html/primess.html?e=" + e
            } else if (i == 1) {
                location.href = "http://127.0.0.1:5050/html/message.html?e=" + e
            } else if (i == 2) {
                location.href = "http://127.0.0.1:5050/html/myvideo.html?e=" + e
            } else if (i == 3) {
                location.href = "http://127.0.0.1:5050/html/fav.html?e=" + e
            } else if (i == 4) {
                location.href = "http://127.0.0.1:5050/html/fav.html?e=" + e
            } else if (i == 5) {
                location.href = "http://127.0.0.1:5050/html/fav.html?e=" + e
            }
        },
        go(v, e) { //视频播放时计算时长，暂停停止计算
            if (e == 1) {
                var video = v.target
                video.addEventListener("timeupdate", () => {
                    var time = Math.floor(video.currentTime)
                    if(time>5){
                        this.palytime = time
                    }
                })
                axios.get("http://127.0.0.1:5050/complex/play?vid=" + this.video.vid)
                gorec(this.user[2], this.video.vid, this.user[1], this.palytime, this.video.uid, this.video.title, this.video.img, this.user[0])
            } else {

                gorec(this.user[2], this.video.vid, this.user[1], this.palytime, this.video.uid, this.video.title, this.video.img, this.user[0])
                if (this.palytime != undefined && this.palytime != NaN) {
                    axios.get(`http://127.0.0.1:5050/video/vidtimes?vid=${this.video.vid}&progress=${this.palytime}&uid=${this.user[1]}`)
                }
            }
            function gorec(a, b, c, d, e, f, g, h) {
                if (a) {
                    axios.get(`http://127.0.0.1:5050/video/rec?rec=1&vid=${b}&uid=${c}&progress=${d}&wuid=${e}&title=${f}&video=${g}&name=${h}`).then(res => {
                        // console.log(res.data)
                    })
                } else {
                    console.log("未登录")
                }
            }
        },
        items(i, e) {
            e.preventDefault();
            for (var l of this.list) {
                l.cb = true
            }
            this.list[i].cb = false
        },
        addcom() {
            if (this.content == "") {
                alert("未输入内容")
            } else {
                if (this.user[2]) {
                    var postdata = `content=${this.content}&uid=${this.user[1]}&vid=${this.video.vid}`
                    axios.post("http://127.0.0.1:5050/video/addcomment", postdata).then(res => {
                        if (res.data.code == "1") {
                            alert("评论成功")
                            this.public()
                        } else if (res.data.code = 10) {
                            alert("您被禁言，无法评论")
                        } else {
                            alert("评论失败")
                        }
                    })
                } else {
                    alert("您未登录")
                }
            }
        },
        uplike(i, p) {
            if (i == 1) {
                var sql = "http://127.0.0.1:5050/user/ulike?liked=1&cid=" + p
            } else if (i == 0) {
                var sql = "http://127.0.0.1:5050/user/ulike?&cid=" + p
            }
            axios.get(sql).then(res => {
                if (res.data.code == 1) {
                    this.public()
                } else if (res.data.code == 0) {
                    alert("点赞失败")
                }
            })
        },
        like(e) {
            var islogin = () => {
                if (this.user[2]) {
                    return true
                } else {
                    alert("请登录!")
                    return false
                }
            }
            var gologin = islogin()
            if (e == 0) {
                if (gologin) {
                    axios.get(`http://127.0.0.1:5050/video/like?like=1&uid=${this.user[1]}&vid=${this.video.vid}`).then(res => {
                        this.public()
                    })
                }
            } else if (e == 1) {
                if (gologin) {
                    axios.get(`http://127.0.0.1:5050/video/like?fav=1&uid=${this.user[1]}&vid=${this.video.vid}`).then(res => {
                        if (res.data.code == "200") {
                            alert("已关注")
                            // this.fav=true
                            this.public()
                        } else if (res.data.code == "211") {
                            alert("关注已取消")
                            // this.fav=false
                            this.public()
                        }
                    })
                }
            } else if (e == 2) {
                if (gologin) {
                    axios.get(`http://127.0.0.1:5050/video/like?like=0&uid=${this.user[1]}&vid=${this.video.vid}`).then(res => {
                        this.public()
                    })
                }
            }
        },/*
        mouse(e,i){
            if(e==1){
                for(var o of this.vidlist){
                    o.mou==true
                }
                this.vidlist[i].mou==false
                console.log(111)
            }else if(e==0){
                for(var o of this.vidlist){
                    o.mou==true
                }
                console.log(222)
            }
        },*/
        login(e, i) {
            if (e == 1) {
                if (this.user[2] == false) {
                    location.href = "http://127.0.0.1:5050/html/index.html"
                }
            } else if (e == 0) {
                location.href = "http://127.0.0.1:5050/html/video.html?vid=" + this.vidlist[i].vid
            } else {
                if (this.user[2]) {
                    axios.get("http://127.0.0.1:5050/user/islogin?no=0").then(res => {
                        if (res.data.code == 0) {
                            alert("用户已注销")
                            this.public()
                        }
                    })
                } else {
                    alert("您没登录无法注销")
                }
            }
        },
        public() {
            axios.get('http://127.0.0.1:5050/index/list').then(res => {
                for (var li of res.data) {
                    li.cb = true
                }
                this.list = res.data
            })
            var id = location.search.split('=')[1]
            if (id) {
                var uid = null
                axios.get("http://127.0.0.1:5050/video/vid?vid=" + id).then(res => {
                    if (res.data.code == "1") {
                        this.video = res.data.reg[0]
                        uid = res.data.reg[0].uid

                    } else {
                        location.replace("http://127.0.0.1:5050/html/body.html")
                        alert("视频已被和谐")

                    }
                    if (uid) {console.log(uid)
                        axios.get("http://127.0.0.1:5050/video/vid?uid=" + uid).then(res => {
                            if (res.data.code == "1") { //------------------
                                var row = res.data.reg  
                                for (var r of row) {
                                    r.cb = false
                                    // r.mou=true
                                    r.pro = 0
                                    r.str = "无浏览进度"
                                    r.strup=""
                                    if (r.progress <=5) {
                                        r.cb=true
                                    } else {
                                        r.strup="观看时长为"
                                        r.pro = r.progress / r.times
                                        var time = r.progress
                                        var h, min, s = 0
                                        s = time
                                        if (time >= 60) {
                                            min = parseInt(time / 60)
                                            s = parseInt(time % 60)
                                            if (min >= 60) {
                                                h = parseInt(min / 60)
                                                min = parseInt(min % 60)
                                            }
                                        }
                                        this.palytime = parseInt(s)
                                        if (min > 0) {
                                            this.palytime = parseInt(min) + "分" + this.palytime+"秒"
                                        }
                                        if (h > 0) {
                                            this.palytime = parseInt(h) + "时" + this.palytime
                                        }
                                        r.str = this.palytime
                                    }
                                }
                                console.log(row)
                                this.vidlist = row
                            } else {
                                alert("无法查询该作者的其他视频")
                            }   //---------------
                        })
                    }
                })
                axios.get(`http://127.0.0.1:5050/video/likes?vid=${id}`).then(res => {
                    if (res.data.code == 0) {
                        this.user[4] = this.user[5] = this.user[6] = 0
                    } else {
                        this.user[4] = res.data[0]
                        this.user[5] = res.data[1]
                        this.user[6] = res.data[2]
                    }
                })
                axios.get("http://127.0.0.1:5050/video/comment?vid=" + id).then(res => {
                    if (res.data.code == "1") {
                        this.comment = res.data.reg
                    } else {
                        //该视频无用户评论
                    }
                })
                axios.get("http://127.0.0.1:5050/user/islogin").then(res => {
                    if (res.data.code == 1) {
                        this.user[0] = res.data.data[1]
                        this.user[1] = res.data.data[0]
                        this.user[2] = true
                        this.user[3] = res.data.data[2]
                        axios.get(`http://127.0.0.1:5050/user/sub?sub=1&uid=${this.user[1]}&wuid=${this.video.uid}`).then(res => {
                            if (res.data.code == 1) {
                                this.sub = "已订阅"
                            } else {
                                this.sub = "订阅"
                            }
                        })
                        axios.get(`http://127.0.0.1:5050/video/fav?uid=${this.user[1]}&vid=${this.video.vid}`).then(res => {
                            if (res.data.code == 1) {
                                //用户已收藏该视频
                                this.fav = true

                            } else {
                                this.fav = false
                            }
                        })
                    } else {
                        this.user[0] = "未登录"
                        this.user[2] = false
                        this.user[3] = 'http://127.0.0.1:5050/head/login.png'
                        this.user[4] = this.user[5] = this.user[6] = 0
                        this.sub = "订阅"
                        alert("未登录")
                        location.replace("http://127.0.0.1:5050/html/index.html")
                    }
                })
            }
            axios.get("http://127.0.0.1:5050/complex/adnum?hits=1")

        }
    },
    created() {
        this.public()
    }
})
var video = document.getElementById("video")
video.addEventListener('canplaythrough', () => {
    var times = Math.floor(video.duration)
    var id = location.search.split('=')[1]
    if (times != NaN && times != undefined) {
        axios.get(`http://127.0.0.1:5050/video/vidtimes?vid=${id}&times=${times}`)
    }


})


