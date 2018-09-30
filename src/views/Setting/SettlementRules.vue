<template>
    <section>
        <!-- 结算单生成规则 -->
        <!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form  :inline="true">
                <el-form-item>
                    <el-input placeholder="请输入门店名称" v-model="name"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-if="checkBtn" @click="search">查询</el-button>
                </el-form-item>
            </el-form>
		</el-col>
        <!-- 列表 -->
        <el-table
         :data='tableData' 
         highlight-current-row 
         style="width: 100%;">
            <el-table-column 
			label="序号"
			align="center"
			width="100">
				<template slot-scope="scope">
					<span>{{scope.$index+(currentPage - 1) * pageSize + 1}} </span>
				</template>
			</el-table-column>
            <el-table-column 
             prop="canteenName" 
             label="门店名称" 
             min-width="150" 
             />
            <el-table-column 
             prop="cateringName" 
             label="餐饮公司" 
             min-width="150" 
             />
            <el-table-column 
             prop="enterpriseName" 
             label="甲方客户" 
             min-width="150" 
             />
            <el-table-column 
             label="周期" 
             width="300" 
             >
             <template slot-scope='scope'>
                    <span>微信:{{scope.row.wechatCycle}}</span>&emsp;
                    <span>现金:{{scope.row.cashCycle}}</span>&emsp;
                    <span>福利金:{{scope.row.welfareCycle}}</span>
                </template>
            </el-table-column>
            <el-table-column 
             prop="note" 
             label="说明" 
             min-width="150" 
             />
            <el-table-column 
             v-if="editBtn"
             label="操作" 
             min-width="100">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" v-if="editBtn" @click="handleSettlement(scope.row)">配置</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 配置 -->
        <I-table-editor
        title='配置结算单'
        v-model="settlementVisible"
        class="settlementDailog"
        >
            <template slot="content">
                <el-form label-width="80px" :model="form">
                    <el-form-item label="微信">
                        <el-select v-model="form.wechatCycle">
                            <el-option
                            v-for="item in cycleOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="现金">
                        <el-select v-model="form.cashCycle">
                            <el-option
                            v-for="item in cycleOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="福利金">
                        <el-select v-model="form.welfareCycle">
                            <el-option
                            v-for="item in cycleOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="支付类型">
                        <el-select v-model="typeValue" multiple>
                            <el-option
                            v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item> -->
                </el-form>
            </template>
            <template slot="foot">
                <el-button @click='settlementVisible = false'>取消</el-button>
                <el-button type="primary" @click="settlementConfirm">确认</el-button>
            </template>
        </I-table-editor>
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
    </section>
</template>
<script>
    import ITableEditor from '../../components/Table/TableEditor.vue'
    export default {
        data() {
            return {
                name:'',
                tableData: [],//列表数据
                settlementVisible: false,
                cycleValue:'1',
                cycleOptions: [
                    {
                        value: 1,
                        label:'日结'
                    },
                    {
                        value: 2,
                        label:'周结'
                    },
                    {
                        value: 3,
                        label:'月结'
                    }
                ],
                form: {
                    wechatCycle:0,
                    cashCycle:0,
                    welfareCycle:0
                },
                total:0,
                currentPage:1,
                pageSize: 5,
                settlementCycleID:0,
                enterpriseID: 0,
                //操作按钮
                editBtn: false,
                checkBtn: false,
            }
        },
        mounted() {
            this.enterpriseID = JSON.parse(localStorage.getItem('user')).enterpriseID;
            this.init();
            this.getBtn();
        },
        methods:{
            //操作按钮是否显示
            getBtn() {
                let permissions = JSON.parse(localStorage.getItem('user')).permissions;
                if(permissions.indexOf('722') > -1) {
                    this.editBtn = true;
                }
                if(permissions.indexOf('721') > -1) {
					this.checkBtn = true;
                }
            },
            //配置弹框
            handleSettlement(val) {
                console.log(val)
                this.settlementCycleID = val.settlementCycleID;
                if(val.wechatCycle == '日结') this.form.wechatCycle = 1;
                if(val.wechatCycle == '周结') this.form.wechatCycle = 2;
                if(val.wechatCycle == '月结') this.form.wechatCycle = 3;

                if(val.cashCycle == '日结') this.form.cashCycle = 1;
                if(val.cashCycle == '周结') this.form.cashCycle = 2;
                if(val.cashCycle == '月结') this.form.cashCycle = 3;

                if(val.welfareCycle == '日结') this.form.welfareCycle = 1;
                if(val.welfareCycle == '周结') this.form.welfareCycle = 2;
                if(val.welfareCycle == '月结') this.form.welfareCycle = 3;
                this.settlementVisible = true;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.init();
            },
            //查询
			search() {
                if(this.name == '') {
                    this.init();
                    return;
                }
				this.$fetch('/settlementCycle/' + this.enterpriseID + '/' + this.name).then(res => {
					console.log(res)
					if(res.state) {
                        let data = this.handleData(res.data);
						this.tableData = data;
					}
				})
			},
            //初始化
			init() {
				this.$fetch('/settlementCycles/' + this.enterpriseID + '/' + this.currentPage + '/' + this.pageSize).then(res => {
					if(res.state) {
						// console.log('初始化',res.data.list)
						if(this.currentPage > 1) {
							if(!res.data) {
								this.currentPage = this.currentPage - 1
								this.init()
							}
                        }
                        let data = this.handleData(res.data.list);
                        this.tableData = data;
						this.total = res.data.total;
					}
				})
            },
            //确认配置
            settlementConfirm() {
                console.log(this.form);
                let para = Object.assign({},this.form);
                para.settlementCycleID = this.settlementCycleID;
                console.log(para);
                this.$put('/settlementCycle',para).then(res => {
                    console.log(res);
                    if(res.state) {
                        this.settlementVisible = false;
                        this.init();
                    }
                })
            },
            //处理数据
            handleData(data) {
                 for(let i = 0,len = data.length; i < len; i ++){
                    if(data[i].wechatCycle == 1) data[i].wechatCycle = '日结';
                    if(data[i].cashCycle == 1) data[i].cashCycle = '日结';
                    if(data[i].welfareCycle == 1) data[i].welfareCycle = '日结';

                    if(data[i].wechatCycle == 2) data[i].wechatCycle = '周结';
                    if(data[i].cashCycle == 2) data[i].cashCycle = '周结';
                    if(data[i].welfareCycle == 2) data[i].welfareCycle = '周结';

                    if(data[i].wechatCycle == 3) data[i].wechatCycle = '月结';
                    if(data[i].cashCycle == 3) data[i].cashCycle = '月结';
                    if(data[i].welfareCycle == 3) data[i].welfareCycle = '月结';
                }
                return data;
            }
        },
        components: {
            ITableEditor
        }
    }
</script>
<style lang="scss">
    .settlementDailog {
        .el-dialog {
            width: 740px;
            .el-dialog__body {
                .el-form {
                    width: 50%;
                    margin: 0 auto;
                }
                .el-select {
                    width: 270px;
                }
            }
        }
    }
</style>
