<template>
    <div>
        <div v-show="showList">
            <header class="page-header">
                <div class="container-fluid">
                    <h2 class="no-margin-bottom">角色卡</h2>
                </div>
            </header>
            <div class="breadcrumb-holder container-fluid">
                <div class="breadcrumb">
                    <button class="btn btn-primary breadcrumb-item" @click="isCreation = true; showList = false; curComp='edit-character'">创建角色卡</button>
                </div>
            </div>
            <!-- Character -->
            <section id="character">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-4" v-for="(character, index) in characters" :key="'character-preview-' + index">
                        <div class="card">
                            <div class="card-close">
                                <div class="dropdown">
                                <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                    class="dropdown-toggle">
                                    <i class="fa fa-ellipsis-v"></i>
                                </button>
                                <div class="dropdown-menu dropdown-menu-right has-shadow">
                                    <a href="javascript:void(0)" class="dropdown-item" @click="fetchCharacterData(character.uuid, false)">
                                        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>编辑
                                    </a>
                                    <a href="javascript:void(0)" class="dropdown-item" @click="deleteCharacter(character.uuid)">
                                        <i class="fa fa-times" aria-hidden="true"></i>删除
                                    </a>
                                </div>
                                </div>
                            </div>
                            <div class="card-header d-flex align-items-center">
                                <h3 class="h4 m-auto">{{ character.name }}</h3>
                            </div>
                            <a href="javascript:void(0)" @click="fetchCharacterData(character.uuid, true)">
                                <div class="card-body">
                                    <img :src="portrait(character.uuid)" class="m-auto" style="display: block; max-width: 100%; max-height: 600px;" />
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            </section>
        </div>
        <view-character v-if="curComp == 'view-character'" @ok="curComp = ''; showList = true;" :initData="compData"></view-character>
        <edit-character v-if="curComp == 'edit-character'" @ok="curComp = ''; showList = true; fetchCharacterList();" @cancel="curComp = ''; showList = true;" :initData="compData" :creation="isCreation"></edit-character>
    </div>
</template>

<script>
import '../global';
import $ from 'jquery';
import Axios from 'axios';
import Vue from 'vue';
import Swal from 'sweetalert2';
import urljoin from 'url-join';
import 'jquery-validation';
import uuid from 'uuid/v1';
import moduleViewCharacter from './view-character.vue';
import moduleEditCharacter from './edit-character.vue';

export default {
    props: {
        userId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            showList: true,
            curComp: '',
            isCreation: true,
            compData: {
                uuid: '',
                portrait: {
                    id: '',
                    stature: 0
                },
                name: '',
                description: '',
                refreshPoint: 0,
                physics: 0,
                mental: 0,
                aspects: [],
                abilities: [],
                consequences: [],
                stunts: []
            },
            page: 0,
            hasMore: true,
            characters: []
        };
    },
    mounted() {
        this.fetchCharacterList();
    },
    methods: {
        log: console.log,
        portrait(uuid) {
            return urljoin(apiUrlPrefix, 'img/character', uuid);
        },
        fetchCharacterList() {
            Axios.get('/userdata/character/list/' + this.userId + '/' + this.page)
            .then(resp => {
                this.characters.splice(0, this.characters.length);
                for (let i in resp.data.characters) {
                    this.characters.push(resp.data.characters[i]);
                }
                if (resp.characters.length == 10) this.hasMore = true;
                else this.hasMore = false;
            })
            .catch(ignore => {});
        },
        fetchCharacterData(uuid, isView) {
            Axios.get('/userdata/character/concrete/' + uuid)
            .then(resp => {
                this.compData.uuid = resp.data.uuid;
                this.compData.portrait.id = resp.data.uuid;
                this.compData.portrait.stature = resp.data.portrait.stature;
                this.compData.name = resp.data.data.name;
                this.compData.description = resp.data.data.description;
                this.compData.refreshPoint = resp.data.data.refreshFatePoint;
                this.compData.physics = resp.data.data.physics;
                this.compData.mental = resp.data.data.mental;
                this.compData.aspects.splice(0, this.compData.aspects.length);
                for (let i in resp.data.data.aspects) {
                    this.compData.aspects.push(resp.data.data.aspects[i]);
                }
                this.compData.abilities.splice(0, this.compData.abilities.length);
                for (let i in resp.data.data.abilities) {
                    this.compData.abilities.push(resp.data.data.abilities[i]);
                }
                this.compData.stunts.splice(0, this.compData.stunts.length);
                for (let i in resp.data.data.stunts) {
                    this.compData.stunts.push(resp.data.data.stunts[i]);
                }
                this.compData.consequences.splice(0, this.compData.consequences.length);
                for (let i in resp.data.data.consequences) {
                    this.compData.consequences.push(resp.data.data.consequences[i]);
                }
                this.showList = false;
                if (isView) {
                    this.curComp = 'view-character';
                } else {
                    this.isCreation = false;
                    this.curComp = 'edit-character';
                }
            })
            .catch(ignore => {});
        },
        deleteCharacter(uuid) {
            Swal.fire({
                title: '你确定要删除这个角色嘛？',
                type: 'warning',
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonText: '是',
                cancelButtonText: '否'
            })
            .then(result => {
                if (result.value) {
                    Axios.delete('/persona/character/' + uuid)
                    .then(() => {
                        Swal.fire({
                            title: '成功',
                            text: '角色卡已删除',
                            type: 'success'
                        });
                        this.fetchCharacterList();
                    })
                    .catch(err => {
                        Swal.fire({
                            title: '错误',
                            text: err.response ? err.response.data.message : err.message,
                            type: 'error'
                        });
                    });
                }
            });
        }
    },
    components: {
        'view-character': moduleViewCharacter,
        'edit-character': moduleEditCharacter
    }
}
</script>
