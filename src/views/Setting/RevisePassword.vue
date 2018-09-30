<template>

    <section class="containerBox">
        <!-- 密码修改 -->
        <div class="passwordBox">
            <div class='title'>密码修改</div>
            <el-form label-width="180px" :model="form" ref='form' :rules="rules">
                <el-form-item label="原密码：" prop="oldPassword">
                    <el-input auto-complete="off" v-model="form.oldPassword" type="password"></el-input>
                </el-form-item>
                <el-form-item label="新密码：" prop="newPassword" style='position:relative;'>
                    <el-input auto-complete="off" v-model="form.newPassword" type="password" @keyup.native="judgePwd" id="pwd">  
                    </el-input>
                    <img :src="eyeUrl" alt="" class="eyeStyle" @click="changeEye">
                </el-form-item>
                <el-form-item label="确认密码：" prop='confirmPassword'>
                    <el-input auto-complete="off" v-model="form.confirmPassword" type="password"></el-input>
                </el-form-item>
                <div class="tips">请使用8-16位数字或英文结合，请勿设置过于简单</div>
            </el-form>
            <div class="buttonBox">
                <el-button type="primary" @click="handleConfirm">确认修改</el-button>
                <!-- <el-button @click="cancel">取消</el-button> -->
            </div>
        </div>
        <!-- 密码修改成功弹框 -->
        <I-table-editor
         title="密码修改"
         v-model="successVisible"
         class="passwordDialog"
         :isClose='false'
        >
            <template slot="content">
                <div class="container">
                    <p>密码修改成功</p>
                    <el-button type="primary" @click="relogin">重新登录</el-button>
                    <span>{{time}}s后重新登录</span>
                </div>
            </template>
        </I-table-editor>
        <!-- 密码强度 -->
        <div class="pwdStrength" v-if="flag">
            <div class="text">密码强度</div>
            <div class="strengthBox">
                <div class="weak" v-if="lvl === 1">弱</div>
                <div class="middle" v-if="lvl === 2">中</div>
                <div class="strong" v-if="lvl === 3">高</div>
            </div>
        </div>
    </section>
</template>
<script>
    import ITableEditor from '../../components/Table/TableEditor.vue'
    import { valid } from 'semver';
    export default {
        data() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value.length < 6 || value.length > 18) {
                    callback(new Error('请输入长度为6~18位的密码'))
                } else if (value !== this.form.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                rules: {
                    oldPassword: [
                        { required: true, message: '请输入旧密码', trigger: 'blur'}
                    ],
                    newPassword: [
                        { required: true, message: '请输入新密码', trigger: 'blur'},
                        {  validator: validatePass, trigger: 'blur'}
                    ],
                    confirmPassword: [
                        { required: true, message: '请确认新密码', trigger: 'blur'},
                        {  validator: validatePass, trigger: 'blur'}
                    ]
                },
                form: {
                    oldPassword:'',
                    newPassword:'',
                    confirmPassword:''
                },
                time: 5,
                flag: false,
                isEyeState: false,
                lvl:null,//密码强度等级 1为弱 2为中 3为强
                successVisible: false,
                eyeUrl:require('../../assets/eye.png'),
            }
        },
        mounted() {
            
        },
        methods: {
            //确认修改密码
            handleConfirm() {
                this.$refs.form.validate((valid) => {
                    if(valid) {
                        let para = {
                            userID: JSON.parse(localStorage.getItem('user')).userID,
                            password: this.form.oldPassword,
                            newPassword: this.form.newPassword
                        }
                        console.log(para)
                        this.$put('/user',para).then(res => {
                            console.log(res);
                            if(res.state) {
                                this.successVisible = true;
                               var timer =  setInterval(() => {
                                    this.time --;
                                    if(this.time < 1) {
                                        clearInterval(timer);
                                        this.relogin();
                                    }
                                },1000)
                            }
                        })
                    }
                })
            },
            cancel() {
                this.form =  {
                    oldPassword:'',
                    newPassword:'',
                    confirmPassword:''
                }
            },
            //重新登录
            relogin() {
                this.$fetch('/logout').then(res => {
                    console.log('重新登录',res);
                    if(!res.state && res.msg == '未登陆') {
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');   
                        this.$router.push('/login');
                    }
                })
            },
            //判断密码强度
            judgePwd() {
                if(this.form.newPassword == '') {
                    this.flag = false;
                }
                if(this.form.newPassword.length >= 6 && this.form.newPassword.length <= 18) {
                    this.flag = true;
                    this.lvl = this.getLvl(this.form.newPassword);
                }
                
            },
            getLvl(txt) {
                //默认级别是0
                var lvl = 0;
                //判断这个字符串中有没有数字
                if (/[0-9]/.test(txt)) {
                    lvl++;
                }
                //判断字符串中有没有字母
                if (/[a-zA-Z]/.test(txt)) {
                    lvl++;
                }
                //判断字符串中有没有特殊符号
                if (/[^0-9a-zA-Z_]/.test(txt)) {
                    lvl++;
                }
                return lvl;
            },
            //显示、隐藏密码
            changeEye() {
                if(!this.isEyeState) {
                    this.eyeUrl = require('../../assets/openeye.png');
                    document.getElementById('pwd').type = 'text';
                    this.isEyeState = true;
                } else {
                    this.eyeUrl = require('../../assets/eye.png');
                    document.getElementById('pwd').type = 'password';
                    this.isEyeState = false;
                }
            }
            
        },
        components: {
            ITableEditor
        }
    }
</script>
<style lang='scss'>
    .containerBox {
        margin-top: 8px;
        position: relative;
    }
    div.passwordBox {
        width: 650px;
        margin-left: 68px;
        div.title {
            font-size: 30px;
            color: #606266;
            margin-top: 40px;
            margin-bottom: 55px;
        }
        .el-form-item {
            margin-bottom: 47px;
        }
        .el-form-item:nth-child(3) {
            margin-bottom: 20px;
        }
        .el-form-item__content {
            width: 430px;
        }
        .el-form-item__label {
            font-size: 24px;
            padding-right: 32px;
            color: #828282;
            text-align: left;
        }
        .el-input {
            .el-input__inner {
                height: 46px;
            }
        }
        .tips {
            color: #828282;
            font-size: 16px;
            margin-left: 180px;
            width: 100%;
            margin-bottom: 43px;
        }
        div.buttonBox {
            padding-top: 20px;
            padding-left: 180px;
            .el-button {
                font-size: 18px;
            }
        }
        .eyeStyle {
            width: 22px;
            height: 22px;
            position: absolute;
            top: 12px;
            right: 15px;
        }
    }
    //密码强度
    .pwdStrength {
        position: absolute;
        left: 700px;
        top: 197px;
        .text {
            font-size: 24px;
            color: #828282; 
            float: left;
            margin-right: 10px;
        }
        .strengthBox {
            float: left;
            color: #fff;
            font-size: 16px;  
            .weak,.middle,.strong {
                height: 33px;
                line-height: 33px;
                text-align: center;
                border-radius: 4px;
            }  
            .weak {
                width: 56px;
                background: #F44831;
            }
            .middle {
               width: 98px;
               background: #00CFC4;
            }
            .strong {
                width: 180px;
                background: #20A0FF;
            }
        }
    }
    .passwordDialog {
        .el-dialog {
            width: 500px;
            height: 300px;
            .container {
                width: 200px;
                text-align: center;
                margin: 0 auto;
                p {
                    font-size: 24px;
                    margin-bottom: 50px;
                }
            }
        }
    }
</style>
