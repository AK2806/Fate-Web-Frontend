<template>
    <div>
        <!-- Page Header -->
        <header class="page-header">
          <div class="container-fluid">
            <h2 class="no-margin-bottom">个人信息 -> 账号资料</h2>
          </div>
        </header>
        <!-- Account Info -->
        <section id="account-info">
          <div class="container-fluid">
            <div class="row">
              <div v-if="!denied" class="col-lg-6 form-container">
                <!-- Form Elements -->
                <form id='account-info-form' class="form-validate"
                  @submit="function(e) { e.preventDefault(); if($('#account-info-form').valid()) submitData(); }">
                  <div class="card">
                    <div class="card-header d-flex align-items-center">
                      <h3 class="h4 px-3">账号资料</h3>
                      <div class="card-option" v-show="editable">
                        <button type="button" class="btn btn-link"
                          @click="overrideEditModel(); editMode = true;"
                          v-show="!editMode">
                          <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                        </button>
                        <button type="submit" class="btn btn-link" @click="editMode = false"
                          v-show="editMode">
                          <i class="fa fa-check" aria-hidden="true"></i>
                        </button>
                        <button type="button" class="btn btn-link" @click="editMode = false"
                          v-show="editMode">
                          <i class="fa fa-times" aria-hidden="true"></i>
                        </button>
                      </div>
                    </div>
                    <div class="card-body">
                      <div class="row align-items-center">
                        <span class="col-lg-2">头像</span>
                        <div class="col-lg-10">
                          <avatar :uuid="avatarId"></avatar>
                          <button type="button" class="btn btn-link" v-show="editable"
                            @click="showAvatarUploader = !showAvatarUploader;">修改</button>
                          <avatar-upload field="imageFile"
                            @crop-upload-success="(jsonData, field) => { avatarId = jsonData.uuid; $emit('account-info-changed'); }"
                            v-model="showAvatarUploader" :width="128" :height="128"
                            :url="avatarUploadUrl" img-format="png" :with-credentials="true"></avatar-upload>
                        </div>
                      </div>
                      <div class="line"></div>
                      <div v-show="!editMode">
                        <div class="row align-items-center my-4">
                          <span class="col-lg-2">昵称</span>
                          <span class="col-lg-10">{{ model.name }}</span>
                        </div>
                        <div class="row align-items-center my-4">
                          <span class="col-lg-2">性别</span>
                          <span class="col-lg-10" v-show="model.gender == 0">
                            <i class="fa fa-mars" aria-hidden="true"></i>
                          </span>
                          <span class="col-lg-10" v-show="model.gender == 1">
                            <i class="fa fa-venus" aria-hidden="true"></i>
                          </span>
                          <span class="col-lg-10" v-show="model.gender == 2">
                            <i class="fa fa-venus-mars" aria-hidden="true"></i>
                          </span>
                        </div>
                        <div class="row align-items-center my-4">
                          <span class="col-lg-2">生日</span>
                          <span class="col-lg-10">{{ model.birthday.toLocaleDateString() }}</span>
                        </div>
                        <div class="row align-items-center my-4">
                          <span class="col-lg-2">所在地</span>
                          <span class="col-lg-10">{{ model.residence }}</span>
                        </div>
                        <div class="row align-items-center my-4">
                          <span class="col-lg-2">资料可见度</span>
                          <span class="col-lg-10" v-show="model.privacy == 0">仅自己可见</span>
                          <span class="col-lg-10" v-show="model.privacy == 1">互粉可见</span>
                          <span class="col-lg-10" v-show="model.privacy == 2">公开</span>
                        </div>
                      </div>
                      <div v-show="editMode">
                        <div class="form-group row align-items-center">
                          <label class="col-lg-2 form-control-label">昵称</label>
                          <div class="col-lg-10">
                            <input type="text" class="form-control" required maxlength="50"
                              v-model="editModel.name" name="name" />
                          </div>
                        </div>
                        <div class="form-group row">
                          <label class="col-lg-2 form-control-label">性别</label>
                          <div class="col-lg-2">
                            <label for="account-info-gender-radios1">
                              <input id="account-info-gender-radios1" type="radio" required
                                v-model="editModel.gender" value="0" name="gender">
                              <i class="fa fa-mars" aria-hidden="true"></i>
                            </label>
                          </div>
                          <div class="col-lg-2">
                            <label for="account-info-gender-radios2">
                              <input id="account-info-gender-radios2" type="radio" required
                                v-model="editModel.gender" value="1" name="gender">
                              <i class="fa fa-venus" aria-hidden="true"></i>
                            </label>
                          </div>
                          <div class="col-lg-2">
                            <label for="account-info-gender-radios3">
                              <input id="account-info-gender-radios3" type="radio" required
                                v-model="editModel.gender" value="2" name="gender">
                              <i class="fa fa-venus-mars" aria-hidden="true"></i>
                            </label>
                          </div>
                        </div>
                        <div class="form-group row align-items-center">
                          <label class="col-lg-2 form-control-label">生日</label>
                          <div class="col-lg-10">
                            <datepicker v-model="editModel.birthday"
                              :language="datepicker.lang['zh']" name="birthday" :bootstrap-styling="true"
                              :disabled-dates="{ from: new Date() }"></datepicker>
                          </div>
                        </div>
                        <div class="form-group row align-items-center">
                          <label class="col-lg-2 form-control-label">所在地</label>
                          <div class="col-lg-10">
                            <input type="text" class="form-control" maxlength="100"
                              v-model="editModel.residence" name="residence" />
                          </div>
                        </div>
                        <div class="form-group row">
                          <label class="col-lg-2 form-control-label">资料可见度</label>
                          <div class="col-lg-10">
                            <div>
                              <input id="account-info-privacy-radios1" type="radio" required
                                v-model="editModel.privacy" value="0" name="privacy">
                              <label for="account-info-privacy-radios1">仅自己可见</label>
                            </div>
                            <div>
                              <input id="account-info-privacy-radios2" type="radio" required
                                v-model="editModel.privacy" value="1" name="privacy">
                              <label for="account-info-privacy-radios2">互粉可见</label>
                            </div>
                            <div>
                              <input id="account-info-privacy-radios3" type="radio" required
                                v-model="editModel.privacy" value="2" name="privacy">
                              <label for="account-info-privacy-radios3">公开</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
    </div>
</template>

<script>
import '../global';
import $ from 'jquery';
import 'jquery-validation';
import Axios from 'axios';
import avatarUpload from 'vue-image-crop-upload';
import vuejsDatepicker from 'vuejs-datepicker';
import * as datepickerLang from "vuejs-datepicker/src/locale";
import urljoin from 'url-join';
import Swal from 'sweetalert2';
import avatar from '../components/avatar.vue';

function jqueryInit() {
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
    // External links to new window
    // ------------------------------------------------------ //
    $('.external').on('click', function (e) {

        e.preventDefault();
        window.open($(this).attr("href"));
    });
};

export default {
  props: {
    userId: {
      type: Number,
      required: true
    },
    editable: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      denied: false,
      editMode: false,
      showAvatarUploader: false,
      avatarUploadUrl: urljoin(apiUrlPrefix, '/persona/avatar'),
      avatarId: '',
      model: {
        name: '',
        gender: 2,
        birthday: new Date(),
        residence: '',
        privacy: 0
      },
      editModel: {
        name: '',
        gender: 2,
        birthday: new Date(),
        residence: '',
        privacy: 0
      },
      datepicker: {
        lang: datepickerLang
      }
    }
  },
  mounted() {
    this.fetchAccountInfo();
    jqueryInit();
  },
  watch: {
    userId: function(newId, oldId) {
      Axios.get('/userdata/account-info/' + newId)
      .then(resp => {
          this.avatarId = resp.data.avatarId;
          this.model.name = resp.data.name;
          this.model.gender = resp.data.gender;
          this.model.birthday = new Date(resp.data.birthday);
          this.model.residence = resp.data.residence;
          this.model.privacy = resp.data.privacy;
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
    'avatar-upload': avatarUpload,
    'datepicker': vuejsDatepicker,
    'avatar': avatar
  },
  methods: {
    $,
    fetchAccountInfo() {
      Axios.get('/userdata/account-info/' + this.userId)
        .then(resp => {
            this.avatarId = resp.data.avatarId;
            this.model.name = resp.data.name;
            this.model.gender = resp.data.gender;
            this.model.birthday = new Date(resp.data.birthday);
            this.model.residence = resp.data.residence;
            this.model.privacy = resp.data.privacy;
            this.denied = false;
        })
        .catch(err => {
            Swal.fire({
                title: '错误',
                text: err.response ? err.response.data.message : err.message,
                type: 'error'
            });
            this.denied = true;
        });
    },
    overrideEditModel() {
      this.editModel.name = this.model.name;
      this.editModel.gender = this.model.gender;
      this.editModel.birthday = new Date(this.model.birthday);
      this.editModel.residence = this.model.residence;
      this.editModel.privacy = this.model.privacy;
    },
    submitData() {
      Axios.patch('/persona/account-info', this.editModel)
      .then(() => {
        this.fetchAccountInfo();
        this.$emit('account-info-changed');
      })
      .catch(err => {
          Swal.fire({
              title: '错误',
              text: err.response ? err.response.data.message : err.message,
              type: 'error'
          });
      });
    }
  }
};
</script>