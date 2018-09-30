<template>
    <section class="forget">
        <div class="bgbox">
            <div class="content">
                 <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="第一步:填写信息" name="first" disabled>
                        <el-form label-width="140px" :model="form" class="demo-ruleForm">
                            <el-form-item label="账号">
                                <el-input  placeholder="请输入账号" v-model="form.account" @input="checkAccount"></el-input>
                            </el-form-item>
                            <!-- <el-form-item label="选择找回方式">
                                <div class="radio">
                                    <el-radio-group v-model="form.type" @change="typeChange">
                                        <el-radio :label="1">手机</el-radio>
                                        <el-radio :label="2">邮箱</el-radio>
                                    </el-radio-group>
                                </div>
                            </el-form-item> -->
                            <el-form-item :label="typeName">
                                <el-input placeholder="请输入手机号" type="number" v-model="form.phoneNumber" @input="checkPhonenumber"></el-input>
                                <!-- <el-input v-if='!isShowType' placeholder="请输入邮箱" type="text" v-model="form.email" @blur="checkType"></el-input> -->
                            </el-form-item>
                        </el-form>
                        <div v-if='isShowMsg' style="width:338px;color:red;position:absolute;font-size:14px;left:344px;bottom:124px;">
                            {{message}}
                        </div>
                        <div class="next"><el-button type="primary" @click="firstNext('form')" :disabled="isDisable">下一步</el-button></div>
                        <div class="goback"><p @click="link">返回登录</p></div>
                    </el-tab-pane>
                    <el-tab-pane label="第二步:验证信息" name="second" disabled>
                        <div class="verifiedMsg">
                            <div class="title">
                                <div v-if='isShowVerifiMsg'>{{verificationMsg}}</div>
                            </div>
                            <div class="code">
                                <span>验证码</span>
                                <el-input placeholder="请输入验证码" v-model="code" @keyup.native="checkCode"></el-input>
                            </div>
                            <div class="retry">
                                <span class="time" v-if="isShowTime">{{time}}s后未收到？</span>
                                <el-button type="primary" size="small" :disabled="isDisableRetry" @click="firstNext">点击重发</el-button>
                            </div>
                            <div class="next">
                                <el-button type="primary" @click="secondNext" :disabled="isDisableTwo">下一步</el-button>
                            </div>
                            <div class="goback"><p @click="link">返回登录</p></div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="第三步:找回密码" name="third" disabled>
                        <div class="findPwed">
                            <div>{{passwordMsg}}</div>
                            <div>若要修改密码，请登录后再设置内进行修改</div>
                            <div class="next"><el-button type="primary" @click="link">登录</el-button></div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="logoImg">
                <img src="../assets/qhlogo.png" alt="">
            </div>
        </div>
  </section>
</template>
<script>
    import { getVerificationCode, verificationCode } from '../api/api';
    export default {
        data() {
            return {
                 activeName: 'first',
                 radio:'1',
                 time: 60,
                 isShowTime: false,
                 isDisable:true,
                 isDisableTwo: true,
                 isShowMsg: false,//第一步提示信息
                 verificationMsg:'',//验证提示信息
                 isShowVerifiMsg: false,//显示验证提示信息
                 message:'',
                 isDisableRetry: true,//第二步点击重发按钮禁止
                 passwordMsg:'',
                 form: {
                     account:'',
                     phoneNumber:'',
                 },
                 code:'',
                 typeName:'手机'
            }
        },
        mounted() {
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            },
            //第一步按钮 下一步是否禁用
            checkAccount() {
                if(this.form.account != '' && this.form.phoneNumber != '') {
                    this.isDisable = false;
                } else if(this.form.account == '' || this.form.phoneNumber == '') {
                    this.isDisable = true;
                }
            },
            checkPhonenumber() {
                this.checkAccount();
                let mobile = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
                if(this.form.phoneNumber == '') {
                    this.message = '';
                } else {
                    if(!mobile.test(this.form.phoneNumber)) {
                        this.message = '请输入正确的手机号';
                        this.isShowMsg = true;
                        if(this.form.account !='') {
                            this.isDisable = true;
                        }
                    } else {
                        this.isShowMsg = false;
                        if(this.form.account != '') {
                            this.isDisable = false;
                        }
                    }
                }
                
            },
            //第二步按钮 下一步是否禁用
            checkCode() {
                if(this.code == '') {
                    this.isDisableTwo = true;
                } else {
                    this.isDisableTwo = false;
                }
            },
            link() {
                this.$router.push({ path: '/login' });
            },
            firstNext() {
                let params = {
                    reservedInfo: this.form.phoneNumber,
                    userName: this.form.account
                }
                console.log(params)
                //发送请求
                getVerificationCode(params).then(res => {
                    console.log(res)
                    if(!res.state) {
                        this.message = res.msg;
                        this.isShowMsg = true;
                        return;
                    }
                    this.activeName = 'second';
                    this.verificationMsg = res.msg;
                    this.isShowVerifiMsg = true;
                    this.isShowTime = true;
                    let timer = setInterval(() => {
                        this.time --;
                        if(this.time < 1) {
                            clearInterval(timer)
                            this.isShowTime = false;
                            this.isDisableRetry = false;
                            this.isShowVerifiMsg = false;
                            this.time = 60;
                        }
                    },1000)
                })
            },
            secondNext() {
                let params = {
                    userName: this.form.account,
                    reservedInfo: this.form.phoneNumber,
                    reservedCode: this.code
                }
                verificationCode(params).then(res => {
                    if(!res.state) {
                        this.verificationMsg = res.msg;
                        this.isShowVerifiMsg = true;
                    } else {
                        this.passwordMsg = res.msg;
                        this.activeName = 'third';
                    }
                    
                })
                
            }
        }
    }
</script>
<style lang='scss'>
    .forget {
        width: 100%;
        height: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        background-image: url('../assets/bg2.png');
        .bgbox {
            width: 100%;
            height: 90%;
            position: relative;
            margin-top: 2.7%;
            background-position: center;
            background-image: url('../assets/bg1.png');
            background-repeat: no-repeat;
        }
        div.content {
            width: 800px;
            height: 550px;
            background: #fff;
            border-radius: 10px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            box-sizing: border-box;
            padding-top: 20px;
            .el-tabs__item {
                width: 250px;
                text-align: center;
                font-size: 20px;
                color: #707070;
                margin-bottom: 20px;
            }
            .el-tabs__content {
                padding-bottom: 20px;
                .el-tab-pane {
                    position: relative;
                }
                //第一步
                .el-form {
                    width: 55%;
                    margin: 0 auto;
                    margin-top: 40px;
                    .el-form-item {
                        margin-top: 50px;
                        height: 50px;
                        .el-form-item__content {
                            margin-left: 160px !important;
                        }
                        .el-form-item__label {
                            font-size: 22px;
                            color: #707070;
                            margin-top: 4px;
                            letter-spacing: 4px;
                        }
                        input::-webkit-outer-spin-button,
                        input::-webkit-inner-spin-button {
                            -webkit-appearance: none;
                        }
                        input[type="number"]{
                            -moz-appearance: textfield;
                        }
                        .el-radio__label {
                            font-size: 18px;
                            color: #707070;
                        }
                        .el-input {
                            input {
                                height: 50px;
                                font-size: 18px;
                                color:#707070;
                            }
                        }
                    }
                    .radio {
                        height: 50px;
                        line-height: 50px;
                    }
                }
                .next {
                    width: 260px;
                    margin: 0 auto;
                    margin-top: 52px;
                    margin-bottom: 24px;
                    button {
                        width: 260px;
                        height: 60px;
                        font-size: 24px;
                    }
                }
                div.goback {
                    width: 260px;
                    margin: 0 auto;
                    text-align: center;
                    border-bottom: 1px solid #707070;
                    p {
                    width: 120px;
                    text-align: center;
                    font-size: 20px;
                    margin: 0 auto;
                    margin-bottom: -14px;
                    background: #fff;
                    color: #707070;
                    cursor: pointer;
                    }
                }
                //第二步
                .verifiedMsg {
                    width: 60%;
                    margin: 0 auto;
                    padding-top: 36px;
                    .title {
                        text-align: center;
                        color: #FF6C00;
                        margin-bottom: 60px;
                        height: 20px;
                    }
                    .code {
                        height: 50px;
                        vertical-align: middle;
                        span {
                            display: inline-block;
                            width: 100px;
                            font-size: 24px;
                            height: 50px;
                            line-height: 50px;
                            color: #707070;
                        }
                        .el-input {
                            width: 70%;
                            input {
                                height: 50px;
                                font-size: 18px;
                                color: #707070;
                            }
                        }
                    }
                    .retry {
                        color: #707070;
                        margin-top: 20px;
                        text-align: right;
                        box-sizing: border-box;
                        padding-right: 38px;
                    }

                }
                //第三步
                .findPwed {
                    width: 60%;
                    margin: 0 auto;
                    padding-top: 100px;
                    color: #707070;
                    div:first-child {
                        font-size: 24px;
                        margin-bottom: 35px;
                    }
                    div:last-child {
                        font-size: 18px;
                    }
                }
            }
        }
    }
</style>
