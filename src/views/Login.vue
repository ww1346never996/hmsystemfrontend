<template>
    <div>
        <el-form :rules="rules"
                 ref="loginForm"
                 :model="loginForm"
                 class="loginContainer">
            <h3 class="loginTitle">
                系统登录
            </h3>
            <el-form-item prop="username">
                <el-input type="text" v-model="loginForm.username" auto-complete="false"
                          placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" auto-complete="false" v-model="loginForm.password"
                          placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input type="text" auto-complete="false" v-model="loginForm.code" placeholder="请输入验证码"
                          style="width: 250px; margin-right: 5px;"></el-input>
                <img :src="captchaUrl" object-fit="contain" @click="updateCaptcha">
            </el-form-item>
            <el-checkbox v-model="checked" style="text-align: left; margin-bottom: 15px;margin-top: 10px;height: auto">记住我</el-checkbox>
            <el-button style="float: right"
                    @click="toRegister">注册</el-button>
            <el-button type="primary" style="width: 100%;margin-left: 0px" @click="submitLogin">登录</el-button>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                captchaUrl: '/captcha?time=' + new Date(),
                user:[],
                tokenStr:'',
                loginForm: {
                    username: '',
                    password: '',
                    code: ''
                },
                checked: true,
                rules: {
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}],
                    code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
                },
            }
        },
        methods: {
            updateCaptcha() {
                this.captchaUrl = '/captcha?time' + new Date();
            },
            submitLogin() {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.postRequest('/login', this.loginForm).then(resp => {
                            if (resp) {
                                //存储用户token
                                this.tokenStr = resp.obj.token;
                                window.sessionStorage.setItem('tokenStr', this.tokenStr);
                                //跳转首页
                                this.$router.replace('/home');
                            }
                        });
                    } else {
                        this.$message.error('请输入所有字段！');
                        return false;
                    }
                });
            },
            toRegister(){
                this.$router.push('/register');
            }
        }
    }
</script>

<style>
    .loginContainer {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 15px 35px 15px 35px;
        background: #ffffff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }

    .loginTitle {
        margin: 0px auto 40px auto;
        text-align: center;
    }

    .el-form-item__content {
        display: flex;
        align-items: center;
    }
</style>