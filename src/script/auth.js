import $ from 'jquery';
import 'jquery-validation';
import 'bootstrap';
import Axios from 'axios';
import Swal from 'sweetalert2';
import ShowCaptcha from './components/captcha-inputer';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import '../css/fontastic.css';
import '../css/poppins.css';
import '../css/general.css';
import '../css/theme.css';
import '../css/landing.css';

let apiUrlPrefix = 'http://localhost:8080/';

Axios.defaults.baseURL = apiUrlPrefix;
Axios.defaults.withCredentials = true;
Axios.defaults.headers.common['Content-Type'] = 'application/json';

function login(email, password, captchaToken, captchaText) {
    return new Promise((resolve, reject) => {
        Axios.post('/auth/authentication/email', {
            email: email,
            passwd: password,
            captchaToken: captchaToken,
            captchaText: captchaText
        })
            .then(() => {
                resolve();
            })
            .catch(err => {
                if (err.response) {
                    reject(err.response.data.message);
                } else {
                    reject(err.message);
                }
            });
    });
}

function askForPasswordReset(email, captchaToken, captchaText) {
    return new Promise((resolve, reject) => {
        Axios.post('/auth/password-reset/email', {
            email: email,
            captchaToken: captchaToken,
            captchaText: captchaText
        })
            .then(() => {
                resolve();
            })
            .catch(err => {
                if (err.response) {
                    reject(err.response.data.message);
                } else {
                    reject(err.message);
                }
            });
    });
}

function askForMailVerify(emailAddr, captchaToken, captchaText) {
    return new Promise((resolve, reject) => {
        Axios.post('/auth/register/email/verify', {
            emailAddr: emailAddr,
            captchaToken: captchaToken,
            captchaText: captchaText
        })
            .then(resp => {
                resolve();
            })
            .catch(err => {
                if (err.response) {
                    reject(err.response.data.message);
                } else {
                    reject(err.message);
                }
            });
    });
}

function register(email, password, verifyCode) {
    return new Promise((resolve, reject) => {
        Axios.post('/auth/register/email', {
            email: email,
            passwd: password,
            verifyCode: verifyCode
        })
            .then(resp => {
                resolve();
            })
            .catch(err => {
                if (err.response) {
                    reject(err.response.data.message);
                } else {
                    reject(err.message);
                }
            });
    });
}

$(document).ready(() => {

    // ------------------------------------------------------- //
    // Universal Form Validation
    // ------------------------------------------------------ //

    $('.form-validate').each(function() {
        $(this).validate({
            errorElement: "div",
            errorClass: 'is-invalid',
            validClass: 'is-valid',
            errorPlacement: function (error, element) {
                // Add the `invalid-feedback` class to the error element
                error.addClass('invalid-feedback');
                error.insertAfter(element.siblings().last());
            }
        });
    });

    // ------------------------------------------------------- //
    // Material Inputs
    // ------------------------------------------------------ //

    let materialInputs = $('input.input-material');

    // activate labels for prefilled values
    materialInputs.filter(function () { return $(this).val() !== ""; }).siblings('.label-material').addClass('active');

    // move label on focus
    materialInputs.focus(function () {
        $(this).siblings('.label-material').addClass('active');
    });

    // remove/keep label on blur
    materialInputs.blur(function () {
        $(this).siblings('.label-material').removeClass('active');

        if ($(this).val() !== '') {
            $(this).siblings('.label-material').addClass('active');
        } else {
            $(this).siblings('.label-material').removeClass('active');
        }
    });

    // ------------------------------------------------------- //
    // External links to new window
    // ------------------------------------------------------ //
    $('.external').click(function (e) {
        e.preventDefault();
        window.open($(this).attr("href"));
    });

    // ------------------------------------------------------- //
    // Method decision
    // ------------------------------------------------------ //
    let url = new URL(window.location.href);
    let method = url.searchParams.get('method');

    if (method === 'register') {
        $('#register-page').show();
        $('#login-page').hide();
        document.title = '《命运™》-注册调查员账号';
    }

    // ------------------------------------------------------- //
    // Login Configuration
    // ------------------------------------------------------ //

    $('#login-form').submit(function(event) {
        event.preventDefault();
        if ($(this).valid()) {
            $('#login-submit').attr('disabled', 'disabled').find('#spinner').show();
            let email = $('#login-email').val();
            let password = $('#login-password').val();
            ShowCaptcha()
                .then(captchaInfo => {
                    login(email, password, captchaInfo.token, captchaInfo.text)
                        .then(() => {
                            window.location.href = "console.html";
                        })
                        .catch(reason => {
                            $('#login-submit').removeAttr('disabled').find('#spinner').hide();
                            Swal.fire({
                                title: '错误',
                                text: reason,
                                type: 'error'
                            });
                        });
                })
                .catch(() => {
                    $('#login-submit').removeAttr('disabled').find('#spinner').hide();
                });
        }
    });

    $('#forgot-pass').click(() => {
        Swal.fire({
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
                ShowCaptcha()
                    .then(captchaInfo => {
                        Swal.fire({
                            title: '请稍等',
                            text: '正在验证邮箱中...',
                            allowEscapeKey: false,
                            allowOutsideClick: false,
                            onOpen: () => {
                                Swal.showLoading()
                            }
                        });
                        askForPasswordReset(result.value, captchaInfo.token, captchaInfo.text)
                            .then(() => {
                                Swal.fire({
                                    title: '成功',
                                    text: '一封含有密码重置链接的邮件已发送至你的邮箱',
                                    type: 'success'
                                });
                            })
                            .catch(reason => {
                                Swal.fire({
                                    title: '错误',
                                    text: reason,
                                    type: 'error'
                                });
                            });
                    });
            }
        });
    });

    $('#toggle-register-page').click(e => {
        e.preventDefault();
        $('#register-page').show();
        $('#login-page').hide();
        document.title = '《命运™》-注册调查员账号';
    });

    // ------------------------------------------------------- //
    // Register Configuration
    // ------------------------------------------------------ //

    $('#email-verify').click(() => {
        if ($('#register-email').valid()) {
            $('#email-verify').attr('disabled', 'disabled').find('#spinner').show();
            let emailAddr = $('#register-email').val();
            ShowCaptcha()
                .then(captchaInfo => {
                    askForMailVerify(emailAddr, captchaInfo.token, captchaInfo.text)
                        .then(() => {
                            $('#email-verify').removeAttr('disabled').find('#spinner').hide();
                            Swal.fire({
                                title: '验证邮件已发送',
                                text: '一封验证邮件已成功发送至你的邮箱',
                                type: 'success'
                            });
                        })
                        .catch(reason => {
                            $('#email-verify').removeAttr('disabled').find('#spinner').hide();
                            Swal.fire({
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
            $('#email-verify').addClass('col-lg-3').fadeIn('normal');
            $('#register-email').addClass('col-lg');
            $('#verifycode-group').fadeIn();
        } else {
            $('#email-verify').hide().removeClass('col-lg-3');
            $('#register-email').removeClass('col-lg');
            $('#verifycode-group').hide();
        }
    });

    $('#register-form').submit(function(event) {
        event.preventDefault();
        if ($(this).valid()) {
            $('#register-submit').attr('disabled', 'disabled').find('#spinner').show();
            let email = $('#register-email').val();
            let password = $('#register-password').val();
            let code = $('#register-verifycode').val();
            register(email, password, code)
                .then(() => {
                    $('#register-submit').removeAttr('disabled').find('#spinner').hide();
                    let timerInterval;
                    Swal.fire({
                        title: '注册成功',
                        html: '在<span></span>秒后跳转到主页',
                        type: 'success',
                        timer: 3000,
                        onBeforeOpen: () => {
                            timerInterval = setInterval(() => {
                                Swal.getContent().querySelector('span')
                                    .textContent = (Swal.getTimerLeft() / 1000).toFixed(0)
                            }, 100)
                        },
                        onClose: () => {
                            clearInterval(timerInterval);
                        }
                    })
                        .then(() => {
                            window.location.href = "console.html";
                        });
                })
                .catch(reason => {
                    $('#register-submit').removeAttr('disabled').find('#spinner').hide();
                    Swal.fire({
                        title: '错误',
                        text: reason,
                        type: 'error'
                    });
                });
        }
    });

    $('#toggle-login-page').click(e => {
        e.preventDefault();
        $('#register-page').hide();
        $('#login-page').show();
        document.title = '《命运™》-登陆';
    });

});

// ------------------------------------------------------- //
// Redirect
// ------------------------------------------------------ //

Axios.get('/auth/authentication')
    .then(resp => {
        global.appUserId = resp.data.userId;
        window.location.href = 'console.html';
    })
    .catch(() => {});
