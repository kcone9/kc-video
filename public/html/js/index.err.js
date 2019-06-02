$(function(){
    var $ul=$('.rail>div>.bar')
    var $li=$('.rail>div>.list>li');
    var index=0;
    function next_img(){
        index++;
        if(index>2){
            index=0
        }
        var newdeal;
        if(index==0){
            newdeal=0;
        }else{
            newdeal=parseInt($ul.css('marginLeft'))-1000;
        }
        $ul.css('marginLeft',newdeal+'px');
        list()
    }
    var l=document.querySelectorAll('.list>li');
    setInterval(next_img,5000);
    function list(){
        $li.removeClass('active')
        if(index==1){
          l[1].className='active'
        }else if(index==2){
            l[2].className='active'
        }else{
            l[0].className='active'
        }
    }
    $li.click(function(){
        $li.removeClass('active')
        $lg=$(this)
        var go;
        if($lg.val()==0){
            index==0;go=0
        }else if($lg.val()==1){
            index=1;go=-1000
        }else{
            index=2;go=-2000
        }
        $ul.css('marginLeft',go+'px')
        $lg.addClass('active')
    })//轮播图结束


})







