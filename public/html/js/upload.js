document.addEventListener('DOMContentLoaded',function(){ 
var obj={
    asi:{witdth:'20%',visibility:"visible",opacity:"1"},
    body:{width:'80%'},
    vid:{height:"36%"},
    asi_hu:{visibility:"visible"},
    num:1,
    act1:true,act2:true,act3:true,file:""
}
var go=new Vue({
    el:"#main",
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
        go(){
            var up=document.getElementById("up");
            if(up.value!=""){
                var form=document.forms[0]
                form.submit()
            }else{
                alert("您没选择文件！")
            }
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
    }

})
})












