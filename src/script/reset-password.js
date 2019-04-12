import './global';
import $ from 'jquery';
import 'jquery-validation';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { Base64 } from 'js-base64';

import '../css/landing.css';

function resetPassword(pid, token, password) {
    return new Promise((resolve, reject) => {
        Axios.put('/auth/password-reset', {
            pid: pid,
            token: token,
            passwd: password
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

$(document).ready(() => {

    // ------------------------------------------------------- //
    // Universal Form Validation
    // ------------------------------------------------------ //

    $('.form-validate').validate({
        errorElement: "div",
        errorClass: 'is-invalid',
        validClass: 'is-valid',
        ignore: '.ignore',
        errorPlacement: function (error, element) {
            // Add the `invalid-feedback` class to the error element
            error.addClass('invalid-feedback');
            error.insertAfter(element.siblings().last());
        }
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
    // Reset-password Configuration
    // ------------------------------------------------------ //

    $('#reset_password').submit(event => {
        event.preventDefault();
        if ($('.form-validate').valid()) {
            $('#reset_password-submit').attr('disabled', 'disabled').find('#spinner').show();
            let url = new URL(window.location.href);
            let pid = url.searchParams.get('pid');
            let tokenBs64 = url.searchParams.get('token');
            resetPassword(pid, Base64.decode(tokenBs64), $('#password').val())
                .then(() => {
                    let timerInterval;
                    Swal.fire({
                        title: '重置成功',
                        html: '在<span></span>秒后跳转到登录页面',
                        type: 'success',
                        timer: 3000,
                        onBeforeOpen: () => {
                            timerInterval = setInterval(() => {
                                Swal.getContent().querySelector('span')
                                    .textContent = (Swal.getTimerLeft() / 1000).toFixed(0)
                            }, 100);
                        },
                        onClose: () => {
                            clearInterval(timerInterval);
                        }
                    })
                        .then(() => {
                            $(window).attr('location', 'auth.html');
                        });
                })
                .catch(reason => {
                    $('#reset_password-submit').removeAttr('disabled').find('#spinner').hide();
                    Swal.fire({
                        title: '错误',
                        text: reason,
                        type: 'error'
                    });
                });
        }
    });
});