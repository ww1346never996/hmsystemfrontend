<template>
    <div class="registerForm">
        <el-form>
            <h2 style="align-items: center;margin-left: 40%">
                用户注册
            </h2>
            <el-form-item label="用户id" style="width: 450px">
                <el-input style="margin-left: 15px"
                        v-model="form.userId" placeholder="请输入数字或英文字母，最小长度为6"></el-input>
            </el-form-item>
            <el-form-item label="用户名" style="width: 450px">
                <el-input style="margin-left: 14px"
                        v-model="form.name" placeholder="请输入用户名，最小长度为2，最大长度为10"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" style="width: 450px">
                <el-input show-password
                        v-model="form.password" placeholder="请输入数字、英文字母，最小长度为6"></el-input>
            </el-form-item>
            <el-form-item style="width: 450px" label="密码确认">
                <el-input show-password
                        v-model="form.passwordConfirm" placeholder="请再次输入密码"></el-input>
            </el-form-item>
            <el-form-item style="margin-left: 25%">
                <el-button style="margin-right: 40px"
                        type="primary" @click="onSubmit">立即注册</el-button>
                <el-button @click="returnLogin">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "Register",
        data() {
            return {
                form: {
                    userId: '',
                    name: '',
                    password: '',
                    passwordConfirm: '',
                }
            }
        },
        methods: {
            onSubmit() {
                console.log('submit!');
            },
            returnLogin(){
                this.$router.replace('/');
            }
        }
    }
</script>

<style scoped>
    .registerForm {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 500px;
        padding: 15px 35px 15px 35px;
        background: #ffffff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }
</style>