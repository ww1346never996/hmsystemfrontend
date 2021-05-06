<template>
    <div>
        <!--     用户列表弹出框       -->
        <div>
            <el-dialog title="用户列表" :visible.sync="dialogTableVisible">
                <el-table :data="userListInfo">
                    <el-table-column
                            prop="username"
                            label="用户id">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="用户名">
                    </el-table-column>
                    <el-table-column
                            prop="useridentity"
                            label="用户权限组">
                    </el-table-column>
                </el-table>
            </el-dialog>
        </div>
        <div>
            <el-row>
                <el-col :span="16">
                    <div>
                        <el-form>
                            <h2 style="margin-left: 15%">
                                个人信息管理
                            </h2>
                            <el-form-item style="margin-left: 15%" label="用户名">
                                <el-input style="margin-left: 14px; width: 79%"
                                          v-model="user.name" placeholder="请输入用户名，最小长度为2，最大长度为10"></el-input>
                            </el-form-item>
                            <el-form-item style="margin-left: 15%" label="用户密码">
                                <el-input style="width: 80%" show-password
                                          v-model="password" placeholder="请输入数字、英文字母，最小长度为6"></el-input>
                            </el-form-item>
                            <el-form-item style="margin-left: 15%" label="密码确认">
                                <el-input style="width: 80%" show-password
                                          v-model="passwordConfirm" placeholder="请再次输入密码"></el-input>
                            </el-form-item>
                            <el-form-item style="margin-left: 15%">
                                <el-button style="width: 40%"
                                           type="primary" @click="changeInfo">修改个人信息
                                </el-button>
                                <el-button style="width: 40%"
                                           @click="listCheck">查看用户列表
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div>
                        <h2 style="margin-left: 35px">用户头像</h2>
                        <div>
                            <el-avatar :size="170" :src="user.avatar"></el-avatar>
                        </div>
                        <div>
                            <el-button style="margin-top: 10px;width: 30%" @click="changeAvatar">修改头像</el-button>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import qs from "qs";

    export default {
        name: "UserInfo",
        data() {
            return {
                userList: [],
                userListInfo: [],
                user: '',
                password: '',
                passwordConfirm: '',
                dialogTableVisible: false,
            }
        },
        mounted() {
            this.loadUser()
        },
        methods: {
            loadUser() {
                this.$http.get('/usertable/getUserList').then(resp => {
                    this.userList = resp;
                });
                let tokenStr = window.sessionStorage.getItem('tokenStr');
                const data = {token: tokenStr}
                this.$http({
                    url: '/logInfo',
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: qs.stringify(data),
                }).then(resp => {
                    this.user = resp;
                })
            },
            changeInfo() {
                if (this.password == this.passwordConfirm) {
                    this.user.userpassword = this.password;
                    this.$http({
                        url: '/usertable/changeUserInfo',
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: this.user
                    }).then(resp => {
                    });
                } else {
                    this.$message.error("两次输入密码不同！");
                }
            },
            changeAvatar() {
                this.$prompt('请输入头像链接', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({value}) => {
                    if (value != null) {
                        this.user.avatar = value;
                        this.$http({
                            url: '/usertable/changeUserInfo',
                            method: 'post',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: this.user
                        }).then(resp => {
                            this.$router.go(0);
                        });
                    } else {
                        this.$message.error("请输入头像链接");
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            },
            listCheck() {
                if (window.sessionStorage.getItem("userIdentity")==1){
                    this.userListInfo = this.userList;
                    for (const item of this.userListInfo){
                        if (item.useridentity==1){
                            item.useridentity = "总管理员";
                        }else if (item.useridentity==2){
                            item.useridentity = "库存管理员";
                        }else{
                            item.useridentity = "采购管理员";
                        }
                    }
                    this.dialogTableVisible = true;
                }
            }
        }
    }
</script>

<style scoped>

</style>