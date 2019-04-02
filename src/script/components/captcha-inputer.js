import $ from 'jquery';
import Axios from 'axios';
import Swal from 'sweetalert2';

function askForCaptcha() {
    return new Promise((resolve, reject) => {
        Axios.post('/captcha')
        .then((resp) => {
            resolve({token: resp.data.token, imageBase64: resp.data.imgBs64});
        })
        .catch((err) => {
            if (err.response) {
                reject(err.response.data.message);
            } else {
                reject(err.message);
            }
        });
    });
}

function showCaptchaDialog(imageBase64) {
    return new Promise((resolve, reject) => {
        Swal.fire({
            title: '请输入验证码',
            input: 'text',
            type: 'info',
            inputValidator: value => {
                return !value && '验证码不能为空！'
            },
            html: $('<div>')
                .append($('<img src="data:image/png;base64,' + imageBase64 + '" />'))
                .append($('<button type="button" class="btn btn-secondary">换一张</button>').click(() => {
                    Swal.close();
                    reject('changeCaptcha');
                }))
                .get(0),
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        })
        .then(result => {
            if (result.value) {
                resolve(result.value);
            } else {
                reject('cancel');
            }
        });
    });
}

export default function requireCaptchaVerification() {
    return new Promise((resolve, reject) => {
        askForCaptcha()
        .then(captcha => {
            showCaptchaDialog(captcha.imageBase64)
            .then(value => {
                resolve({token: captcha.token, text: value});
            })
            .catch(reason => {
                switch (reason) {
                    case 'changeCaptcha':
                        requireCaptchaVerification().then(resolve).catch(reject);
                        break;
                    default:
                        reject(reason);
                        break;
                }
            });
        })
        .catch(err => {
            Swal.fire({
                title: "获取验证码时发生未知错误",
                text: err,
                type: "error"
            })
            .then(() => {
                reject('failOnRetrievingCaptcha');
            });
        });
    });
}
