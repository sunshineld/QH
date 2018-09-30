<!--门店-->
<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="请输入名称" clearable></el-input>
                </el-form-item>
                <el-form-item v-if="checkBtn">
                    <el-button type="primary"  @click="search">查询</el-button>
                </el-form-item>
                <el-form-item v-if="addBtn">
                    <el-button type="primary"  @click="handleAdd">新增</el-button>
                </el-form-item>
                <el-form-item v-if='deleBtn'>
                    <el-button type="danger"   @click="batchRemove" :disabled="this.sels.length < 2">批量删除</el-button>
                </el-form-item>
            </el-form>
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
             type="index" 
             label='序号'
             width="80">
            </el-table-column>
            <el-table-column 
             prop="canteenName" 
             label="名称" 
             width="120" 
             >
            </el-table-column>
            <el-table-column 
             prop="address" 
             label="地址" 
             width="180" 
             >
            </el-table-column>
            <el-table-column 
             prop="employeeName" 
             label="负责人" 
             width="100" 
             >
            </el-table-column>
            <el-table-column 
             prop="phoneNumber" 
             label="电话" 
             width="150" 
             >
            </el-table-column>
            <el-table-column 
             prop="note" 
             label="说明" 
             min-width="180" 
             >
            </el-table-column>
            <el-table-column 
             v-if="editBtn || deleBtn"
             label="操作" 
             width="200">
                <template slot-scope="scope">
                    <el-button size="small" v-if="editBtn" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" v-if="deleBtn" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条(分页) 不需要-->
        <!-- <el-col :span="24" class="toolbar">
            <el-pagination 
             layout="prev, pager, next" 
             @current-change="handleCurrentChange" 
             :page-size="20" 
             :total="total" 
             style="float:right;">
            </el-pagination>
        </el-col> -->
        <!-- 新增和编辑 -->
        <I-table-editor
        :title='title'
        v-model="addFormVisible"
        @dialogVisibleClose='closeDialog'
        class="addDialog"
        >
            <template slot='content'>
                <el-form :model="form" label-width="80px" :rules="rules" ref="form">
                    <el-form-item label="名称" prop="canteenName">
                        <el-input v-model="form.canteenName" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="address">
                        <el-input v-model="form.address" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="负责人" prop="employeeID">
                         <el-select v-model="form.employeeID" placeholder="请选择" @change='selectChange'>
                            <el-option
                            v-for="item in employeeData"
                            :key="item.employeeID"
                            :label="item.employeeName"
                            :value="item.employeeID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="电话" prop="phoneNumber">
                        <el-input v-model="form.phoneNumber" auto-complete="off" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="说明">
                        <el-input type="textarea" v-model="form.note"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <template slot='foot'>
                <el-button @click="closeDialog">取消</el-button>
                <el-button v-if='isAdd == true' type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
                <el-button v-if='isAdd == false' type="primary" @click.native="editSubmit" :loading="addLoading">提交</el-button>
            </template>
        </I-table-editor>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    import ITableEditor from '../../components/Table/TableEditor.vue'
    //import NProgress from 'nprogress'

    export default {
        data() {
            var checkPhone = (rule, value, callback) => {
                if (!value) {
                return callback(new Error('手机号不能为空'));
                } else {
                const reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
                console.log(reg.test(value));
                if (reg.test(value)) {
                    callback();
                } else {
                    return callback(new Error('请输入正确的手机号'));
                }
                }
            };
            return {
                enterpriseID: 0,
                employeeData:[],//员工数据
                filters: {
                    name: ''
                },
                title: '',
                isAdd: true,
                tableData: [],//列表数据
                total: 0,
                currentPage: 1,//当前页
                pageSize:0,//每页显示的条数，为0，显示25条
                listLoading: false,
                sels: [],//列表选中列
                //新增、编辑界面数据
                form: {
                    canteenName: '',
                    address: '',
                    employeeID: '',
                    phoneNumber: '',
                    note: ''
                },
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                rules: {
                    canteenName: [
                        { required: true, message: '请输入门店名称', trigger: 'blur' }
                    ],
                    address: [
                        { required: true, message: '请输入地址', trigger: 'blur' }
                    ],
                    employeeID: [
                        { required: true, message: '请选择负责人' }
                    ],
                    phoneNumber: [
                        { required: true, message: '请选择负责人' }
                        // { validator: checkPhone, trigger: 'blur'}
                    ]
                },
                //操作按钮
                checkBtn: false,
                editBtn: false,
                deleBtn: false,
                addBtn: false,
            }
        },
        mounted() {
            this.enterpriseID = JSON.parse(localStorage.getItem('user')).enterpriseID;
            this.init();//初始化
            this.getBtn();
            this.getEmployeeData();
        },
        methods: {
            //获取操作按钮
            getBtn() {
                let permissions = JSON.parse(localStorage.getItem('user')).permissions;
                if(permissions.indexOf('131') > -1) {
                    this.checkBtn = true;
                }
                if(permissions.indexOf('132') > -1) {
                    this.addBtn = true;
                }
                if(permissions.indexOf('133') > -1) {
                    this.deleBtn = true;
                }
                if(permissions.indexOf('134') > -1) {
                    this.editBtn = true;
                }
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            //查询
            search() {
                this.$fetch('/canteens/' + this.enterpriseID + '/' + this.filters.name).then(res => {
                    console.log(res);
                    this.tableData = res.data;
                })
            },
            //关闭弹框
            closeDialog() {
                this.addFormVisible = false;
                this.$refs['form'].resetFields();
            },
            //获取员工列表
            getEmployeeData() {
                this.$fetch('/employees/' + this.enterpriseID + '/0/0').then(res => {
                    console.log('员工数据', res.data.list);
                    this.employeeData = res.data.list;
                })
            },
            //新增负责人电话显示
            selectChange() {
                console.log(this.form.employeeID);
                this.employeeData.map((value,index) => {
                    if(value.employeeID == this.form.employeeID) {
                        this.form.phoneNumber = value.phoneNumber;
                    }
                })
            },
            //获取列表
            init() {
                // this.listLoading = true;
                this.$fetch('/canteens/' + this.enterpriseID).then(res => {
                    console.log('列表数据',res);
                    this.tableData = res.data;
                })
            },
            //删除
            handleDel: function (index, row) {
                // console.log(row)
                this.$fetch('/settlementCycle/canteenID/' + row.canteenID).then(res => {
                    // console.log('del',res);
                    if(res.data.length > 0) {
                        this.$message.error(res.msg);
                    } else {
                        this.confirmDel(row.canteenID);
                    }
                })
                
            },
            //确定删除
            confirmDel(canteenID) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    // this.listLoading = true;
                    this.$remove('/canteen/' + canteenID).then(res => {
                        if(!res.state) {
                            this.$message.error(res.msg);
                        } else {
                            this.$message.success(res.msg);
                            this.init();
                            // this.listLoading = false;
                        }
                    })
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                console.log('编辑',row)
                this.addFormVisible = true;
                this.title = '编辑';
                this.isAdd = false;
                this.form = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.title = '新增';
                this.isAdd = true;
                
                this.form.note = '';
            },
            //编辑
            editSubmit: function () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.form);
                            this.$put('/canteen/',para).then(res => {
                                console.log(res);
                                if(!res.state) {
                                    this.$message.error(res.msg);
                                } else {
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
                            let para = Object.assign({}, this.form);
                            para.enterpriseID = this.enterpriseID;
                            console.log('新增数据',para);
                            this.$post('/canteen', para).then(res => {
                                console.log(res)
                                if(!res.state) {
                                    this.$message.error(res.msg);
                                } else {
                                    this.addFormVisible = false;
                                    this.$refs['form'].resetFields();
                                    this.init();
                                }
                            })
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.canteenID).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    // this.listLoading = true;
                    this.$remove('/canteens/' + ids).then((res) => {
                        // this.listLoading = false;
                        this.$message.success(res.msg);
                        this.init();
                    });
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
    
</style>