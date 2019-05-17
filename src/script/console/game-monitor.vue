<template>
  <div>
    <header class="page-header">
      <div class="container-fluid">
        <h2 class="no-margin-bottom">系统管理</h2>
      </div>
    </header>
    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="card w-100">
            <div class="card-header d-flex align-items-center">
              <h3 class="h4 px-3">数据统计</h3>
              <button type="button" class="btn btn-info" @click="refreshStatistics"><i class="fa fa-refresh" aria-hidden="true"></i></button>
            </div>
            <div class="card-body">
              <div class="p-4">
                <div class="row m-4">
                  <h1 class="h1">注册用户数：{{ usersCount }}</h1>
                </div>
                <div class="row m-4">
                  <h1 class="h1">累计游戏局数：{{ gameTablesCount }}</h1>
                </div>
                <div class="row m-4">
                  <h3 class="h3">过去12小时的游戏局数统计：</h3>
                  <canvas id="lineChart"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="card w-100">
            <div class="card-header d-flex align-items-center">
              <h3 class="h4 px-3">游戏实例</h3>
              <button type="button" class="btn btn-info" @click="fetchGameInstances"><i class="fa fa-refresh" aria-hidden="true"></i></button>
            </div>
            <div class="card-body">
              <div
                v-for="(gameInstance, idx) in gameInstances"
                :key="'game-instance-as-dm-' + gameInstance.uuid"
                class="has-shadow"
              >
                <div class="row px-4 py-2 mx-2 my-4 d-flex align-items-center">
                  <div v-if="!gameInstance.modUuid" class="bg-blue rounded-lg p-2">
                    <i class="fa fa-bolt fa-fw fa-4x" aria-hidden="true"></i>
                  </div>
                  <div v-if="gameInstance.modUuid" class="bg-orange rounded-lg p-2">
                    <i class="fa fa-gamepad fa-fw fa-4x" aria-hidden="true"></i>
                  </div>
                  <div class="mx-4">
                    <h1 class="m-0">{{ gameInstance.title }}</h1>
                    <p class="text-secondary m-0">类型：{{ gameInstance.modUuid ? '完整游戏桌' : '快速游戏桌' }}</p>
                    <p v-if="gameInstance.modUuid" class="text-secondary m-0">装载模组：{{ gameInstance.modUuid }}</p>
                  </div>
                  <div class="mx-4">
                    <div class="text-center">
                      <small class="text-secondary">主持人</small>
                    </div>
                    <avatar v-if="gameInstance.inGameDmId >= 0" :userId="gameInstance.dm.userId"></avatar>
                  </div>
                  <div class="mx-4">
                    <div class="text-center">
                      <small class="text-secondary">玩家</small>
                    </div>
                    <div class="d-flex align-items-center">
                      <div
                        v-for="player in gameInstance.players"
                        :key="`gameInstance-as-dm-${gameInstance.uuid}-player-${player.userId}`"
                        class="mx-1"
                      >
                      <avatar v-if="gameInstance.inGamePlayersId.indexOf(player.userId) != -1" :userId="player.userId"></avatar>
                      </div>
                    </div>
                  </div>
                  <div class="mx-4">
                    <a
                      role="button"
                      class="btn btn-primary"
                      :href="'#collapse-' + idx"
                      data-toggle="collapse"
                      aria-expanded="false"
                      :aria-controls="'#collapse-' + idx"
                    >查看日志</a>
                    <button
                      type="button"
                      class="btn btn-danger"
                      @click="forceStopInstance(gameInstance.uuid)"
                    >强制结束</button>
                  </div>
                </div>
                <div class="row mx-2 py-4 collapse" :id="'collapse-' + idx">
                  <div class="col-lg-12">
                    <textarea class="form-control rounded w-100" v-model="gameInstance.log" readonly rows="20"></textarea>
                  </div>
                </div>
              </div>
              <div class="row">
                <nav class="m-auto">
                  <ul class="pagination">
                    <li :class="{'page-item': true, 'disabled': gameInstancesPageIdx <= 0}">
                      <a class="page-link" href="javascript:void(0)" @click="gameInstancesPageIdx--">
                        <span aria-hidden="true">&laquo;</span>
                      </a>
                    </li>
                    <li
                      v-for="i in gameInstancesPageCount"
                      :key="'gameInstance-as-dm-page-' + i"
                      :class="{'page-item': true, 'active': gameInstancesPageIdx + 1 == i}"
                    >
                      <a
                        class="page-link"
                        href="javascript:void(0)"
                        @click="gameInstancesPageIdx = i - 1"
                      >{{ i }}</a>
                    </li>
                    <li
                      :class="{'page-item': true, 'disabled': gameInstancesPageIdx >= gameInstancesPageCount - 1}"
                    >
                      <a class="page-link" href="javascript:void(0)" @click="gameInstancesPageIdx++">
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
    </section>
  </div>
</template>

<script>
import "../global";
import $ from "jquery";
import Axios from "axios";
import Vue from "vue";
import Swal from "sweetalert2";
import urljoin from "url-join";
import "jquery-validation";
import uuid from "uuid/v1";
import avatar from "../components/avatar.vue";
import Chart from "chart.js";

export default {
  data() {
    return {
      usersCount: 0,
      gameTablesCount: 0,
      gameInstancesCountPerPage: 5,
      gameInstancesPageIdx: 0,
      gameInstances: [],
      lineChart: null
    };
  },
  computed: {
    gameInstancesPageCount() {
      return Math.ceil(this.gameInstances.length / this.gameInstancesCountPerPage);
    }
  },
  mounted() {
    let LINECHART = $('#lineChart');
    this.lineChart = new Chart(LINECHART, {
        type: 'line',
        options: {
            legend: {labels:{fontColor:"#777", fontSize: 12}},
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: {
                        color: '#eee'
                    }
                }],
                yAxes: [{
                    display: true,
                    gridLines: {
                        color: '#eee'
                    },
                    ticks: {
                        min: 0,
                        suggestedMax: 10
                    }
                }]
            },
        },
        data: {
            labels: ['00:00','00:00','00:00','00:00','00:00','00:00','00:00','00:00','00:00','00:00','00:00','00:00'],
            datasets: [
                {
                    label: "游戏桌数",
                    fill: true,
                    lineTension: 0.3,
                    backgroundColor: 'rgba(76, 162, 205, 0.85)',
                    borderColor: 'rgba(76, 162, 205, 0.85)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    borderWidth: 1,
                    pointBorderColor: 'rgba(76, 162, 205, 0.85)',
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(76, 162, 205, 0.85)',
                    pointHoverBorderColor: "rgba(220, 220, 220, 1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [],
                    spanGaps: false
                }
            ]
        }
    });
    this.refreshStatistics();
    this.fetchGameInstances();
  },
  methods: {
    $,
    refreshStatistics() {
      Axios.get('/console/statistics/users-count')
      .then(resp => {
        this.usersCount = resp.data.count;
      })
      .catch(err => {
        console.error(err);
      });
      Axios.get('/console/statistics/gaming-records-count')
      .then(resp => {
        this.gameTablesCount = resp.data.count;
      })
      .catch(err => {
        console.error(err);
      });
      Axios.get('/console/statistics/gaming-records-count/last-12-hours')
      .then(resp => {
        let countRespList = resp.data;
        var now = new Date();
        for (let i = 11; i >= 0; --i) {
          this.lineChart.data.labels[i] = now.getHours().toString().padStart(2, '0') + ':00';
          now.setHours(now.getHours() - 1);
          this.lineChart.data.labels[i] = now.getHours().toString().padStart(2, '0') + ':00 ~ ' + this.lineChart.data.labels[i];
        }
        let data = this.lineChart.data.datasets[0].data;
        data.splice(0, data.length);
        for (let i = countRespList.length - 1; i >= 0; --i) {
          this.lineChart.data.datasets[0].data.push(countRespList[i].count);
        }
        this.lineChart.update();
      })
      .catch(err => {
        console.error(err);
      })
    },
    fetchGameInstances() {
      Axios.get("/console/game-instance")
        .then(resp => {
          this.gameInstancesPageIdx = 0;
          this.gameInstances.splice(0, this.gameInstances.length);
          for (let i in resp.data.gameInstances) {
            let gameInstance = resp.data.gameInstances[i];
            Axios.get("/userdata/game/" + gameInstance.gameUuid)
              .then(gameResp => {
                let game = gameResp.data;
                let gamePlayers = [];
                for (let j in game.players) {
                  let player = game.players[j];
                  let playerInfo = {
                    userId: player.userId,
                    userName: "",
                    characterUuid: player.characterUuid
                  };
                  gamePlayers.push(playerInfo);
                  Axios.get("/userdata/user/id/" + player.userId)
                    .then(resp => {
                      playerInfo.userName = resp.data.name;
                    })
                    .catch(err => {
                      console.error(err);
                    });
                }
                let instancePlayersId = [];
                for (let j in gameInstance.playersId) {
                  instancePlayersId.push(gameInstance.playersId[j]);
                }
                var instanceInfo = {
                  uuid: game.uuid,
                  title: game.title,
                  modUuid: game.modUuid,
                  inGameDmId: gameInstance.dmId,
                  inGamePlayersId: instancePlayersId,
                  dm: { userId: game.belongUserId, userName: "" },
                  players: gamePlayers,
                  createTime: new Date(gameInstance.createTime),
                  log: gameInstance.log,
                  serverIpAddr: gameInstance.socketAddress,
                  serverPort: gameInstance.socketPort
                }
                Axios.get("/userdata/user/id/" + instanceInfo.dm.userId)
                  .then(resp => {
                    instanceInfo.dm.userName = resp.data.name;
                  })
                  .catch(err => {
                    console.error(err);
                  });
                this.gameInstances.push(instanceInfo);
              })
              .catch(err => {
                console.error(err);
              });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    forceStopInstance(gameUuid) {
      Swal.fire({
          title: '确定要强制终止这个进程吗？',
          type: 'warning',
          showCloseButton: true,
          showCancelButton: true,
          confirmButtonText: '是',
          cancelButtonText: '否'
      })
      .then(result => {
          if (result.value) {
              Axios.delete('/console/game-instance/' + gameUuid)
              .then(() => {
                  Swal.fire({
                      title: '成功',
                      text: '进程已终止',
                      type: 'success'
                  });
                  this.fetchGameInstances();
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
    avatar
  }
};
</script>
