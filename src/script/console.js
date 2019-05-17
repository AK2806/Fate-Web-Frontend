import './global';
import $ from 'jquery';
import 'jquery.cookie';
import 'jquery-validation';
import Axios from 'axios';
import Vue from 'vue';
import Swal from 'sweetalert2';
import avatar from './components/avatar.vue';
import VueRouter from 'vue-router';

import pageGame from './console/game.vue';
import pageCharacter from './console/character.vue';
import pageMod from './console/mod.vue';
import pageCommunity from './console/community.vue';
import pageAccountInfo from './console/account-info.vue';
import pageAccountSafety from './console/account-safety.vue';

import pageModsMarket from './mods-market.vue';
import pageAssetsStore from './assets-store.vue';
import pageAnnouncement from './announcement.vue';

import pageAnnouncementPosting from './console/announcement-posting.vue';
import pageGameMonitor from './console/game-monitor.vue';

import '../css/console.css';

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
            ignore: '.ignore',
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

const viewOthersMenu = {
    groups: [
        {
            heading: '主页',
            items: [
                {
                    type: 'item',
                    id: 'game',
                    html: '<i class="fa fa-gamepad" aria-hidden="true"></i>ta的游戏桌'
                }
            ]
        },
        {
            heading: '仓库',
            items: [
                {
                    type: 'item',
                    id: 'character',
                    html: '<i class="fa fa-user-secret" aria-hidden="true"></i>ta的角色卡'
                },
                {
                    type: 'item',
                    id: 'mod',
                    html: '<i class="fa fa-cube" aria-hidden="true"></i>ta的模组'
                }
            ]
        },
        {
            heading: '社交',
            items: [
                {
                    type: 'item',
                    id: 'community',
                    html: '<i class="fa fa-users" aria-hidden="true"></i>ta的圈子'
                },
                {
                    type: 'item',
                    id: 'account-info',
                    html: '<i class="fa fa-user-circle-o" aria-hidden="true"></i>ta的账号资料'
                }
            ]
        },
    ]
};

const userMenu = {
    groups: [
        {
            heading: '主页',
            items: [
                {
                    type: 'item',
                    id: 'game',
                    html: '<i class="fa fa-gamepad" aria-hidden="true"></i>游戏桌'
                }
            ]
        },
        {
            heading: '仓库',
            items: [
                {
                    type: 'item',
                    id: 'character',
                    html: '<i class="fa fa-user-secret" aria-hidden="true"></i>角色卡'
                },
                {
                    type: 'item',
                    id: 'mod',
                    html: '<i class="fa fa-cube" aria-hidden="true"></i>模组'
                }
            ]
        },
        {
            heading: '社交',
            items: [
                {
                    type: 'item',
                    id: 'community',
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
};

const adminMenu = {
    groups: [
        {
            heading: '后台',
            items: [
                {
                    type: 'item',
                    id: 'game-monitor',
                    html: '<i class="fa fa-tachometer" aria-hidden="true"></i>系统管理'
                },
                {
                    type: 'item',
                    id: 'announcement-posting',
                    html: '<i class="fa fa-bullhorn" aria-hidden="true"></i>发布公告'
                }
            ]
        },
        {
            heading: '主页',
            items: [
                {
                    type: 'item',
                    id: 'game',
                    html: '<i class="fa fa-gamepad" aria-hidden="true"></i>游戏桌'
                }
            ]
        },
        {
            heading: '仓库',
            items: [
                {
                    type: 'item',
                    id: 'character',
                    html: '<i class="fa fa-user-secret" aria-hidden="true"></i>角色卡'
                },
                {
                    type: 'item',
                    id: 'mod',
                    html: '<i class="fa fa-cube" aria-hidden="true"></i>模组'
                }
            ]
        },
        {
            heading: '社交',
            items: [
                {
                    type: 'item',
                    id: 'community',
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
        }
    ]
};

const viewer = {
    props: {
        selfId: {
            type: Number,
            required: true
        },
        userId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            userName: '',
            role: 0,
            followed: false,
            menu: userMenu,
        };
    },
    mounted() {
        this.updateAccountInfo();
    },
    watch: {
        userId: function(newId, oldId) {
            Axios.get('/userdata/user/id/' + newId)
            .then(resp => {
                this.userName = resp.data.name;
                this.role = resp.data.role;
                if (newId != this.selfId) {
                    this.menu = viewOthersMenu;
                } else {
                    switch (this.role) {
                        case 0:
                            this.menu = userMenu;
                            break;
                        case 1:
                        case 2:
                            this.menu = adminMenu;
                            break;
                        default:
                            this.menu = userMenu;
                            break;
                    }
                }
            })
            .catch(err => {
                Swal.fire({
                    title: '错误',
                    text: err.response ? err.response.data.message : err.message,
                    type: 'error'
                });
            });
            if (newId != this.selfId) {
                Axios.get('/persona/followee/' + newId)
                .then(() => {
                    this.followed = true;
                })
                .catch(err => {
                    if (err.response && err.response.status == 404) {
                        this.followed = false;
                      } else {
                        Swal.fire({
                            title: '错误',
                            text: err.response ? err.response.data.message : err.message,
                            type: 'error'
                        });
                      }
                });
            }
        }
    },
    methods: {
        log: console.log,
        updateAccountInfo() {
            this.$refs['avatar'].updateAvatar();
            Axios.get('/userdata/user/id/' + this.userId)
            .then(resp => {
                this.userName = resp.data.name;
                this.role = resp.data.role;
                if (this.userId != this.selfId) {
                    this.menu = viewOthersMenu;
                } else {
                    switch (this.role) {
                        case 0:
                            this.menu = userMenu;
                            break;
                        case 1:
                        case 2:
                            this.menu = adminMenu;
                            break;
                        default:
                            this.menu = userMenu;
                            break;
                    }
                }
            })
            .catch(err => {
                Swal.fire({
                    title: '错误',
                    text: err.response ? err.response.data.message : err.message,
                    type: 'error'
                });
            });
            if (this.userId != this.selfId) {
                Axios.get('/persona/followee/' + this.userId)
                .then(() => {
                    this.followed = true;
                })
                .catch(err => {
                    if (err.response && err.response.status == 404) {
                        this.followed = false;
                      } else {
                        Swal.fire({
                            title: '错误',
                            text: err.response ? err.response.data.message : err.message,
                            type: 'error'
                        });
                      }
                });
            } else {
                this.$emit('account-info-changed', this.userId);
            }
        },
        toggleFollow() {
            Axios.put('/persona/followee', {
                userId: this.userId
            })
            .then(() => {
                Axios.get('/persona/followee/' + this.userId)
                .then(() => {
                    this.followed = true;
                })
                .catch(err => {
                    if (err.response && err.response.status == 404) {
                        this.followed = false;
                      } else {
                        Swal.fire({
                            title: '错误',
                            text: err.response ? err.response.data.message : err.message,
                            type: 'error'
                        });
                      }
                });
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
    computed: {
        roleName() {
            switch (this.role) {
                case 0:
                    return '调查员';
                case 1:
                    return '管理员';
                case 2:
                    return '超级管理员';
                default:
                    return '';
            }
        }
    },
    components: {
        avatar
    },
    template: `
        <div class="page-content d-flex align-items-stretch">
            <nav class="side-navbar">
                <div class="sidebar-header d-flex align-items-center">
                    <avatar ref="avatar" :user-id="userId" width="55" height="55"></avatar>
                    <div class="title">
                        <h1 class="h4">{{ userName }}</h1>
                        <p>{{ roleName }}</p>
                    </div>
                </div>
                <div v-if="this.userId != this.selfId" class="d-flex align-items-center justify-content-center">
                    <button v-if="followed" class="btn btn-secondary follow-btn" @click="toggleFollow()">已关注</button>
                    <button v-else class="btn btn-primary follow-btn" @click="toggleFollow()">关注</button>
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
                <router-view @user-changed="$emit('user-changed', $event)" @account-info-changed="updateAccountInfo()"></router-view>
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

const vueData = {
    selfId: -1,
    selfName: '',
    selfRole: 0,
    notificationCount: {
        announcement: 0,
        follower: 0
    }
};

Axios.get('/auth/authentication')
    .then(resp => {
        vueData.selfId = resp.data.userId;
        Object.freeze(vueData.selfId);
        new Vue({
            router: new VueRouter({
                routes: [
                    { path: '/', redirect: '/' + vueData.selfId },
                    { path: '/mods-market', component: pageModsMarket },
                    { path: '/assets-store', component: pageAssetsStore },
                    { path: '/announcement', component: pageAnnouncement },
                    {
                        path: '/:userId',
                        component: viewer,
                        props(route) {
                            let props = { };
                            props.selfId = vueData.selfId;
                            props.userId = parseInt(route.params.userId);
                            return props;
                        },
                        children: [
                            {
                                path: 'game',
                                component: pageGame,
                                props(route) {
                                    let props = { };
                                    props.selfId = vueData.selfId;
                                    props.userId = parseInt(route.params.userId);
                                    return props;
                                }
                            },
                            {
                                path: 'character',
                                component: pageCharacter,
                                props(route) {
                                    let props = { };
                                    props.selfId = vueData.selfId;
                                    props.userId = parseInt(route.params.userId);
                                    return props;
                                }
                            },
                            {
                                path: 'mod',
                                component: pageMod,
                                props(route) {
                                    let props = { };
                                    props.userId = parseInt(route.params.userId);
                                    return props;
                                }
                            },
                            {
                                path: 'community',
                                component: pageCommunity,
                                props(route) {
                                    let props = { };
                                    props.selfId = vueData.selfId;
                                    props.userId = parseInt(route.params.userId);
                                    return props;
                                }
                            },
                            {
                                path: 'account-info',
                                component: pageAccountInfo,
                                props(route) {
                                    let props = { };
                                    props.userId = parseInt(route.params.userId);
                                    props.editable = false;
                                    if (route.params.userId == vueData.selfId) {
                                        props.editable = true;
                                    }
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
                                path: 'game-monitor',
                                component: pageGameMonitor,
                                props(route) {
                                    let props = { };
                                    props.userId = parseInt(route.params.userId);
                                    return props;
                                }
                            },
                            {
                                path: 'announcement-posting',
                                component: pageAnnouncementPosting,
                                props(route) {
                                    let props = { };
                                    props.userId = parseInt(route.params.userId);
                                    return props;
                                }
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
                this.updateNotification();
            },
            computed: {
                notificationCountText() {
                    let count = this.notificationCount.announcement + this.notificationCount.follower;
                    return count > 0 ? (count < 100 ? `${count}` : '99+') : '';
                },
                newFollowerCountHtml() {
                    return this.notificationCount.follower > 0 ?
                        `你有<strong class="text-red">${this.notificationCount.follower}</strong>位新粉丝`
                        : '没有新的粉丝';
                },
                urneadAnnouncementCountHtml() {
                    return this.notificationCount.announcement > 0 ?
                        `你有<strong class="text-red">${this.notificationCount.announcement}</strong>条未读公告`
                        : '没有未读公告';
                }
            },
            methods: {
                log: console.log,
                $: $,
                changeViewUser(userId) {
                    this.$router.push('/' + userId);
                },
                updateSelfAccoutInfo() {
                    this.$refs['avatar'].updateAvatar();
                    Axios.get('/userdata/user/id/' + this.selfId)
                        .then(resp => {
                            this.selfName = resp.data.name;
                            this.selfRole = resp.data.role;
                        })
                        .catch(err => {
                            Swal.fire({
                                title: '错误',
                                text: err.response ? err.response.data.message : err.message,
                                type: 'error'
                            });
                        });
                },
                updateNotification() {
                    Axios.get('/persona/notification/announcement')
                    .then(resp => {
                        this.notificationCount.announcement = resp.data.count;
                    })
                    .catch(err => {
                        console.error(err);
                    });
                    Axios.get('/persona/notification/follower')
                    .then(resp => {
                        this.notificationCount.follower = resp.data.count;
                    })
                    .catch(err => {
                        console.error(err);
                    });
                }
            },
            components: {
                avatar
            }
        });
    })
    .catch(() => {
        window.location.href = 'auth.html';
    });
