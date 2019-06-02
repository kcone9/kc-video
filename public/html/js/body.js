axios.defaults.withCredentials = true
var obj = {
    name: '', user: ["未登录", 0, false, "http://127.0.0.1:5050/head/login.png"],
    asi: { witdth: '20%', visibility: "visible", opacity: "1" },
    body: { width: '80%' }, page: 1, searchs: true, sea: [], seavalue: "",
    vid: { height: "26%" },
    asi_hu: { visibility: "visible" },
    num: 1, publist: [],
    list: []
}
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
                this.vid.height = "26%"
            } else {
                this.body.width = '80%';
                this.asi.width = '20%';
                this.asi.visibility = "visible"
                this.asi_hu.visibility = "visible"
                this.asi.opacity = "1"
                this.vid.height = "26%"
            }
        },
        bodys(e, $) {
            if (e == "body") {
                location.href = "http://127.0.0.1:5050/html/body.html"
            } else if (e == "next") {
                $.preventDefault()
                this.page = this.page + 1
            } else if (e == "prev") {
                $.preventDefault()
                this.page = this.page - 1
                if (this.page < 1) {
                    this.page = 1
                }
            }
            axios("http://127.0.0.1:5050/video/vidpage?idx=" + this.page).then(res => {
                if (res.data.code == 1) {
                    this.list = res.data.reg
                } else {
                    this.page = this.page - 1
                    alert("无法翻页，本页为最后一页")
                }
            })
        },
        fo(e, p) {
            if (p == 1) {
                console.log("打开")
                this.searchs = false
            } else if (p == 0) {
                this.searchs = true
                console.log("关闭")
            }
        },
        myvideo(i) {
            location.href = "http://127.0.0.1:5050/html/video.html?vid=" + this.list[i].vid
        },
        items(i, e) {
            e.preventDefault();
            for (var l of this.publist) {
                l.cb = true
            }
            this.publist[i].cb = false
        },
        search(e, p) {
            e.preventDefault()
            if (p == "java") {
            } else if (p == "php") {
            } else if (p == "python") {
            } else if (p == "any") {
            }
            if (p != "" && p != "any") {
                axios.get("http://127.0.0.1:5050/video/sea?title=" + p).then(res => {
                    if (res.data.code == 1) {
                        this.sea = res.data.reg
                    } else if (res.data.code == 0) {
                        this.sea = [{ title: "无搜索结果！" }]
                    }
                })
            } else if (p == "any") {
                axios.get("http://127.0.0.1:5050/video/sea?title=" + this.seavalue).then(res => {
                    if (res.data.code == 1) {
                        var rows = res.data.reg
                        for (var i = 0; i < rows.length; i++) {
                            var type = rows[i].time
                            var ty = type.indexOf("T")
                            var types = type.slice(0, ty)
                            rows[i].times = types
                        }
                        this.list = rows
                    } else if (res.data.code == 0) {
                        alert("搜索结果为空")
                    }
                })
            }
        },
        jumpsea(e, p) {
            e.preventDefault()
            var type = this.sea[p].time
            var ty = type.indexOf("T")
            var types = type.slice(0, ty)
            this.sea[p].times=types
            var no=[]
            no.push(this.sea[p])
            this.list =no
        },
        jump(i, e) {
            if (i == 0) {
                location.href = "http://127.0.0.1:5050/html/primess.html?e=" + e
            } else if (i == 1) {
                location.href = "http://127.0.0.1:5050/html/message.html?e=" + e
            } else if (i == 2) {
                location.href = "http://127.0.0.1:5050/html/myvideo.html?e=" + e
            } else if (i == 3) {
                location.href = "http://127.0.0.1:5050/html/fav.html?e=" + 0
            } else if (i == 4) {
                location.href = "http://127.0.0.1:5050/html/fav.html?e=" + 1
            } else if (i == 5) {
                location.href = "http://127.0.0.1:5050/html/fav.html?e=" + 2
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
                            this.go()
                        }
                    })
                } else {
                    alert("您没登录无法注销")
                }
            }
        },
        go() {
            axios.get("http://127.0.0.1:5050/user/islogin").then(res => {
                if (res.data.code == 1) {
                    this.user[0] = res.data.data[1]
                    this.user[1] = res.data.data[0]
                    this.user[2] = true
                    this.user[3] = res.data.data[2]
                } else {
                    this.user[0] = "未登录"
                    this.user[2] = false
                    this.user[3] = 'http://127.0.0.1:5050/head/login.png'
                    alert("未登录！")
                    location.replace("http://127.0.0.1:5050/html/index.html")
                }
            })
            axios.get('http://127.0.0.1:5050/video/vid').then(res => {
                this.list = res.data.reg;
                console.log(this.list)
            })
            axios.get('http://127.0.0.1:5050/index/list').then(res => {
                for (var li of res.data) {
                    li.cb = true
                }
                this.publist = res.data
            })
            axios.get("http://127.0.0.1:5050/complex/adnum?hits=1")
        }
    },
    watch: {
        seavalue: function () {
            if (this.seavalue != "") {
                axios.get("http://127.0.0.1:5050/video/sea?title=" + this.seavalue).then(res => {
                    if (res.data.code == 1) {

                        this.sea = res.data.reg
                    } else if (res.data.code == 0) {
                        this.sea = [{ title: "搜索结果为空" }]
                    }
                })
            } else {
                this.sea = [{ title: "请搜索" }]
            }
        }
    },
    created() {
        this.go()

    }
})







