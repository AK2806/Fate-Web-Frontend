import './init'
import $ from 'jquery';
import axios from 'axios';
import swal from 'sweetalert2';

function resetPassword(token, password) {
    return new Promise((resolve, reject) => {
        axios.put('/auth/password-reset', {
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

$('#reset-password').click(() => {
    if ($('.form-validate').valid()) {
        $('#reset-password').attr('disabled', 'disabled').find('#spinner').show();
        let url = new URL(window.location.href);
        let token = url.searchParams.get('token');
        resetPassword(token, $('#password').val())
        .then(() => {
            let timerInterval;
            swal.fire({
                title: '重置成功',
                html: '在<span></span>秒后跳转到登录页面',
                type: 'success',
                timer: 3000,
                onBeforeOpen: () => {
                    timerInterval = setInterval(() => {
                        swal.getContent().querySelector('span')
                        .textContent = (swal.getTimerLeft() / 1000).toFixed(0)
                    }, 100);
                },
                onClose: () => {
                    clearInterval(timerInterval);
                }
            })
            .then(() => {
                $(window).attr('location','login.html');
            });
        })
        .catch(reason => {
            $('#reset-password').removeAttr('disabled').find('#spinner').hide();
            swal.fire({
                title: '错误',
                text: reason,
                type: 'error'
            });
        });
    }
});