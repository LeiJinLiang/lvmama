/**
 * Created by jinlei on 16/4/25.
 */
var EventUtil={
    addHandler:function(element,type,handler){ //添加事件
        if(element.addEventListener){
            element.addEventListener(type,handler,false);  //使用DOM2级方法添加事件
        }else if(element.attachEvent){                    //使用IE方法添加事件
            element.attachEvent("on"+type,handler);
        }else{
            element["on"+type]=handler;          //使用DOM0级方法添加事件
        }
    },
    removeHandler:function(element,type,handler){  //取消事件
        if(element.removeEventListener){
            element.removeEventListener(type,handler,false);
        }else if(element.detachEvent){
            element.detachEvent("on"+type,handler);
        }else{
            element["on"+type]=null;
        }
    },
    getEvent:function(event){  //使用这个方法跨浏览器取得event对象
        return event?event:window.event;
    },

    getTarget:function(event){  //返回事件的实际目标
        return event.target||event.srcElement;
    },

    preventDefault:function(event){   //阻止事件的默认行为
        if(event.preventDefault){
            event.preventDefault();
        }else{
            event.returnValue=false;
        }
    },

    stopPropagation:function(event){  //立即停止事件在DOM中的传播
        //避免触发注册在document.body上面的事件处理程序
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble=true;
        }
    }
};
var iBase = {
    Id: function(name){
        return document.getElementById(name);
    },
    //设置元素透明度,透明度值按IE规则计,即0~100
    SetOpacity: function(ev, v){
        ev.filters ? ev.style.filter = 'alpha(opacity=' + v + ')' : ev.style.opacity = v / 100;
    }
}
//淡入效果(含淡入到指定透明度)
function fadeIn(elem, speed, opacity){
    /*
     * 参数说明
     * elem==>需要淡入的元素
     * speed==>淡入速度,正整数(可选)
     * opacity==>淡入到指定的透明度,0~100(可选)
     */
    speed = speed || 20;
    opacity = opacity || 100;
    //显示元素,并将元素值为0透明度(不可见)
    elem.style.display = 'block';
    iBase.SetOpacity(elem, 0);
    //初始化透明度变化值为0
    var val = 0;
    //循环将透明值以5递增,即淡入效果
    (function(){
        iBase.SetOpacity(elem, val);
        val += 5;
        if (val <= opacity) {
            setTimeout(arguments.callee, speed)
        }
    })();
}

//淡出效果(含淡出到指定透明度)
function fadeOut(elem, speed, opacity){
    /*
     * 参数说明
     * elem==>需要淡入的元素
     * speed==>淡入速度,正整数(可选)
     * opacity==>淡入到指定的透明度,0~100(可选)
     */
    speed = speed || 20;
    opacity = opacity || 0;
    //初始化透明度变化值为0
    var val = 100;
    //循环将透明值以5递减,即淡出效果
    (function(){
        iBase.SetOpacity(elem, val);
        val -= 5;
        if (val >= opacity) {
            setTimeout(arguments.callee, speed);
        }else if (val < 0) {
            //元素透明度为0后隐藏元素
            elem.style.display = 'none';
        }
    })();
}

//切换tab
var weekend=document.getElementById('weekend');
var holiday=document.getElementById('holiday');
var show_week=document.getElementById('show_week')
var show_holiday=document.getElementsByClassName('tabChange')[1];
EventUtil.addHandler(weekend,'click',function (e) {
    show_holiday.classList=[];
    fadeOut(show_holiday,10,100);
    fadeIn(show_week,10,100);
    show_holiday.style.display='none';
});
EventUtil.addHandler(holiday,'click', function (e) {
    show_week.style.display='none';
    show_week.classList=[];
    fadeOut(show_week,10,100);
    fadeIn(show_holiday,10,100);
});
//广告位上下轮播小动画
window.onload= function () {
    var oBox = document.getElementById("box");
    var oList = oBox.getElementsByTagName("ul")[0];
    var aImg = oBox.getElementsByTagName("a");
    var timer = playTimer = null;
    var index = i = 0;
    var bOrder = true;
    var aTmp = [];
    var aBtn = null;

    //生成数字按钮
    for (i = 0; i < aImg.length; i++) aTmp.push("<li>" + (i + 1) + "</li>");

    //插入元素
    var oCount = document.createElement("ul");
    oCount.className = "count";
    oCount.innerHTML = aTmp.join("");
    oBox.appendChild(oCount);
    aBtn = oBox.getElementsByTagName("ul")[1].getElementsByTagName("li");
    //初始化状态
    cutover();

    //按钮点击切换
    for (i = 0; i < aBtn.length; i++)
    {
        aBtn[i].index = i;
        aBtn[i].onmouseover = function ()
        {
            index = this.index;
            cutover()
        }
    }

    function cutover()
    {
        for (i = 0; i < aBtn.length; i++) aBtn[i].className = "";
        aBtn[index].className = "current";
        startMove(-(index * aImg[0].offsetHeight));
        aBtn[index].style.display='none';
    }

    function next()
    {
        bOrder ? index++ : index--;
        index <= 0 && (index = 0, bOrder = true);
        index >= aBtn.length - 1 && (index = aBtn.length - 1, bOrder = false)
        cutover()
    }

    playTimer = setInterval(next, 3000);

    //鼠标移入展示区停止自动播放
    oBox.onmouseover = function ()
    {
        clearInterval(playTimer)
    };

    //鼠标离开展示区开始自动播放
    oBox.onmouseout = function ()
    {
        playTimer = setInterval(next, 3000)
    };
    function startMove(iTarget)
    {
        clearInterval(timer);
        timer = setInterval(function ()
        {
            doMove(iTarget)
        }, 30)
    }
    function doMove (iTarget)
    {
        var iSpeed = (iTarget - oList.offsetTop) / 10;
        iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
        oList.offsetTop == iTarget ? clearInterval(timer) : oList.style.top = oList.offsetTop + iSpeed + "px"
    }
}

//完全加载动画
EventUtil.addHandler(window,'load',function(){
    var ele=document.getElementsByClassName('fenlei1')[0];
    ele=ele.childNodes[1].children;
    var imgAll=[];
    for(var i=0;i<ele.length;i++){
        var tem=ele[i].childNodes[0].childNodes;
       imgAll.push(tem);
    }
    for(var j=0;j<imgAll.length;j++){
        imgAll[j][0].className='img';
    }
});