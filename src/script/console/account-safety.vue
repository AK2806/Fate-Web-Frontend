<template>
    <div>
        <header class="page-header">
            <div class="container-fluid">
                <h2 class="no-margin-bottom">个人信息 -> 账号安全</h2>
            </div>
        </header>
        <!-- Account Safety -->
        <section id="account-safety">
            <div class="container-fluid">
                <div class="row">
                <div class="col-lg-12 form-container">
                    <!-- Form Elements -->
                    <form id="account-safety-form" class="form-validate"
                    @submit="function(e) { e.preventDefault(); if($('#account-safety-form').valid()) submitData(); }">
                    <div class="card">
                        <div class="card-header d-flex align-items-center">
                        <h3 class="h4 px-3">账号安全</h3>
                        </div>
                        <div class="card-body">
                        <div class="form-group row align-items-center">
                            <label class="col-sm-2 form-control-label">原密码</label>
                            <div class="col-sm">
                            <input type="password" class="form-control" required minlength="6" maxlength="24"
                                data-msg="密码长度需6-24位" v-model="model.oldPasswd"
                                name="oldPassword" />
                            </div>
                        </div>
                        <div class="form-group row align-items-center">
                            <label class="col-sm-2 form-control-label">新密码</label>
                            <div class="col-sm">
                            <input id="account-safety-new-password" type="password" class="form-control" required
                                minlength="6" maxlength="24" data-msg="密码长度需6-24位"
                                v-model="model.newPasswd" name="newPassword" />
                            </div>
                        </div>
                        <div class="form-group row align-items-center">
                            <label class="col-sm-2 form-control-label">确认密码</label>
                            <div class="col-sm">
                            <input type="password" class="form-control" required minlength="6" maxlength="24"
                                v-model="confirmPassword" equalTo="#account-safety-new-password"
                                data-msg="和上面的密码不一致" name="confirmPassword" />
                            </div>
                        </div>
                        <div class="form-group row align-items-center">
                            <div class="col-sm-4 offset-sm-2">
                            <button type="submit" class="btn btn-primary">确定</button>
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
export default {
    data() {
        return {
            confirmPassword: '',
            model: {
                oldPasswd: '',
                newPasswd: ''
            }
        };
    },
    methods: {
        submitData() {
            Axios.put('/persona/password', this.model)
                .then(() => {
                    this.model.oldPasswd = '';
                    this.model.newPasswd = '';
                    this.confirmPassword = '';
                    Swal.fire({
                        title: '成功',
                        text: '密码修改成功！',
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
    }
}
</script>
