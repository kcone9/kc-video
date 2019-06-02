axios.defaults.withCredentials = true
var obj = {
    asi: { witdth: '20%', visibility: "visible", opacity: "1" },
    body: { width: '80%' }, user: ["未登录", 0, false, "http://127.0.0.1:5050/head/login.png"], myvalue: "", myvalues: 0, web: [],
    vid: { height: "36%" }, fav: [], sub: [], search: "", dy: [], textarea: { backgroundColor: "#e5e9ef", border: 0 }, com: [], dtitle: "",
    asi_hu: { visibility: "visible" }, islogin: "", input: "", inputnum: 50, chats: { default: "没有更多消息了", name: "", head: "", uid: 0 },
    num: 1, list: [], myvideo: { width: "25%" }, myvid: [{ id: 0, vid: false }, { id: 1, vid: true }, { id: 2, vid: true }, { id: 3, vid: true }, { id: 4, vid: true }]
}
var data = new Vue({
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
                this.myvideo.width = "20%"
            } else {
                this.body.width = '80%';
                this.asi.width = '20%';
                this.asi.visibility = "visible"
                this.asi_hu.visibility = "visible"
                this.asi.opacity = "1"
                this.vid.height = "36%"
                this.myvideo.width = "25%"
            }
        },
        login(e) {
            if (e == 1) {
                if (this.user[2] == false) {
                    location.href = "http://127.0.0.1:5050/html/index.html"
                }
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
        bodys(e, item, i) {
            if (e == "jump") {
                location.href = "http://127.0.0.1:5050/html/body.html"
            } else if (e == "textarea") {
                this.textarea.backgroundColor = "#fff"
                this.textarea.border = "1px solid #00a1d6"
            } else if ('out') {
                this.textarea.backgroundColor = "#e5e9ef"
                this.textarea.border = 0
            }
        },
        comgo($, p, e, i) {
            if (p == "comment") {
                for (var c of this.dy) {
                    c.com = true
                }
                this.dy[i].com = false
            } else if (p == "send") {
                $.preventDefault()
                i = parseInt(i)
                if (e == undefined || e == null || e == false) {
                    alert("订阅用户的视频暂时不能发表评论")
                } else {
                    if (this.dtitle != "") {
                        console.log(this.user[1],this.dtitle,i,e)
                        axios.get(`http://127.0.0.1:5050/complex/comment?uid=${this.user[1]}&dtitle=${this.dtitle}&duid=${i}&did=${e}`).then(res => {
                            if (res.data.code == 1) {
                                this.public()
                            } else if (res.data.code == 0) {
                                alert("评论失败")
                            }
                        })
                    }
                }
            }else if(p=="play"){
                if(e !=undefined){
                    location.href="http://127.0.0.1:5050/html/video.html?vid="+e
                }
            }
        },
        favn(e) {
            if (this.user[2]) {
                axios.get(`http://127.0.0.1:5050/video/favs?uid=${this.user[1]}&vid=${e}`).then(res => {
                    if (res.data.code == 1) {
                        this.public()
                    } else {
                        alert("取消失败！")
                    }
                })
            } else {
                alert("未登录")
            }
        },
        items(i, e) {
            e.preventDefault();
            for (var l of this.list) {
                l.cb = true
            }
            this.list[i].cb = false
        },
        jump(i, e) {
            if (i == 0) {
                location.href = "http://127.0.0.1:5050/html/primess.html?e=" + e
            } else if (i == 1) {
                location.href = "http://127.0.0.1:5050/html/message.html?e=" + e
            } else if (i == 2) {
                location.href = "http://127.0.0.1:5050/html/myvideo.html?e=" + e
            } else if (i == 3) {
                this.jumps(0)
            } else if (i == 4) {
                this.jumps(1)
            } else if (i == 5) {
                this.jumps(2)
            }
        },
        jumps(e) {
            for (var a of this.myvid) {
                a.vid = true
            }
            if (e == '0') {
                this.myvid[0].vid = false
            } else if (e == "1") {
                this.myvid[1].vid = false
                this.myvid[3].vid = false
            }
            else if (e == "2") {
                this.myvid[2].vid = false
                if (this.user[2] == false) {
                    alert("未登录")
                }
            }
        },
        chat(e, uid, head, name) {
            e.preventDefault()
            socket = new WebSocket("ws://127.0.0.1:5060/foo")
            socket.onmessage = (e) => {
                var row = {}
                var go = e.data
                var ty1 = go.indexOf("&1")
                var types1 = go.slice(0, ty1)
                row.uid = types1
                var ty2 = go.indexOf("&2")
                var types2 = go.slice(ty1 + 2, ty2)
                row.head = types2
                var ty3 = go.indexOf("&3")
                var types3 = go.slice(ty2 + 2, ty3)
                row.neme = types3
                var types4 = go.slice(ty3 + 2, go.length)
                row.value = types4
                row.li = true
                row.img = true
                if (this.web != undefined || this.web != null) {
                    this.web.push(row)
                } else {
                    var list = []
                    list.push(row)
                    this.web = list
                }
                for (var i = 0; i < this.web.length; i++) {
                    if (this.user[1] == this.web[i].uid) {
                        this.web[i].li = true
                        this.web[i].img = true
                    } else {
                        this.web[i].li = false
                        this.web[i].img = false
                    }
                    /*if(this.web[i].uid!=uid){
                        this.web[i].split(i,1)
                    }*/
                }
                console.log(this.web)
            }
            this.myvid[3].vid = true
            this.myvid[4].vid = false
            this.chats.uid = uid
            this.chats.head = head
            this.chats.name = name
            this.chats.default = ""
            return socket
        },
        send() {
            var obj = `${this.user[1]}&1${this.user[3]}&2${this.chats.name}&3${this.myvalue}`
            socket.send(obj)
            this.myvalue = ""
        },
        all(p, e, i, item, did) {
            e.stopPropagation()
            if (p == "false") {
                if (this.dy[i]) {
                    for (var d of this.dy) {
                        d.cb = true
                    }
                    this.dy[i].cb = false
                } else {
                    for (var d of this.dy) {
                        d.cb = true
                    }
                    this.dy[i].cb = false
                }
            } else if (p == "true") {
                for (var d of this.dy) {
                    d.cb = true
                }
            } else if (p == "no") {
                if (this.user[2]) {
                    if (this.$refs.myvalue[item].innerText == "取消关注") {
                        axios.get(`http://127.0.0.1:5050/user/sub?uid=${this.user[1]}&wuid=${i}`).then(res => {
                            if (res.data.code == 0) {
                                this.public()
                            } else {
                                alert("未知错误")
                            }
                        })
                    } else if (this.$refs.myvalue[item].innerText == "删除动态") {
                        axios.get("http://127.0.0.1:5050/complex/dy?del=1&did=" + did).then(res => {
                            if (res.data.code == 1) {
                                this.public()
                            } else if (res.data.code == 0) {
                                alert("修改失败")
                            }
                        })
                    }

                } else {
                    alert("请登录")
                }
            } else if (p == "go") {
                if (this.input == "" || this.input == null) {
                    alert("内容不能为空")
                } else {
                    if (this.user[2]) {
                        axios.get(`http://127.0.0.1:5050/complex/dy?uid=${this.user[1]}&utitle=${this.input}`).then(res => {
                            if (res.data.code == 1) {
                                this.public()
                            } else {
                                alert("发布失败")
                            }
                        })
                    } else {
                        alert("未登录")
                    }
                }
            }
        },
        public() {
            axios.get("http://127.0.0.1:5050/user/islogin").then(res => {
                if (res.data.code == 1) {
                    this.user[0] = res.data.data[1]
                    this.user[1] = res.data.data[0]
                    this.user[2] = true
                    this.user[3] = res.data.data[2]
                    this.islogin = ""
                    if (this.user[2]) {
                        axios.get("http://127.0.0.1:5050/video/favs?uid=" + this.user[1]).then(res => {
                            this.row(res.data.obj.reg, res.data.obj.favs)
                        })
                        axios.get("http://127.0.0.1:5050/user/fsub?uid=" + this.user[1]).then(res => {
                            if (res.data.code == 1) {
                                this.sub = res.data.reg
                            } else {
                                if (this.myvid[1].vid == false) {
                                    alert("此账户未做任何订阅")
                                }
                            }
                        })
                        axios.get("http://127.0.0.1:5050/complex?uid=" + this.user[1]).then(res => {
                            if (res.data.code == 1) {
                                var rows = res.data.reg.reg
                                for (var i = 0; i < rows.length; i++) {
                                    var type = rows[i].time
                                    var ty = type.indexOf("T")
                                    var types = type.slice(0, ty)
                                    rows[i].times = types
                                }
                                for (var c of rows) {
                                    c.cb = true
                                    c.com = true
                                    if (c.type == 1) {
                                        c.cbs = false
                                    } else if (c.type == 2) {
                                        c.cbs = true
                                    } else if (c.type == 3) {
                                        c.cbs = true
                                    }
                                }
                                rows.sort(function (b, a) {
                                    if (a.time > b.time) {
                                        return 1
                                    } else if (a.time < b.time) {
                                        return -1
                                    } else {
                                        if (a.time > b.time) {
                                            return -1
                                        } else if (a.time < b.time) {
                                            return 1
                                        }
                                        return 0
                                    }
                                })
                                this.com=[]
                                rows.forEach((x, i) => {
                                    if (x.type == 4) {
                                        this.com.push(rows[i])
                                    }
                                })
                                console.log(rows)
                                this.dy = rows
                            } else {
                                alert("动态获取失败")
                            }
                        })
                    }
                } else {
                    this.user[0] = "未登录"
                    this.user[2] = false
                    this.user[3] = 'http://127.0.0.1:5050/head/login.png'
                    this.islogin = "未登录"
                    alert("未登录")
                    location.replace("http://127.0.0.1:5050/html/index.html")
                }
            })
            axios.get('http://127.0.0.1:5050/index/list').then(res => {
                for (var li of res.data) {
                    li.cb = true
                }
                this.list = res.data
            })
            var id = location.search.split('=')[1]
            if (id) {
                for (var a of this.myvid) {
                    a.vid = true
                }
                this.myvid[id].vid = false
            }
            axios.get("http://127.0.0.1:5050/complex/adnum?hits=1")
        },
        row(e, f2) {
            var rows = e
            for (var i = 0; i < e.length; i++) {
                var type = e[i].liketime
                var ty = type.indexOf("T")
                var types = type.slice(0, ty)
                rows[i].ltime = types
            }
            for (var i = 0; i < e.length; i++) {
                var type = e[i].reltime
                var ty = type.indexOf("T")
                var types = type.slice(0, ty)
                rows[i].rtime = types
            }
            for (var f of rows) {
                f.cb = true
            }
            for (var i = 0; i < f2.length; i++) {
                rows[i].fav = f2[i]
            }
            this.fav = rows
        },
        mouse(e, p, i) {
            if (e == "false") {
                for (var f of this.fav) {
                    f.cb = true
                }
            } else if (e == "true") {
                p.preventDefault()
                if (this.user[2]) {
                    this.user[1]
                    axios.get(`http://127.0.0.1:5050/user/sub?uid=${this.user[1]}&wuid=${i}`).then(res => {
                        if (res.data.code == 1) {
                        } else if (res.data.code == 0) {
                            this.public()
                        }
                    })
                } else {
                    alert("未登录")
                }
            } else if (e == "search") {
                if (this.search != "") {
                    if (this.user[2]) {
                        axios.get(`http://127.0.0.1:5050/video/favlike?uid=${this.user[1]}&title=${this.search}`).then(res => {
                            if (res.data.code == 1) {
                                this.row(res.data.obj.reg, res.data.obj.favs)
                            } else if (res.data.code == 0) {
                                alert("无任何结果，请更换搜索词")
                            }
                        })
                    } else {
                        alert("未登录")
                    }
                } else {
                    alert("输入结果为空")
                }
            } else {
                this.fav[e].cb = false
            }
        }
    },
    created() {
        this.public()
    },
    watch: {
        input: function () {
            this.inputnum = 50 - this.input.length

        },
        myvalue: function () {
            this.myvalues = this.myvalue.length
        }
    }

})



