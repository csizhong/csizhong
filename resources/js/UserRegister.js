
$(document).ajaxSend(function (e, xhr, option) {
    if (sessionStorage.getItem('token') != null)
        xhr.setRequestHeader('Authorization', sessionStorage.getItem('token'))
})
var registerConfirm = document.getElementById('registerConfirm');
registerConfirm.onclick = function (event) {
    var email = $('#registerEmail').val()//.value
    var username = $('#registerName').val()
    var pwd = $('#registerPwd').val()
    var confirmpwd = $('#confirmPwd').val()
    $.ajax({
        url: 'http://127.0.0.1/register',
        type: 'POST',
        data: { email, username, pwd, confirmpwd },
        dataType: 'json',
        success: function (res) {
            switch (res.code) {
                case 0: alert('注册成功')
                    var token = res.data.token
                    sessionStorage.setItem('token', token);
                    window.location.href = 'http://127.0.0.1/login';
                    break;
                case 1: alert('注册失败,此邮箱已被注册'); break;
                case 2: alert('注册失败,用户名已被使用'); break;
                case 3: alert('注册失败,输入密码和确认密码不一致'); break;
                default: alert('出错了'); break;
            }
        },
        error: function () {
            console.log('出错了')
        }
    })
    event.preventDefault();
}