<!--公司基础信息-->
<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-select v-model="value" placeholder="请选择" @change="selectChange">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if='addBtn'>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
                <el-form-item v-if='deleBtn'>
                    <el-button type="danger"  @click="batchRemove"  :disabled="this.sels.length < 2">批量删除</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--部门列表-->
        <el-table 
         :data='departmentData'
         highlight-current-row 
         v-loading="listLoading"
         key="firstTable" 
         v-if='value == "1"'
         @selection-change="selsChange" 
         style="width: 100%;">
            <el-table-column 
             type="selection" 
             width="55">
            </el-table-column>
            <el-table-column 
             prop="departmentName" 
             label="部门" 
             width="120" 
             >
            </el-table-column>
            <el-table-column 
             prop="departmentNote" 
             label="说明" 
             min-width="120" 
             >
            </el-table-column>
            <el-table-column
            v-if='editBtn || deleBtn' 
             label="操作" 
             width="250">
                <template slot-scope="scope">
                    <el-button type="primary" v-if="editBtn" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" v-if="deleBtn" size="small" @click="deleteDepartment(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 职位列表 -->
        <el-table 
         :data='positionData'
         highlight-current-row 
         v-loading="listLoading" 
         key="secondTable" 
         v-if='value == "2"'
         @selection-change="selsChange" 
         style="width: 100%;">
            <el-table-column 
             type="selection" 
             width="55">
            </el-table-column>
            <el-table-column 
             prop="positionName" 
             label="职位" 
             width="120" 
             >
            </el-table-column>
            <el-table-column 
             prop="positionNote" 
             label="说明" 
             min-width="120" 
             >
            </el-table-column>
            <el-table-column 
             v-if='editBtn || deleBtn'
             label="操作" 
             width="250">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" v-if="editBtn" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" v-if="deleBtn" @click="deletePosition(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 角色列表 -->
        <el-table 
         :data='roleData'
         highlight-current-row 
         v-loading="listLoading" 
         key="thirdTable" 
         v-if='value == "3"'
         @selection-change="selsChange" 
         style="width: 100%;">
            <el-table-column 
             type="selection" 
             width="55">
            </el-table-column>
            <el-table-column 
             prop="roleName" 
             label="岗位角色" 
             width="120" 
             >
            </el-table-column>
            <el-table-column 
             prop="roleNote" 
             label="说明" 
             min-width="120" 
             >
            </el-table-column>
            <el-table-column
             v-if="editBtn || deleBtn" 
             label="操作" 
             width="250">
                <template slot-scope="scope">
                    <el-button type="primary" v-if="editBtn" :disabled='scope.row.enterpriseID === 0' size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" v-if="deleBtn" :disabled='scope.row.enterpriseID === 0' size="small" @click="deleteRole(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条(不需要分页)-->
        <!-- <el-col :span="24" class="toolbar">
            <el-pagination 
             layout="prev, pager, next" 
             @current-change="handleCurrentChange" 
             :page-size="20" 
             :total="total" 
             style="float:right;">
            </el-pagination>
        </el-col> -->
        <!-- 新增、编辑 -->
        <I-table-editor
         :title='title'
         v-model="addFormVisible"
         @dialogVisibleClose='closeDialog'
         class="addDialog editDialog"
        >
            <template slot="content">
                <el-form :model="form" label-width="100px" :rules="addFormRules" ref="form">
                    <el-form-item :label="nameLable" prop="name">
                        <el-input v-model="form.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="说明">
                        <el-input type="textarea" v-model="form.note"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <template slot="foot">
                <el-button @click.native="closeDialog">取消</el-button>
                <el-button v-if='isAdd == true && value == "1"' type="primary" @click.native="addDepartmentBtn">提交</el-button>
                <el-button v-if='isAdd == true && value == "2"' type="primary" @click.native="addPositionBtn">提交</el-button>
                <el-button v-if='isAdd == true && value == "3"' type="primary" @click.native="addRoleBtn">提交</el-button>
                <el-button v-if='isAdd == false && value == "1"' type="primary" @click.native="editDepartmentBtn">提交</el-button>
                <el-button v-if='isAdd == false && value == "2"' type="primary" @click.native="editPositionBtn">提交</el-button>
                <el-button v-if='isAdd == false && value == "3"' type="primary" @click.native="editRoleBtn">提交</el-button>
            </template>
        </I-table-editor>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    import ITableEditor from '../../components/Table/TableEditor.vue'
    export default {
        data() {
            return {
                departmentData:[],//列表数据
                positionData:[],
                roleData:[],
                value:'1',
                options: [
                    {
                        value: '1',
                        label: '部门'
                    },
                     {
                        value: '2',
                        label: '职位'
                    },
                     {
                        value: '3',
                        label: '岗位角色'
                    }
                ],
                nameLable:'',
                title:'',//新增、编辑标题
                isAdd: true,
                currentPage: 1,//当前页
                pageSize:0,//每页显示的条数，为0，显示25条
                contactType: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                addFormVisible: false,//新增、编辑界面是否显示
                addLoading: false,
                //验证
                addFormRules: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                form: {
                    name: '',
                    note: ''
                },
                departmentID: 0,//部门ID
                positionID: 0,//职位ID
                roleID: 0,//角色ID
                user:{},
                enterpriseID: 0,
                disableBtn: false,
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
            
        },
        methods: {
            //操作按钮是否显示
            getBtn() {
                let permissions = JSON.parse(localStorage.getItem('user')).permissions;
                if(permissions.indexOf('111') > -1) {
                    this.checkBtn = true;
                }
                if(permissions.indexOf('112') > -1) {
                    this.addBtn = true;
                }
                if(permissions.indexOf('113') > -1) {
                    this.deleBtn = true;
                }
                if(permissions.indexOf('114') > -1) {
                    this.editBtn = true;
                }
            },
            //分页
            handleCurrentChange(val) {
                this.page = val;
            },
            selectChange() {
                console.log(this.value)
                if(this.value == '1') {
                    this.nameLable = '部门';
                    this.init();
                } else if(this.value == '2') {
                    this.nameLable = '职位';
                   this.init();
                } else if(this.value == '3') {
                    this.nameLable = '岗位角色';
                    this.init();
                }
            },
            //获取列表
            init() {
                //NProgress.start();
                if(this.value == '1') {
                    this.nameLable = '部门';
                    this.$fetch('/departments/'+this.enterpriseID).then(res => {
                        // console.log("部门列表",res);
                        if(!res.state) {
                            this.$message({
                                message: res.msg,
                                type: 'error'
                            })
                        } else {
                            this.departmentData= res.data;
                        }
                    }).catch(res => {

                    })
                } else if(this.value == '2') {
                    this.nameLable = '职位';
                    this.$fetch('/positions/'+this.enterpriseID).then(res => {
                        // console.log('职位列表',res.data);
                        if(!res.state) {
                            this.$message({
                                message: res.msg,
                                type: 'error'
                            })
                        } else {
                            this.positionData = res.data;
                        }
                    }).catch(res => {

                    })
                } else if(this.value == '3') {
                    this.nameLable = '岗位角色';
                    this.$fetch('/roles/'+this.enterpriseID).then(res => {
                        // console.log('角色列表',res.data);
                        if(!res.state) {
                            this.$message.error(res.msg)
                        } else {
                            this.roleData = res.data;
                        }
                    }).catch(res => {

                    })
                }
                
            },
            //删除部门
            deleteDepartment(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$remove('/department/'+ row.departmentID).then(res => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.init();
                    })
                }).catch(() => {

                });
            },
            //删除职位
            deletePosition(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$remove('/position/'+ row.positionID).then(res => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.init();
                    })
                }).catch(() => {

                });
            },
            //删除角色
            deleteRole(index,row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$remove('/role/'+ row.enterpriseID + '/' + row.roleID).then(res => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.init();
                    })
                }).catch(() => {

                });
            },
            //关闭弹框
            closeDialog() {
                this.addFormVisible = false;
                this.$refs['form'].resetFields();
            },
            //显示编辑界面
            handleEdit(index, row) {
                console.log('编辑',row);
                this.addFormVisible = true;
                this.title = '编辑';
                this.isAdd = false;
                if(this.value == '1') {
                    this.form.name = row.departmentName;
                    this.form.note = row.departmentNote;
                    this.departmentID = row.departmentID;
                } else if( this.value == '2') {
                    this.form.name = row.positionName;
                    this.form.note = row.positionNote;
                    this.positionID = row.positionID;
                } else if(this.value == '3') {
                    this.form.name = row.roleName;
                    this.form.note = row.roleNote;
                    this.roleID = row.roleID;
                }
                
            },
            //显示新增界面
            handleAdd() {
                this.addFormVisible = true;
                this.title = '新增';
                this.isAdd = true;
                this.form = {
                    name: '',
                    note:''
                };
            },
            //确认编辑部门
            editDepartmentBtn() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let para = {
                                enterpriseID: this.enterpriseID,
                                departmentName: this.form.name,
                                departmentNote: this.form.note,
                                departmentID: this.departmentID
                            };
                            console.log('参数',para)
                            // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            this.$put('/department',para).then(res => {
                                console.log(res);
                                if(!res.state) {
                                    this.$message({
                                        message: res.msg,
                                        type: 'error'
                                    });
                                } else {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.addFormVisible = false;
                                    this.init();
                                }
                            })
                        });
                    }
                });
            },
            //确认编辑职位
            editPositionBtn() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let para = {
                                enterpriseID: this.enterpriseID,
                                positionName: this.form.name,
                                positionNote: this.form.note,
                                positionID: this.positionID
                            };
                            console.log(para)
                            // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            this.$put('/position',para).then(res => {
                                console.log(res);
                                if(!res.state) {
                                    this.$message({
                                        message: res.msg,
                                        type: 'error'
                                    });
                                } else {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.addFormVisible = false;
                                    this.init();
                                }
                            })
                        });
                    }
                });
            },
            //确认编辑角色
            editRoleBtn() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let para = {
                                enterpriseID: '1',
                                roleName: this.form.name,
                                roleNote: this.form.note,
                                roleID: this.roleID
                            };
                            console.log(para)
                            // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            this.$put('/role',para).then(res => {
                                console.log(res);
                                if(!res.state) {
                                    this.$message({
                                        message: res.msg,
                                        type: 'error'
                                    });
                                } else {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.addFormVisible = false;
                                    this.init();
                                }
                            })
                        });
                    }
                });
            },
            //确认新增部门
            addDepartmentBtn() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            
                            console.log(this.form);
                            let para = {
                                enterpriseID: this.enterpriseID,
                                departmentName: this.form.name,
                                departmentNote: this.form.note
                            };
                            console.log(para);
                            // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            console.log('********',para);
                            this.$post('/department',para).then(res => {
                                console.log(res);
                                if(!res.state) {
                                    this.$message({
                                        message: res.msg,
                                        type: 'error'
                                    });
                                } else {
                                    this.$message({
                                        message: res.msg,
                                        type: 'success'
                                    });
                                    this.addFormVisible = false;
                                    this.init();
                                }
                            })
                        });
                    }
                });
            },
            //确认新增职位
            addPositionBtn() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            console.log(this.form);
                            let para = {
                                enterpriseID: this.enterpriseID,
                                positionName: this.form.name,
                                positionNote: this.form.note
                            };
                            console.log(typeof para);
                            // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            console.log('********',para);
                            this.$post('/position',para).then(res => {
                                console.log(res);
                                if(!res.state) {
                                    this.$message({
                                        message: res.msg,
                                        type: 'error'
                                    });
                                } else {
                                    this.$message({
                                        message: res.msg,
                                        type: 'success'
                                    });
                                    this.addFormVisible = false;
                                    this.init();
                                }
                            })
                        });
                    }
                });
            },
            //确认新增角色
            addRoleBtn() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            console.log(this.form);
                            let para = {
                                enterpriseID: this.enterpriseID,
                                roleName: this.form.name,
                                roleNote: this.form.note
                            };
                            console.log(typeof para);
                            // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            console.log('********',para);
                            this.$post('/role',para).then(res => {
                                console.log(res);
                                if(!res.state) {
                                    this.$message({
                                        message: res.msg,
                                        type: 'error'
                                    });
                                } else {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
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
            },
            //批量删除
            batchRemove() {
                this.$confirm('确认删除选中记录吗','提示',{
                    type: 'warning'
                }).then(() => {
                    if(this.value == '1') {
                        let ids = this.sels.map(item => item.departmentID).toString();
                        this.$remove('/departments/' + ids).then(res => {
                            if(res.state) {
                                this.$message.success('删除成功');
                                this.init();
                            }
                        })
                    } else if(this.value == '2') {
                        let ids = this.sels.map(item => item.positionID).toString();
                        this.$remove('/positions/' + ids).then(res => {
                            if(res.state) {
                                this.$message.success('删除成功');
                                this.init();
                            }
                            
                        })
                    } else if(this.value == '3') {
                        let ids = this.sels.map(item => item.roleID).toString();
                        this.$remove('/roles/' + this.enterpriseID + '/' + ids).then(res => {
                            if(res.state) {
                                console.log(res);
                                this.$message.success('删除成功');
                                this.init();
                            }
                        })
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
    @import '../../styles/common.scss';
    .el-select-dropdown__item.selected {
        color: #20a0ff;
        background-color:#fff;
    }
    .editDialog {
        .el-dialog {
            width: 740px;
            .el-dialog__body {
                .el-form {
                    width: 60%;
                    margin: 0 auto;
                    .el-form-item__label {
                        letter-spacing: 2px;
                        font-size: 16px;
                        font-weight: bold;
                    }
                }
                .el-form-item__content {
                    width: 280px;
                }
            }
        }
        
    }
</style>