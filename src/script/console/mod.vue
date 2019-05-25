<template>
  <div>
    <header class="page-header">
      <div class="container-fluid">
        <h2 class="no-margin-bottom">模组</h2>
      </div>
    </header>
    <div v-if="!canSelect" class="breadcrumb-holder container-fluid">
        <div class="breadcrumb">
            <div class="breadcrumb-item d-flex align-items-center">
                <button v-if="selfId == userId" class="btn btn-primary" @click="openEditor()">启动模组编辑器</button>
            </div>
        </div>
    </div>
    <section>
      <div v-show="mode=='edit'" class="container-fluid">
        <div class="row">
          <div class="card w-100">
            <div class="card-header d-flex align-items-center">
              <h3 class="h4 px-3">创建模组</h3>
            </div>
            <div class="card-body">
              <form id='mod-form' class="form-validate"
                @submit="(e) => { e.preventDefault(); if($('#mod-form').valid() && editingData.thumbnail != '') submitMod(); }">
                <div class="form-group row align-items-center">
                    <label class="col-lg-2 form-control-label text-center">标题</label>
                    <div class="col-lg-10">
                      <input type="text" class="form-control" required
                        v-model="editingData.title" name="modTitle" />
                    </div>
                </div>
                <div class="form-group row align-items-center">
                  <label class="col-lg-2 form-control-label text-center">简介</label>
                  <div class="col-lg-10">
                      <textarea class="form-control" rows="10" v-model="editingData.description"
                          name="modDescription"></textarea>
                  </div>
                </div>
                <div class="form-group row align-items-center">
                  <label class="col-lg-2 form-control-label text-center">封面</label>
                  <div class="col-lg-10">
                    <button type="button" class="btn btn-info" @click="$refs['thumbnailFile'].click();">上传封面</button>
                    <input type="file" class="form-control-file" ref="thumbnailFile" hidden
                        @change="thumbnailFileChanged($event.target.files[0])" />
                  </div>
                </div>
                <div class="form-group row align-items-center">
                    <div class="col-lg-10 offset-md-2">
                        <image-cropper :img-src="editingData.thumbnail" ref="thumbnailCropper"></image-cropper>
                    </div>
                </div>
                <div class="line"></div>
                <div class="form-group row align-items-center">
                  <div class="offset-lg-2 col-lg-10">
                    <button type="submit" class="btn btn-primary">{{ editingData.uuid != '' ? '修改' : '创建' }}</button>
                    <button type="button" class="btn btn-secondary" @click="mode='list'">返回</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div v-show="mode=='list'" class="container-fluid">
        <div class="row">
          <div
            class="col-lg-3"
            v-for="(mod, index) in mods"
            :key="'mod-preview-' + index"
          >
            <div class="card" style="max-width: 400px; max-height: 300px;">
              <a href="javascript:void(0)" @click="viewMod(mod.uuid)">
                <img :src="thumbnail(mod.uuid)" style="width: 100%;" />
              </a>
              <div class="card-body d-flex align-items-center justify-content-between">
                <div class="card-title">
                  <h3 class="h4">
                    {{ mod.title }}
                    <small v-if="mod.lastPublishTime != null" class="text-green"><i class="fa fa-ravelry" aria-hidden="true"></i>已发布</small>
                    <small v-if="mod.lastPublishTime == null" class="text-gray"><i class="fa fa-ravelry" aria-hidden="true"></i>未发布</small>
                  </h3>
                  <p>作者：{{ mod.authorUser.name }}</p>
                </div>
                <div v-if="selfId == userId">
                  <div class="dropdown">
                    <button
                      type="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                      class="btn btn-info dropdown-toggle"
                    >
                      选项
                    </button>
                    <div class="dropdown-menu">
                      <a
                        href="javascript:void(0)"
                        class="dropdown-item text-secondary"
                        @click="editMod(mod)"
                      >
                        <i class="fa fa-pencil-square-o fa-fw" aria-hidden="true"></i>修改信息
                      </a>
                      <a
                        href="javascript:void(0)"
                        class="dropdown-item text-danger"
                        @click="deleteMod(mod.uuid)"
                      >
                        <i class="fa fa-trash fa-fw" aria-hidden="true"></i>删除
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-3">
            <a href="javascript:void(0)" @click="editMod()">
              <img src="../../img/add-mod.png" style="width: 100%; max-height: 300px;" />
            </a>
          </div>
        </div>
        <div class="row">
          <nav class="m-auto">
            <ul class="pagination">
              <li :class="{'page-item': true, 'disabled': modPageIdx <= 0}">
                <a class="page-link" href="javascript:void(0)" @click="modPageIdx--">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li
                v-for="i in modPageCount"
                :key="'mod-page-' + i"
                :class="{'page-item': true, 'active': modPageIdx + 1 == i}"
              >
                <a
                  class="page-link"
                  href="javascript:void(0)"
                  @click="modPageIdx = i - 1"
                >{{ i }}</a>
              </li>
              <li
                :class="{'page-item': true, 'disabled': modPageIdx >= modPageCount - 1}"
              >
                <a class="page-link" href="javascript:void(0)" @click="modPageIdx++">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
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
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
  props: {
        selfId: {
            type: Number,
            required: true
        },
        userId: {
            type: Number,
            required: true
        },
        canSelect: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            mode: 'list',

            modPageCount: 1,
            modPageIdx: 0,
            mods: [],

            editingData: {
                uuid: '',
                thumbnail: '',
                title: '',
                description: '',
            }
        };
    },
    mounted() {
      this.fetchMods();
    },
    watch: {
      modPageIdx: function(newVal, oldVal) {
        this.getModList(newVal);
      }
    },
    methods: {
      $,
      fetchMods() {
        Axios.get('/userdata/mod/' + this.userId + '/list')
        .then(resp => {
          this.modPageCount = resp.data;
          this.modPageIdx = 0;
          this.getModList(this.modPageIdx);
        })
        .catch(err => {
          console.error(err);
        });
      },
      getModList(page) {
        Axios.get('/userdata/mod/' + this.userId + '/list/' + page)
        .then(resp => {
          this.mods.splice(0, this.mods.length);
          let list = resp.data;
          for (let i in list) {
            this.mods.push({
              uuid: list[i].uuid,
              title: list[i].title,
              description: list[i].description,
              createTime: list[i].createTime,
              lastPublishTime: list[i].lastPublishTime,
              ownUser: {
                id: list[i].ownerId,
                name: '',
                avatarId: ''
              },
              authorUser: {
                id: list[i].authorId,
                name: '',
                avatarId: ''
              }
            });
            Axios.get('/userdata/user/id/' + list[i].ownerId)
            .then(resp => {
              this.mods[i].ownUser.name = resp.data.name;
              this.mods[i].ownUser.avatarId = resp.data.avatarId;
            })
            .catch(err => {
              console.error(err);
            });
            Axios.get('/userdata/user/id/' + list[i].authorId)
            .then(resp => {
              this.mods[i].authorUser.name = resp.data.name;
              this.mods[i].authorUser.avatarId = resp.data.avatarId;
            })
            .catch(err => {
              console.error(err);
            });
          }
        })
        .catch(err => {
          console.error(err);
        });
      },
      thumbnail(modUuid) {
        return urljoin(apiUrlPrefix, 'img/mod', modUuid, 'thumbnail');
      },
      thumbnailFileChanged(file) {
          let fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = e => {
              this.editingData.thumbnail = e.target.result;
          };
      },
      viewMod(modUuid) {

      },
      editMod(mod) {
        if (!mod) {
          this.editingData.uuid = '';
          this.editingData.thumbnail = '';
          this.editingData.title = '';
          this.editingData.description = '';
          this.mode = 'edit';
        } else {
          this.editingData.uuid = mod.uuid;
          this.editingData.thumbnail = this.thumbnail(mod.uuid);
          this.editingData.title = mod.title;
          this.editingData.description = mod.description;
          this.mode = 'edit';
        }
      },
      deleteMod(modUuid) {
        
      },
      submitMod() {
        if (this.editingData.uuid == '') {
          let sendData = {
            title: this.editingData.title,
            description: this.editingData.description
          };
          let canvas = this.$refs.thumbnailCropper.cropper.getCroppedCanvas();
          canvas.toBlob((blob) => {
              let fmData = new FormData();
              let jsonBlob = new Blob([JSON.stringify(sendData)], { type: 'application/json' });
              fmData.append('info', jsonBlob);
              fmData.append('thumbnail', blob, 'thumbnail.png');
              Axios.post('/persona/mod', fmData)
              .then(() => {
                  Swal.fire({
                      title: '成功',
                      text: '模组槽已创建',
                      type: 'success'
                  }).then(() => {
                    this.mode = 'list';
                    this.fetchMods();
                  });
              })
              .catch(err => {
                  Swal.fire({
                      title: '错误',
                      text: err.response ? err.response.data.message : err.message,
                      type: 'error'
                  });
              });
          });
        } else {

        }
      },
      openEditor() {

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
                this.cropper = new Cropper(this.$refs.cropping, { aspectRatio: 16 / 9 });
            },
            watch: {
                imgSrc: function (newSrc, oldSrc) {
                    this.cropper.destroy();
                    console.log(newSrc);
                    if (newSrc != '') {
                      this.cropper.replace(newSrc);
                    }
                },
            },
            template: `
                <div :style="{ width: width, height: height }">
                    <img style="max-width: 100%;" ref="cropping" />
                </div>
            `
        },
    }
};
</script>
