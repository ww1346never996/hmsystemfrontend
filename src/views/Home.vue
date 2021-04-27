<template>
    <div>
        <el-container>
            <el-header class="header">
                <div class="header_text">
                    <p>医院药品管理系统</p>
                </div>
                <div class="header_account">
                    <h3 style="float: left; width: auto; height: 60px">
                        <span>{{user.name}}</span>
                    </h3>
                    <el-avatar style="float: right; margin-left: 10px" :size="60" :src="user.avatar"></el-avatar>
                </div>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu router>
                        <el-submenu index="1"
                                    v-for="(item,index) in this.$router.options.routes" :key="index"
                                    v-if="!item.hidden">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>{{item.name}}</span>
                            </template>
                            <el-menu-item :index="children.path"
                                          v-for="(children, indexj) in item.children" >
                                {{children.name}}
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                    <el-button style="width: 100px;margin-left:38px;margin-right:25px;position: fixed;bottom: 20px; width: auto;align-items: center"
                               type="danger"
                               @click="logout">用户登出</el-button>
                </el-aside>
                <el-main>
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import qs from 'qs'
    export default {
        name: "Home",
        data() {
            return {
                user: [],
                drawer: false,
                direction: 'rtl',
            }
        },
        mounted: function () {
            this.getUser();
        },
        methods:{
            getUser(){
                if (window.sessionStorage.getItem('tokenStr')){
                    let tokenStr = window.sessionStorage.getItem('tokenStr');
                    const data = {token:tokenStr}
                    this.$http({
                        url: '/logInfo',
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: qs.stringify(data),
                    }).then(resp=>{
                        this.user = resp;
                        window.sessionStorage.setItem("userIdentity",this.user.useridentity);
                        window.sessionStorage.setItem("username",this.user.name);
                        window.sessionStorage.setItem("userid",this.user.username);
                    })
                }
            },
            logout(){
                this.$http.post("/logout").then(resp=>{
                    window.sessionStorage.removeItem("tokenStr");
                    window.sessionStorage.removeItem("userIdentity");
                    window.sessionStorage.removeItem("username");
                });
                this.$router.replace("/");
            },
        }
    }
</script>

<style scoped>
    .header {
        background: #8e99ed;
        height: 20px;
        display: inline-block;
    }

    .header_text {
        display: inline;
        width: 180px;
        text-align: left;
        font-size: 18px;
        margin-left: 10px;
        align-items: center;
        float: left;
    }

    .header_account {
        width: auto;
        height: 60px;
        display: inline;
        float: right;
        align-items: center;
    }
</style>