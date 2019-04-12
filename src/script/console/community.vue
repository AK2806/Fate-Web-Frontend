<template>
    <div>
        <header class="page-header">
            <div class="container-fluid">
                <h2 class="no-margin-bottom">圈子</h2>
            </div>
        </header>
        <section>
            <div class="container-fluid">
                <div class="row">
                    <!-- Search Box-->
                    <div class="search-box">
                        <form @submit="function(e) { e.preventDefault(); search(); }">
                            <button type="submit" class="search-btn"><i class="icon-search"></i></button>
                            <input type="text" placeholder="按邮箱搜索调查员" class="form-control" v-model="searchPlayer">
                            <button type="button" class="dismiss" @click="clearSearch()"><i class="icon-close"></i></button>
                        </form>
                    </div>
                </div>
                <div class="row">
                    <section v-if="home" class="col-lg-12">
                        <div class="row">
                            <div class="card w-100">
                                <div class="card-header d-flex align-items-center">
                                    <h3 class="h4 px-3">关注</h3>
                                </div>
                                <div class="card-body">
                                    <div class="row" style="padding: 20px;">
                                        <div v-for="user in followee" :key="'followee-' + user.userId" style="padding: 10px;" class="col-lg-3 has-shadow">
                                            <a href="javascript:void(0)" @click="$emit('user-changed', user.id);" style="display: block;" class="d-flex align-items-center">
                                                <avatar :uuid="user.avatarId"></avatar>
                                                <div style="margin-left: 10px">
                                                    <span class="h4">{{ user.name }}</span>
                                                    <small class="text-secondary">{{ user.email }}</small>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <nav class="m-auto">
                                            <ul class="pagination">
                                                <li :class="{'page-item': true, 'disabled': followeePageIdx <= 0}">
                                                    <a class="page-link" href="javascript:void(0)" @click="followeePageIdx--">
                                                        <span aria-hidden="true">&laquo;</span>
                                                    </a>
                                                </li>
                                                <li v-for="i in followeePageCount" :key="'followee-page-' + i"
                                                    :class="{'page-item': true, 'active': followeePageIdx + 1 == i}">
                                                    <a class="page-link" href="javascript:void(0)"
                                                        @click="followeePageIdx = i - 1">{{ i }}</a>
                                                </li>
                                                <li :class="{'page-item': true, 'disabled': followeePageIdx >= followeePageCount - 1}">
                                                    <a class="page-link" href="javascript:void(0)" @click="followeePageIdx++">
                                                        <span aria-hidden="true">&raquo;</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="card w-100">
                                <div class="card-header d-flex align-items-center">
                                    <h3 class="h4 px-3">粉丝</h3>
                                </div>
                                <div class="card-body">
                                    <div class="row" style="padding: 20px;">
                                        <div v-for="user in follower" :key="'follower-' + user.userId" style="padding: 10px;" class="col-lg-3 has-shadow">
                                            <a href="javascript:void(0)" @click="$emit('user-changed', user.id);" style="display: block;" class="d-flex align-items-center">
                                                <avatar :uuid="user.avatarId"></avatar>
                                                <div style="margin-left: 10px">
                                                    <span class="h4">{{ user.name }}</span>
                                                    <small class="text-secondary">{{ user.email }}</small>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <nav class="m-auto">
                                            <ul class="pagination">
                                                <li :class="{'page-item': true, 'disabled': followerPageIdx <= 0}">
                                                    <a class="page-link" href="javascript:void(0)" @click="followerPageIdx--">
                                                        <span aria-hidden="true">&laquo;</span>
                                                    </a>
                                                </li>
                                                <li v-for="i in followerPageCount" :key="'follower-page-' + i"
                                                    :class="{'page-item': true, 'active': followerPageIdx + 1 == i}">
                                                    <a class="page-link" href="javascript:void(0)"
                                                        @click="followerPageIdx = i - 1">{{ i }}</a>
                                                </li>
                                                <li :class="{'page-item': true, 'disabled': followerPageIdx >= followerPageCount - 1}">
                                                    <a class="page-link" href="javascript:void(0)" @click="followerPageIdx++">
                                                        <span aria-hidden="true">&raquo;</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section v-if="!home" class="col-lg-12">
                        <div class="row">
                            <div class="card w-100">
                                <div class="card-header d-flex align-items-center">
                                    <h3 class="h4 px-3">搜索结果</h3>
                                </div>
                                <div class="card-body">
                                    <div class="row" style="padding: 20px;">
                                        <div v-for="user in searchResult" :key="'user-' + user.userId" style="padding: 10px;" class="col-lg-3 has-shadow">
                                            <a href="javascript:void(0)" @click="$emit('user-changed', user.id);" style="display: block;" class="d-flex align-items-center">
                                                <avatar :uuid="user.avatarId"></avatar>
                                                <div style="margin-left: 10px">
                                                    <span class="h4">{{ user.name }}</span>
                                                    <small class="text-secondary">{{ user.email }}</small>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import '../global';
import avatar from '../components/avatar.vue';
import $ from 'jquery';
import Axios from 'axios';
import Vue from 'vue';
import Swal from 'sweetalert2';
import urljoin from 'url-join';
import uuid from 'uuid/v1';

export default {
    props: {
        userId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            home: true,
            searchPlayer: '',
            searchResult: [],
            followee: [],
            followeePageCount: 1,
            followeePageIdx: 0,
            follower: [],
            followerPageCount: 1,
            followerPageIdx: 0,
        };
    },
    mounted() {
        Axios.get('/userdata/follower/' + this.userId)
        .then(resp => {
            this.followerPageCount = resp.data.count;
            this.followerPageIdx = 0;
            this.updateFollowers(this.followerPageIdx);
        })
        .catch(err => {
            Swal.fire({
                title: '错误',
                text: err.response ? err.response.data.message : err.message,
                type: 'error'
            });
        });
        Axios.get('/userdata/followee/' + this.userId)
        .then(resp => {
            this.followeePageCount = resp.data.count;
            this.followeePageIdx = 0;
            this.updateFollowees(this.followeePageIdx);
        })
        .catch(err => {
            Swal.fire({
                title: '错误',
                text: err.response ? err.response.data.message : err.message,
                type: 'error'
            });
        })
    },
    watch: {
        followerPageIdx: function (newVal, oldVal) {
            this.updateFollowers(newVal);
        },
        followeePageIdx: function (newVal, oldVal){
            this.updateFollowees(newVal);
        }
    },
    methods: {
        log: console.log,
        search() {
            this.home = false;
            Axios.get('/userdata/user/email/' + this.searchPlayer)
            .then(resp => {
                this.searchResult.splice(0, this.searchResult.length);
                this.searchResult.push({
                    id: resp.data.userId,
                    name: resp.data.name,
                    email: resp.data.email,
                    avatarId: resp.data.avatarId
                });
            })
            .catch(err => {
                this.searchResult.splice(0, this.searchResult.length);
            });
        },
        clearSearch() {
            this.home = true;
            this.searchPlayer = '';
            this.searchResult.splice(0, this.searchResult.length);
        },
        updateFollowers(pageIdx) {
            Axios.get('/userdata/follower/' + this.userId + '/' + pageIdx)
            .then(resp => {
                this.follower.splice(0, this.follower.length);
                for (let key in resp.data.usersId) {
                    Axios.get('/userdata/user/id/' + resp.data.usersId[key])
                    .then(resp => {
                        this.follower.push({
                            id: resp.data.userId,
                            name: resp.data.name,
                            email: resp.data.email,
                            avatarId: resp.data.avatarId
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
            })
            .catch(err => {
                Swal.fire({
                    title: '错误',
                    text: err.response ? err.response.data.message : err.message,
                    type: 'error'
                });
            });
        },
        updateFollowees(pageIdx) {
            Axios.get('/userdata/followee/' + this.userId + '/' + pageIdx)
            .then(resp => {
                this.followee.splice(0, this.followee.length);
                for (let key in resp.data.usersId) {
                    Axios.get('/userdata/user/id/' + resp.data.usersId[key])
                    .then(resp => {
                        this.followee.push({
                            id: resp.data.userId,
                            name: resp.data.name,
                            email: resp.data.email,
                            avatarId: resp.data.avatarId
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
        avatar
    }
}
</script>
