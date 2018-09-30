<template>
	<section>
        <!-- 福利卡清零 -->
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-button type="primary" @click="clearVisible = true" v-if="editBtn">清零</el-button>
		</el-col>
		<!--列表-->
		<el-table 
		 :data="tableData" 
		 highlight-current-row 
		 v-loading="listLoading" 
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
			 prop="oprateTime" 
			 label="时间" 
			 >
			</el-table-column>
			<el-table-column 
			 prop="sendType" 
			 label="发放类型" 
			 >
			</el-table-column>
			<el-table-column 
			 prop="price" 
			 label="金额" 
			 >
			</el-table-column>
			<el-table-column 
			 prop="oprator" 
			 label="操作员" 
			 >
			</el-table-column>
            <el-table-column 
			 label="操作" 
			 >
			 <template slot-scope="scope">
				 <el-button type="primary" size="small" @click='handleCheck(scope.row)'>查看</el-button>
			 </template>
			</el-table-column>
		</el-table>

		<!--工具条（分页）-->
		<el-col :span="24" class="toolbar">
			<el-pagination 
			 layout="prev, pager, next" 
			 @current-change="handleCurrentChange" 
			 :page-size="pageSize" 
			 :total="total" 
			 style="float:right;">
			</el-pagination>
		</el-col>
		<!-- 清零弹框 -->
		<I-table-editor
		 title="清零"
		 v-model="clearVisible"
		 @dialogVisibleClose='closeDialog'
		 class="aloneGrantDailog"
		>
			<template slot="content">
				<div>
					<el-input placeholder="请输入员工姓名" v-model="name" class="searchContent"></el-input>
					<el-select clearable v-model="departmentID" placeholder="请选择部门" class="searchContent">
						<el-option
						v-for="item in departmentData"
						:key="item.departmentID"
						:label="item.departmentName"
						:value="item.departmentID">
						</el-option>
					</el-select>
					<el-select clearable v-model="positionID" placeholder="请选择职位" class="searchContent">
						<el-option
						v-for="item in positionData"
						:key="item.positionID"
						:label="item.positionName"
						:value="item.positionID">
						</el-option>
					</el-select>
					<el-button type="primary" @click="searchBtn">搜索</el-button>
				</div>
				<el-table
					:data="staffData"
					ref='staffTable'
					@selection-change="selsChangeClear"
					height="300"
					style="width: 100%">
					<el-table-column 
					type="selection" 
					width="40">
					</el-table-column>
					<el-table-column
						type="index"
						label="序号"
						width="100"
						>
					</el-table-column>
					<el-table-column
						prop="customerName"
						label="姓名"
						>
					</el-table-column>
					<el-table-column
						prop="departmentName"
						label="部门"
						>
					</el-table-column>
					<el-table-column
						prop="positionName"
						label="职位">
					</el-table-column>
					<el-table-column
						prop="welfare"
						label="福利金余额">
					</el-table-column>
				</el-table>
			</template>
			<template slot="foot">
				<el-button>取消</el-button>
				<el-button type="primary" @click="handleClear">清零</el-button>
			</template>
		</I-table-editor>
		<!-- 查看 -->
		<I-table-editor
		 title="清零明细"
		 v-model="checkDetailVisible"
		 v-loading='listLoading'	
		 class="aloneGrantDailog"	
		>
			<template slot="content">
				<el-table
				:data="clearDetailed"
				height="500"
				style="width: 100%">
				<el-table-column
					prop="customerName"
					label="姓名"
					min-width='80'>
				</el-table-column>
				<el-table-column
					prop="departmentName"
					label="部门"
					>
				</el-table-column>
				<el-table-column
					prop="positionName"
					label="职位">
				</el-table-column>
				<el-table-column
					prop="price"
					label="金额">
				</el-table-column>
				<el-table-column
					prop="note"
					label="备注">
				</el-table-column>
				</el-table>
			</template>
			<template slot="foot">
				<el-button type="primary" @click="checkDetailVisible = false">确定</el-button>
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
				timer:'',//查询时间
				pickerOptions: {
					shortcuts: [
						{
							text: '最近一周',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
								picker.$emit('pick', [start, end]);
							}
						}, 
						{
							text: '最近一个月',
							onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
							}
						}, 
						{
							text: '最近三个月',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
								picker.$emit('pick', [start, end]);
							}
						}
					]
				},
				tableData: [],//列表数据
				stateValue:'1',
				state:[
					{
						value:'1',
						label:'正常'
					},
					{
						value:'2',
						label:'已停用'
					},
				],
				total: 0,
				currentPage: 1,
				pageSize: 10,
				listLoading: false,
				sels: [],//列表选中列
				clearVisible: false,//清零弹框
				checkDetailVisible: false,//查看弹框
				clearDetailed:[],//清零明细数据
				staffData:[],//员工数据
				positionData:[],//职位数据
				departmentData:[],//部门数据
				name:'',//搜索名字
				departmentID:'',//搜索部门
				positionID:'',//搜索职位
				enterpriseID: 0,
				editBtn: false,
			}
		},
		mounted() {
			this.enterpriseID = JSON.parse(localStorage.getItem('user')).enterpriseID;
			this.init();
			this.getBtn();
			this.getStaffList();
			this.getDepartmentData();
			this.getPositionData();
		},
		methods: {
			//操作按钮是否显示
            getBtn() {
                let permissions = JSON.parse(localStorage.getItem('user')).permissions;
                if(permissions.indexOf('461') > -1) {
                    this.editBtn = true;
                }
            },
			handleCurrentChange(val) {
				this.currentPage = val;
				this.init();
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//获取清零记录
			init() {
				let consumingTypeID = 5; //福利卡发放（系统配好）
				this.$fetch('/welfareRecord/' + this.enterpriseID + '/' + consumingTypeID + '/' + this.currentPage + '/' + this.pageSize).then(res => {
					if(this.currentPage > 1) {
						if(!res.data) {
							this.currentPage = this.currentPage - 1;
							this.init();
							return;
						}
					}
					this.tableData = res.data.list;
					this.total = res.data.total;
				})
			},
			selsChangeClear(sels) {
				this.sels = sels;
			},
			//获取就餐用户列表
            getStaffList() {
                this.$fetch('/customers/' + this.enterpriseID + '/' + 0 + '/' + 0).then(res => {
                    this.staffData = res.data.list;
                })
			},
			//获取部门
            getDepartmentData() {
                this.$fetch('/departments/' + this.enterpriseID).then(res => {
                    this.departmentData = res.data;
                })
			},
			//获取职位
            getPositionData() {
                this.$fetch('/positions/' + this.enterpriseID).then(res => {
                    this.positionData = res.data;
                })
			},
			//查看
			handleCheck(row) {
				this.listLoading = true;
				this.$fetch('/consumingRecords/' + row.orderID).then(res => {
					if(res.state) {
						this.clearDetailed = res.data;
						this.checkDetailVisible = true;
						this.listLoading = false;
					}
				})
			},
			//搜索
			searchBtn() {
				if(this.departmentID == '') this.departmentID = null;
				if(this.positionID == '') this.positionID = null;
				if(this.name == '') this.name = null;
				let para = {
					enterpriseID: this.enterpriseID,
					departmentID: this.departmentID,
					positionID: this.positionID,
					customerName: this.name
				}
				this.$post('/customers/moreCondition',para).then(res => {
					if(res.state) {
						this.staffData = res.data;
					}
				})
			},
			//弹框关闭
			closeDialog() {
				this.$refs.staffTable.clearSelection();
			},
			//清零
			handleClear() {
				if(this.sels.length == 0) {
					this.$message.info('请选择员工');
					return;
				}
				let ids = this.sels.map(item => item.customerID);
				let para = {
					customerIDs: ids,
					oprator: JSON.parse(localStorage.getItem('user')).contacts,
					enterpriseID: this.enterpriseID
				}
				this.$post('/consumingRecords/clear',para).then(res => {
					if(res.state) {
						this.$message.success(res.msg);
						this.clearVisible = false;
						this.init();
						this.getStaffList();
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
	.aloneGrantDailog {
		.el-dialog {
			width: 740px;
			.searchContent {
				width: 25%;
			}
		}
	}
</style>