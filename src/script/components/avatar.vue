<template>
    <div :style="{ width: width ? width + 'px' : undefined, height: height ? height + 'px' : undefined }">
        <img :src="avatarUrl" alt="头像" class="img-fluid rounded-circle">
    </div>
</template>

<script>
import '../global';
import urljoin from 'url-join';
import Axios from 'axios';

export default {
    props: {
        userId: {
            required: true
        }, 
        width: {
            default: 55
        },
        height: {
            default: 55
        }
    },
    data: function () {
        return {
            baseUrl: apiUrlPrefix,
            uuid: ''
        };
    },
    mounted() {
        this.updateAvatar();
    },
    methods: {
        updateAvatar() {
            Axios.get('/userdata/user/id/' + this.userId)
                .then(resp => {
                    this.uuid = resp.data.avatarId;
                })
                .catch(err => {
                    console.error(err);
                });
        }
    },
    watch: {
        userId: function () {
            this.updateAvatar();
        }
    },
    computed: {
        avatarUrl: function () {
            return urljoin(this.baseUrl, 'img/avatar', this.uuid);
        }
    }
}
</script>
