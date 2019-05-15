<template>
  <div>
    <header class="page-header">
      <div class="container-fluid">
        <h2 class="no-margin-bottom">游戏桌</h2>
      </div>
    </header>
    <div v-if="mode == 'creation' && selfId == userId">
      <div class="breadcrumb-holder container-fluid">
        <div class="breadcrumb">
          <div class="breadcrumb-item d-flex align-items-center">
            <button type="button" class="btn btn-secondary" @click="mode = 'view'">返回</button>
          </div>
        </div>
      </div>
      <section>
        <div class="container-fluid">
          <div class="row">
            <div class="card w-100">
              <div class="card-header d-flex align-items-center">
                <h3 class="h4 px-3">新建游戏桌</h3>
              </div>
              <div class="card-body">
                <form id='game-form' class="form-validate"
                 @submit="function(e) { e.preventDefault(); if($('#game-form').valid()) createGame(); }">
                  <div class="form-group row align-items-center">
                      <label class="col-lg-2 form-control-label text-center">游戏名</label>
                      <div class="col-lg-10">
                        <input type="text" class="form-control" required
                          v-model="creationData.title"  name="gameTitle" />
                      </div>
                  </div>
                  <div class="form-group row align-items-center">
                    <label class="col-lg-2 form-control-label text-center">类型</label>
                    <div class="col-lg-10 d-flex align-items-center">
                      <div class="px-2">
                        <input id="game-type-radios1" type="radio" required
                          v-model="creationData.type" value="0" name="privacy">
                        <label for="game-type-radios1">快速桌</label>
                      </div>
                      <div class="px-2">
                        <input id="game-type-radios2" type="radio" required
                          v-model="creationData.type" value="1" name="privacy">
                        <label for="game-type-radios2">完整游戏</label>
                      </div>
                    </div>
                  </div>
                  <div v-if="creationData.type == 1" class="form-group row align-items-center">
                    <label class="col-lg-2 form-control-label text-center">模组</label>
                    <div class="col-lg-10">
                      <span v-show="creationData.mod != ''" class="px-4">{{ creationData.mod }}</span>
                      <button type="button" class="btn btn-info">选择模组</button>
                    </div>
                  </div>
                  <div class="form-group row align-items-center">
                    <label class="col-lg-2 form-control-label text-center">玩家</label>
                    <div class="col-lg-10">
                      <div class="d-flex align-items-center">
                        <a v-for="(id, index) in creationData.playersId" :key="'avatar-user-' + id"
                         class="d-block m-2" href="javascript:void(0)" @click="creationData.playersId.splice(index, 1)">
                          <avatar :userId="id"></avatar>
                        </a>
                      </div>
                      <button type="button" class="btn btn-info" @click="openUserSelector()">邀请玩家</button>
                    </div>
                  </div>
                  <div class="line"></div>
                  <div class="form-group row align-items-center">
                    <div class="offset-lg-2 col-lg-10">
                      <button type="submit" class="btn btn-primary">创建游戏</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div v-if="mode == 'playerManager' && selfId == userId && selectedDMGameIdx >= 0 && selectedDMGameIdx < gameAsDM.length">
      <div class="breadcrumb-holder container-fluid">
        <div class="breadcrumb">
          <div class="breadcrumb-item d-flex align-items-center">
            <button type="button" class="btn btn-secondary" @click="mode = 'view'">返回</button>
          </div>
        </div>
      </div>
      <section>
        <div class="container-fluid">
          <div class="row">
            <div class="card w-100">
              <div class="card-header d-flex align-items-center">
                <h3 class="h4 px-3">玩家管理</h3>
              </div>
              <div class="card-body">
                <div class="row align-items-center">
                  <span class="col-lg-2 text-center">玩家</span>
                  <div class="col-lg-10">
                    <button type="button" class="btn btn-info" @click="openUserSelector()">邀请玩家</button>
                  </div>
                </div>
                <div v-for="player in gameAsDM[selectedDMGameIdx].players" :key="'manage-player-' + player.userId" class="row my-2">
                  <div class="offset-lg-2 col-lg-10 d-flex align-items-center">
                    <avatar class="m-2" :userId="player.userId"></avatar>
                    <span class="m-2">{{ player.userName }}</span>
                    <button type="button" class="btn btn-primary m-2" @click="viewCharacter(player.characterUuid)">查看角色卡</button>
                    <button type="button" class="btn btn-danger m-2"
                     @click="deletePlayer(gameAsDM[selectedDMGameIdx].uuid, player.userId)">
                     <i class="fa fa-times" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div v-if="mode == 'view'">
      <div v-if="selfId == userId" class="breadcrumb-holder container-fluid">
        <div class="breadcrumb">
          <div class="breadcrumb-item d-flex align-items-center">
            <button type="button" class="btn btn-primary" @click="mode = 'creation'">主持新的游戏</button>
          </div>
        </div>
      </div>
      <section>
        <div class="container-fluid">
          <div class="row">
            <div class="card w-100">
              <div class="card-header d-flex align-items-center">
                <h3 class="h4 px-3">主持的游戏</h3>
              </div>
              <div class="card-body">
                <div
                  v-for="(game, index) in gameAsDM"
                  :key="'game-as-dm-' + game.uuid"
                  class="row has-shadow px-4 py-2 mx-2 my-4"
                >
                  <div class="d-flex align-items-center">
                    <div v-if="!game.modUuid" class="bg-blue rounded-lg p-2"><i class="fa fa-bolt fa-fw fa-4x" aria-hidden="true"></i></div>
                    <div v-if="game.modUuid" class="bg-orange rounded-lg p-2"><i class="fa fa-gamepad fa-fw fa-4x" aria-hidden="true"></i></div>
                    <div class="mx-4">
                      <h1 class="m-0">{{ game.title }}</h1>
                      <p class="text-secondary m-0">类型：{{ game.modUuid ? '完整游戏桌' : '快速游戏桌' }}</p>
                      <p v-if="game.modUuid" class="text-secondary m-0">装载模组：{{ game.modUuid }}</p>
                      <p class="m-0">
                        <span v-if="game.status == 0" class="text-orange"><i class="fa fa-eercast" aria-hidden="true"></i>准备中</span>
                        <span v-if="game.status == 1" class="text-green"><i class="fa fa-eercast" aria-hidden="true"></i>可游戏</span>
                        <span v-if="game.status == 2" class="text-gray"><i class="fa fa-eercast" aria-hidden="true"></i>已结束</span>
                      </p>
                    </div>
                    <div class="mx-4">
                      <div class="text-center"><small class="text-secondary">主持人</small></div>
                      <avatar :userId="game.dmId"></avatar>
                    </div>
                    <div class="mx-4">
                      <div class="text-center"><small class="text-secondary">玩家</small></div>
                      <div class="d-flex align-items-center">
                        <div v-for="player in game.players" :key="`game-as-dm-${game.uuid}-player-${player.userId}`" class="mx-1">
                          <avatar :userId="player.userId"></avatar>
                        </div>
                      </div>
                    </div>
                    <div v-if="selfId == userId" class="mx-4">
                      <button v-if="game.status == 0" type="button" class="btn btn-primary" @click="mode = 'playerManager'; selectedDMGameIdx = index;">玩家管理</button>
                      <button v-if="game.status == 0" type="button" class="btn btn-success" @click="makeGameReady(game.uuid)">完成准备</button>
                      <button v-if="game.status != 2" type="button" class="btn btn-danger" @click="invalidGame(game.uuid)">关闭游戏</button>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <nav class="m-auto">
                    <ul class="pagination">
                      <li :class="{'page-item': true, 'disabled': gameAsDMPageIdx <= 0}">
                        <a class="page-link" href="javascript:void(0)" @click="gameAsDMPageIdx--">
                          <span aria-hidden="true">&laquo;</span>
                        </a>
                      </li>
                      <li
                        v-for="i in gameAsDMPageCount"
                        :key="'game-as-dm-page-' + i"
                        :class="{'page-item': true, 'active': gameAsDMPageIdx + 1 == i}"
                      >
                        <a
                          class="page-link"
                          href="javascript:void(0)"
                          @click="gameAsDMPageIdx = i - 1"
                        >{{ i }}</a>
                      </li>
                      <li
                        :class="{'page-item': true, 'disabled': gameAsDMPageIdx >= gameAsDMPageCount - 1}"
                      >
                        <a class="page-link" href="javascript:void(0)" @click="gameAsDMPageIdx++">
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
                <h3 class="h4 px-3">参与的游戏</h3>
              </div>
              <div class="card-body">
                <div
                  v-for="(game, index) in gameAsPlayer"
                  :key="'game-as-player-' + game.uuid"
                  class="row has-shadow px-4 py-2 mx-2 my-4"
                >
                  <div class="d-flex align-items-center">
                    <div v-if="!game.modUuid" class="bg-blue rounded-lg p-2"><i class="fa fa-bolt fa-fw fa-4x" aria-hidden="true"></i></div>
                    <div v-if="game.modUuid" class="bg-orange rounded-lg p-2"><i class="fa fa-gamepad fa-fw fa-4x" aria-hidden="true"></i></div>
                    <div class="mx-4">
                      <h1 class="m-0">{{ game.title }}</h1>
                      <p class="text-secondary m-0">类型：{{ game.modUuid ? '完整游戏桌' : '快速游戏桌' }}</p>
                      <p v-if="game.modUuid" class="text-secondary m-0">装载模组：{{ game.modUuid }}</p>
                      <p class="m-0">
                        <span v-if="game.status == 0" class="text-orange"><i class="fa fa-eercast" aria-hidden="true"></i>准备中</span>
                        <span v-if="game.status == 1" class="text-green"><i class="fa fa-eercast" aria-hidden="true"></i>可游戏</span>
                        <span v-if="game.status == 2" class="text-gray"><i class="fa fa-eercast" aria-hidden="true"></i>已结束</span>
                      </p>
                    </div>
                    <div class="mx-4">
                      <div class="text-center"><small class="text-secondary">主持人</small></div>
                      <avatar :userId="game.dmId"></avatar>
                    </div>
                    <div class="mx-4">
                      <div class="text-center"><small class="text-secondary">玩家</small></div>
                      <div class="d-flex align-items-center">
                        <div v-for="player in game.players" :key="`game-as-player-${game.uuid}-player-${player.userId}`" class="mx-1">
                          <avatar :userId="player.userId"></avatar>
                        </div>
                      </div>
                    </div>
                    <div v-if="selfId == userId" class="mx-4">
                      <button type="button" v-if="game.status == 0" class="btn btn-primary" @click="openCharacterList(); selectedPlayerGameIdx = index;">选择角色卡</button>
                      <button type="button" class="btn btn-info" :disabled="!game.players.find(e => e.userId == userId).characterUuid"
                        @click="viewCharacter(game.players.find(e => e.userId == userId).characterUuid)">查看我的角色</button>
                    </div>
                    <div class="mx-4">
                    </div>
                  </div>
                </div>
                <div class="row">
                  <nav class="m-auto">
                    <ul class="pagination">
                      <li :class="{'page-item': true, 'disabled': gameAsPlayerPageIdx <= 0}">
                        <a class="page-link" href="javascript:void(0)" @click="gameAsPlayerPageIdx--">
                          <span aria-hidden="true">&laquo;</span>
                        </a>
                      </li>
                      <li
                        v-for="i in gameAsPlayerPageCount"
                        :key="'game-as-player-page-' + i"
                        :class="{'page-item': true, 'active': gameAsPlayerPageIdx + 1 == i}"
                      >
                        <a
                          class="page-link"
                          href="javascript:void(0)"
                          @click="gameAsPlayerPageIdx = i - 1"
                        >{{ i }}</a>
                      </li>
                      <li
                        :class="{'page-item': true, 'disabled': gameAsPlayerPageIdx >= gameAsPlayerPageCount - 1}"
                      >
                        <a class="page-link" href="javascript:void(0)" @click="gameAsPlayerPageIdx++">
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
    
    <!-- User List -->
    <div class="modal fade" ref="userDialog" tabindex="-1" role="dialog" aria-labelledby="userDialogTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="userDialog">选择参与玩家</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body page">
            <community :self-id="selfId" :user-id="userId" @user-changed="selectedUser"></community>
          </div>
        </div>
      </div>
    </div>

    <!-- Character Data -->
    <div class="modal fade" ref="characterDialog" tabindex="-1" role="dialog" aria-labelledby="characterDialogTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="characterDialog">角色卡</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body page">
            <view-character v-if="characterDataUpdated" ref="viewCharacterData" :init-data="characterData" :only-view="true"></view-character>
          </div>
        </div>
      </div>
    </div>

    <!-- Character List -->
    <div class="modal fade" ref="characterListDialog" tabindex="-1" role="dialog" aria-labelledby="characterListDialogTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="characterListDialog">角色列表</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body page">
            <character ref="characterList" :self-id="selfId" :user-id="userId" :can-select="true" @select-character="selectedCharacter"></character>
          </div>
        </div>
      </div>
    </div>

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
import community from './community.vue';
import avatar from '../components/avatar.vue';
import viewCharacter from './view-character.vue';
import characterList from './character.vue';

export default {
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
      mode: 'view',
      
      gameAsDMPageCount: 1,
      gameAsDMPageIdx: 0,
      gameAsPlayerPageCount: 1,
      gameAsPlayerPageIdx: 0,
      gameAsDM: [],
      gameAsPlayer: [],

      creationData: {
        title: '',
        type: 0,
        mod: '',
        playersId: []
      },

      selectedDMGameIdx: -1,
      selectedPlayerGameIdx: -1,

      characterDataUpdated: true,
      characterData: {
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
    };
  },
  watch: {
    mode: function (newVal, oldVal) {
      if (newVal == 'view') {
        this.fetchGamesAsDM();
        this.fetchGamesAsPlayer();
      } else if (newVal == 'creation') {
        this.creationData.title = '';
        this.creationData.type = 0;
        this.creationData.mod = '';
        this.creationData.playersId.splice(0, this.creationData.playersId.length);
      }
    },
    gameAsDMPageIdx: function (newVal, oldVal) {
      this.updateGameAsDMList(newVal);
    },
    gameAsPlayerPageIdx: function (newVal, oldVal){
      this.updateGameAsPlayerList(newVal);
    }
  },
  mounted() {
    this.fetchGamesAsDM();
    this.fetchGamesAsPlayer();
  },
  methods: {
    $,
    openUserSelector() {
      $(this.$refs['userDialog']).modal('show');
    },
    selectedUser(userId) {
      if (this.mode == 'creation') {
        if (userId == this.selfId) {
          Swal.fire({
            title: '错误',
            text: '不能选择自己',
            type: 'error'
          });
        } else {
          if (this.creationData.playersId.indexOf(userId) == -1) {
            this.creationData.playersId.push(userId);
            $(this.$refs['userDialog']).modal('hide');
          } else {
            Swal.fire({
              title: '错误',
              text: '不能选择重复玩家',
              type: 'error'
            });
          }
        }
      } else if (this.mode == 'playerManager') {
        if (userId == this.selfId) {
          Swal.fire({
            title: '错误',
            text: '不能选择自己',
            type: 'error'
          });
        } else {
          let game = this.gameAsDM[this.selectedDMGameIdx];
          if (game.players.find(e => e.userId == userId) == undefined) {
            Axios.post('/persona/game/' + game.uuid + '/player', {
              userId: userId
            })
            .then(() => {
              this.updateGameAsDMList(this.gameAsDMPageIdx);
            });
            $(this.$refs['userDialog']).modal('hide');
          } else {
            Swal.fire({
              title: '错误',
              text: '不能选择重复玩家',
              type: 'error'
            });
          }
        }
      }
    },
    viewCharacter(uuid) {
      if (uuid == null) {
        Swal.fire({
          title: '未设定',
          text: '他还没有设定这场游戏使用的角色卡',
          type: 'info'
        });
      } else {
        console.log(uuid);
        Axios.get('/userdata/character/concrete/' + uuid)
        .then(resp => {
            this.characterData.uuid = resp.data.uuid;
            this.characterData.portrait.id = resp.data.uuid;
            this.characterData.portrait.stature = resp.data.portrait.stature;
            this.characterData.name = resp.data.data.name;
            this.characterData.description = resp.data.data.description;
            this.characterData.refreshPoint = resp.data.data.refreshFatePoint;
            this.characterData.physics = resp.data.data.physics;
            this.characterData.mental = resp.data.data.mental;
            this.characterData.aspects.splice(0, this.characterData.aspects.length);
            for (let i in resp.data.data.aspects) {
                this.characterData.aspects.push(resp.data.data.aspects[i]);
            }
            this.characterData.abilities.splice(0, this.characterData.abilities.length);
            for (let i in resp.data.data.abilities) {
                this.characterData.abilities.push(resp.data.data.abilities[i]);
            }
            this.characterData.stunts.splice(0, this.characterData.stunts.length);
            for (let i in resp.data.data.stunts) {
                this.characterData.stunts.push(resp.data.data.stunts[i]);
            }
            this.characterData.consequences.splice(0, this.characterData.consequences.length);
            for (let i in resp.data.data.consequences) {
                this.characterData.consequences.push(resp.data.data.consequences[i]);
            }
            this.characterDataUpdated = false;
            this.$nextTick(() => this.characterDataUpdated = true);
            $(this.$refs['characterDialog']).modal();
        })
        .catch(err => {
          console.error(err);
        });
      }
    },
    openCharacterList() {
      $(this.$refs['characterListDialog']).modal('show');
    },
    selectedCharacter(characterUuid) {
      $(this.$refs['characterListDialog']).modal('hide');
      Axios.put('/persona/game/' + this.gameAsPlayer[this.selectedPlayerGameIdx].uuid + '/as-player', {
        characterId: characterUuid
      })
      .then(() => {
        this.updateGameAsPlayerList(this.gameAsPlayerPageIdx);
      })
      .catch(err => {
        console.error(err);
      });
    },
    deletePlayer(gameUuid, playerId) {
      Swal.fire({
          title: '你确定要移除这个玩家吗？',
          type: 'warning',
          showCloseButton: true,
          showCancelButton: true,
          confirmButtonText: '是',
          cancelButtonText: '否'
      })
      .then(result => {
          if (result.value) {
              Axios.delete('/persona/game/' + gameUuid + '/player/' + playerId)
              .then(() => {
                this.updateGameAsDMList(this.gameAsDMPageIdx);
              })
              .catch(err => {
                console.error(err);
              })
          }
      });
    },
    createGame() {
      Axios.post('/persona/game', {
        title: this.creationData.title,
        modGuid: this.creationData.type == 1 ? this.creationData.mod : ''
      })
      .then(resp => {
        let promises = [];
        for (let i in this.creationData.playersId) {
          promises.push(Axios.post('/persona/game/' + resp.data.uuid + '/player', {
            userId: this.creationData.playersId[i]
          }));
        }
        Promise.all(promises)
        .then(() => {
          Swal.fire({
            title: '成功',
            text: '游戏桌已创建',
            type: 'success'
          }).then(() => { this.mode = 'view'; });
        })
        .catch(() => {
          Swal.fire({
            title: '错误',
            text: '游戏创建失败',
            type: 'error'
          });
        });
      })
    },
    makeGameReady(gameUuid) {
      Axios.put('/persona/game/' + gameUuid)
      .then(resp => {
        Swal.fire({
          title: '完成',
          text: '该游戏桌可以开始游戏了',
          type: 'success'
        });
        this.updateGameAsDMList(this.gameAsDMPageIdx);
      })
      .catch(err => {
        Swal.fire({
          title: '错误',
          text: '部分玩家未设置角色卡',
          type: 'error'
        });
      });
    },
    invalidGame(gameUuid) {
      Swal.fire({
          title: '你确定要关闭这个游戏桌吗？',
          type: 'warning',
          showCloseButton: true,
          showCancelButton: true,
          confirmButtonText: '是',
          cancelButtonText: '否'
      })
      .then(result => {
        if (result.value) {
          Axios.delete('/persona/game/' + gameUuid)
          .then(() => {
            this.updateGameAsDMList(this.gameAsDMPageIdx);
          })
          .catch(err => {
            console.error(err);
          })
        }
      });
    },
    fetchGamesAsDM() {
      Axios.get('/userdata/game/dm/' + this.userId)
      .then(resp => {
        this.gameAsDMPageCount = resp.data.count;
        this.gameAsDMPageIdx = 0;
        this.updateGameAsDMList(this.gameAsDMPageIdx);
      })
      .catch(err => {
        console.log(err);
      });
    },
    fetchGamesAsPlayer() {
      Axios.get('/userdata/game/player/' + this.userId)
      .then(resp => {
        this.gameAsPlayerPageCount = resp.data.count;
        this.gameAsPlayerPageIdx = 0;
        this.updateGameAsPlayerList(this.gameAsPlayerPageIdx);
      })
      .catch(err => {
        console.log(err);
      });
    },
    updateGameAsDMList(page) {
      Axios.get('/userdata/game/dm/' + this.userId + '/' + page)
      .then(resp => {
        this.gameAsDM.splice(0, this.gameAsDM.length);
        for (let i in resp.data) {
          let game = resp.data[i];
          let gamePlayers = [];
          for (let j in game.players) {
            let player = game.players[j];
            let playerInfo = {
              userId: player.userId,
              userName: '',
              characterUuid: player.characterUuid
            };
            gamePlayers.push(playerInfo);
            Axios.get('/userdata/user/id/' + player.userId)
            .then(resp => {
              playerInfo.userName = resp.data.name;
            })
            .catch(err => {
              console.error(err);
            });
          }
          this.gameAsDM.push({
            uuid: game.uuid,
            title: game.title,
            modUuid: game.modUuid,
            status: game.status,
            dmId: game.belongUserId,
            createTime: new Date(game.createTime),
            players: gamePlayers
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    },
    updateGameAsPlayerList(page) {
      Axios.get('/userdata/game/player/' + this.userId + '/' + page)
      .then(resp => {
        this.gameAsPlayer.splice(0, this.gameAsPlayer.length);
        for (let i in resp.data) {
          let game = resp.data[i];
          let gamePlayers = [];
          for (let j in game.players) {
            let player = game.players[j];
            let playerInfo = {
              userId: player.userId,
              userName: '',
              characterUuid: player.characterUuid
            };
            gamePlayers.push(playerInfo);
            Axios.get('/userdata/user/id/' + player.userId)
            .then(resp => {
              playerInfo.userName = resp.data.name;
            })
            .catch(err => {
              console.error(err);
            });
          }
          this.gameAsPlayer.push({
            uuid: game.uuid,
            title: game.title,
            modUuid: game.modUuid,
            status: game.status,
            dmId: game.belongUserId,
            createTime: new Date(game.createTime),
            players: gamePlayers
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    }
  },
  components: {
    community,
    avatar,
    'view-character': viewCharacter,
    'character': characterList
  }
};
</script>
