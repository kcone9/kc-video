axios.defaults.withCredentials=true
var obj={
    name:'',
    pass:""
}
new Vue({
    el:"#app",
    data:obj,
    methods:{
        go(e){
            e.preventDefault()
            var postdata="name="+this.name+"&pass="+this.pass
            axios.post("http://127.0.0.1:5050/user/login",postdata).then(res=>{
                console.log(res.data)
                if(res.data.code==0){
                    alert("登录失败，账户或密码错误")
                }else if(res.data.code==3){
                    alert("欢迎管理员")
                    location.replace("http://127.0.0.1:5050/html/admin.html")
                }else{
                    alert("登录成功！")
                    location.replace("http://127.0.0.1:5050/html/body.html")
                }
            })
        },
        public(){
            axios.get("http://127.0.0.1:5050/complex/adnum?hits=1")
        }
    },
    created(){
        this.public()
    }
})
























