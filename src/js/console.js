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

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import '../css/fontastic.css';
import '../css/poppins.css';
import '../css/general.css';
import '../css/theme.css';
import '../css/console.css';

let apiUrlPrefix = 'http://localhost:8080/trpgfate-api';

Axios.defaults.baseURL = apiUrlPrefix;
Axios.defaults.withCredentials = true;
Axios.defaults.headers.common['Content-Type'] = 'application/json';

function ready() {
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

    $('.form-validate').validate({
        errorElement: "div",
        errorClass: 'is-invalid',
        validClass: 'is-valid',
        errorPlacement: function (error, element) {
            // Add the `invalid-feedback` class to the error element
            error.addClass('invalid-feedback');
            error.insertAfter(element.siblings().last());
        }
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
}

Vue.component('avatar', {
    props: ['uuid', 'width', 'height'],
    data: function () {
        return {
            baseUrl: apiUrlPrefix
        };
    },
    computed: {
        avatarUrl: function () {
            console.log(urljoin(this.baseUrl, 'img/avatar', this.uuid));
            return urljoin(this.baseUrl, 'img/avatar', this.uuid);
        }
    },
    template: `
        <div :style="{ width: width + 'px', height: height + 'px' }">
            <img :src="avatarUrl" alt="头像" class="img-fluid rounded-circle">
        </div>
        `
});

global.vueData = {
    userId: -1,
    accountInfo: null,
    sideBarMenu: {
        groups: [
            {
                heading: '入口',
                items: [
                    {
                        type: 'item',
                        id: 'home',
                        html: '<i class="fa fa-home" aria-hidden="true"></i>主页'
                    },
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
                        html: '<i class="fa fa-users" aria-hidden="true"></i>我的关注'
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
    sideBarMenuSelectionInitId: 'home',
    pageTitle: '主页'
};

Axios.get('/auth/authentication')
    .then(resp => {
        vueData.userId = resp.data.userId;
        Axios.get("/persona/account-info/" + vueData.userId)
            .then(resp => {
                vueData.accountInfo = resp.data;
            });
        new Vue({
            el: '#app',
            data: vueData,
            methods: {
                changePageTitle: function (id) {
                    switch (id) {
                        case 'home':
                            this.pageTitle = '主页';
                            break;
                        case 'mods-market':
                            this.pageTitle = '模组市场';
                            break;
                        case 'assets-store':
                            this.pageTitle = '素材商店';
                            break;
                        case 'character':
                            this.pageTitle = '角色卡';
                            break;
                        case 'mod':
                            this.pageTitle = '模组';
                            break;
                        case 'follower':
                            this.pageTitle = '我的关注';
                            break;
                        case 'account-info':
                            this.pageTitle = '个人信息 -> 账号资料';
                            break;
                        case 'account-safety':
                            this.pageTitle = '个人信息 -> 账号安全';
                            break;
                    }
                }
            },
            components: {
                'side-bar': {
                    props: ['name', 'role', 'avatarUuid', 'menuList', 'initSelectedId'],
                    data: function () {
                        return {
                            selectedItemId: this.initSelectedId,
                            menuUUID: uuid()
                        };
                    },
                    methods: {
                        selectItem: function (itemId) {
                            this.selectedItemId = itemId;
                            this.$emit('select-item', itemId);
                        }
                    },
                    template: `
                        <nav class="side-navbar">
                            <div class="sidebar-header d-flex align-items-center">
                                <avatar :uuid="avatarUuid" width="55" height="55"></avatar>
                                <div class="title">
                                    <h1 class="h4">{{ name }}</h1>
                                    <p>{{ role }}</p>
                                </div>
                            </div>
                            <div v-for="group in menuList.groups">
                                <span class="heading">{{ group.heading }}</span>
                                <ul class="list-unstyled">
                                    <div v-for="(item, index) in group.items">
                                        <li :class="{ active: selectedItemId === item.id }" v-if="item.type === 'item'">
                                            <a href="javascript:void(0)" @click="selectItem(item.id)" v-html="item.html"></a>
                                        </li>
                                        <li v-else-if="item.type === 'dropdown'">
                                            <a :href="'#dropdown-' + index + '-' + menuUUID" aria-expanded="false" data-toggle="collapse" v-html="item.html"></a>
                                            <ul :id="'dropdown-' + index + '-' + menuUUID" class="collapse list-unstyled">
                                                <li :class="{ active: selectedItemId === dropdownItem.id }" v-for="dropdownItem in item.items">
                                                    <a href="javascript:void(0)" @click="selectItem(dropdownItem.id)" v-html="dropdownItem.html"></a>
                                                </li>
                                            </ul>
                                        </li>
                                    </div>
                                </ul>
                            </div>
                        </nav>
                        `
                }
            }
        });
    })
    .catch(() => {
        window.location.href = 'auth.html';
    });
