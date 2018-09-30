<!--员工信息-->
<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" style="float:left;">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="请输入员工姓名" clearable></el-input>
                </el-form-item>
                <el-form-item v-if="checkBtn">
                    <el-button type="primary"  v-on:click="search">查询</el-button>
                </el-form-item>
                <el-form-item v-if='addBtn'>
                    <el-button type="primary"  @click="handleAdd">新增</el-button>
                </el-form-item>
                <el-form-item v-if='deleBtn'>
                    <el-button type="danger" @click="batchRemove"  :disabled="this.sels.length < 2">批量删除</el-button>
                </el-form-item>
            </el-form>
            <div style="float:right;">
                <el-upload
                    class="upload-demo uploadBtn"
                    :action="url"
                    :headers = obj
                    :data='uploadData'
                    :on-error="uploadError"
                    :on-success="uploadSuccess"
                    :show-file-list='false'
                    >
                    <el-button type="primary" v-if="addBtn">批量导入</el-button>
                    <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                </el-upload>
                <a :href='exportUrl' v-if='checkBtn' class="downLoad">批量导出</a>
                <a :href='downLoadUrl' v-if="checkBtn" class="downLoad">下载模板</a>
            </div>
        </el-col>
        <!--列表-->
        <el-table
         :data='tableData' 
         highlight-current-row 
         v-loading="listLoading" 
         @selection-change="selsChange" 
         style="width: 100%;">
            <el-table-column 
             type="selection" 
             width="55">
            </el-table-column>
            <el-table-column 
             label="序号" 
             width="100"
             align="center" 
             >
                <template slot-scope="scope">
					<span>{{scope.$index+(currentPage - 1) *pageSize + 1}} </span>
				</template>
            </el-table-column>
            <el-table-column 
             prop="employeeName" 
             label="姓名" 
             width="120" 
             />
            <el-table-column 
             prop="positionName" 
             label="职位" 
             width="120" 
             />
            <el-table-column 
             prop="departmentName" 
             label="部门" 
             width="120" 
             />
            <el-table-column 
             prop="phoneNumber" 
             label="电话" 
             width="150" 
             />
            <el-table-column 
             prop="email" 
             label="邮箱" 
             min-width="180" 
             >
            </el-table-column>
            <el-table-column 
             v-if='editBtn || deleBtn'
             label="操作" 
             width="200">
                <template slot-scope="scope">
                    <el-button size="small" type="primary" v-if="editBtn" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" v-if="deleBtn" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination 
             layout="prev, pager, next" 
             @current-change="handleCurrentChange" 
             :page-size="pageSize" 
             :total="total" 
             style="float:right;">
            </el-pagination>
        </el-col>
        <!-- 新增、编辑 -->
        <I-table-editor
         :title='title'
         v-model="addFormVisible"
         @dialogVisibleClose='closeDialog'
         class="addDialog"
        >
            <template slot="content">
                <el-form :model="form" label-width="80px" :rules="rules" ref="form">
                <el-form-item label="姓名" prop="employeeName">
                    <el-input v-model="form.employeeName" auto-complete="off"></el-input>
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
                <el-form-item label="电话" prop='phoneNumber'>
                    <el-input v-model="form.phoneNumber" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
            </el-form>
            </template>
            <template slot="foot">
                <el-button @click.native="closeDialog">取消</el-button>
                <el-button v-if='isAdd == true' type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
                <el-button v-if='isAdd == false' type="primary" @click.native="editSubmit" :loading="addLoading">提交</el-button>
            </template>
        </I-table-editor>
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
                <el-button @click="importVisible = false">确定</el-button>
            </template>
        </I-table-editor>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    import configUrl from '../../common/js/url.js'
    import ITableEditor from '../../components/Table/TableEditor.vue'
    //import NProgress from 'nprogress'

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
                filters: {
                    name: ''
                },
                promptMsg:'',//文件上传成功的提示信息
                downLoadUrl: '',
                exportUrl:'',
                url: configUrl.url + 'employees/upload',
                uploadData:{
                    enterpriseID: 0
                },
                obj:{'Authorization':''},
                tableData:[],//列表数据
                importVisible: false,//批量导入弹框
                exportVisible: false,//批量导出弹框
                isAdd: true,
                title:"",//新增、编辑标题
                enterpriseContact: [],
                total: 0,
                currentPage: 1,
                pageSize:10,//每页显示的条数，为0，显示25条
                listLoading: false,
                sels: [],//列表选中列
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                rules: {
                    employeeName: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                    positionID: [
                        { required: true, message: '请选择职位' }
                    ],
                    departmentID: [
                        { required: true, message: '请选择部门'}
                    ],
                    phoneNumber: [
                        { required: true, message: '请输入电话号码', trigger: 'blur'},
                        { validator: checkPhone, trigger: 'blur'}
                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur'},
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
                    ]
                },
                positionValue:'',
                positionData:[],//职位数据
                departmentValue:'',
                departmentData:[],//部门数据
                //新增界面数据
                form: {
                    employeeCode:'',
                    employeeName:'',
                    phoneNumber:'',
                    email:'',
                    positionID:null,
                    departmentID:null,
                    gender:'',
                },
                enterpriseID: 0,
                //操作按钮
                checkBtn: false,
                editBtn: false,
                deleBtn: false,
                addBtn: false,
            }
        },
        mounted() {
            this.obj.Authorization = localStorage.getItem('token');
            this.enterpriseID = JSON.parse(localStorage.getItem('user')).enterpriseID;
            this.downLoadUrl = configUrl.url_download + this.enterpriseID;
            this.exportUrl = configUrl.url + 'employee/exportData/' + this.enterpriseID;
            this.uploadData.enterpriseID = this.enterpriseID;
            // console.log('上传文件地址',this.url)
            this.filters.name = '';
            this.init();//初始化
            this.getBtn();
            this.getPositionData();
            this.getDepartmentData();
        },
        methods: {
            //获取操作按钮
            getBtn() {
                let permissions = JSON.parse(localStorage.getItem('user')).permissions;
                if(permissions.indexOf('121') > -1) {
                    this.checkBtn = true;
                }
                if(permissions.indexOf('122') > -1) {
                    this.addBtn = true;
                }
                if(permissions.indexOf('123') > -1) {
                    this.deleBtn = true;
                }
                if(permissions.indexOf('124') > -1) {
                    this.editBtn = true;
                }
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.init();
            },
            //查询
            search() {
                if(this.filters.name == '') {
                    this.init();
                }
                this.$fetch('/employee/' + this.enterpriseID + '/' + this.filters.name).then(res => {
                    console.log(res);
                    this.tableData = res.data;
                    this.total = res.data.length;
                })
            },
            //获取职位
            getPositionData() {
                this.$fetch('/positions/' + this.enterpriseID).then(res => {
                    console.log('职位数据',res);
                    this.positionData = res.data;
                })
            },
            //获取部门
            getDepartmentData() {
                this.$fetch('/departments/' + this.enterpriseID).then(res => {
                    console.log('部门数据',res);
                    this.departmentData = res.data;
                })
            },
            //获取列表
            init() {
                this.listLoading = true;
                this.$fetch('/employees/' + this.enterpriseID +'/'+ this.currentPage + '/' + this.pageSize).then(res => {
                    console.log('**********',res)
                    if(res.state) {
                        if(this.currentPage > 1) {
                            if(!res.data) {
                                this.currentPage = this.currentPage - 1
                                this.init()
                                return;
                            }
                        }
                        this.tableData = res.data.list;
                        this.total = res.data.total;
                        this.listLoading = false;
                    }
                    
                })
            },
            //上传失败的回调
            uploadError(err, file, fileList) {
                console.log(err)
            },
            //上传成功的回调
            uploadSuccess(response, file, fileList) {
                // console.log('文件上传成功',response)
                this.importVisible = true;
                this.promptMsg = response.msg;
                this.init();
            },
            //批量导出弹出显示
            exportBtn() {
                
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    // this.listLoading = true;
                    this.$remove('/employee/' + row.employeeID).then(res => {
                        console.log(res);
                        this.$message.success(res.msg);
                        this.init();
                    })
                }).catch(() => {

                });
            },
            //弹框关闭
            closeDialog() {
                this.addFormVisible = false;
                this.$refs['form'].resetFields();
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.addFormVisible = true;
                console.log('编辑员工数据',row);
                this.title = '编辑';
                this.isAdd = false;
                this.form = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.title = "新增";
                this.isAdd = true;
                this.positionValue = '';
                this.departmentValue = '';
            },
            //编辑
            editSubmit: function () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            // this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({},this.form);
                            console.log('确认编辑数据',para)
                            this.$put('/employee',para).then(res => {
                                if(!res.state) {
                                    this.$message.error(res.msg);
                                } else {
                                    this.$message.success(res.msg);
                                    this.addFormVisible = false;
                                    this.init();
                                }
                            })
                        });
                    }
                });
            },
            //新增
            addSubmit: function () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            // this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.form);
                            para.enterpriseID = this.enterpriseID;
                            console.log(para)
                            this.$post('/employee',para).then(res => {
                                console.log(res)
                                if(!res.state) {
                                    this.$message.error(res.msg);
                                } else {
                                    this.$message.success(res.msg);
                                    this.addFormVisible = false;
                                    this.init();
                                }
                            })
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
                // console.log(this.sels);
            },
            //批量删除
            batchRemove() {
                var ids = this.sels.map(item => item.employeeID).toString();
                console.log('id',ids);
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    // this.listLoading = true;
                    //NProgress.start();
                    this.$remove('/employees/' + ids).then(res => {
                        if(!res.state) {
                            this.$message.error(res.msg);
                        } else {
                            this.$message.success(res.msg);
                            this.init();
                        }
                    })
                }).catch(() => {

                });
            }
        },
        components: {
            ITableEditor
        }
    }

</script>

<style lang='scss'>
    // @import '../../styles/common.scss';
    
    
    .exportBox .el-dialog {
        width: 32%;
        .el-dialog__body {
            padding: 60px 20px 60px 20px;
            position: relative;
            p.text {
                position: absolute;
                right: 20px;
                top: -50px;
                font-weight: bold;
            }
        }
        .fileBox {
            span {
                font-size: 16px;
                font-weight: bold;
                display: inline-block;
                margin-right: 18px;
                margin-left: 50px;
            }
            .el-input {
                width: 70%;
            }
        }
    }
    
    // 下载
    .downLoad {
        display: inline-block;
        width: 88px;
        height: 36px;
        line-height: 36px;
        border-radius: 4px;
        text-align: center;
        background: #20a0ff;
        color: #fff;
        margin-left: 10px;
        text-decoration: none;
    }
    //上传
    .uploadBtn {
        display: inline-block !important;
    }
</style>