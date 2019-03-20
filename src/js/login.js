import './init';
import $ from 'jquery';
import axios from 'axios';
import requireCaptchaVerification from './captcha-inputer';
import swal from 'sweetalert2';

function login(email, password, captchaToken, captchaText) {
    return new Promise((resolve, reject) => {
        axios.post('/auth/authentication', {
            email: email,
            passwd: password,
            captchaToken: captchaToken,
            captchaText: captchaText
        })
        .then(() => {
            resolve();
        })
        .catch(err => {
            reject(err.response.data.message);
        });
    });
}

function askForPasswordReset(email, captchaToken, captchaText) {
    return new Promise((resolve, reject) => {
        axios.post('/auth/password-reset', {
            email: email,
            captchaToken: captchaToken,
            captchaText: captchaText
        })
        .then(() => {
            resolve();
        })
        .catch(err => {
            reject(err.response.data.message);
        });
    });
}

$('#login').click(() => {
    if ($('.form-validate').valid()) {
        $('#login').attr('disabled', 'disabled').find('#spinner').show();
        let email = $('#login-email').val();
        let password = $('#login-password').val();
        requireCaptchaVerification()
        .then(captchaInfo => {
            login(email, password, captchaInfo.token, captchaInfo.text)
            .then(() => {
                $(window).attr('location','home.html');
            })
            .catch(reason => {
                $('#login').removeAttr('disabled').find('#spinner').hide();
                swal.fire({
                    title: '错误',
                    text: reason,
                    type: 'error'
                });
            });
        })
        .catch(() => {
            $('#login').removeAttr('disabled').find('#spinner').hide();
        });
    }
});

$('#forgot-pass').click(() => {
    swal.fire({
        type: 'info',
        title: '申请密码重置',
        text: '请输入你注册的邮箱账号',
        input: 'text',
        inputValue: $('#login-email').val(),
        inputValidator: value => {
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return !regex.test(value) && '邮箱地址格式不正确！';
        },
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: '继续 &rarr;',
        cancelButtonText: '取消'
    }).then(result => {
        if (result.value) {
            requireCaptchaVerification()
            .then(captchaInfo => {
                swal.fire({
                    title: '请稍等',
                    text: '正在验证邮箱中...',
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    onOpen: () => {
                        swal.showLoading()
                    }
                });
                askForPasswordReset(result.value, captchaInfo.token, captchaInfo.text)
                .then(() => {
                    swal.fire({
                        title: '成功',
                        text: '一封含有密码重置链接的邮件已发送至你的邮箱',
                        type: 'success'
                    });
                })
                .catch(reason => {
                    swal.fire({
                        title: '错误',
                        text: reason,
                        type: 'error'
                    });
                });
            });
        }
    });
});
