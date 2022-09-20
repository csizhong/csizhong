// 1、获取元素
var eye = document.getElementById('eye');
var pwd = document.getElementById('pwd');
// 2、 注册事件 处理程序
var flag = 0;
eye.onclick = function () {
    if (flag == 0) {
        // 点击一次之后，flag一定要变化
        pwd.type = 'text';
        eye.className = "iconfont icon-xianshi";
        flag = 1;
    } else {
        pwd.type = 'password';
        eye.className = "iconfont icon-guanbi";
        flag = 0;
    }
}

$(document).ajaxSend(function (e, xhr, option) {
    if (sessionStorage.getItem('token') != null)
        xhr.setRequestHeader('Authorization', sessionStorage.getItem('token'))
})
var loginConfirm = document.getElementById('loginConfirm');
loginConfirm.onclick = function (event) {
    var email = $('#email').val()//.value
    var pwd = $('#pwd').val()
    $.ajax({
        url: 'http://127.0.0.1/login',
        type: 'POST',
        data: { email, pwd },
        dataType: 'json',
        success: function (res) {
            if (res.code == 0) {
                alert('登陆成功')
                var token = res.data.token
                sessionStorage.setItem('token', token)
                window.location.href = 'http://127.0.0.1'
            }
            else {
                alert('登陆失败')
            }
        },
        error: function () {
            console.log('出错了')
        }
    })
    event.preventDefault();
}