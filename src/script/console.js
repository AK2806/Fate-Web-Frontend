import $ from 'jquery';
import Popper from 'popper.js';
import Chart from 'chart.js';
import Axios from 'axios';
import Vue from 'vue';
import Swal from 'sweetalert2';
import urljoin from 'url-join';
import ShowCaptcha from './components/captcha-inputer';
import 'bootstrap';
import 'jquery.cookie';
import 'jquery-validation';
import uuid from 'uuid/v1';
import avatar from './components/avatar.vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import VueRouter from 'vue-router';

import pageHome from './console/home.vue';
import pageAccountInfo from './console/account-info.vue';
import pageAccountSafety from './console/account-safety.vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import '../css/fontastic.css';
import '../css/poppins.css';
import '../css/general.css';
import '../css/theme.css';
import '../css/console.css';

let apiUrlPrefix = 'http://localhost:8080/';

Axios.defaults.baseURL = apiUrlPrefix;
Axios.defaults.withCredentials = true;
Axios.defaults.headers.common['Content-Type'] = 'application/json';

Vue.use(VueRouter);

function jqueryInit() {
    // ------------------------------------------------------- //
    // Card Close
    // ------------------------------------------------------ //
    $('.card-close a.remove').on('click', function (e) {
        e.preventDefault();
        $(this).parents('.card').fadeOut();
    });

    // ------------------------------------------------------- //
    // Tooltips init
    // ------------------------------------------------------ //    

    $('[data-toggle="tooltip"]').tooltip();

    // ------------------------------------------------------- //
    // Adding fade effect to dropdowns
    // ------------------------------------------------------ //
    $('.dropdown').on('show.bs.dropdown', function () {
        $(this).find('.dropdown-menu').first().stop(true, true).fadeIn();
    });
    $('.dropdown').on('hide.bs.dropdown', function () {
        $(this).find('.dropdown-menu').first().stop(true, true).fadeOut();
    });

    // ------------------------------------------------------- //
    // Sidebar Functionality
    // ------------------------------------------------------ //
    $('#toggle-btn').on('click', function (e) {
        e.preventDefault();
        $(this).toggleClass('active');

        $('.side-navbar').toggleClass('shrinked');
        $('.content-inner').toggleClass('active');
        $(document).trigger('sidebarChanged');

        if ($(window).outerWidth() > 1183) {
            if ($('#toggle-btn').hasClass('active')) {
                $('.navbar-header .brand-small').hide();
                $('.navbar-header .brand-big').show();
            } else {
                $('.navbar-header .brand-small').show();
                $('.navbar-header .brand-big').hide();
            }
        }

        if ($(window).outerWidth() < 1183) {
            $('.navbar-header .brand-small').show();
        }
    });

    // ------------------------------------------------------- //
    // Universal Form Validation
    // ------------------------------------------------------ //

    $('.form-validate').each(function () {
        $(this).validate({
            errorElement: "div",
            errorClass: 'is-invalid text-red',
            validClass: 'is-valid',
            ignore: '.ignore'
        });
    });

    // ------------------------------------------------------- //
    // Material Inputs
    // ------------------------------------------------------ //

    var materialInputs = $('input.input-material');

    // activate labels for prefilled values
    materialInputs.filter(function () { return $(this).val() !== ""; }).siblings('.label-material').addClass('active');

    // move label on focus
    materialInputs.on('focus', function () {
        $(this).siblings('.label-material').addClass('active');
    });

    // remove/keep label on blur
    materialInputs.on('blur', function () {
        $(this).siblings('.label-material').removeClass('active');

        if ($(this).val() !== '') {
            $(this).siblings('.label-material').addClass('active');
        } else {
            $(this).siblings('.label-material').removeClass('active');
        }
    });

    // ------------------------------------------------------- //
    // Footer 
    // ------------------------------------------------------ //   

    var contentInner = $('.content-inner');

    $(document).on('sidebarChanged', function () {
        adjustFooter();
    });

    $(window).on('resize', function () {
        adjustFooter();
    })

    function adjustFooter() {
        var footerBlockHeight = $('.main-footer').outerHeight();
        contentInner.css('padding-bottom', footerBlockHeight + 'px');
    }

    // ------------------------------------------------------- //
    // External links to new window
    // ------------------------------------------------------ //
    $('.external').on('click', function (e) {

        e.preventDefault();
        window.open($(this).attr("href"));
    });

    // ------------------------------------------------------- //
    // Logout
    // ------------------------------------------------------ //

    $('.logout').on('click', function (e) {
        e.preventDefault();
        Axios.delete('/auth/authentication')
            .then(() => {
                window.location.href = "index.html";
            })
            .catch(() => {
                window.location.href = "index.html";
            });
    });
};

/*
{
    type: 'item',
    id: 'mods-market',
    html: '<i class="fa fa-cube" aria-hidden="true"></i>模组市场'
},
{
    type: 'item',
    id: 'assets-store',
    html: '<i class="fa fa-flask" aria-hidden="true"></i>素材商店'
}
*/

let vueData = {
    selfId: -1,
    selfAccountInfo: {
        name: '',
        avatarId: ''
    },
    page: {
        newCharacter: {
            portrait: {
                file: null,
                path: '',
            },
            name: ''
        }
    }
};

const viewer = {
    props: {
        userId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            userName: '',
            avatarId: '',
            menu: {
                groups: [
                    {
                        heading: '仓库',
                        items: [
                            {
                                type: 'item',
                                id: 'home',
                                html: '<i class="fa fa-home" aria-hidden="true"></i>主页'
                            },
                            {
                                type: 'item',
                                id: 'character',
                                html: '<i class="fa fa-user-secret" aria-hidden="true"></i>角色卡'
                            },
                            {
                                type: 'item',
                                id: 'mod',
                                html: '<i class="fa fa-cubes" aria-hidden="true"></i>模组'
                            }
                        ]
                    },
                    {
                        heading: '社交',
                        items: [
                            {
                                type: 'item',
                                id: 'follower',
                                html: '<i class="fa fa-users" aria-hidden="true"></i>我的圈子'
                            },
                            {
                                type: 'dropdown',
                                html: '<i class="fa fa-user-circle-o" aria-hidden="true"></i>个人信息',
                                items: [
                                    {
                                        id: 'account-info',
                                        html: '账号资料'
                                    },
                                    {
                                        id: 'account-safety',
                                        html: '账号安全'
                                    }
                                ]
                            }
                        ]
                    },
                ]
            },
        };
    },
    mounted() {
        this.updateAccountInfo();
    },
    watch: {
        userId: function(newId, oldId) {
            Axios.get('/persona/account-info/' + newId)
            .then(resp => {
                this.userName = resp.data.name;
                this.avatarId = resp.data.avatarId;
            })
            .catch(err => {
                Swal.fire({
                    title: '错误',
                    text: err.response ? err.response.data.message : err.message,
                    type: 'error'
                });
            });
        }
    },
    methods: {
        log: console.log,
        updateAccountInfo() {
            Axios.get('/persona/account-info/' + this.userId)
            .then(resp => {
                this.userName = resp.data.name;
                this.avatarId = resp.data.avatarId;
            })
            .catch(err => {
                Swal.fire({
                    title: '错误',
                    text: err.response ? err.response.data.message : err.message,
                    type: 'error'
                });
            });
        }
    },
    components: {
        'avatar': avatar
    },
    template: `
        <div class="page-content d-flex align-items-stretch">
            <nav class="side-navbar">
                <div class="sidebar-header d-flex align-items-center">
                <avatar :uuid="avatarId" width="55" height="55"></avatar>
                <div class="title">
                    <h1 class="h4">{{ userName }}</h1>
                    <p>调查员</p>
                </div>
                </div>
                <div v-for="group in menu.groups">
                <span class="heading text-primary">{{ group.heading }}</span>
                <ul class="list-unstyled">
                    <div v-for="(item, index) in group.items">
                    <li :class="{ active: $route.path == '/' + userId + '/' + item.id }" v-if="item.type === 'item'">
                        <router-link :to="'/' + userId + '/' + item.id" v-html="item.html"></router-link>
                    </li>
                    <li v-else-if="item.type === 'dropdown'">
                        <a :href="'#dropdown-' + index" aria-expanded="false" data-toggle="collapse" v-html="item.html"></a>
                        <ul :id="'dropdown-' + index" class="collapse list-unstyled">
                        <li :class="{ active: $route.path == '/' + userId + '/' + dropdownItem.id }" v-for="dropdownItem in item.items">
                            <router-link :to="'/' + userId + '/' + dropdownItem.id" v-html="dropdownItem.html"></router-link>
                        </li>
                        </ul>
                    </li>
                    </div>
                </ul>
                </div>
            </nav>
            <div class="content-inner">
                <router-view @account-info-changed="updateAccountInfo(); $emit('account-info-changed', userId);"></router-view>
                <!-- Page Footer -->
                <footer class="main-footer">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-sm-6">
                                <p>《命运™》桌面角色扮演</p>
                            </div>
                            <div class="col-sm-6 text-right">
                                <p>上海璀璨星屑网络科技工作室 &copy; 2019-2020 <a href="https://www.ccxxgames.com"
                                    target="_blank">https://www.ccxxgames.com</a></p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    `
};

Axios.get('/auth/authentication')
    .then(resp => {
        vueData.selfId = resp.data.userId;
        Object.freeze(vueData.selfId);
        new Vue({
            router: new VueRouter({
                routes: [
                    { path: '/', redirect: '/' + vueData.selfId },
                    {
                        path: '/:userId',
                        component: viewer,
                        props(route) {
                            let props = { };
                            props.userId = parseInt(route.params.userId);
                            return props;
                        },
                        children: [
                            {
                                path: 'home',
                                component: pageHome
                            },
                            {
                                path: 'account-info',
                                component: pageAccountInfo,
                                props(route) {
                                    let props = { };
                                    props.userId = parseInt(route.params.userId);
                                    return props;
                                }
                            },
                            {
                                path: 'account-safety',
                                component: pageAccountSafety,
                                props(route) {
                                    let props = { };
                                    props.userId = parseInt(route.params.userId);
                                    return props;
                                }
                            },
                            {
                                path: '*',
                                component: pageHome
                            }
                        ]
                    }
                ]
            }),
            el: '#app',
            data: vueData,
            mounted() {
                jqueryInit();
                this.updateSelfAccoutInfo();
            },
            methods: {
                log: console.log,
                $: $,
                pageAccountSafetySubmitData,
                pageNewCharacterChangePortrait(file) {
                    this.page.newCharacter.portrait.file = file;
                    let fileReader = new FileReader();
                    fileReader.readAsDataURL(file);
                    fileReader.onload = e => {
                        this.page.newCharacter.portrait.path = e.target.result;
                    }
                },
                updateSelfAccoutInfo() {
                    Axios.get('/persona/account-info/' + this.selfId)
                        .then(resp => {
                            this.selfAccountInfo.name = resp.data.name;
                            this.selfAccountInfo.avatarId = resp.data.avatarId;
                        })
                        .catch(err => {
                            Swal.fire({
                                title: '错误',
                                text: err.response ? err.response.data.message : err.message,
                                type: 'error'
                            });
                        });
                }
            },
            components: {
                'image-cropper': {
                    props: {
                        imgSrc: {
                            required: true
                        },
                        width: {
                            default: 600
                        },
                        height: {
                            default: 600
                        }
                    },
                    data: function () {
                        return {
                            cropper: null
                        };
                    },
                    mounted: function () {
                        this.cropper = new Cropper(this.$refs.cropping, {
                            aspectRatio: 16 / 9,
                            crop(event) {
                                console.log(event.detail.x);
                                console.log(event.detail.y);
                                console.log(event.detail.width);
                                console.log(event.detail.height);
                                console.log(event.detail.rotate);
                                console.log(event.detail.scaleX);
                                console.log(event.detail.scaleY);
                            },
                        });
                    },
                    watch: {
                        imgSrc: function (newSrc, oldSrc) {
                            this.cropper.replace(newSrc);
                        },
                    },
                    template: `
                        <div :style="{ width: width, height: height }">
                            <img style="max-width: 100%;" ref="cropping" />
                        </div>
                    `
                },
                'avatar': avatar
            }
        });
    })
    .catch(() => {
        window.location.href = 'auth.html';
    });
