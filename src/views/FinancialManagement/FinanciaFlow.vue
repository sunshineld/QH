<template>
	<section>
        <!-- 消费流水 -->
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-date-picker
					v-model="timer"
					type="daterange"
					align="right"
					unlink-panels
					@change="getDate"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					:clearable='false'
					:picker-options="pickerOptions">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="门店">
					<el-select v-model="filters.canteenID" placeholder="请选择">
						<el-option
						v-for="item in storeData"
						:key="item.canteenID"
						:label="item.canteenName"
						:value="item.canteenID">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="客户名称">
					<el-select v-model="filters.enterpriseID" placeholder="请选择">
						<el-option
						v-for="item in customerData"
						:key="item.enterpriseID"
						:label="item.enterpriseName"
						:value="item.enterpriseID">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="支付方式" class="type">
					<el-select v-model="filters.payTypeID" placeholder="请选择">
						<el-option
						v-for="item in payType"
						:key="item.payTypeID"
						:label="item.payTypeName"
						:value="item.payTypeID">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="流水类型" class="type">
					<el-select v-model="filters.consumingTypeID" placeholder="请选择">
						<el-option
						v-for="item in flowType"
						:key="item.consumingTypeID"
						:label="item.consumingTypeName"
						:value="item.consumingTypeID">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item v-if="checkBtn">
					<el-button type="primary"  v-on:click="search">查询</el-button>
				</el-form-item>
				<el-form-item v-if="checkBtn">
					<el-button type="primary"  @click="exportBtn">批量导出</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!-- 数据展示-->
		<ul class="dataPlay">
			<li>
				<div class="title">
					<p>营业额</p>
					<p>￥{{turnOver}}</p>
				</div>
				<div class="list">
					<div>
						<p v-for="(value,item) in payTypeData" :key='item'>
							<span>{{item}}：</span><span>{{value}}</span>
						</p>
						<p><span>退款：</span><span>{{refundMoney}}</span></p>
					</div>
				</div>
			</li>
			<li>
				<div class="title">
					<p>就餐人数</p>
					<p>{{totalPeople}}人</p>
				</div>
				<div class="list">
					<div>
						<p><span>员工就餐：</span><span>{{enterpriseCustome}}</span></p>
						<p><span>临时就餐：</span><span>{{tempCustome}}</span></p>
					</div>
					
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
			 v-if="enterpriseTypeID != 1"
			 prop="cateringName" 
			 label="餐饮公司" 
			 min-width="120">
			</el-table-column>
			<el-table-column
			 v-if="enterpriseTypeID == 1" 
			 prop="enterpriseName" 
			 label="客户名称" 
			 min-width="120" 
			 >
			</el-table-column>
			<el-table-column 
			 prop="customerName"
			 label="用户名称" 
			 min-width="120" 
			 >
			</el-table-column>
			<el-table-column 
			 prop="canteenName" 
			 label="门店名称" 
			 min-width="120" 
			 >
			</el-table-column>
			<el-table-column 
			 prop="payTypeName" 
			 label="支付方式" 
			 min-width="120" 
			 >
			</el-table-column>
			<el-table-column 
			 prop="consumingTypeName" 
			 label="流水类型" 
			 min-width="120" 
			 >
			</el-table-column>
			<el-table-column 
			 prop="price" 
			 label="金额" 
			 min-width="120" 
			 >
			</el-table-column>
			<el-table-column 
			 prop="operateTime" 
			 label="时间" 
			 min-width="180" 
			 >
			</el-table-column>
		</el-table>

		<!--工具条(分页)-->
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
	import configUrl from '../../common/js/url.js'
	export default {
		data() {
			return {
				filters: {
					enterpriseID:null,
					canteenID:null,
					cateringID: null,
					startTime: '',
					endTime: '',
					payTypeID: null,
					consumingTypeID: null,
					// canteenName: this.canteenName,
					pageSize: 10,
					currentPage: 1
				},
				timer:[],//查询时间
				// start_time:'',//开始时间
				// end_time:'',//结束时间
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
				payType:[],
				flowType:[],
				canteenName:'',//门店
				tableData: [],//列表数据
				storeData:[],//门店数据
				customerData:[],//客户数据
				total: 0,
				listLoading: false,
				sels: [],//列表选中列
				turnOver:0,//营业额
				refundMoney:0,//退款
				totalPeople:0,//总的就餐人数
				enterpriseCustome:0,//员工就餐数据
				tempCustome:0,//临时就餐数据
				payTypeData:{},//支付方式数据
				exportUrl:'',
				//操作按钮
				checkBtn: false,
				enterpriseTypeID: null,
			}
		},
		mounted() {
			this.filters.cateringID = JSON.parse(localStorage.getItem('user')).enterpriseID;
			this.enterpriseTypeID = JSON.parse(localStorage.getItem('user')).enterpriseTypeID;
			this.getBtn();
			this.getStore();
			this.getCustomersList();
			this.getPayType();
			this.getConsumingType();
			
			this.initTime();
			this.initData();
			

		},
		methods: {
			//操作按钮是否显示
            getBtn() {
                let permissions = JSON.parse(localStorage.getItem('user')).permissions;
                if(permissions.indexOf('411') > -1) {
                    this.checkBtn = true;
                }
			},
			//获取当前登陆用户可操作门店
            getStore() {
                let para = {
                    enterpriseID: this.filters.cateringID,
                    canteenID: JSON.parse(localStorage.getItem('user')).canteenID,
                    userID: JSON.parse(localStorage.getItem('user')).userID
                }
                this.$post('/canteens/operable',para).then(res => {
                    // console.log('操作门店',res.data);
                    if(res.state) {
						this.storeData = res.data; 
						let obj = {
							canteenID: null,
							canteenName: '全部'
						}
						this.storeData.unshift(obj);
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
                    this.filters.canteenID = JSON.parse(localStorage.getItem('user')).canteenID;
                    // this.initData();
                } else {
                    // this.initData();
                }
            },
			handleCurrentChange(val) {
				this.filters.currentPage = val;
				this.getTableList();
			},
			search() {
				this.filters.currentPage = 1;
				this.initData();
				return


				if(this.payTypeValue == 0) this.payTypeValue = null;
				if(this.flowTypeValue == 0) this.flowTypeValue = null;
				let para = {
					enterpriseID: this.enterpriseID,
					startTime: this.start_time,
					endTime: this.end_time,
					price: this.payTypeValue,
					consumingTypeID: this.flowTypeValue,
					enterpriseName: this.enterpriseName,
					canteenName: this.canteenName,
					pageSize: this.pageSize,
					currentPage: this.currentPage
				}
				console.log('查询条件',para)
				this.$post('/consumingRecords',para).then(res => {
					console.log('res',res)
					if(this.currentPage > 1) {
						if(!res.data) {
							this.currentPage = this.currentPage - 1;
							this.search();
						}
					}
					this.tableData = res.data.list;
					this.total = res.data.total;
				})
				//获取营业额
				this.$post('/consumingRecords/enterpriseBusinessVolumeAnalysis',para).then(res => {
					// console.log('营业额',res.data)
					this.turnOver = res.data.totalMoney;
					this.refundMoney = res.data.refundMoney;
				})
				//获取支付方式数据
				this.$post('/consumingRecords/enterprisePayTypeAnalysis',para).then(res => {
					// console.log('支付方式分析',res);
					let obj = res.data;
					let keyMap = {
						'cash': '现金',
						'wechat': '微信',
						'welfare': '福利金'
					}
					for(var key in obj){
						var newKey = keyMap[key];
						if(newKey){
							obj[newKey] = obj[key];
							delete obj[key];
						}
					}
					this.payTypeData = obj;
				})
				//获取就餐用户类型分析数据
				this.$post('/consumingRecords/enterpriseCustomerAnalysis',para).then(res => {
					console.log('就餐用户类型分析数据',res)
					this.enterpriseCustome = res.data.enterpriseCustome;
					this.tempCustome = res.data.tempCustome;
					this.totalPeople = this.enterpriseCustome + this.tempCustome;
				})
			},
			//获取日期
			getDate() {
				if(typeof this.timer == undefined) return;
				if(typeof this.timer == 'object') {
					console.log(typeof this.timer[0])
					if(typeof this.timer[0] == 'object') {
						console.log('哈哈哈哈',this.timer)
						if(this.timer[0] == null && this.timer[1] == null){
							console.log('null')			
						} else {
							this.filters.startTime = util.formatDate.format(this.timer[0]);
							this.filters.endTime = util.formatDate.format(this.timer[1]);
							
						}
					}
				}	
			},
			//获取支付方式
			getPayType() {
				this.$fetch('/config/payType').then(res => {
					if(res.state) {
						this.payType = res.data;
						let obj = {
							payTypeID: null,
							payTypeName: '全部'
						}
						this.payType.unshift(obj);
						
					}
				})
			},
			//获取流水类型
			getConsumingType() {
				this.$fetch('/config/consumingType').then(res => {
					if(res.state) {
						res.data.splice(2,3);
						this.flowType = res.data;
						let obj = {
							consumingTypeID: null,
							consumingTypeName: '全部'
						}
						if(this.flowType.length > 1) {
							this.flowType.unshift(obj);
						}
					}
					
				})
			},
			//获取客户
			getCustomersList() {
				this.$fetch('/enterprises/' + this.filters.cateringID).then(res => {
					console.log('客户数据',res)
                    if(res.state) {
						this.customerData = res.data;
						let obj = {
							enterpriseID: null,
							enterpriseName: "全部"
						}
						this.customerData.unshift(obj);
						
                    }
                })
			},
			//初始化
			initTime() {
				//初始化时间
				let start_time = util.formatDate.getCurrentMonthFirst();
				start_time = util.formatDate.format(start_time);//获取当月的1号
				let end_time = util.formatDate.getDay(1);//获取当天日期
				this.filters.startTime = start_time;
				this.filters.endTime = end_time;
				this.timer.push(start_time);
				this.timer.push(end_time);
			},
			//初始化页面数据
			initData() {
				this.getPayTypeData();
				this.getCustomersData();
				this.getTableList();
				this.getTurnover();
			},
			//获取消费流水
			getTableList() {
				console.log(this.filters)
				this.$post('/consumingRecords',this.filters).then(res => {
					console.log('res',res)
					if(res.state) {
						if(this.filters.currentPage > 1) {
							if(!res.data) {
								this.filters.currentPage = this.filters.currentPage - 1;
								this.getTableList();
								return;
							}
						}
						this.tableData = res.data.list;
						this.total = res.data.total;
					} else {
						this.$message.error(res.msg);
					}
					
				})
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//获取营业额
			getTurnover() {
				this.$post('/consumingRecords/enterpriseBusinessVolumeAnalysis',this.filters).then(res => {
					console.log('营业额',res.data)
					this.turnOver = res.data.totalMoney;
					this.refundMoney = res.data.refundMoney;
				})
			},
			//获取支付方式数据
			getPayTypeData() {
				this.$post('/consumingRecords/enterprisePayTypeAnalysis',this.filters).then(res => {
					console.log('支付方式分析',res);
					if(res.state) {
						let obj = res.data;
						let keyMap = {
							'cash': '现金',
							'wechat': '微信',
							'welfare': '福利金'
						}
						for(var key in obj){
							var newKey = keyMap[key];
							if(newKey){
								obj[newKey] = obj[key];
								delete obj[key];
							}
						}
						this.payTypeData = obj;
					}
				})
			},
			//获取就餐用户类型分析数据
			getCustomersData() {
				this.$post('/consumingRecords/enterpriseCustomerAnalysis',this.filters).then(res => {
					console.log('就餐用户类型分析数据',res)
					if(res.state) {
						this.enterpriseCustome = res.data.enterpriseCustome;
						this.tempCustome = res.data.tempCustome;
						this.totalPeople = this.enterpriseCustome + this.tempCustome;
					}
					
				})
			},
			//导出
			exportBtn() {
				this.$post('/consumingRecords/exportLink',this.filters).then(res => {
					var a = document.createElement('a');
					a.setAttribute('href',configUrl.url + res);
					var body=document.querySelector('body');
					body.appendChild(a);
					a.click();
				})
			}

		},
		
	}

</script>

<style lang='scss'>
	.el-form--inline {
		.type {
			width: 172px;
			.el-form-item__content {
				width: 55%;
			}
		}
	}
	
</style>