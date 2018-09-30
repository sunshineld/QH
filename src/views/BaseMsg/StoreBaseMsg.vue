<!--门店基础信息维护-->
<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item v-if="!selectBtn">
                    <el-select v-model="canteenID" placeholder="请选择" @change="storeChange">
                        <el-option
                        v-for="item in storeData"
                        :key="item.canteenID"
                        :label="item.canteenName"
                        :value="item.canteenID">
                        </el-option>
                    </el-select>
                </el-form-item>
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
                <el-form-item v-if="addBtn">
                    <el-button type="primary"  @click="handleAdd">新增</el-button>
                </el-form-item>
                <el-form-item v-if="deleBtn">
                    <el-button type="danger" v-if='value == "1"'   @click="batchRemove" :disabled="this.sels.length < 2">批量删除</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--窗口列表-->
        <el-table 
         :data='windowData'
         highlight-current-row 
         v-loading="listLoading" 
         key='firstTable'
         v-if='value === "1"'
         @selection-change="selsChange" 
         style="width: 100%;">
            <el-table-column 
             type="selection" 
             width="55">
            </el-table-column>
            <el-table-column 
             prop="windowName" 
             label="名称" 
             width="200" 
             >
            </el-table-column>
            <el-table-column 
             prop="windowNote" 
             label="说明" 
             min-width="200" 
             >
            </el-table-column>
            <el-table-column
            v-if='editBtn || deleBtn' 
             label="操作" 
             width="150">
                <template slot-scope="scope">
                    <el-button size="small" type="primary" v-if="editBtn" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" v-if="deleBtn" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 菜品类别列表 -->
        <el-table 
         :data='dishData'
         highlight-current-row 
         v-loading="listLoading" 
         key='secondTable'
         v-if='value === "2"'
         @selection-change="selsChange" 
         style="width: 100%;">
            <el-table-column 
             type="selection" 
             width="55">
            </el-table-column>
            <el-table-column 
             prop="dishesType" 
             label="名称" 
             width="120" 
             >
            </el-table-column>
            <el-table-column 
             prop="classificationNote" 
             label="说明" 
             min-width="200" 
             >
            </el-table-column>
            <el-table-column 
             v-if="editBtn || deleBtn"
             label="操作" 
             width="150">
                <template slot-scope="scope">
                    <el-button size="small" type="primary" v-if="editBtn" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" v-if="deleBtn" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 餐段设置列表 -->
        <el-table 
         :data='dishTimeData'
         highlight-current-row 
         v-loading="listLoading" 
         key='thirdTable'
         v-if='value === "3"'
         @selection-change="selsChange" 
         style="width: 100%;">
            <el-table-column 
             type="selection" 
             width="55">
            </el-table-column>
            <el-table-column 
             prop="mealPartitionName" 
             label="名称" 
             width="120" 
             >
            </el-table-column>
            <el-table-column
             prop="openingTime" 
             label="开始时间" 
             width="120" 
             >
            </el-table-column>
            <el-table-column 
             prop="closeTime" 
             label="结束时间" 
             width="120" 
             >
            </el-table-column>
            <el-table-column 
             prop="mealPartitionNote" 
             label="说明" 
             min-width="200" 
             >
            </el-table-column>
            <el-table-column
             v-if="editBtn || deleBtn" 
             label="操作" 
             width="200">
                <template slot-scope="scope">
                    <el-button size="small" type="primary" v-if="editBtn" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" v-if="deleBtn" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条(不需要)-->
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
         class="addDialog"
        >
            <template slot="content">
                <el-form :model="form" label-width="100px" :rules="rules" ref="form">
                    <el-form-item label="名称" prop="name" v-if='value != 3'>
                        <el-input v-model="form.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="名称" prop="mealPartitionTypeName" v-if='value == 3'>
                        <el-select v-model="form.mealPartitionTypeName" placeholder="请选择名称">
                            <el-option
                            v-for="(item,index) in mealData"
                            :key="index"
                            :label="item.mealPartitionTypeName"
                            :value="item.mealPartitionTypeName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="value == '3'" label="开始时间" prop="dinnerStart">
                        <el-time-select
                        v-model="form.dinnerStart"
                        :picker-options="{
                            start: '06:00',
                            step: '00:15',
                            end:'23:59'
                        }"
                        placeholder="选择时间">
                        </el-time-select>
                    </el-form-item>
                    <el-form-item v-if="value == '3'" label="结束时间" prop="dinnerEnd">
                        <el-time-select
                        v-model="form.dinnerEnd"
                        :picker-options="{
                            start: '06:00',
                            step: '00:15',
                            end:'23:59',
                            minTime: form.dinnerStart
                        }"
                        placeholder="选择时间">
                        </el-time-select>
                    </el-form-item>
                    <el-form-item label="说明">
                        <el-input type="textarea" v-model="form.note" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <template slot="foot">
                <el-button @click.native="closeDialog">取消</el-button>
                <el-button v-if='isAdd == true && value == "1"' type="primary" @click.native="addWindowBtn">提交</el-button>
                <el-button v-if='isAdd == true && value == "2"' type="primary" @click.native="addDishTypeBtn">提交</el-button>
                <el-button v-if='isAdd == true && value == "3"' type="primary" @click.native="addMealTimeBtn">提交</el-button>
                <el-button v-if='isAdd == false && value == "1"' type="primary" @click.native="editWindowBtn">提交</el-button>
                <el-button v-if='isAdd == false && value == "2"' type="primary" @click.native="editDishTypeBtn">提交</el-button>
                <el-button v-if='isAdd == false && value == "3"' type="primary" @click.native="editMealTimeBtn">提交</el-button>
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
            return {
                filters: {
                    name: ''
                },
                windowData:[],
                dishData:[],
                dishTimeData:[],
                options: [
                    {
                        value: '1',
                        label: '窗口'
                    },
                     {
                        value: '2',
                        label: '菜品类别'
                    },
                     {
                        value: '3',
                        label: '餐段设置'
                    }
                ],
                value: '1',
                isAdd: true,
                title:'',//新增、编辑标题
                ProductCategory: [],
                total: 0,
                currentPage: 1,
                pageSize: 0,//每页显示的条数，为0，显示25条
                listLoading: false,
                sels: [],//列表选中列

                //表单数据
                form: {
                    name: '',
                    dinnerStart:'',
                    dinnerEnd:'',
                    mealPartitionTypeName:'',
                    note: '',
                },
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                rules: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ],
                    dinnerStart: [
                        { required: true, message: '请选择开始时间', trigger: 'blur' }
                    ],
                    dinnerEnd: [
                        { required: true, message: '请选择结束时间', trigger: 'blur' }
                    ],
                    mealPartitionTypeName: [
                        { required: true, message: '请选择名称' }
                    ]
                },
                enterpriseID: 0,
                windowID:0,
                classificationDishesID: 0,
                mealPartitionID: 0,
                mealData:[],//餐段名称
                canteenID: null,
                // canteenID2: null,
                storeData:[],//门店数据
                //操作按钮
                checkBtn: false,
                editBtn: false,
                deleBtn: false,
                addBtn: false,
                selectBtn: false,

            }
        },
        mounted() {
            this.enterpriseID = JSON.parse(localStorage.getItem('user')).enterpriseID;
            this.storeData = JSON.parse(localStorage.getItem('user')).canteenList;
            //初始化
            this.getStore();
            this.getBtn();
            this.getMealList();
        },
        methods: {
            //获取操作按钮
            getBtn() {
                let permissions = JSON.parse(localStorage.getItem('user')).permissions;
                let roleList = JSON.parse(localStorage.getItem('user')).roleList;
                console.log(roleList)
                if(permissions.indexOf('151') > -1) {
                    this.checkBtn = true;
                }
                if(permissions.indexOf('152') > -1) {
                    this.addBtn = true;
                }
                if(permissions.indexOf('153') > -1) {
                    this.deleBtn = true;
                }
                if(permissions.indexOf('154') > -1) {
                    this.editBtn = true;
                }
                for(let i = 0; i < roleList.length; i ++) {
                    if(roleList[i].roleID === 2) {
                        console.log('----------',this.selectBtn)
                        this.selectBtn = true;
                        break;
                    }
                }
                console.log('=====',this.selectBtn)
            },
            //获取当前登陆用户可操作门店
            getStore() {
                let para = {
                    enterpriseID: this.enterpriseID,
                    canteenID: JSON.parse(localStorage.getItem('user')).canteenID,
                    userID: JSON.parse(localStorage.getItem('user')).userID
                }
                this.$post('/canteens/operable',para).then(res => {
                    // console.log('操作门店',res.data);
                    if(res.state) {
                        this.storeData = res.data; 
                        this.getList();
                    } else {
                        this.$message.error(res.msg);
                    }
                })
            },
            //判断角色获取列表
            getList() {
                let roleList = JSON.parse(localStorage.getItem('user')).roleList;
                let roleID = [];
                for(let i = 0; i < roleList.length; i ++) {
                    roleID.push(roleList[i].roleID);
                }
                if(roleID.indexOf(2) > -1) {
                    this.canteenID = JSON.parse(localStorage.getItem('user')).canteenID;
                    this.init();
                } else {
                    this.canteenID = this.storeData[0].canteenID;
                    this.init();
                }
            },
            handleCurrentChange(val) {
                this.page = val;
                this.init();
            },
            //门店选择change
            storeChange() {
                this.init();
            },
            selectChange() {
                // console.log(this.value);
                this.init();
            },
            init() {
                // this.listLoading = true;
                if(this.value == '1') {
                    this.windowData = [];
                    this.$fetch('/canteenWindows/' + this.canteenID).then(res => {
                        if(!res.state) {
                            this.$message.error(res.msg);
                        } else {
                            // console.log('窗口',res)
                            this.windowData = res.data;                        
                        }
                    })
                } else if(this.value == '2') {
                    this.dishData = [];
                    this.$fetch('/classificationDishes/'+ this.enterpriseID + '/' + this.canteenID).then(res => {
                        // console.log('菜品类别数据',res)
                        if(!res.state) {
                            this.$message.error(res.msg);
                        } else {
                            this.dishData = res.data
                        }
                    })
                } else if(this.value == '3') {
                    this.dishTimeData = [];
                    this.$fetch('/mealPartitions/' + this.enterpriseID + '/' + this.canteenID).then(res => {
                        // console.log('餐段设置数据',res);
                        if(!res.state) {
                            this.$message.error(res.msg);
                        } else {
                            this.dishTimeData = res.data;
                        }
                    })
                }
            },
            //获取餐段名称
            getMealList() {
                this.$fetch('/config/mealPartitionType').then(res => {
                    if(res.state) {
                        this.mealData = res.data;
                    }
                })
            },
            //关闭弹框
            closeDialog() {
                this.$refs['form'].resetFields();
                this.addFormVisible = false;
            },
            //删除
            handleDel: function (index, row) {
                console.log(row);
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    // this.listLoading = true;
                    if(this.value == '1') {
                        this.$remove('/canteenWindow/' + row.windowID).then(res => {
                            console.log(res)
                            if(res.state) {
                                this.$message.success('删除成功');
                                this.init(this.canteenID);
                            } else {
                                this.$message.error(res.msg)
                            }
                        })
                    } else if(this.value == '2') {
                        this.$remove('/classificationDish/' + row.classificationDishesID).then(res => {
                            if(res.state) {
                                this.$message.success('删除成功');
                                this.init(this.canteenID);
                            } else {
                                this.$message.error(res.msg)
                            }
                        }) 
                    } else if(this.value == '3') {
                        this.$remove('/mealPartition/' + row.mealPartitionID).then(res => {
                            if(res.state) {
                                this.$message.success('删除成功');
                                this.init(this.canteenID);
                            } else {
                                this.$message.error(res.msg)
                            }
                        })
                    }
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                console.log(row)
                this.addFormVisible = true;
                this.title = '编辑';
                this.isAdd = false;
                this.windowID = row.windowID;
                this.classificationDishesID = row.classificationDishesID;
                this.mealPartitionID = row.mealPartitionID;
                if(this.value == '1'){
                    this.form.name = row.windowName;
                    this.form.note = row.windowNote;
                } else if(this.value == '2') {
                    this.form.name = row.dishesType;
                    this.form.note = row.classificationNote;
                } else if(this.value == '3') {
                    this.form.mealPartitionTypeName = row.mealPartitionName;
                    this.form.dinnerStart = row.openingTime;
                    this.form.dinnerEnd = row.closeTime;
                    this.form.note = row.mealPartitionNote;
                }
             },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.title = '新增';
                this.isAdd = true;
                this.form = {
                    name: '',
                    note: '',
                    dinnerEnd:'',
                    dinnerStart:''
                };
            },
            //确认新增窗口
            addWindowBtn() {
                this.$refs['form'].validate((valid) => {
                    if(valid) {
                        let para = {
                            windowName: this.form.name,
                            enterpriseID: this.enterpriseID,
                            windowNote: this.form.note,
                            canteenID: this.canteenID
                        }
                        this.$post('/canteenWindow', para).then(res => {
                            console.log('--------',res)
                            if(!res.state) {
                                this.$message.error(res.msg);
                            } else {
                                this.$message.success(res.msg);
                                this.addFormVisible = false;
                                this.init(this.canteenID);
                            }

                        })
                    }
                })
            },
            //确认新增菜品类别
            addDishTypeBtn() {
                this.$refs['form'].validate((valid) => {
                    if(valid) {
                        let para = {
                            dishesType: this.form.name,
                            enterpriseID: this.enterpriseID,
                            classificationNote: this.form.note,
                            canteenID: this.canteenID
                        }
                        console.log(para)
                        this.$post('/classificationDish', para).then(res => {
                            console.log('--------',res)
                            if(res.state) {
                                this.$message.success('新增成功');
                                this.addFormVisible = false;
                                this.init(this.canteenID);
                            } else {
                                this.$message.error(res.msg);
                            }

                        })
                    }
                })
            },
            //确认新增餐段设置
            addMealTimeBtn() {
                console.log('开始时间',this.form.dinnerStart,'开始时间',this.form.dinnerEnd)
                this.$refs['form'].validate((valid) => {
                    if(valid) {
                        let para = {
                            mealPartitionName: this.form.mealPartitionTypeName,
                            enterpriseID: this.enterpriseID,
                            mealPartitionNote: this.form.note,
                            openingTime: this.form.dinnerStart,
                            closeTime: this.form.dinnerEnd,
                            canteenID: this.canteenID
                        }
                        console.log('para',para)
                        this.$post('/mealPartition', para).then(res => {
                            console.log('--------',res)
                            if(res.state) {
                                this.$message.success('新增成功');
                                this.addFormVisible = false;
                                this.init(this.canteenID);
                            } else {
                                this.$message.error(res.msg);
                            }

                        })
                    }
                })
            },
            //确认编辑窗口
            editWindowBtn() {
                this.$refs['form'].validate((valid) => {
                    if(valid) {
                        let para = {
                            windowName: this.form.name,
                            enterpriseID: this.enterpriseID,
                            windowNote: this.form.note,
                            canteenID: this.canteenID,
                            windowID: this.windowID,
                        }
                        this.$put('/canteenWindow', para).then(res => {
                            console.log('--------',res)
                            if(!res.state) {
                                this.$message.error(res.msg);
                            } else {
                                this.$message.success(res.msg);
                                this.addFormVisible = false;
                                this.init(this.canteenID);
                            }

                        })
                    }
                })
            },
            //确认编辑菜品类别
            editDishTypeBtn() {
                this.$refs['form'].validate((valid) => {
                    if(valid) {
                        let para = {
                            dishesType: this.form.name,
                            classificationDishesID: this.classificationDishesID,
                            enterpriseID: this.enterpriseID,
                            classificationNote: this.form.note
                        }
                        console.log('确认编辑数据',para)
                        this.$put('/classificationDish', para).then(res => {
                            console.log('--------',res)
                            if(res.state) {
                                this.$message.success('修改成功');
                                this.addFormVisible = false;
                                this.init(this.canteenID);
                            }

                        })
                    }
                })
            },
            //确认编辑餐段设置
            editMealTimeBtn() {
                this.$refs['form'].validate((valid) => {
                    if(valid) {
                        let para = {
                            mealPartitionName: this.form.mealPartitionTypeName,
                            enterpriseID: this.enterpriseID,
                            mealPartitionNote: this.form.note,
                            openingTime: this.form.dinnerStart,
                            closeTime: this.form.dinnerEnd,
                            canteenID: this.canteenID,
                            mealPartitionID: this.mealPartitionID
                        }
                        console.log('确认编辑数据',para)
                        this.$put('/mealPartition', para).then(res => {
                            console.log('--------',res)
                            if(res.state) {
                                this.$message.success('修改成功');
                                this.addFormVisible = false;
                                this.init(this.canteenID);
                            }

                        })
                    }
                })
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    var ids = '';
                    // this.listLoading = true;
                    ids = this.sels.map(item => item.windowID).toString();
                    this.$remove('/canteenWindows/' + ids).then(res => {
                        if(res.state) {
                            this.$message.success('删除成功');
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
    @import '../../styles/common.scss';
    .el-select-dropdown__item.selected {
        color: #20a0ff;
        background-color:#fff;
    }
    .el-date-editor.el-input {
        width: 100%;
    }
</style>