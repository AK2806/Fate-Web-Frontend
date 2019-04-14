<template>
  <div class="page-content">
    <div class="content-inner" style="width: 100%;">
      <header class="page-header">
        <div class="container-fluid">
          <h2 class="no-margin-bottom">系统公告</h2>
        </div>
      </header>
      <section>
        <div class="container-fluid">
          <div class="row">
            <div class="col-lg-12">
              <div class="card">
                <div class="card-header">公告栏</div>
                <div class="card-body">
                  <div
                    v-for="(announcement, idx) in announcements"
                    :key="'announcement-' + idx"
                    class="row"
                  >
                    <div style="margin-left: 2rem;">
                      <h1 class="h1">{{ announcement.title }}</h1>
                      <small
                        class="text-secondary"
                      >时间：{{ new Date(announcement.createTime).toLocaleDateString() }}</small>
                      <a
                        :href="'#collapse-' + idx"
                        data-toggle="collapse"
                        aria-expanded="false"
                        :aria-controls="'#collapse-' + idx"
                      >
                        <small class="pl-4">展开</small>
                      </a>
                      <div class="collapse" :id="'collapse-' + idx">
                        <div style="margin: 2rem;" v-html="announcement.htmlContent"></div>
                      </div>
                    </div>
                    <div class="line"></div>
                  </div>
                  <div class="row">
                    <nav class="m-auto">
                      <ul class="pagination">
                        <li :class="{'page-item': true, 'disabled': currPage <= 0}">
                          <a class="page-link" href="javascript:void(0)" @click="currPage--">
                            <span aria-hidden="true">&laquo;</span>
                          </a>
                        </li>
                        <li
                          v-for="i in pageCount"
                          :key="'follower-page-' + i"
                          :class="{'page-item': true, 'active': currPage + 1 == i}"
                        >
                          <a
                            class="page-link"
                            href="javascript:void(0)"
                            @click="currPage = i - 1"
                          >{{ i }}</a>
                        </li>
                        <li
                          :class="{'page-item': true, 'disabled': currPage >= pageCount - 1}"
                        >
                          <a class="page-link" href="javascript:void(0)" @click="currPage++">
                            <span aria-hidden="true">&raquo;</span>
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer class="main-footer">
        <div class="container-fluid">
          <div class="row">
            <div class="col-sm-6">
              <p>《命运™》桌面角色扮演</p>
            </div>
            <div class="col-sm-6 text-right">
              <p>
                上海璀璨星屑网络科技工作室 &copy; 2019-2020
                <a
                  href="https://www.ccxxgames.com"
                  target="_blank"
                >https://www.ccxxgames.com</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import "./global";
import $ from "jquery";
import Axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      announcements: [],
      currPage: 0,
      pageCount: 1
    };
  },
  watch: {
      currPage: function (newVal, oldVal) {
          this.updatePage(newVal);
      }
  },
  mounted() {
    Axios.get("/announcement")
      .then(resp => {
        this.pageCount = resp.data.count;
        this.currPage = 0;
        this.updatePage(this.currPage);
        this.markAnnouncementRead();
      })
      .catch(err => {});
  },
  methods: {
    updatePage(pageIdx) {
      Axios.get("/announcement/" + pageIdx)
      .then(resp => {
        for (let i in resp.data) {
          let announcement = resp.data[i];
          this.announcements.push(announcement);
        }
      })
      .catch(err => {});
    },
    markAnnouncementRead() {
      Axios.put('/persona/notification/announcement')
      .then(() => {
        this.$emit('notification-updated');
      })
      .catch(err => {
        console.error(err);
      });
    }
  }
};
</script>
