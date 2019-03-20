import './init';
import $ from 'jquery';
import axios from 'axios';
import requireCaptchaVerification from './captcha-inputer';
import swal from 'sweetalert2';

function askForMailVerify(emailAddr, captchaToken, captchaText) {
    return new Promise((resolve, reject) => {
        axios.post('/auth/register/verify-mail', {
            emailAddr: emailAddr,
            captchaToken: captchaToken,
            captchaText: captchaText
        })
        .then(resp => {
            resolve();
        })
        .catch(err => {
            reject(err.response.data.message);
        });
    });
}

function register(email, password, verifyCode) {
    return new Promise((resolve, reject) => {
        axios.post('/auth/register', {
            email: email,
            passwd: password,
            verifyCode: verifyCode
        })
        .then(resp => {
            resolve();
        })
        .catch(err => {
            reject(err.response.data.message);
        });
    });
}

$('#email-verify').click(() => {
    if ($('#register-email').valid()) {
        $('#email-verify').attr('disabled', 'disabled').find('#spinner').show();
        let emailAddr = $('#register-email').val();
        requireCaptchaVerification()
        .then(captchaInfo => {
            askForMailVerify(emailAddr, captchaInfo.token, captchaInfo.text)
            .then(() => {
                $('#email-verify').removeAttr('disabled').find('#spinner').hide();
                swal.fire({
                    title: '验证邮件已发送',
                    text: '一封验证邮件已成功发送至你的邮箱',
                    type: 'success'
                });
            })
            .catch(reason => {
                $('#email-verify').removeAttr('disabled').find('#spinner').hide();
                swal.fire({
                    title: '错误',
                    text: reason,
                    type: 'error'
                });
            });
        })
        .catch(() => {
            $('#email-verify').removeAttr('disabled').find('#spinner').hide();
        });
    }
});

$('#register-email').blur(() => {
    if ($('#register-email').valid()) {
        $('#email-verify').addClass('col-sm-3').fadeIn('normal');
        $('#register-email').addClass('col-sm');
        $('#verifycode-group').fadeIn();
    } else {
        $('#email-verify').hide().removeClass('col-sm-3');
        $('#register-email').removeClass('col-sm');
        $('#verifycode-group').hide();
    }
});

$('#register').click(() => {
    if ($('.form-validate').valid()) {
        $('#register').attr('disabled', 'disabled').find('#spinner').show();
        let email = $('#register-email').val();
        let password = $('#register-password').val();
        let code = $('#register-verifycode').val();
        register(email, password, code)
        .then(() => {
            $('#register').removeAttr('disabled').find('#spinner').hide();
            let timerInterval;
            swal.fire({
                title: '注册成功',
                html: '在<span></span>秒后跳转到主页',
                type: 'success',
                timer: 3000,
                onBeforeOpen: () => {
                    timerInterval = setInterval(() => {
                        swal.getContent().querySelector('span')
                        .textContent = (swal.getTimerLeft() / 1000).toFixed(0)
                    }, 100)
                },
                onClose: () => {
                    clearInterval(timerInterval);
                }
            })
            .then(() => {
                $(window).attr('location','home.html');
            });
        })
        .catch(reason => {
            $('#register').removeAttr('disabled').find('#spinner').hide();
            swal.fire({
                title: '错误',
                text: reason,
                type: 'error'
            });
        });
    }
});
