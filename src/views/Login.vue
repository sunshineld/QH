<template>
  <section class="login">
    <div class="bgbox">
      <div class="login_content">
          <div class="title">起盒智慧团膳管理系统<span>v1.0</span></div>
          <div class="content">
              <div v-if='isShowMsg' style="width:338px;color:red;position:absolute;font-size:14px;left:66px;top:-28px;">
                    {{message}}
              </div>
              <div class="account">
                  <span>账号</span><input type="text" v-model="account" placeholder="请输入用户账号"/>
              </div>
              <div class="password">
                  <span>密码</span><input v-model="password" type="password" placeholder="请输入密码" @keydown="enterLogin($event)"/>
              </div>
              <div class="login_btn" @click="handleSubmit">登录</div>
              <div class="forget_pwd"><p @click="link">忘记密码</p></div>
          </div>
      </div>
      <div class="logoImg">
        <img src="../assets/qhlogo.png" alt="">
      </div>
    </div>
    
  </section>
</template>

<script>
  import { requestLogin } from '../api/api';
  import md5 from 'js-md5';
  import {routes} from '../routes.js'
  import { getUserRouterPaths } from '../routes.js'
  
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        account:'',
        password:'',
        message:'',
        isShowMsg: false,
      };
    },
    methods: {
      //跳转到忘记密码
      link() {
        this.$router.push({ path: '/forgetPassword' });
      },
      getmd5(str){
          var a;
          var md5 = crypto.createHash("md5");
          //update("中文", "utf8")
          md5.update(str);
          var a = md5.digest('hex');
          console.log(a);
          //47bce5c74f589f4867dbd57e9ca9f808
          return a;
      },
      //点击回车登录
      enterLogin(e) {
        if(e.keyCode == 13) {
          this.handleSubmit();
        }
      },
      //登录
      handleSubmit() {
        if(this.account == '' && this.password == '') {
          this.message = '请输入账号和密码';
          this.isShowMsg = true;
          return;
        } 
        if(this.account == '') {
          this.message = '请输入账号';
          this.isShowMsg = true;
          return;
        }
        if(this.password == '') {
          this.message = '请输入密码';
          this.isShowMsg = true;
          return;
        }
        if(this.account == '' || this.password == '') {
          this.$message.info("请输入账号和密码");
          return;
        }
        let loginParams = {
          userName: this.account,
          password: this.password
        };
        this.$post('/login',loginParams).then(res => {
          if(!res.state) {
            this.message = res.msg;
            this.isShowMsg = true;
            return;
          }
          localStorage.setItem('token',res.data.token);
          localStorage.setItem('user',JSON.stringify(res.data.user));
          console.log(res)
          let permissions = res.data.user.permissions;
          let dr = getUserRouterPaths(permissions);
           this.$router.push({ path: dr[0] });
        }).catch(res => {
          
        })
      }
    },
    created() {
    },
  }

</script>

<style lang="scss" >
  .login {
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
      background-image: url('../assets/bg.png');
      background-repeat: no-repeat;
      background-size:cover;
    }
  }
  .login_content {
    width: 420px;
    height: 500px;
    background: #fff;
    border-radius: 10px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 94px;
    div.title {
      width: 100%;
      height: 100px;
      box-sizing: border-box;
      padding-top: 12px;
      background: #FF931E;
      border-radius: 10px 10px 0 0;
      color: #fff;
      font-size: 30px;
      text-align: center;
      span {
        display: block;
        font-size: 24px;
        margin-top: 4px;
      }
    }
    div.content {
      width: 100%;
      position: relative;
      div.account, div.password {
        width: 80%;
        height: 66px;
        line-height: 64px;
        margin: 0 auto;
        border: 1px solid #011F2C;
        vertical-align: middle;
        border-radius: 4px;
        margin-bottom: 40px;
        font-size: 24px;
        span {
          display:inline-block;
          height: 66px;
          margin-left: 24px;
          margin-right: 24px;
        }
        input {
          border: 0;
          width: 60%;
          height: 50px;
          line-height: 50px;
          font-size: 18px;
          outline: none;
          color: #A8A8A8;
        }
      }
      div.account {
        margin-top: 40px;
      }
      div.login_btn {
        width: 260px;
        height: 60px;
        line-height: 60px;
        background: #FF931E;
        border-radius: 10px;
        font-size: 24px;
        margin: 0 auto;
        color: #fff;
        text-align: center;
        margin-bottom: 22px;
        cursor: default;
      }
      div.forget_pwd {
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
    }
  }
  .logoImg {
    position: absolute;
    left: 60px;
    bottom: 40px;
  }
  input:focus::-webkit-input-placeholder {
    color: transparent;
  }
  input:focus:-moz-placeholder {
    color: transparent;
  }
  input:focus::-moz-placeholder {
    color: transparent;
  }
  input:focus:-ms-input-placeholder {
    color: transparent;
  }
</style>