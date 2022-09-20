// 1、获取元素
var _A = document.getElementsByClassName('banner');
var as = document.querySelector('.A').querySelectorAll('a');

//推荐受欢迎的视频  
for (let i = 0; i < as.length; i++) {
    $.ajax({
        url: 'http://127.0.0.1/getVideos',
        type: 'GET',
        data: {},
        dataType: 'json',
        success: function (res) {
            if (res.code == 0) {
                // 从后端导入数据 替换a标签的链接和文本内容 改变背景图片
                as[i].href = res.data[i].videolink;
                as[i].innerHTML = res.data[i].videoname;
                _A[0].style.backgroundImage = "url(" + res.data[0].videoimg + ")";
                // a标签移动绑定事件
                as[i].addEventListener("mouseover", function (event) {
                    //排他思想
                    for (let j = 0; j < as.length; j++) {
                        as[j].className = 'recover';
                    }
                    this.className = 'change';
                })
            }
            else {
                alert('找不到该视频')
            }
        },
        error: function () {
            console.log('出错了')
        }
    })

    // a标签移动绑定事件
    as[i].addEventListener("mouseover", function (event) {
        //排他思想
        $.ajax({
            url: 'http://127.0.0.1/getVideos',
            type: 'GET',
            data: {},
            dataType: 'json',
            success: function (res) {
                if (res.code == 0) {

                    as[i].href = res.data[i].videolink;
                    as[i].innerHTML = res.data[i].videoname;
                    _A[0].style.backgroundImage = "url(" + res.data[i].videoimg + ")";
                    _A[0].style.width = 0;
                }
                else {
                    alert('找不到该视频')
                }
            },
            error: function () {
                console.log('出错了')
            }
        })
        for (let j = 0; j < as.length; j++) {
            as[j].className = 'recover';
        }
        this.className = 'change';
    })
}





// 搜索视频获取元素
var inputSearch = document.querySelector('.search').querySelector('input');
var searchBtn = document.querySelector('.search').querySelector('button');
//搜索视频绑定事件
searchBtn.onclick = function (event) {
    var videoname = $(inputSearch).val()//.value
    console.log(videoname);
    $.ajax({
        url: 'http://127.0.0.1/getOneVideo',
        type: 'POST',
        data: { videoname },
        dataType: 'json',
        success: function (res) {
            if (res.code == 0) {
                window.location.href = '' + res.data.videolink;
            }
            else {
                alert('找不到该视频')
            }
        },
        error: function () {
            console.log('出错了')
        }
    })
    event.preventDefault();
}

// 用户信息获取元素
var userInfo = document.querySelector('#usermodel1>a')
var userimg = document.querySelector('#usermodel1>a>img')
var userInfo1 = document.querySelector('#usermodel1>ul')

var exit = document.querySelector('#exit')
//用户头像绑定事件
$(document).ajaxSend(function (e, xhr, option) {
    if (sessionStorage.getItem('token') != null)
        xhr.setRequestHeader('Authorization', sessionStorage.getItem('token'))
})
var token = sessionStorage.getItem('token');
if (token) {
    $.ajax({
        url: 'http://127.0.0.1/getLoginUser',
        type: 'POST',
        data: { token },
        dataType: 'json',
        success: function (res) {
            console.log(res.data);
            if (res.code == 0) {
                userimg.src = res.data.img;
                userInfo.href = 'http://127.0.0.1/userInfo'
                userInfo.addEventListener("mouseover", function () {
                    this.nextElementSibling.style.display = 'block';
                })
                addEventListener("click", function () {
                    userInfo1.style.display = 'none';
                })
                exit.addEventListener('click', function () {
                    sessionStorage.removeItem('token')
                    exit.href = 'http://127.0.0.1/login';
                })
            }
            else {
                alert('找不到该用户')
            }
        },
        error: function () {
            console.log('出错了')
        }
    })
}
//轮播效果
function animate(obj, target, callback) {
    //先清除以前的定时器，只保留当前的一个定时器执行
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        //步长值写到定时器的里面
        // 把我们的步长值改为整数 不要出现小数的问题
        var step = (target - obj.offsetLeft) / 10;
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
        if (obj.offsetLeft == target) {
            //停止动画 本质是停止定时器
            clearInterval(obj.timer);
            //回调函数写到定时器结束里面
            if (callback) {
                //调用函数
                callback();
            }
        }
        //把每次加1 这个步长值改为一个慢慢变小的值 步长公式：（目标值-现在的位置）/10
        obj.style.left = obj.offsetLeft + step + 'px';
    }, 15);
}
var arrow_l = document.querySelectorAll('.arrow-l');
var arrow_r = document.querySelectorAll('.arrow-r');
var video_img = document.querySelectorAll('.video-img');
var video_imgWidth = video_img[0].offsetWidth;
var ul = [];
for (var i = 0; i < video_img.length; i++) {
    ul.push(video_img[i].querySelector('ul'));
}
var num = [];
for (let i = 0; i < arrow_l.length; i++) {
    num.push('0');
    //下一页
    arrow_r[i].addEventListener('click', function () {
        $(arrow_l[i]).css("pointer-events", "auto");
        $(arrow_l[i]).css("color", "#737577");
        num[i]++;
        animate(ul[i], -num[i] * video_imgWidth, () => {
            console.log(ul[i].offsetLeft)
            if (ul[i].offsetLeft <= -2 * video_imgWidth) {
                $(arrow_r[i]).css("pointer-events", "none");
                $(arrow_r[i]).css("color", "#3b3c3d");
            } else {
                $(arrow_r[i]).css("pointer-events", "auto");
                $(arrow_r[i]).css("color", "#737577");
            }
        });

    })

    //上一页
    if (ul[i].offsetLeft === 0) {
        $(arrow_l[i]).css("pointer-events", "none");
    } else {
        $(arrow_l[i]).css("pointer-events", "auto");
    }
    arrow_l[i].addEventListener('click', function () {
        $(arrow_r[i]).css("pointer-events", "auto");
        $(arrow_r[i]).css("color", "#737577");
        num[i]--;
        animate(ul[i], -num[i] * video_imgWidth, () => {
            console.log(ul[i].offsetLeft)
            if (ul[i].offsetLeft === 0) {
                $(arrow_l[i]).css("pointer-events", "none");
                $(arrow_l[i]).css("color", "#3b3c3d");
            } else {
                $(arrow_l[i]).css("pointer-events", "auto");
            }
        });

    })
}