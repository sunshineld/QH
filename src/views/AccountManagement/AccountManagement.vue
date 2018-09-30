<template>
    <section>
        <!-- 账号管理 -->
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-input placeholder="角色/姓名/电话/邮箱/账号/密码" v-model="name" style="width:250px" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search" v-if="checkBtn">查询</el-button>
                </el-form-item> 
                <el-form-item>
                    <el-button type="primary" @click='creatStaffVisible = true' v-if="addBtn">创建员工账号</el-button>
                </el-form-item>
                <el-form-item v-if="enterpriseTypeID == 1">
                    <el-button type="primary" @click="handleCreatStore" v-if="addBtn">门店管理账号</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!-- 列表 -->
        <el-table
         :data='tableData' 
         highlight-current-row 
         v-loading="listLoading" 
         style="width: 100%;">
            <el-table-column 
             label="序号"
             type="index" 
             width="100" 
             />
            <el-table-column 
             label="角色" 
             width="200" 
             >
             <template slot-scope="scope">
                 <span v-for='(item,index) in scope.row.roleList' :key="index">{{item.roleName}}&emsp;</span>
             </template>
            </el-table-column>
            <el-table-column 
             v-if="enterpriseTypeID == 1"
             label="门店名称"
             show-overflow-tooltip 
             width="200" 
             >
             <template slot-scope="scope">
                 <span v-for='(item,index) in scope.row.canteenList' :key="index">{{item.canteenName}}&emsp;</span>
             </template>
            </el-table-column>
            <el-table-column 
             prop="contacts" 
             label="联系人" 
             width="150" 
             />
            <el-table-column 
             prop="contactNumber" 
             label="联系电话" 
             min-width="150" 
             >
            </el-table-column>
            <el-table-column 
             prop="email" 
             label="联系邮箱" 
             min-width="150" 
             >
            </el-table-column>
            <el-table-column 
             prop="userName" 
             label="账号" 
             min-width="120" 
             >
            </el-table-column>
            <el-table-column 
             prop="password" 
             label="密码" 
             min-width="120" 
             >
            </el-table-column>
            <el-table-column 
             label="状态" 
             min-width="120" 
             >
             <template slot-scope="scope">
                 <el-tag type='success' v-if='scope.row.state == 0'>正常</el-tag>
                 <el-tag type='danger' v-if='scope.row.state == 1'>锁定</el-tag>
                <el-tag type='danger' v-if='scope.row.state == 2'>已停用</el-tag>
             </template>
            </el-table-column>
            <el-table-column
             v-if="editBtn" 
             label="操作" 
             min-width="220">
                <template slot-scope="scope">
                    <el-button type="primary" :disabled="scope.row.roleList.length == 1 && scope.row.roleList[0].roleID == 2" v-if="editBtn" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="primary" v-if='editBtn && scope.row.state != 0' size="small" @click="handleStart(scope.row)">启用</el-button>
                    <el-button type="danger"  v-if='editBtn && scope.row.state == 0' size="small" @click="handleStop(scope.row)">停用</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 创建员工账号 第一步-->
        <I-table-editor
         title='创建员工账号'
         v-model="creatStaffVisible"
         @dialogVisibleClose='staffDialogClose'
         class="creatStaffDailog"
        >
            <template slot="content">
                <div class="searchBox">
                    <p class="titlePS">请选择员工(只能单选)</p>
                    <el-input placeholder="请输入员工姓名" v-model="staffName"></el-input>
                    <el-button type="primary" @click="searchStaff">搜索</el-button>
                </div>
                <div class="tableList">
					<el-table
					:data="staffData"
                    height="300"
                    ref='staffTable'
                    @selection-change='selectStaff'
					style="width: 100%">
                        <el-table-column 
                        type="selection" 
                        width="55">
                        </el-table-column>
                        <el-table-column 
                        type="index" 
                        label="序号"
                        width="80">
                        </el-table-column>
                        <el-table-column
                            prop="employeeName"
                            label="姓名"
                            min-width="80">
                        </el-table-column>
                        <el-table-column
                            prop="positionName"
                            label="职位"
                            min-width="80">
                        </el-table-column>
                        <el-table-column
                            prop="departmentName"
                            label="部门"
                            min-width="80">
                        </el-table-column>
                        <el-table-column
                            prop="phoneNumber"
                            label="电话"
                            min-width="120">
                        </el-table-column>
                        <el-table-column
                            prop="email"
                            label="邮箱"
                            min-width="150">
                        </el-table-column>
					</el-table>
				</div>
            </template>
            <template slot="foot">
                <el-button @click="creatStaffVisible = false">取消</el-button>
                <el-button type="primary" @click="creatFirstNext">下一步</el-button>
            </template>
        </I-table-editor>
        <!-- 创建员工账号 第二步 选择角色-->
        <I-table-editor
         title='选择角色'
         v-model="chooseRoleVisible"
         class="chooseRoleDailog"
        >
            <template slot="content">
                <div class="titlePS"><p>请选择角色(可多选)</p></div>
                <div class="roleBox">
                    <div class="roleLib">
                        <p class="title">角色库</p>
                        <el-table
                            :data="roleData"
                            height="250"
                            style="width: 100%">
                            <el-table-column
                                prop="roleName"
                                label="角色"
                                min-width="100">
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                width="100">
                                <template slot-scope="scope">
                                    <span size="small" @click="addRole(scope.row)" v-if='!scope.row.flag' style="color:#20A0FF;cursor:default;">添加</span>
                                    <span size="small" v-if='scope.row.flag' style="color:#B5DFFF;cursor:default;">已添加</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="arrow">
                        <img src="../../assets/rolearrows.png" alt="">
                    </div>
                    <div class="choosed">
                        <p class="title">已选择角色</p>
                        <el-table
                            :data="chooseRoleData"
                            height="250"
                            style="width: 100%">
                            <el-table-column
                                prop="roleName"
                                label="角色"
                                min-width="100">
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                width="100">
                                <template slot-scope="scope">
                                    <span size="small" @click='removeRole(scope.row)' style="color:#F44831;cursor:default;">删除</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </template>
            <template slot="foot">
                <el-button @click="chooseRoleVisible = false">取消</el-button>
                <el-button type="primary" @click="creatSecondNext" v-if="enterpriseTypeID == 1">下一步</el-button>
                <el-button type="primary" @click="creatThirdNext" v-if="enterpriseTypeID != 1 && !confirmEditBtn">创建账号</el-button>
                <el-button type="primary" @click="confirmEdit" v-if="enterpriseTypeID != 1 && confirmEditBtn">确认</el-button>
            </template>
        </I-table-editor>
        <!-- 创建员工账号 第三步 选择门店 -->
        <I-table-editor
         title='选择门店'
         v-model="chooseStoreVisible"
         class="chooseRoleDailog"
        >
            <template slot="content">
                <div class="titlePS"><p>请选择门店(可多选)</p></div>
                <div class="roleBox">
                    <div class="roleLib">
                        <p class="title">门店列表</p>
                        <el-table
                            :data="storeData"
                            height="250"
                            style="width: 100%">
                            <el-table-column
                                prop="canteenName"
                                label="门店名称"
                                min-width="100">
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                width="100">
                                <template slot-scope="scope">
                                    <span size="small" @click="addStore(scope.row)" v-if='!scope.row.flag' style="color:#20A0FF;cursor:default;">添加</span>
                                    <span size="small" v-if='scope.row.flag' style="color:#B5DFFF;cursor:default;">已添加</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="arrow">
                        <img src="../../assets/rolearrows.png" alt="">
                    </div>
                    <div class="choosed">
                        <p class="title">已选门店</p>
                        <el-table
                            :data="chooseStoreData"
                            height="250"
                            style="width: 100%">
                            <el-table-column
                                prop="canteenName"
                                label="门店名称"
                                min-width="100">
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                width="100">
                                <template slot-scope="scope">
                                    <span size="small" @click="removeStore(scope.row)" style="color:#F44831;cursor:default;">删除</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="remarks">如不选择，将默认查看所有门店</div>
            </template>
            <template slot="foot">
                <el-button @click="chooseStoreVisible = false">取消</el-button>
                <el-button type="primary" v-if="!confirmEditBtn"  @click="creatThirdNext">创建账号</el-button>
                <el-button type="primary" @click="confirmEdit" v-if="confirmEditBtn">确认</el-button>
            </template>
        </I-table-editor>
        <!--创建员工账号 第四步 员工账号 -->
        <I-table-editor
         title="员工账号"
         v-model="staffAccountVisible"
         class="staffAccountDailog"
        >
            <template slot="content">
                <div class="content">
                    <p><span>账号：</span>{{userName}}</p>
                    <p><span>密码：</span>{{password}}</p>
                </div>
            </template>
            <template slot="foot">
                <span class="remarks">账号和密码为系统自动生成，密码可在设置修改</span>
                <!-- <el-button type="primary">发送通知</el-button> -->
            </template>
        </I-table-editor>
        <!-- 创建门店管理账号 -->
        <I-table-editor
         title='创建门店管理账号'
         v-model="creatStoreVisible"
         @dialogVisibleClose='storeDialogClose'
         class="creatStoreDailog"
        >
            <template slot="content">
                <div class="searchBox">
                    <p class="titlePS">请选择门店(只能单选)</p>
                    <el-input placeholder="请输入门店名称" v-model="canteenName"></el-input>
                    <el-button type="primary" @click="getStoreList">搜索</el-button>
                </div>
                <div class="tableList">
					<el-table
					:data="storeDatas"
                    height="300"
                    ref='storeTable'
                    @selection-change='selectStore'
					style="width: 100%">
                        <el-table-column 
                        type="selection" 
                        width="55">
                        </el-table-column>
                        <el-table-column 
                        type="index" 
                        label="序号"
                        width="80">
                        </el-table-column>
                        <el-table-column
                            prop="canteenName"
                            label="门店名称"
                            min-width="120">
                        </el-table-column>
                        <el-table-column
                            prop="address"
                            label="地址"
                            min-width="200">
                        </el-table-column>
                        <el-table-column
                            prop="employeeName"
                            label="负责人"
                            min-width="80">
                        </el-table-column>
                        <el-table-column
                            prop="phoneNumber"
                            label="电话"
                            min-width="120">
                        </el-table-column>
                        <el-table-column
                            label="账号状态"
                            min-width="120">
                            <template slot-scope="scope">
                                <el-tag type='success' v-if='scope.row.state > 0'>已创建</el-tag>
                                <el-tag type='danger' v-if='scope.row.state == 0'>未创建</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="note"
                            label="说明"
                            min-width="150">
                        </el-table-column>
					</el-table>
				</div>
            </template>
            <template slot="foot">
                <el-button @click="creatStoreVisible = false">取消</el-button>
                <el-button type="primary" @click="creatStoreAccount">创建账号</el-button>
            </template>
        </I-table-editor>
        <!-- 创建门店管理账号 第二步 -->
        <I-table-editor
         title="门店管理账号"
         v-model="storeAccountVisible"
         class="staffAccountDailog"
        >
            <template slot="content">
                <div class="content">
                    <p><span>账号：</span>{{storeAccount}}</p>
                    <p><span>密码：</span>{{storePassword}}</p>
                </div>
            </template>
            <template slot="foot">
                <span class="remarks">账号和密码为系统自动生成，密码可在设置修改</span>
                <!-- <el-button type="primary">发送通知</el-button> -->
            </template>
        </I-table-editor>
        <!-- 编辑 -->
        <!-- <I-table-editor 
         title="编辑"
         v-model="editVisible"
         class="addDailog"
        >
            <template slot="content">
                <el-form :model="form" label-width="100px"  ref="form">
                    <el-form-item label="名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-input v-model="form.type"></el-input>
                    </el-form-item>
                    <el-form-item label="角色">
                        <el-input v-model="form.role"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人">
                        <el-input v-model="form.contacts"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话">
                        <el-input v-model="form.contactsPhone"></el-input>
                    </el-form-item>
                    <el-form-item label="联系邮箱">
                        <el-input v-model="form.contactsEmail"></el-input>
                    </el-form-item>
                    <el-form-item label="账号">
                        <el-input v-model="form.account"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="form.password"></el-input>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-tag type='success'>正常</el-tag>
                    </el-form-item>
                </el-form>
            </template>
            <template slot="foot">
                <el-button @click="editVisible = false">取消</el-button>
                <el-button type="primary">确认</el-button>
            </template>
        </I-table-editor> -->
    </section>
</template>
<script>
    import ITableEditor from '../../components/Table/TableEditor.vue'
    export default {
        data() {
            return {
                listLoading: false,
                editVisible: false,
                tableData:[],//列表数据
                staffData:[],//员工数据
                roleData:[],//角色数据
                chooseRoleData:[],//选中的角色
                storeData:[],//门店数据
                storeDatas:[],//未创建账号的门店
                chooseStoreData:[],//已选门店数据
                custormersData:[],//客户数据
                //创建员工账号
                creatStaffVisible: false,
                chooseRoleVisible: false,
                chooseStoreVisible: false,
                staffAccountVisible: false,
                //创建门店管理账号
                creatStoreVisible: false,
                storeAccountVisible: false,
                //创建超级管理员账号
                creatSuperVisible: false,
                superAdminVisible: false,
                //编辑表单数据
                form: {
                    name:'',
                    role:'',
                    type:'',
                    contacts:'',
                    contactsPhone:'',
                    contactsEmail:'',
                    account:'',
                    password:''
                },
                canteenName:'',//门店名称
                staffName:'',//员工姓名
                customersName:'',//公司名称
                chooseStaff:[],//选中的员工
                staffSels:[],
                storeSels:[],
                customersSels:[],
                userName:'',//用户名
                password:'',//密码
                name:null,//姓名
                storeAccount:'',//门店账号
                storePassword:'',//门店密码
                enterpriseID: 0,
                confirmEditBtn: false,
                userID:null,//用户ID
                //操作按钮
                checkBtn: false,
                editBtn: false,
                addBtn: false,
                enterpriseTypeID: null,
                arrCanteenID:[],//员工能查看的门店ID
            }
        },
        mounted() {
            this.enterpriseID = JSON.parse(localStorage.getItem('user')).enterpriseID;
            this.enterpriseTypeID = JSON.parse(localStorage.getItem('user')).enterpriseTypeID;
            this.init();
            this.getBtn();
            this.getStaff();
            this.getRole();
            this.getAllStore();
        },
        methods: {
            //操作按钮是否显示
            getBtn() {
                let permissions = JSON.parse(localStorage.getItem('user')).permissions;
                if(permissions.indexOf('511') > -1) {
                    this.checkBtn = true;
                    
                }
                if(permissions.indexOf('512') > -1) {
					this.addBtn = true;
                }
                if(permissions.indexOf('513') > -1) {
					this.editBtn = true;
                }
                
            },
            //弹框关闭
            customersDialogClose() {
                this.customersName = '';
                this.$refs.customersTable.clearSelection();
            },
            staffDialogClose() {
                this.staffName = '';
                this.$refs.staffTable.clearSelection();
            },
            storeDialogClose() {
                this.canteenName = '';
                this.$refs.storeTable.clearSelection();
            },
            //获取合作客户
            getCooperativeCustomers() {
                this.$fetch('/enterprises/' + this.enterpriseID + '/' + this.customersName).then(res => {
                    if(res.state) {
                        this.custormersData = res.data;
                    }
                })
            },
            //选中客户
            selectCustomers(sels) {
                this.customersSels = sels;
            },
            //查询员工 
            searchStaff() {
                if(this.staffName == '') {
                    this.getStaff();
                    return;
                }
                this.$fetch('/employee/' + this.enterpriseID + '/' + this.staffName).then(res => {
                    this.staffData = res.data;
                })
            },
            //获取员工
            getStaff() {
                this.$fetch('/employees/' + this.enterpriseID + '/' + 0 + '/' + 0 + '/').then(res => {
                    console.log('员工',res)
                    if(res.state) {
                        this.staffData = res.data.list;
                    }
                })
            },
            //选中员工
            selectStaff(sels) {
                this.staffSels = sels;
            },
            //门店管理账号弹框
            handleCreatStore() {
                this.creatStoreVisible = true;
                this.getStoreList();
            },
            //获取所有门店
            getAllStore() {
                this.$fetch('/canteens/' + this.enterpriseID).then(res => {
                    if(res.state) {
                        for(let i = 0; i < res.data.length; i ++) {
                            res.data[i].flag = false;
                        }
                    }
                    this.storeData = res.data;
                })
            },
            //获取未创建账号的门店
            getStoreList() {
                if(this.canteenName == '') {
                    this.canteenName = null;
                }
                let para = {
                    enterpriseID: this.enterpriseID,
                    canteenName: this.canteenName
                }
                this.$post('/canteens/withoutRegister',para).then(res => {
                    // console.log('门店',res)
                    if(res.state) {
                        this.storeDatas = res.data;
                    }
                })
            },
            //选中门店
            selectStore(sels) {
                this.storeSels = sels;
            },
            //获取岗位角色
            getRole() {
                this.$fetch('/roles/'+this.enterpriseID).then(res => {
                    if(res.state) {
                        for(let i = 0; i < res.data.length; i ++) {
                            res.data[i].flag = false;
                        }
                        this.roleData = res.data;
                    }
                })
            },
            //添加角色
            addRole(row) {
                for(let i = 0; i < this.roleData.length; i ++) {
                    if(this.roleData[i].roleID == row.roleID) {
                        this.roleData[i].flag = true;
                    }
                }
                this.chooseRoleData.push(row);
            },
            //删除角色
            removeRole(row) {
                for(let i = 0; i < this.roleData.length; i++) {
                    if(this.roleData[i].roleID == row.roleID) {
                        this.roleData[i].flag = false;
                    }
                }
                for(let i = 0; i < this.chooseRoleData.length; i++) {
                    if(this.chooseRoleData[i].roleID == row.roleID) {
                        this.chooseRoleData.splice(i,1);
                    }
                }
                
                
            },
            //添加门店
            addStore(row) {
                for(let i = 0; i < this.storeData.length; i ++) {
                    if(this.storeData[i].canteenID == row.canteenID) {
                        this.storeData[i].flag = true;
                    }
                }
                this.chooseStoreData.push(row);
            },
            //删除门店
            removeStore(row) {
                for(let i = 0; i < this.storeData.length; i ++) {
                    if(this.storeData[i].canteenID == row.canteenID) {
                        this.storeData[i].flag = false;
                    }
                }
                for(let i = 0; i < this.chooseStoreData.length; i++) {
                    if(this.chooseStoreData[i].canteenID == row.canteenID) {
                        this.chooseStoreData.splice(i,1);
                    }
                }
            },
            //查询 
            search() {
                this.$fetch('/users/' + this.enterpriseID + '/' + this.name).then(res => {
                    console.log(res);
                    if(res.state) {
                        this.tableData = res.data;
                    }
                })
            },
            //初始化
            init() {
                this.$fetch('/users/' + this.enterpriseID).then(res => {
                    if(res.state) {
                        console.log(res)
                        this.tableData = res.data;
                    }
                })
            },
            //编辑员工角色和门店
            handleEdit(val) {
                // console.log(val)
                this.userID = val.userID;
                this.confirmEditBtn = true;
                this.arrCanteenID = [];
                if(val.roleList.length == 1 && val.roleList[0].roleID == 2) {

                } else {
                    this.roleData.forEach(element => {
                        element.flag = false;
                    })
                    let arr1 = [];
                    val.roleList.forEach(element => {
                        arr1.push(element.roleID)
                    });
                    this.roleData.forEach(element => {
                        if(arr1.indexOf(element.roleID) > -1) {
                            element.flag = true;
                        }
                    })
                    val.canteenList.forEach(item => {
                        this.arrCanteenID.push(item.canteenID);
                    })
                    this.chooseRoleVisible = true;
                    this.chooseRoleData = [...val.roleList];
                    if(this.enterpriseTypeID == 1) {
                        this.chooseStoreData = [...val.canteenList];
                    }
                }   
            },
            //确认编辑员工角色和门店
            confirmEdit() {
                let para = {
                    userID: this.userID,
                    roleList: this.chooseRoleData,
                    canteenList: this.chooseStoreData
                }
                console.log('参数',para);
                this.$put('/user/role',para).then(res => {
                    console.log(res)
                    if(res.state) {
                        this.init();
                        this.chooseRoleVisible = false;
                        this.chooseStoreVisible = false;
                        this.confirmEditBtn = false;
                    }
                })
            },
            //创建员工账号第一步 下一步
            creatFirstNext() {
                this.confirmEditBtn = false;
                this.chooseStoreData = [];
                this.arrCanteenID = [];
                if(this.staffSels.length > 1) {
                    this.$message.info('只能选择一个员工');
                    return;
                } else if(this.staffSels.length == 0) {
                    this.$message.info('请选择员工');
                    return;
                }
                this.chooseStaff = this.staffSels;//选中的员工
                this.chooseRoleVisible = true;
                for(let i = 0; i < this.roleData.length; i ++) {
                    this.roleData[i].flag = false;
                }
                this.chooseRoleData = [];
                setTimeout(() => {
                    this.creatStaffVisible = false;
                },200)
            },
            //创建员工账号第二步 下一步
            creatSecondNext() {
                if(this.chooseRoleData.length == 0) {
                    this.$message.info('请选择角色');
                    return;
                }
                this.chooseStoreVisible = true;
                // this.getStoreList();
                this.storeData.forEach(item => {
                    item.flag = false;
                })
                this.storeData.forEach(item => {
                    if(this.arrCanteenID.indexOf(item.canteenID) > -1) {
                        item.flag = true;
                    } 
                })
                setTimeout(() => {
                    this.chooseRoleVisible = false;
                },200)
            },
            //创建员工账号
            creatThirdNext() {
                let roleIDs = [], canteenIDs = [];
                for(let i = 0,len = this.chooseRoleData.length; i < len; i++) {
                    let obj = {roleID: 0};
                    obj.roleID = this.chooseRoleData[i].roleID;
                    roleIDs.push(obj);
                }
                for(let i = 0,len = this.chooseStoreData.length; i < len; i ++) {
                    let obj = {canteenID: 0};
                    obj.canteenID = this.chooseStoreData[i].canteenID;
                    canteenIDs.push(obj);
                }
                if(canteenIDs.length == 0) {
                    canteenIDs = null;
                }
                let para = {
                    enterpriseID: this.enterpriseID,
                    contacts: this.chooseStaff[0].employeeName,
                    contactNumber: this.chooseStaff[0].phoneNumber,
                    email: this.chooseStaff[0].email,
                    roleList: roleIDs,
                    canteenList: canteenIDs,
                    level: JSON.parse(localStorage.getItem('user')).level + 1,
                }
                this.$post('/user',para).then(res => {
                    console.log(res);
                    if(res.state) {
                        this.userName = res.data.userName;
                        this.password = res.data.password;
                        this.init();
                        this.staffAccountVisible = true;
                        setTimeout(() => {
                            this.chooseStoreVisible = false;
                            this.chooseRoleVisible = false;
                        },200)
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                
            },
            //创建门店管理账号
            creatStoreAccount() {
                if(this.storeSels.length > 1) {
                    this.$message.info('只能选择一个门店');
                    return;
                } else if(this.storeSels.length == 0) {
                    this.$message.info('请选择门店');
                    return;
                }
                let para = {
                    canteenID: this.storeSels[0].canteenID,
                    enterpriseID: this.enterpriseID,
                    roleList:[{roleID: 2}],
                    level: JSON.parse(localStorage.getItem('user')).level + 1,
                    contacts: this.storeSels[0].employeeName,
                    contactNumber: this.storeSels[0].phoneNumber,
                    userID: this.storeSels[0].state
                }
                console.log('选中的门店数据',this.storeSels)
                this.$post('/user',para).then(res => {
                    if(res.state) {
                        this.storeAccount = res.data.userName;
                        this.storePassword = res.data.password;
                        this.init();
                        this.storeAccountVisible = true;
                        setTimeout(() => {
                            this.creatStoreVisible = false;
                        },200)
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                
                
            },
            //编辑显示
            // handleEditor(val) {
            //     this.editVisible = true;
            //     this.form = Object.assign({},val);
            // },
            //停用
            handleStop(row) {
                console.log(row);
                let para = {
                    userID: row.userID,
                    state: 2,//停用
                }
                this.$put('/users',para).then(res => {
                    if(res.state) {
                        this.init();
                    }
                })
            },
            //启用
            handleStart(row) {
                let para = {
                    userID: row.userID,
                    state: 0,//启用
                }
                this.$put('/users',para).then(res => {
                    if(res.state) {
                        this.init();
                    }
                })
            }
        },
        components: {
            ITableEditor
        }
    }
</script>
<style lang='scss'>
    //创建员工账号 创建门店管理账号 创建超级管理员样式
    .creatStaffDailog, .creatStoreDailog, .creatSuperDailog {
        .el-dialog {
            width: 1122px;
            .el-dialog__body {
                div.searchBox {
                    position: relative;
                    margin-bottom: 20px;
                    p.titlePS {
                        position: absolute;
                        top: -80px;
                        left: 180px;
                    }
                    .el-input {
                        width: 40%;
                    }
                }
                div.tableList {
                    .el-table {
                        border: 0;
                        div.cell {
                            text-align: center;
                        }
                    }	
                    .el-table::after, .el-table::before {
                        background-color: #fff;
                    }
                    .el-table th.is-leaf {
                        border:0;
                    }
                    .el-table th, .el-table__header-wrapper thead div {
                        background-color: #f4f3ef;
                    }
                }
            }
        }
    }
    .creatStaffDailog {
        .searchBox {
            .titlePS {
                left: 132px !important;
            }
        }
    }
    //选择角色样式
    .chooseRoleDailog {
        .el-dialog {
            width: 740px;
            .el-dialog__body {
                div.titlePS {
                    position: relative;
                    height: 10px;
                    margin-bottom: 10px;
                    p {
                        position: absolute;
                        top: -80px;
                        left: 90px;
                    }
                }
                div.roleBox {
                    overflow: hidden;
                    div.roleLib, div.choosed {
                        width: 45%;
                        // border: 1px solid #20a0ff;
                        p.title {
                            margin: 0;
                            background: #20a0ff;
                            color: #fff;
                            font-size: 18px;
                            text-align: center;
                            height: 40px;
                            line-height: 40px;
                        }
                        .el-table th, .el-table__header-wrapper thead div {
                            background:#f4f3ef;
                        }
                        .el-table th.is-leaf {
                            border: 0;
                        }
                        div.cell {
                            text-align: center;
                        }
                    }
                    div.roleLib {
                        float: left;
                    }
                    div.arrow {
                        float: left;
                        margin-left: 13px;
                        margin-top: 150px;
                    }
                    div.choosed {
                        float: right;
                    }
                }
                div.remarks {
                    margin-top: 30px;
                }
            }
        }
    }
    //生成员工账号样式
    .staffAccountDailog {
        .el-dialog {
            width: 620px;
            div.content {
                text-align: center;
                margin-top: 20px;
                p {
                    width: 50%;
                    text-align: left;
                    margin: 0 auto;
                    font-size: 18px;
                    margin-bottom: 20px;
                    span {
                        display: inline-block;
                        width: 80px;
                    }
                }
            }
            .el-dialog__footer {
                .remarks {
                    display: inline-block;
                    margin-right: 200px;
                    color: #aaa;
                    font-size: 13px;
                }
            }
        } 
    }
    //创建门店管理账号样式
    .creatStoreDailog {
        .el-dialog {
            .el-dialog__body {
                div.searchBox {
                     p.titlePS {
                        left: 180px;
                    }
                }
            }
        }
    }
    //创建超级管理员账号
    .creatSuperDailog {
       .el-dialog {
           width: 1132px;
            .el-dialog__body {
                div.searchBox {
                     p.titlePS {
                        left: 160px;
                    }
                }
            }
        } 
    }
</style>
