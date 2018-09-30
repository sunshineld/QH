<template>
	<section>
        <!-- 结算单 -->
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<!-- <el-input v-model="filters.name" placeholder=""></el-input> -->
					<el-date-picker
					v-model="timer"
					type="daterange"
					align="right"
					unlink-panels
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					@change="getDate"
					:picker-options="pickerOptions">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="状态" class="type">
					<el-select v-model="filters.stateID" placeholder="请选择">
						<el-option
						v-for="item in stateType"
						:key="item.stateID"
						:label="item.state"
						:value="item.stateID">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="门店名称">
					<el-select v-model="filters.canteenID" placeholder="请选择">
						<el-option
						v-for="item in storeData"
						:key="item.canteenID"
						:label="item.canteenName"
						:value="item.canteenID">
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
				<el-form-item>
					<el-button type="primary" v-if="checkBtn" @click="search">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!-- 数据展示-->
		<ul class="dataPlay">
			<li>
				<div class="title">
					<p>金额</p>
					<p>￥{{totalMoney}}</p>
				</div>
				<div class="list">
					<div>
						<p><span>已完成：</span><span>{{did}}</span></p>
						<p><span>未完成：</span><span>{{doing}}</span></p>
					</div>
				</div>
			</li>
			<li>
				<div class="title">
					<p>对账单笔数</p>
					<p>{{counts}}笔</p>
				</div>
				<div class="list">
					<div>
						<p><span>现金：</span><span>{{cash}}</span></p>
						<p><span>微信：</span><span>{{wechart}}</span></p>
						<p><span>福利金：</span><span>{{welfare}}</span></p>
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
			 prop="canteenName" 
			 label="门店名称" 
			 width="100"
			 >
			</el-table-column>
			<el-table-column 
			 prop="statementAccountNum" 
			 label="结算单号"
			 width="350" 
			 >
			</el-table-column>
			<el-table-column 
			 prop="amountOfMoney"
			 label="结算金额" 
			 width="120"
			 >
			</el-table-column>
			<el-table-column 
			 prop="enterpriseName"
			 label="结算对象"
			 width="120" 
			 >
			</el-table-column>
			<el-table-column 
			 prop="state" 
			 label="结算状态"
			 width="120" 
			 >
			 </el-table-column>
			 <el-table-column 
			 prop="payTypeName" 
			 label="类型"
			 width='100' 
			 >
			</el-table-column>
			<el-table-column 
			 prop="operateDate" 
			 label="时间" 
			 width="200"
			 >
			</el-table-column>
            <el-table-column
			 v-if='checkBtn || faqiBtn || statementBtn || payBtn || collectBtn || finishBtn' 
			 label="操作" 
			 width="300"
			 >
			 <template slot-scope="scope">
				 <el-button @click="handleCheck(scope.row)" type="primary" size="small" v-if="checkBtn">查看</el-button>
				 <el-button @click="handlePrint(scope.row)" type="primary" size="small" v-if="checkBtn">打印</el-button>
				 <el-button @click='handleAccount(scope.row)' type="primary" size="small"  v-if="faqiBtn && enterpriseTypeID == 1 && scope.row.stateID == 1">发起对账</el-button>
				 <el-button @click='handleAccount(scope.row)' type="primary" size="small"  v-if="statementBtn && enterpriseTypeID != 1 && scope.row.stateID == 2" >确认对账</el-button>
				 <el-button @click='handleAccount(scope.row)' type="primary" size="small"  v-if="payBtn && enterpriseTypeID != 1 && scope.row.stateID == 3">确认付款</el-button>
				 <el-button @click='handleAccount(scope.row)' type="primary" size="small"  v-if="collectBtn && enterpriseTypeID == 1 && scope.row.stateID == 4">确认收款</el-button>
				 <el-button @click='handleAccount(scope.row)' type="primary" size="small" :disabled="scope.row.stateID == 5"  v-if="finishBtn && enterpriseTypeID == 1 && scope.row.stateID == 5">已完成</el-button>
			 </template>
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
		<!-- 查看 -->
		<I-table-editor
		 title="查看结算单"
		 v-model="checkSettlementVisible"
		 class="checkDailog"
		>
			<template slot="content">
				<el-table
				:data="checkData1"
				style="width: 100%">
				<el-table-column
					prop="date"
					label="结算时间段"
					>
				</el-table-column>
				<el-table-column
					prop="enterpriseName"
					label="结算对象"
					>
				</el-table-column>
				<el-table-column
					prop="amountOfMoney"
					label="金额">
				</el-table-column>
				</el-table>
				<div style="background:#f4f3ef;height:36px;
				    line-height:36px;font-size:18px;
					font-weight:bold;padding-left:20px;
					margin-bottom:30px;margin-top:30px;"
				>流水明细<el-button type="primary" size="middle" style="margin-left:10px;" @click="exportBtn">导出明细</el-button></div>
				<el-table
				:data="checkData2"
				height="300"
				style="width: 100%">
				<el-table-column
					prop="enterpriseName"
					label="客户名称"
					>
				</el-table-column>
				<el-table-column
					prop="customerName"
					label="用户名称"
					>
				</el-table-column>
				<el-table-column
					prop="canteenName"
					label="门店名称">
				</el-table-column>
				<el-table-column
					prop="payTypeName"
					label="支付方式">
				</el-table-column>
				<el-table-column
					prop="consumingTypeName"
					label="流水类型">
				</el-table-column>
				<el-table-column
					prop="price"
					label="金额">
				</el-table-column>
				</el-table>
			</template>
			
		</I-table-editor>
		<!-- 打印 -->
		<I-table-editor
		 title='打印结算单'
		 v-model="printVisible"
		 class="printDailog"
		>
			<template slot="content">
				<div id="printContent">
					<div class="title">
						<p>{{operateDate}}</p>
						<p>结算单</p>
					</div>
					<div class="middle">
						<div class="text">
							<p>门店名称：{{canteenName}}</p>
							<p>结算单号：{{statementAccountNum}}</p>
						</div>
						<!-- <div class="code">
							<img src="../../assets/qh_logo.png" alt="">
						</div> -->
					</div>
					<div class="tableList">
						<el-table
						:data="printData"
						style="width: 100%">
						<el-table-column
							prop="enterpriseName"
							label="结算对象"
							min-width="180">
						</el-table-column>
						<el-table-column
							prop="payTypeName"
							label="类型"
							min-width="180">
						</el-table-column>
						<el-table-column
							prop="amountOfMoney"
							label="金额"
							min-width="180">
						</el-table-column>
						</el-table>
					</div>
				</div>
				<div class="foot">
					<el-button type="primary" @click="print">
						<img src="../../assets/printer.png" height="20px" style="vertical-align: middle;margin-right:4px;"/>
						立即打印
					</el-button>
					<!-- <el-button style="color:#20A2FF;border-color:#20A2FF">
						<img src="../../assets/download.png" height="20px" style="vertical-align: middle;"/>
						下载
					</el-button> -->
				</div>
			</template>
		</I-table-editor>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import ITableEditor from '../../components/Table/TableEditor.vue'
	//import NProgress from 'nprogress'
	import configUrl from '../../common/js/url.js'
	export default {
		data() {
			return {
				filters: {
					enterpriseID: null,
					startDate: '',
					endDate: '',
					canteenID: null,
					payTypeID: null,
					currentPage: 1,
					pageSize: 10,
					stateID: null,
				},
				timer:[],
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
				checkData1:[],//查看结算单数据
				checkData2:[],//查看结算单数据
				printData:[],//打印数据
				total: 0,
				checkSettlementVisible: false,//查看弹框
				listLoading: false,
				printVisible: false,//打印弹框
				sels: [],//列表选中列
				stateID:null,
				stateType:[],
				payTypeID:null,
				payType:[],//支付方式
				canteenID:null,//门店名称
				storeData:[],//门店数据
				
				doing:0,
				did:0,
				totalMoney:0,
				wechart:0,
				welfare:0,
				cash:0,
				counts:0,
				operateDate:'',//时间段
				canteenName:'',//门店名称
				statementAccountNum:'',//结算单号
				payTypeName:'',//结算类型
				detailPara: {},
				//操作按钮
                checkBtn: false,
				editBtn: false,
				faqiBtn: false,//发起对账
                statementBtn: false,//确认对账
                payBtn: false,//确认付款
                collectBtn: false,//确认收款
                finishBtn: false,//完成
				enterpriseTypeID: null,
			}
		},
		mounted() {
			this.filters.enterpriseID = JSON.parse(localStorage.getItem('user')).enterpriseID;
			this.enterpriseTypeID = JSON.parse(localStorage.getItem('user')).enterpriseTypeID;
			this.initTime();
			this.getBtn();
			this.getStore();
			// this.getMoney();
			this.getPayType();
			this.getStateList();
			this.getInitData();
		},
		methods: {
			//操作按钮是否显示
            getBtn() {
                let permissions = JSON.parse(localStorage.getItem('user')).permissions;
                if(permissions.indexOf('421') > -1) {
                    this.checkBtn = true;
                }
                if(permissions.indexOf('422') > -1) {
                    this.faqiBtn = true;//发起对账
				}
				if(permissions.indexOf('423') > -1) {
                    this.statementBtn = true;//确认对账
				}
				if(permissions.indexOf('424') > -1) {
                    this.payBtn = true;//确认付款
				}
				if(permissions.indexOf('425') > -1) {
                    this.collectBtn = true;//确认收款
				}
				if(permissions.indexOf('426') > -1) {
                    this.finishBtn = true;//完成
                }
			},
			//获取当前登陆用户可操作门店
            getStore() {
                let para = {
                    enterpriseID: this.filters.enterpriseID,
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
						
                    } else {
                        this.$message.error(res.msg);
                    }
                })
            },
			handleCurrentChange(val) {
				this.filters.currentPage = val;
				this.getSettlementData();
			},
			//打印弹框显示
			handlePrint(val) {
				this.printData = [];
				this.printVisible = true;
				let date = val.operateDate.split('-');
				console.log(date)
				this.operateDate = date[0] + '年' + date[1] + '月' + date[2].substring(0,2) + '日' + date[2].substring(3);
				this.canteenName = val.canteenName;
				this.statementAccountNum = val.statementAccountNum;
				let obj = {
					payTypeName: val.payTypeName,
					enterpriseName:val.enterpriseName,
					amountOfMoney:val.amountOfMoney
				}
				this.printData.push(obj);
			},
			//立即打印
			print() {
				var div_print = document.getElementById('printContent');
				var newStr = div_print.innerHTML;
				var oldStr = document.body.innerHTML;
				document.body.innerHTML = newStr;
				window.print();
				window.location.reload();
				document.body.innerHTML = oldStr;
				return false;
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//获取日期
			getDate() {
				if(typeof this.timer == undefined) return;
				if(typeof this.timer == 'object') {
					console.log(typeof this.timer[0])
					if(typeof this.timer[0] == 'object') {
						if(this.timer[0] == null && this.timer[1] == null){
							// console.log('null')			
						} else {
							this.filters.startDate = util.formatDate.format(this.timer[0]);
							this.filters.endDate = util.formatDate.format(this.timer[1]);
						}
					}
				}	
			},
			//获取状态
			getStateList() {
				this.$fetch('/config/statementAccountState').then(res => {
					// console.log(res)
					if(res.state) {
						this.stateType = res.data;
						let obj = {
							stateID: null,
							state: '全部'
						}
						if(this.stateType.length > 1) {
							this.stateType.unshift(obj);
						}
					}
				})
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
			//查询
			search() {
				this.filters.currentPage = 1;
				this.getInitData();
				return
				if(!this.stateID) this.stateID = null;
				if(!this.canteenID) this.canteenID = null;
				if(!this.payTypeID) this.payTypeID = null;
				let para = {
					enterpriseID: this.enterpriseID,
					startDate: this.start_time,
					endDate: this.end_time,
					canteenID: this.canteenID,
					stateID: this.stateID,
					payTypeID: this.payTypeID,
					currentPage: this.currentPage,
					pageSize: this.pageSize
				}
				this.$post('/statementAccount',para).then(res => {
					console.log('结算单列表数据',res)
					if(res.state) {
						if(res.state) {
							if(this.currentPage > 1) {
								if(!res.data) {
									this.currentPage = this.currentPage - 1;
									this.search();
								}
							}
							this.tableData = res.data.list;
							this.total = res.data.total;
						}
					}
				})
				this.$post('/statementAccount/counts',para).then(res => {
					console.log('金额',res)
					this.did = res.data.did;
					this.doing = res.data.doing;
					this.totalMoney = res.data.totalMoney;
					this.wechart = res.data.wechart;
					this.welfare = res.data.welfare;
					this.cash = res.data.cash;
					this.counts = res.data.counts;
				})
			},
			//初始化时间
			initTime() {
				// let para = this.getParameter();
				let start_time = util.formatDate.getCurrentMonthFirst();
				start_time = util.formatDate.format(start_time);//获取当月的1号
				let end_time = util.formatDate.getDay(1);//获取当天日期
				this.filters.startDate = start_time;
				this.filters.endDate = end_time;
				this.timer.push(start_time);
				this.timer.push(end_time);
				
			},
			//获取初始化页面数据
			getInitData() {
				this.getSettlementData();
				this.getMoney();
			},
			//获取结算单数据
			getSettlementData() {
				console.log('............',this.filters)
				this.filters.enterpriseTypeID = JSON.parse(localStorage.getItem('user')).enterpriseTypeID;
				this.$post('/statementAccount',this.filters).then(res => {
					console.log('结算单列表数据',res)
					if(res.state) {
						if(this.currentPage > 1) {
							if(!res.data) {
								this.filters.currentPage = this.filters.currentPage - 1;
								this.getSettlementData();
								return;
							}
						}
						this.tableData = res.data.list;
						this.total = res.data.total;
					}
				})
			},
			//获取金额
			getMoney() {
				// let para = this.getParameter();
				this.$post('/statementAccount/counts',this.filters).then(res => {
					console.log('金额',res)
					this.did = res.data.did;
					this.doing = res.data.doing;
					this.totalMoney = res.data.totalMoney;
					this.wechart = res.data.wechart;
					this.welfare = res.data.welfare;
					this.cash = res.data.cash;
					this.counts = res.data.counts;
				})
			},
			//初始参数
			getParameter() {
				this.start_time = util.formatDate.getCurrentMonthFirst();
				this.start_time = util.formatDate.format(this.start_time);//获取当月的1号
				this.end_time = util.formatDate.getDay(1);//获取当天日期
				let para = {
					enterpriseID: this.enterpriseID,
					startDate: this.start_time,
					endDate: this.end_time,
					canteenID: this.canteenID,
					payTypeID: this.payTypeID,
					currentPage: this.currentPage,
					pageSize: this.pageSize
				}
				return para;
			},
			//对账按钮
			handleAccount(row) {
				// console.log('对账',row)
				let para = {
					statementAccountNum: row.statementAccountNum,
					stateID: row.stateID + 1,
					operator: JSON.parse(localStorage.getItem('user')).contacts,
					button: row.button
				}
				// console.log('参数',para);
				// return;
				this.$put('/statementAccount',para).then(res => {
					console.log('-------',res);
					if(res.state) {
						this.$message.success(res.msg);
						this.getSettlementData();
					}
				})
			},
			//查看
			handleCheck(row) {
				this.checkData1 = [];
				this.checkSettlementVisible = true;
				console.log(row);
				this.detailPara = row;
				let obj = {
					date: row.startDate + '~' + row.endDate,
					enterpriseName:row.enterpriseName,
					amountOfMoney:row.amountOfMoney
				}
				this.checkData1.push(obj);
				let para = {
					canteenID: row.canteenID,
					startDate: row.startDate,
					endDate: row.endDate,
					cateringID: row.cateringID,
					enterpriseID: row.enterpriseID,
					payTypeName: row.payTypeName
				}
				console.log('==============',para)
				this.$post('/consumingRecords',para).then(res => {
					console.log(res);
					if(res.state) {
						this.checkData2 = res.data.list;
					}
				})
			},
			exportBtn() {
				let para = {
					canteenID: this.detailPara.canteenID,
					startTime: this.detailPara.startDate,
					endTime: this.detailPara.endDate,
					cateringID: this.detailPara.cateringID,
					enterpriseID: this.detailPara.enterpriseID,
					payTypeName: this.detailPara.payTypeName
				}
				console.log(para)
				this.$post('/consumingRecords/exportLink',para).then(res => {
					var a = document.createElement('a');
					a.setAttribute('href',configUrl.url + res);
					var body=document.querySelector('body');
					body.appendChild(a);
					a.click();
				})
			}
		},
		components: {
			ITableEditor
		}
		
	}

</script>

<style lang='scss'>
	ul.dataPlay {
		li:nth-child(1) {
			div.first {
				margin-top: 54px;
				
			}
		}
	} 
	//查看  单独发放样式
	.checkDailog, .aloneGrantDailog {
		.el-dialog--small {
			width: 764px;
			.el-table {
				border: 0;
			}
			.el-table th.is-leaf {
				border: 0;
			}
			.el-table th,.el-table__header-wrapper thead div {
				background: #f4f3ef;
			}
			.el-table::after, .el-table::before {
				background-color: #fff;
			}
			div.cell {
				text-align: center;
			}
			.el-table:first-child {
				div.cell {
					font-size: 16px;
				}
			}
		}
	}
	//打印弹框样式
	.printDailog {
		.el-dialog {
			width: 740px;
			div.title {
				p {
					display: inline-block;
				}
				p:nth-child(1) {
					width: 20%;
				}
				p:nth-child(2) {
					width:57%;
					text-align: center;
				}
			}
			div.middle {
				overflow: hidden;
				margin-bottom: 20px;
				.text {
					float: left;
					height: 100px;
					p:nth-child(1) {
						margin-top: 23px;
					}
				}
				.code {
					float: right;
					width: 100px;
					height: 100px;
					line-height: 100px;
					text-align: center;
					background: gray;
					color: #fff;
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
			div.foot {
				text-align: center;
				margin-top: 200px;
			}
		}
	}
	//打印样式
	@media print {
		div.title {
				p {
					display: inline-block;
				}
				p:nth-child(1) {
					width: 20%;
				}
				p:nth-child(2) {
					width:57%;
					text-align: center;
				}
			}
			div.middle {
				overflow: hidden;
				margin-bottom: 20px;
				.text {
					float: left;
					height: 100px;
					p:nth-child(1) {
						margin-top: 23px;
					}
				}
				.code {
					float: right;
					width: 100px;
					height: 100px;
					line-height: 100px;
					text-align: center;
					background: gray;
					color: #fff;
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
	//导出样式
	.exportBtn {
		display: inline-block;
		width: 80px;
		height: 30px;
		line-height: 30px;
		text-align: center;
		font-size: 15px;
		text-decoration: none;
		background: #20a0ff;
		color: #fff;
		border-radius: 4px;
		margin-left: 10px;
	}
</style>