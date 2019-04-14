<template>
  <div>
    <header class="page-header">
      <div class="container-fluid">
        <h2 class="no-margin-bottom">发布公告</h2>
      </div>
    </header>
    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="card-header">编写公告</div>
              <div class="card-body">
                <div class="row my-2">
                    <label class="form-control-label text-bold col-lg-1 m-auto">标题</label>
                    <div class="col-lg-11">
                        <input type="text" class="form-control" v-model="title" />
                    </div>
                </div>
                <div class="row my-2">
                    <div class="col-lg-12">
                        <jqx-editor theme="bootstrap" ref="content" :height="height" :localization="localization" lineBreak="div">
                            <div></div>
                        </jqx-editor>
                    </div>
                </div>
                <div class="row my-2">
                    <div class="col-lg-12">
                        <button type="button" class="btn btn-primary" @click="submitData">发布</button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import "../global";
import $ from "jquery";
import Axios from "axios";
import Swal from "sweetalert2";
import jqxEditor from "jqwidgets-scripts/jqwidgets-vue/vue_jqxeditor.vue";
import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.bootstrap.css";

export default {
  data() {
    return {
      height: 500,
      localization: {
        bold: "粗体",
        italic: "斜体",
        underline: "下划线",
        format: "格式",
        font: "字体",
        size: "字体大小",
        color: "文本颜色",
        background: "填充颜色",
        left: "左对齐",
        center: "居中",
        right: "右对齐",
        outdent: "Indent Less",
        indent: "Indent More",
        ul: "Insert unordered list",
        ol: "Insert ordered list",
        image: "Insert image",
        link: "Insert link",
        html: "View source",
        clean: "Remove Formatting"
      },
      title: ''
    };
  },
  methods: {
      submitData() {
        Axios.post('/console/announcement', {
            title: this.title,
            htmlContent: this.$refs['content'].val()
        })
        .then(() => {
            this.title = '';
            this.$refs['content'].val('<div></div>');
            Swal.fire({
                title: '完成',
                text: '公告已发布',
                type: 'success'
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
  components: {
    "jqx-editor": jqxEditor
  }
};
</script>
