<template>
    <section>
        <!-- 员工管理 -->
        <!--工具条-->
        <div style="height:50px;background:#F4F3EF" v-if="enterpriseTypeID == 1"></div>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;" v-if="enterpriseTypeID != 1">
			<el-form :inline="true" :model="filters" style="display:inline-block;">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-if="checkBtn" v-on:click="search">查询</el-button>
				</el-form-item>
				<el-form-item v-if="addBtn">
					<el-button type="primary"  @click="handleAdd">新增</el-button>
				</el-form-item>
                <el-form-item v-if="addBtn">
                    <el-upload
                    class="upload-demo uploadBtn"
                    :action="url"
                    :data='uploadData'
                    name='file'
                    :on-error="uploadError"
                    :on-success="uploadSuccess"
                    :show-file-list='false'
                    >
                        <el-button type="primary" >批量导入</el-button>
                    </el-upload>
				</el-form-item>
                <el-form-item>
                    <a :href='exportUrl' v-if="checkBtn" class="downLoadBtn">批量导出</a>
				</el-form-item>
                <el-form-item v-if="addBtn">
                    <a :href='downLoadUrl' class="downLoadBtn">下载模板</a>
				</el-form-item>
				<el-form-item v-if='deleBtn'>
                    <el-button type="danger"   @click="batchStopUsing" :disabled="this.sels.length < 2">批量停用</el-button>
                </el-form-item>
			</el-form>
            
		</el-col>
        <!-- 员工列表(甲方客户) -->
        <el-table 
         v-if="enterpriseTypeID != 1"
		 :data="tableData" 
		 highlight-current-row 
         key="firstTable"
		 v-loading="listLoading" 
		 @selection-change="selsChange" 
		 style="width: 100%;" >
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
			 prop="employeeCode" 
			 label="员工编号"
             width="120" 
			 >
			</el-table-column>
			<el-table-column 
			 prop="customerName" 
			 label="姓名"
             width="100" 
			 >
			</el-table-column>
            <el-table-column 
			 prop="gender" 
			 label="性别"
             width="100"  
			 >
			</el-table-column>
            <el-table-column
            prop="phoneNumber"
            label="手机号"
            min-width="150"
            >
            </el-table-column>
            <el-table-column
            prop="email"
            label="邮箱"
            min-width="150"
            >
            </el-table-column>
            <el-table-column 
			 label="微信ID状态"
             width="150" 
			 >
             <template slot-scope="scope">
                 <el-tag type='success' v-if="scope.row.weChatOpenID">已绑定</el-tag>
                <el-tag type='danger' v-if="!scope.row.weChatOpenID">未绑定</el-tag>
             </template>
			</el-table-column>
            <el-table-column 
			 label="IC卡状态" 
             width="100"
			 >
             <template slot-scope="scope">
                 <el-tag type='danger' v-if="scope.row.icCardState == null">未绑定</el-tag>
                 <el-tag type='success' v-if="scope.row.icCardState == 1">正常</el-tag>
                <el-tag type='danger' v-if="scope.row.icCardState == 0">冻结</el-tag>
             </template>
			</el-table-column>
            <el-table-column 
			 label="账户状态"
             width="100" 
			 >
             <template slot-scope="scope">
                 <el-tag type='success' v-if="scope.row.welfareState">正常</el-tag>
                <el-tag type='danger' v-if="!scope.row.welfareState">已停用</el-tag>
             </template>
			</el-table-column>
            <el-table-column 
			 prop="cash" 
             align="center"
			 label="现金余额（元）" 
             width="140"
			 >
			</el-table-column>
            <el-table-column 
			 prop="welfare" 
             align="center"
			 label="福利金余额（元）" 
             width="140"
			 >
			</el-table-column>
			<el-table-column 
             v-if='editBtn'
             label="操作" 
             width="350">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" v-if="editBtn" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="primary" size="small" @click="collectionBtn(scope.row)" v-if='editBtn && !scope.row.icCardID'>采集IC卡</el-button>
                    <el-button type="primary" size="small" @click="reapplayBtn(scope.row)" v-if='editBtn && scope.row.icCardID'>补卡</el-button>
                    <el-button type="primary" size="small" @click="lossBtn(scope.row)" v-if="editBtn">IC卡挂失</el-button>
					<el-button type="danger" v-if='editBtn && scope.row.welfareState' size="small" @click="stopUsing(scope.$index, scope.row)">停用</el-button>
                    <el-button type="primary" v-if='editBtn && !scope.row.welfareState' size="small" @click="startUsing(scope.$index, scope.row)">启用</el-button>
                </template>
            </el-table-column>
		</el-table>
        <!-- 餐饮公司 列表数据 -->
        <el-table
            :data="cateringData"
            :expand-row-keys="expandRowKeys" 
            row-key="enterpriseID"
            key="secondTable"
            v-if="enterpriseTypeID == 1"
            @expand-change='expandChange'
            style="width: 100%">
            <el-table-column type="expand">
             <template slot-scope="props">
                <el-table
                key="thirdTable"
                :data="staffData"
                style="width: 100%">
                <el-table-column
                    type="index"
                    label="序号"
                    width="55">
                    </el-table-column>
                    <el-table-column
                    prop="employeeCode"
                    label="员工编号"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="customerName"
                    label="姓名"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="gender"
                    label="性别"
                    >
                    </el-table-column>
                    
                    <el-table-column
                    label="微信ID状态"
                    >
                    <template slot-scope="scope">
                        <el-tag type='success' v-if="scope.row.weChatOpenID">已绑定</el-tag>
                        <el-tag type='danger' v-if="!scope.row.weChatOpenID">未绑定</el-tag>
                    </template>
                    </el-table-column>
                    <el-table-column
                    label="IC卡状态"
                    >
                        <template slot-scope="scope">
                            <el-tag type='danger' v-if="scope.row.icCardState == null">未绑定</el-tag>
                            <el-tag type='success' v-if="scope.row.icCardState == 1">正常</el-tag>
                            <el-tag type='danger' v-if="scope.row.icCardState == 0">冻结</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="账号状态"
                    >
                        <template slot-scope="scope">
                            <el-tag type='success' v-if="scope.row.welfareState">正常</el-tag>
                            <el-tag type='danger' v-if="!scope.row.welfareState">已停用</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="cash"
                    label="现金余额（元）"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="welfare"
                    label="福利金余额（元）"
                    >
                    </el-table-column>
                </el-table>
                </template>
            </el-table-column>
            <el-table-column
            label="公司名称"
            prop="enterpriseName">
            </el-table-column>
            <el-table-column
            label="就餐人数"
            prop="customerID">
            </el-table-column>    
        </el-table>
        
        <!--工具条 分页-->
		<el-col :span="24" class="toolbar" v-if="enterpriseTypeID != 1">
			<el-pagination 
			 layout="prev, pager, next" 
			 @current-change="handleCurrentChange" 
			 :page-size="pageSize" 
			 :total="total" 
			 style="float:right;">
			</el-pagination>
		</el-col>
        <!-- 新增 编辑 -->
        <I-table-editor
         :title='title'
         v-model="addFormVisible"
         class="addDailog"
        >
            <template slot="content">
                <el-form :model="form" label-width="100px" :rules="rules" ref="form">
                    <el-form-item label="员工编号">
                        <el-input v-model="form.employeeCode"></el-input>
                    </el-form-item>
                     <el-form-item label="姓名" prop='customerName'>
                        <el-input v-model="form.customerName"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="gender">
                        <el-radio-group  v-model="form.gender">
                            <el-radio label="男"></el-radio>
                            <el-radio label="女"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="部门" prop='departmentID'>
                        <el-select v-model="form.departmentID" placeholder="请选择">
                            <el-option
                            v-for="item in departmentData"
                            :key="item.departmentID"
                            :label="item.departmentName"
                            :value="item.departmentID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="职位" prop='positionID'>
                        <el-select v-model="form.positionID" placeholder="请选择">
                            <el-option
                            v-for="item in positionData"
                            :key="item.positionID"
                            :label="item.positionName"
                            :value="item.positionID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="手机号" prop="phoneNumber">
                        <el-input v-model="form.phoneNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop='email'>
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <template slot="foot">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button v-if='isAdd == true' type="primary" @click.native="addSubmit">提交</el-button>
                <el-button v-if='isAdd == false' type="primary" @click.native="editSubmit">提交</el-button>
            </template>
        </I-table-editor>
        <!-- 采集IC卡 -->
        <I-table-editor
         :title="titleIC"
         v-model="collectionVisible"
         class="ICdailog"
        >
            <template slot="content">
                <div class='scanningIC'>
                    <p>请扫描IC卡</p>
                    <el-input v-model="codeIC"></el-input>
                </div>
            </template>
            <template slot="foot">
                <el-button @click="collectionVisible = false">取消</el-button>
                <el-button type="primary" @click="handleEntry">提交</el-button>
            </template>
        </I-table-editor>
        <!-- 录入IC卡 -->
        <I-table-editor
         title="录入IC卡"
         v-model="entryVisible"
         class="ICdailog"
        >
            <template slot="content">
                <div class='scanningIC'>
                    <p>录入成功</p>
                    <p>IC卡编号：{{codeIC}}</p>
                </div>
            </template>
            <template slot="foot">
                <el-button type="primary" @click='entryVisible = false'>确认</el-button>
            </template>
        </I-table-editor>
        <!-- 挂失IC卡 -->
        <I-table-editor
         title="员工IC卡挂失"
         v-model="lossVisible"
         class="ICdailog"
        >
            <template slot="content">
                <div class='scanningIC'>
                    <p>是否挂失员工IC卡</p>
                    <el-input :value="codeICMsg"></el-input>
                </div>
            </template>
            <template slot="foot">
                <el-button @click="lossVisible = false">取消</el-button>
                <el-button type="primary" @click="handleLossIC">提交</el-button>
            </template>
        </I-table-editor>
        <!-- 补办IC卡 -->
        <!-- <I-table-editor
         title="补办IC卡"
         v-model="reapplayVisible"
         class="ICdailog"
        >
            <template slot="content">
                <div class='scanningIC'>
                    <p>请扫描IC卡</p>
                    <el-input v-model="codeIC"></el-input>
                </div>
            </template>
            <template slot="foot">
                <el-button @click="reapplayVisible = false">取消</el-button>
                <el-button type="primary" @click="handleEntry">提交</el-button>
            </template>
        </I-table-editor> -->
        <!-- 批量导入成功后的消息弹框 -->
        <I-table-editor
         title='提示'
         v-model="importVisible"
         class="importBox"
        >
            <template slot='content'>
                <div class="contentBox" v-html="promptMsg">
                    
                </div>
            </template>
            <template slot="foot">
                <el-button @click="importVisible = false">取消</el-button>
            </template>
        </I-table-editor>
    </section>
</template>
<script>
    import ITableEditor from '../../components/Table/TableEditor.vue'
    import configUrl from '../../common/js/url.js'
    import { valid } from 'semver';
    export default {
        data() {
            var checkPhone = (rule, value, callback) => {
                if (!value) {
                return callback(new Error('手机号不能为空'));
                } else {
                    const reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
                    if (reg.test(value)) {
                        callback();
                    } else {
                        return callback(new Error('请输入正确的手机号'));
                    }
                }
            };
            return {
                expandRowKeys: [],
                filters: {
					name: ''
                },
                staffData:[],//员工数据
                flag:false,
                tableData:[],//列表数据(甲方客户)
                cateringData:[],//餐饮公司列表数据
                tableData2:[],
                title:'',//新增编辑标题
                titleIC:'',//IC卡弹框标题
                promptMsg:'',//文件上传成功的提示信息
                flag:false,
                addFormVisible: false,
                importVisible: false,//批量导入成功弹框
                collectionVisible: false,//采集IC卡
                entryVisible: false,//录入IC卡
                lossVisible: false,//挂失IC卡
                reapplayVisible: false,//补办IC卡
                isAdd: false,
                total: 0,
                currentPage: 1,//当前页
                pageSize: 10,//每页的条数
                sels: [],//列表选中列
                listLoading: false,
                rules: {
					customerName: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                    gender: [
                        { required: true, message: '请选择性别',  }
                    ],
                    departmentID: [
                        { required: true, message: '请选择部门', }
                    ],
                    positionID: [
                        { required: true, message: '请选择职位', }
                    ],
                    phoneNumber: [
                        { required: true, message: '请输入手机号', trigger: 'blur'},
                        { validator: checkPhone, trigger: 'blur'}
                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur'},
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
                    ]


                },
                //表单数据
                form: {
                    employeeCode:'',
                    customerName:'',
                    gender: '男',
                    positionID:'',
                    departmentID:'',
                    phoneNumber:'',
                    email:'',
                },
                departmentData:[],//部门数据
                positionData:[],//职位数据
                enterpriseID: 0,
                downLoadUrl: '',
                exportUrl:'',
                url: configUrl.url + '/customers',
                uploadData: {
                    enterpriseID: 0
                },
                codeIC:'',//IC卡号
                codeICMsg:'',//挂失IC卡信息
                customerID: 0,//员工ID
                //操作按钮
                checkBtn: false,
                editBtn: false,
                deleBtn: false,
                addBtn: false,
                enterpriseTypeID:0,//登录者的类型（甲方/餐饮/平台）
            }
        },
        mounted() {
            this.enterpriseID = JSON.parse(localStorage.getItem('user')).enterpriseID;
            this.enterpriseTypeID = JSON.parse(localStorage.getItem('user')).enterpriseTypeID;
            this.uploadData = {enterpriseID: this.enterpriseID};
            this.downLoadUrl = configUrl.url_download + this.enterpriseID;
            this.exportUrl = configUrl.url + 'customers/export/' + this.enterpriseID;
            this.init();
            this.getBtn();
            this.getPositionData();
            this.getDepartmentData();
        },
        methods: {
            //点击展开
            expandChange(row,expandedRows) {
                this.staffData = [];
                //点击时只展开一行 start//
                this.expandRowKeys.length = 0
                if (expandedRows.length > 0) {
                    this.expandRowKeys.push(row.enterpriseID)
                }
                //点击时只展开一行 end//
                this.$fetch('/customers/' + row.enterpriseID + '/' + 0 +'/' + 0).then(res => {
                    if(res.state) {
                        this.staffData = res.data.list;
                    }
                })
            },
            //操作按钮是否显示
            getBtn() {
                let permissions = JSON.parse(localStorage.getItem('user')).permissions;
                if(permissions.indexOf('311') > -1) {
                    this.checkBtn = true;
                }
                if(permissions.indexOf('312') > -1) {
                    this.addBtn = true;
                }
                if(permissions.indexOf('313') > -1) {
                    this.editBtn = true;
                }
                if(permissions.indexOf('314') > -1) {
                    this.deleBtn = true;
                }
            },
            //上传成功
            uploadSuccess(response, file, fileList) {
                console.log(response.data)
                this.importVisible = true;
                this.promptMsg = response.data;
                this.init();
            },
            //上传失败
            uploadError(err, file, fileList) {
                console.log(err)
            },
            //查询
            search() {
                if(this.filters.name == '') {
                    this.init();
                }
                this.$fetch('/customer/' + this.enterpriseID + '/' + this.filters.name).then(res => {
                    if(res.state) {
                        this.tableData = res.data;
                    }
                })
            },
            //获取职位
            getPositionData() {
                this.$fetch('/positions/' + this.enterpriseID).then(res => {
                    this.positionData = res.data;
                })
            },
            //获取就餐用户列表
            init() {
                this.listLoading = true;
                if(this.enterpriseTypeID == 1) {//餐饮公司
                    this.$fetch('/customers/cooperate/' + this.enterpriseID).then(res => {
                        console.log('用户列表',res)
                        if(res.state) {
                            this.cateringData  = res.data;
                            console.log('*****',this.cateringData)
                        }
                    })
                } else {
                    this.$fetch('/customers/' + this.enterpriseID + '/' + this.currentPage + '/' + this.pageSize).then(res => {
                        console.log(res);
                        if(res.state) {
                            if(this.currentPage > 1) {
                                if(!res.data) {
                                    this.currentPage = this.currentPage - 1
                                    this.init()
                                }
                            }
                            this.tableData = res.data.list;
                            this.total = res.data.total;
                            this.listLoading = false;
                        }
                    })
                }
                
            },
            //获取部门
            getDepartmentData() {
                this.$fetch('/departments/' + this.enterpriseID).then(res => {
                    this.departmentData = res.data;
                })
            },
            //新增显示
            handleAdd() {
                this.addFormVisible = true;
                this.title = '新增';
                this.isAdd = true;
                this.form = {
                    employeeCode:'',
                    customerName:'',
                    gender: '男',
                    positionID:'',
                    departmentID:'',
                    phoneNumber:'',
                    email:'',
                }
            },
            //确认新增
            addSubmit() {
                this.$refs.form.validate((valid) => {
                    if(valid) {
                        let para = Object.assign({},this.form);
                        para.enterpriseID = this.enterpriseID;
                        console.log('新增数据',para);
                        this.$post('/customer',para).then(res => {
                            // console.log(res);
                            if(res.state) {
                                this.$refs['form'].resetFields();
                                this.addFormVisible = false;
                                this.init();
                            }
                        })
                    }
                })
            },
            //编辑显示
            handleEdit(index,val) {
                console.log('编辑',val);
                this.addFormVisible = true;
                this.title = '编辑';
                this.isAdd = false;
                this.form = Object.assign({},val);
            },
            //确认编辑
            editSubmit() {
                this.$refs.form.validate((valid) => {
                    if(valid) {
                        this.$put('/customer',this.form).then(res => {
                            console.log(res)
                            if(res.state) {
                                this.$message.success('修改成功');
                                this.addFormVisible = false;
                                this.init();
                            }
                        })
                    }
                })
            },
            //停用
            stopUsing(index,row) {
                let para = {
                    welfareState: !row.welfareState,
                    customerID: row.customerID
                }
                this.$put('/customer',para).then(res => {
                    if(res.state) {
                        this.$message.success('停用成功');
                        this.init();
                    }
                })
            },
            //启用
            startUsing(index,row) {
                let para = {
                    welfareState: !row.welfareState,
                    customerID: row.customerID
                }
                this.$put('/customer',para).then(res => {
                    if(res.state) {
                        this.$message.success('启用成功');
                        this.init();
                    }
                })
            },
            selsChange(sels) {
                this.sels = sels;
                // console.log(sels)
            },
            //批量停用
            batchStopUsing() {
                let data = this.sels.map(item => item.customerID);
                // for(let i = 0,len = this.sels.length; i < len; i ++) {
                //     let para = { customerID: '',welfareState:''};
                //     para.customerID = this.sels[i].customerID;
                //     para.welfareState = !this.sels[i].welfareState;
                //     data.push(para);
                // }
                console.log('yyyyyyyyyyy',data);
                this.$put('/customers/disable',data).then(res => {
                    console.log(res);
                    if(res.state) {
                        this.$message.success('批量停用成功');
                        this.init();
                    }
                })
            },
            //批量导入弹框
            importBtn() {
            },
            //批量导出
            exportBtn() {
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.init();
            },
            //采集IC卡弹框
            collectionBtn(val) {
                this.titleIC = '采集IC卡';
                this.collectionVisible = true;
                this.customerID = val.customerID;
                this.codeIC = '';
            },
            //采集IC卡提交
            handleEntry() {
                if(this.codeIC == '') {
                    this.$message.info('请刷IC卡');
                    return;
                }
                let para = {
                    customerID: this.customerID,
                    icCardID: this.codeIC,
                    icCardState: 1
                }
                // console.log('员工信息',this.sels);
                // console.log('IC卡号', this.codeIC);
                this.$put('/customer',para).then(res => {
                    console.log(res);
                    if(res.state) {
                        this.init();
                        this.entryVisible = true;
                        setTimeout(() => {
                            this.collectionVisible = false;
                            // this.reapplayVisible = false;
                        },200);
                    } else {
                        this.$message.error(res.msg)
                    }
                })
                
            },
            //挂失弹框
            lossBtn(val) {
                this.customerID = val.customerID;
                this.lossVisible = true;
                this.codeICMsg = "IC卡号：" + val.icCardID;
                // console.log(this.codeIC)
            },
            //挂失IC卡提交
            handleLossIC() {
                let para = {
                    customerID: this.customerID,
                    icCardState: 0
                }
                this.$put('/customer',para).then(res => {
                    if(res.state) {
                        this.lossVisible = false;
                        this.init();
                    } else {
                        this.$message.error(res.msg);
                    }
                })
            },
            //补卡弹框
            reapplayBtn(val) {
                this.titleIC = '补办IC卡';
                this.customerID = val.customerID;
                this.collectionVisible = true;
                this.codeIC = '';
            }
        },
        components: {
            ITableEditor
        }
    }
</script>
<style lang="scss">
    .toolbar {
        box-sizing: border-box;
    }
    .ICdailog {
        .el-dialog {
            width: 740px;
            .scanningIC {
                width: 50%;
                margin: 0 auto;
                text-align: center;
                p {
                    font-size: 20px;
                    font-weight: bold;
                }
            }
        }
    }
    .addDailog {
        .el-dialog {
            width: 740px;
            .el-dialog__body {
                padding-left: 100px;
                .el-input__inner {
                    width: 70%;
                }
                .el-radio-group {
                    padding-left: 10px;
                    .el-radio__label {
                        font-size: 16px;
                    }
                    
                }
                .el-form-item__label {
                    font-size: 16px;
                    font-weight: bold;
                }
                .el-select {
                    width: 70%;
                   .el-input__inner {
                        width: 100%;
                    } 
                }
                 
            }
            
        }
    }
</style>
