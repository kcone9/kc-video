var obj={
    user:'',userc:'',users:'',
    pass:'',passc:'',passs:'',
    pass2:'',pass2c:'',pass2s:'',
    phone:'',phonec:'',phones:'',
    email:'',emailc:'',emails:'',
    act:true,uid:0
}
var data=new Vue({
    el:"#forget",
    data:obj,
    methods:{
        go(e,p){
            e.preventDefault()
            if(p=="forget"){
                if(this.userc=='success' && this.phonec=='success' && this.emailc=='success'){
                    var post=`name=${this.user}&phone=${this.phone}&email=${this.email}`
                    axios.post("http://127.0.0.1:5050/user/forget",post).then(res=>{
                        if(res.data.code==1){
                            this.act=false
                            console.log(res.data.reg)
                            this.uid=res.data.reg[0].uid
                        }else{
                            alert("用户名与绑定信息不匹配")
                        }
                    })
    
                }else{
                    alert("输入信息有误")
                }
            }else if(p=="pass"){
                if(this.pass!= "" && this.pass2!=""){
                if(this.pass==this.pass2){
                    var post=`uid=${this.uid}&pass=${this.pass}`
                    axios.post("http://127.0.0.1:5050/user/forget",post).then(res=>{
                        if(res.data.code==1){
                            alert("修改成功！密码已被重置")
                            location.replace("http://127.0.0.1:5050/html/index.html")
                        }else if(res.data.code==0){
                            alert("修改失败")
                        }
                    })
                }else{
                    alert("密码不一致")
                }   }
            }
        }
    },
    watch:{
        user:function(){  
            if(!(this.user.length>=3 && this.user.length<=8)){
                this.userc='error';
                this.users='fa fa-times-circle fa-2x'
            }else{
                this.userc='success';
                this.users='fa fa-check-circle fa-2x'
                this.islogin=true
            }
            if(this.user.length==''){
                this.userc='';
                this.users=''
            }
        },
        pass:function(){
            var reg=/^[a-zA-z0-9]{8,16}$/g;
            if(reg.test(this.pass)==true ){
                this.passc='success';
                this.passs='fa fa-check-circle fa-2x'
            }else{
                this.passs='error';
                this.passc='fa fa-times-circle fa-2x'
            }
            if(this.pass==''){
                this.passs='',
                this.passc=''
            }
        },
        pass2:function(){
            var reg=/^[a-zA-z0-9]{8,16}$/g;
            if(reg.test(this.pass)==true && this.pass2==this.pass){
                this.pass2c='success';
                this.pass2s='fa fa-check-circle fa-2x'

            }else{
                this.pass2c='error';
                this.pass2s='fa fa-times-circle fa-2x'
            }
            if(this.pass2==''){
                this.pass2s='',
                this.pass2c=''
            }
        },
        phone:function(){
            if(this.phone.search(/^1[3-8]\d{9}$/ig)!=-1){
                this.phonec='success';
                 this.phones='fa fa-check-circle fa-2x';
                 
            }else{
                this.phonec='error';
                this.phones='fa fa-times-circle fa-2x';
            }
            if(this.phone==''){
                this.phonec='';
                this.phones=''
                
            }
        },
        email:function(){
            if(this.email.search(/^(\w{1,20})@(\w{1,10}).com/ig)!=-1){
                this.emailc='success';
                this.emails='fa fa-check-circle fa-2x'
                
            }else{
                this.emailc='error';
                this.emails='fa fa-times-circle fa-2x'
                
            }
            if(this.email==''){
                this.emailc='';
                this.emails=''
                
            }
        }
    },
    created:()=>{

    }
        
    
});










