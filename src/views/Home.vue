<template>
    <el-row class="container">
        <el-col :span="24" class="header">
            <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
                <!-- {{collapsed?'':sysName}} -->
                <img src="../assets/qh_logo.png" alt="">
            </el-col>
            <el-col :span="5">
                <div class="tools" @click.prevent="collapse">
                    <i class="fa fa-align-justify"></i>
                </div>
            </el-col>
            <el-col :span="9" class="userinfo">
                <div style="display:inline;color:#475669;font-size:18px;margin-right:10px;">{{enterpriseName}}</div>
                <span class="el-dropdown-link userinfo-inner" style="display:inline-block;margin-right:50px;">
                    {{sysUserName}}
                </span>
                <img src="../assets/qh_logo.png" alt="" style='width:30px;vertical-align: middle;'>
            </el-col>
        </el-col>
        <el-col :span="24" class="main">
            <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
                <!--导航菜单-->
                <el-menu :default-active="$route.path" id="lastclass"  class="el-menu-vertical-demo" @open="handleopen"
                         @close="handleclose" @select="handleselect"
                         unique-opened router v-show="!collapsed">

                    <template v-for="(item, index) in menuList">
                        <el-submenu :index="index+''" :key='index'>
                            <template slot="title"><img :src="item.iconCls" class="imgClass"/>{{item.name}}</template>
                            <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path"
                                @click="logout($event, item.name, child.name)" class="white"><span :id='child.logout == true ? "logout" : ""'>{{child.name}}</span>
                            </el-menu-item>
                        </el-submenu>
                        <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path" :key='index'><img
                                :src="item.iconCls" class="imgClass"/>{{item.children[0].name}}
                        </el-menu-item>
                    </template>
                </el-menu>
                <!--导航菜单-折叠后-->
                <ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
                    <li v-for="(item,index) in menuList" :key='index' class="el-submenu item">
                        <template v-if="!item.leaf">
                            <div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)"
                                @mouseout="showMenu(index,false)"><img :src="item.iconCls" class="imgClass"/></div>
                            <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)"
                                @mouseout="showMenu(index,false)">
                                <li v-for="child in item.children" :key="child.path"
                                    class="el-menu-item whiteColor" style="padding-left: 40px;"
                                    :class="$route.path==child.path?'is-active':''" @click="$router.push({path: child.path})">
                                    {{child.name}}
                                </li>
                            </ul>
                        </template>
                        <template v-else>
                    <li class="el-submenu">
                        <div class="el-submenu__title el-menu-item"
                             style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;"
                             :class="$route.path==item.children[0].path?'is-active':''"
                             @click="$router.push(item.children[0].path)"><img :src="item.iconCls" class="imgClass"/></div>
                    </li>
                    </template>
                    </li>
                </ul>
            </aside>
            <section class="content-container">
                <div class="grid-content bg-purple-light">
                    <el-col :span="24" class="breadcrumb-container">
                        <strong style='font-size:16px' class="title">{{cname}}</strong>
                        <el-breadcrumb separator="/" class="breadcrumb-inner">
                            <el-breadcrumb-item >
                                {{pname + " / " + cname}}
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                    <el-col :span="24" class="content-wrapper">
                        <transition name="fade" mode="out-in">
                            <router-view></router-view>
                        </transition>
                    </el-col>
                </div>
            </section>
        </el-col>
    </el-row>
</template>

<script>
    import { getMenuList } from '../menu.js'
    export default {
        data() {
            return {
                sysName: 'VUEADMIN',
                collapsed: false,
                sysUserName: '',
                sysUserAvatar: '',
                menuList: [],
                enterpriseName:'',
                pname:'',
                cname:''
            }
        },
        methods: {
            onSubmit() {
                console.log('submit!');
            },
            handleopen(key, keyPath) {
                // console.log(key, keyPath);
            },
            handleclose(key, keyPath) {
                // console.log(key, keyPath);
            },
            handleselect: function (a, b) {
            },
            //退出登录
            logout: function (e, pname, cname) {
                let id = e.$vnode.elm.children[0].id;
                if(id == 'logout') {
                    var _this = this;
                    this.$confirm('确认退出吗?', '提示', {
                        //type: 'warning'
                    }).then(() => {
                        this.$fetch('/logout').then(res => {
                            if(!res.state && res.msg == '未登陆') {
                                localStorage.removeItem('user');
                                localStorage.removeItem('token');   
                                this.$router.push('/login');
                            }
                        })
                    }).catch(() => {

                    });
                } else {
                    this.pname = pname
                    this.cname = cname
                }
                
            },
            // //折叠导航栏
            // collapse: function () {
            //     this.collapsed = !this.collapsed;
            // },
            //折叠导航栏
            collapse: function () {
                this.collapsed = !this.collapsed;
                var uiwidth = document.getElementById('lastclass');
                if (uiwidth.offsetWidth === 0) {
                    {
                        uiwidth.style.width = "230px"
                    }
                }
            },
            showMenu(i, status) {
                this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
            },
            initNav() {
                for (let i = 0; i < this.menuList.length; i++) {
                    for (let j = 0; j < this.menuList[i].children.length; j++) {
                        if (this.$route.path == this.menuList[i].children[j].path) {
                            this.pname = this.menuList[i].name
                            this.cname = this.menuList[i].children[j].name
                            return;
                        }
                    }
                }
            }
        },
        mounted() {
            // console.log('====================',this.$route)
            var user = localStorage.getItem('user');
            if (user) {
                user = JSON.parse(user);
                this.sysUserName = user.contacts || '';
                this.enterpriseName = user.enterpriseName || '';
                // this.sysUserAvatar = user.avatar || '';
                this.menuList = getMenuList(user.permissions)
                this.initNav()
            }
            

        }
    }

</script>

<style lang="scss">
    @import '~scss_vars';
    .container {
        // position: absolute;
        // top: 0px;
        // bottom: 0px;
        height: 100%;
        width: 100%;
        .header {
            height: 60px;
            line-height: 60px;
            background: #F4F3EF;
            color: #fff;
            .userinfo {
                text-align: right;
                padding-right: 35px;
                float: right;
                .userinfo-inner {
                    cursor: pointer;
                    font-size: 18px;
                    color: #475669;
                }
            }
            .logo {
                //width:230px;
                height: 60px;
                font-size: 22px;
                padding-left: 20px;
                padding-right: 20px;
                border-color: rgba(238, 241, 146, 0.3);
                border-right-width: 1px;
                border-right-style: solid;
                img {
                    width: 40px;
                    float: left;
                    margin-top: 4px;
                }
                .txt {
                    color: #fff;
                }
            }
            .logo-width {
                width: 230px;
            }
            .logo-collapse-width {
                width: 60px
            }
            .tools {
                padding: 0px 23px;
                width: 14px;
                height: 60px;
                line-height: 60px;
                cursor: pointer;
            }
        }
        .main {
            display: flex;
            // background: #324057;
            position: absolute;
            top: 60px;
            bottom: 0px;
            overflow: hidden;
            aside {
                flex: 0 0 230px;
                width: 230px;
                // position: absolute;
                // top: 0px;
                // bottom: 0px;
                .el-menu {
                    height: 100%;
                }
                .collapsed {
                    width: 60px;
                    .item {
                        position: relative;
                    }
                    .submenu {
                        position: absolute;
                        top: 0px;
                        left: 60px;
                        z-index: 99999;
                        height: auto;
                        display: none;
                    }

                }
            }
            .menu-collapsed {
                flex: 0 0 60px;
                width: 60px;
            }
            .menu-expanded {
                flex: 0 0 230px;
                width: 230px;
            }
            .content-container {
                // background: #f1f2f7;
                flex: 1;
                // position: absolute;
                // right: 0px;
                // top: 0px;
                // bottom: 0px;
                // left: 230px;
                overflow-y: scroll;
                padding: 20px;
                .breadcrumb-container {
                    //margin-bottom: 15px;
                    .title {
                        width: 200px;
                        float: left;
                        color: #475669;
                    }
                    .breadcrumb-inner {
                        float: right;
                    }
                }
                .content-wrapper {
                    background-color: #fff;
                    box-sizing: border-box;
                }
            }
        }
    }
    .el-submenu__title {
        background-color: #00cfc4;
        color: #fff;
        margin-bottom: 2px;
    }
    .el-menu-item {
        background-color: #011f2c;
        color: #fff;
    }
    #lastclass {
        background-color: #011f2c;
    }
    .el-submenu__title:hover {
        background:  #00cfc4 !important;
        opacity: 0.8;
    }
    .el-menu-item:hover {
        background-color: #093e56 !important;
    }
    .el-dialog__title {
        font-size: 22px;
    }
    .imgClass {
        margin-right: 20px;
    }
    .whiteColor {
        color: #fff !important;
    }
</style>