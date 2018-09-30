<template>
	<section>
        <!-- 福利金流水 -->
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-date-picker
					v-model="timer"
					type="daterange"
					align="right"
					unlink-panels
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					:clearable="false"
					@change='getDate'
					:picker-options="pickerOptions">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="姓名">
					<el-input v-model="filters.customerName" clearable></el-input>
				</el-form-item>
				<el-form-item label="部门" v-if="enterpriseTypeID != 1">
					<el-select clearable v-model="filters.departmentID" placeholder="请选择部门">
						<el-option
						v-for="item in departmentData"
						:key="item.departmentID"
						:label="item.departmentName"
						:value="item.departmentID">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="search">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!-- 数据展示-->
		<ul class="dataPlay">
			<li>
				<div>
					<p>金额</p>
					<p>￥{{turnOver}}</p>
				</div>
			</li>
			<li>
				<div>
					<p>数量</p>
					<p>{{total}}次</p>
				</div>
			</li>
		</ul>
		<!--列表-->
		<el-table 
		 :data="tableData" 
		 highlight-current-row 
		 v-loading="listLoading"
		 @selection-change="selsChange" 
		 style="width: 100%;" >
			<el-table-column 
			label="序号"
			align="center"
			width="100">
				<template slot-scope="scope">
					<span>{{scope.$index+(filters.currentPage - 1) *filters.pageSize + 1}} </span>
				</template>
			</el-table-column>
			<el-table-column 
			 v-if='enterpriseTypeID == 1'
			 prop="enterpriseName" 
			 label="公司名称"
			 min-width="120" 
			 >
			</el-table-column>
			<el-table-column 
			 prop="customerName" 
			 label="姓名"
			 min-width="120" 
			 >
			</el-table-column>
			<el-table-column 
			 prop="departmentName" 
			 label="部门" 
			 min-width="120" 
			 >
			</el-table-column>
			<el-table-column 
			 prop="positionName" 
			 label="职位" 
			 min-width="120" 
			 >
			</el-table-column>
			<el-table-column 
			 prop="price" 
			 label="金额（元）" 
			 min-width="120" 
			 >
			</el-table-column>
			<el-table-column 
			 prop="consumingTypeName" 
			 label="消费类型" 
			 min-width="100" 
			 >
			</el-table-column>
			<el-table-column 
			 prop="operateTime" 
			 label="时间" 
			 min-width="150" 
			 >
			</el-table-column>
			<el-table-column 
			 prop="note" 
			 label="备注" 
			 min-width="120"
			 show-overflow-tooltip 
			 >
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination 
			 layout="prev, pager, next" 
			 @current-change="handleCurrentChange" 
			 :page-size="filters.pageSize" 
			 :total="total" 
			 style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>
	import util from '../../common/js/util'

	export default {
		data() {
			return {
				filters: {
					customerName: '',
					departmentID: null,
					pageSize: 10,
					currentPage: 1,
					startTime: '',
					endTime: '',
					payTypeID: 1,//福利金
					consumingTypeID: 1,//消费
					cateringID: null
				},
				timer:[],//查询时间
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
				tableData: [],
				//补贴类型
				welfareTypeID:'',
				welfareType:[],
				departmentData:[],//部门数据
				total: 0,
				listLoading: false,
				sels: [],//列表选中列
				turnOver:0,//营业额
				start_time:'',//开始时间
				end_time:'',//结束时间
				enterpriseID: 0,
				enterpriseTypeID: null,


			}
		},
		mounted() {
			this.filters.cateringID = JSON.parse(localStorage.getItem('user')).enterpriseID;
			this.enterpriseID = JSON.parse(localStorage.getItem('user')).enterpriseID;
			this.enterpriseTypeID = JSON.parse(localStorage.getItem('user')).enterpriseTypeID;
			this.initTime();
			this.initData();
			this.getDepartmentData();
		},
		methods: {
			handleCurrentChange(val) {
				this.filters.currentPage = val;
				this.getWelfareFlow();
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//获取福利类型
			// getWelfareType() {
			// 	this.$fetch('/config/welfareType').then(res => {
			// 		this.welfareType = res.data;
			// 	})
			// },
			//获取部门
            getDepartmentData() {
                this.$fetch('/departments/' + this.enterpriseID).then(res => {
					if(res.state) {
						this.departmentData = res.data;
						let obj = {
							departmentID: null,
							departmentName: '全部'
						}
						this.departmentData.unshift(obj);

					}
                })
			},
			//获取日期
			getDate() {
				if(typeof this.timer == undefined) return;
				if(typeof this.timer == 'object') {
					console.log(typeof this.timer[0])
					if(typeof this.timer[0] == 'object') {
						// console.log('哈哈哈哈',this.timer)
						if(this.timer[0] == null && this.timer[1] == null){
							console.log('null')			
						} else {
							this.filters.startTime = util.formatDate.format(this.timer[0]);
							this.filters.endTime = util.formatDate.format(this.timer[1]);
						}
					}
				}	
			},
			//查询
			search() {
				this.filters.currentPage = 1;
				this.initData();
			},
			//获取福利金流水
			getWelfareFlow() {
				this.$post('/consumingRecords',this.filters).then(res => {
					console.log('res',res)
					if(res.state) {
						if(this.currentPage > 1) {
							if(!res.data) {
								this.currentPage = this.currentPage - 1;
								this.getWelfareFlow();
								return;
							}
						}
						this.tableData = res.data.list;
						this.total = res.data.total;
					}
					
				})
			},
			//获取营业额
			getTurnover() {
				this.$post('/consumingRecords/enterpriseBusinessVolumeAnalysis',this.filters).then(res => {
					console.log('营业额',res.data)
					if(res.state) {
						this.turnOver = res.data.totalMoney;
					}
				})
			},
			//初始化时间
			initTime() {
				let start_time = util.formatDate.getCurrentMonthFirst();
				start_time = util.formatDate.format(start_time);//获取当月的1号
				let end_time = util.formatDate.getDay(1);//获取当天日期
				this.timer.push(start_time);
				this.timer.push(end_time);
				this.filters.startTime = start_time;
				this.filters.endTime = end_time;
			},
			//初始化页面数据
			initData() {
				this.getWelfareFlow();
				this.getTurnover();
			},
			//初始参数
			getParameter() {
				this.start_time = util.formatDate.getCurrentMonthFirst();
				this.start_time = util.formatDate.format(this.start_time);//获取当月的1号
				this.end_time = util.formatDate.getDay(1);//获取当天日期
				let para = {
					payTypeID: 1,//福利金
					consumingTypeID: 1,//消费
					cateringID: this.enterpriseID,
					startTime: this.start_time,
					endTime: this.end_time,
					currentPage: this.currentPage,
					pageSize: this.pageSize
				}
				return para;
			}
		}
		
	}

</script>

<style scoped lang="scss">
	ul.dataPlay {
		li {
			width: 390px;
			height: 190px;
			font-size: 24px;
			position: relative;
			div {
				position: absolute;
				top: 50%;
				left: 50%;
				transform:translate(-50%,-50%);
				text-align: center;
			}
		}
	}
</style>