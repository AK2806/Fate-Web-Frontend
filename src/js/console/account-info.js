import waitForCredentials from '../console';
import '../../css/account-info.css';
import avatarUpload from 'vue-image-crop-upload';

let data = {
    accountInfo: null,
    show: false,
    avatarUrl: '',
    apiUrlPrefix: apiUrlPrefix
};

waitForCredentials(() => {
    /*
    let vInst = new Vue({
        el: '#account-info',
        data: data,
        components: {
            'avatar-upload': avatarUpload
        },
        mounted() {
            Axios.get("/persona/account-info/" + appUserId)
            .then(resp => {
                this.accountInfo = resp.data;
                this.avatarUrl = apiUrlPrefix + '/img/avatar/' + resp.data.avatarId;
            })
        },
        methods: {
            toggleShow() {
                this.show = !this.show;
            },
            cropUploadSuccess(jsonData, field){
                this.accountInfo.avatarId = jsonData.uuid;
                this.avatarUrl = apiUrlPrefix + '/img/avatar/' + jsonData.uuid;
            }
        }
    });
    */
});
