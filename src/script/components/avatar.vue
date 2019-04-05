<template>
    <div :style="{ width: width + 'px', height: height + 'px' }">
        <img :src="avatarUrl" alt="头像" class="img-fluid rounded-circle">
    </div>
</template>

<script>
import '../global';
import urljoin from 'url-join';

export default {
    props: {
        uuid: {
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
            baseUrl: apiUrlPrefix
        };
    },
    computed: {
        avatarUrl: function () {
            return urljoin(this.baseUrl, 'img/avatar', this.uuid);
        }
    }
}
</script>
