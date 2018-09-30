<template>
	<section>
        <!-- 福利卡发放 -->
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" v-if="editBtn" @click="handleAloneGrant">单独发放</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-if="editBtn" @click="handleBatchGrant">批量发放</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table 
		 :data="tableData" 
		 highlight-current-row 
		 v-loading="listLoading" 
		 @selection-change="selsChange" 
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
			 prop="welfareTypeName" 
			 label="福利类型" 
			 >
			</el-table-column>
			<el-table-column 
			 prop="price" 
			 label="金额（元）" 
			 >
			</el-table-column>
			<el-table-column 
			 prop="oprator" 
			 label="操作员" 
			 >
			</el-table-column>
            <el-table-column 
			 label="操作" 
			 v-if='checkBtn'
			 >
			 <template slot-scope="scope">
				 <el-button type="primary" size="small" v-if="checkBtn" @click='handleCheck(scope.row)'>查看</el-button>
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
		<!-- 单独/批量发放 -->
		<I-table-editor
		 :title="title"
		 v-model="aloneGrantVisible"
		 @dialogVisibleClose='closeDialog'
		 class="aloneGrantDailog"
		>
			<template slot="content">
				<el-input placeholder="请输入员工姓名" v-model="name" v-if='isAlone'></el-input>
				<el-select clearable v-model="departmentID" placeholder="请选择部门" v-if='!isAlone' class="searchContent">
					<el-option
					v-for="item in departmentData"
					:key="item.departmentID"
					:label="item.departmentName"
					:value="item.departmentID">
					</el-option>
				</el-select>
				<el-select clearable v-model="positionID" placeholder="请选择职位" v-if='!isAlone' class="searchContent">
					<el-option
					v-for="item in positionData"
					:key="item.positionID"
					:label="item.positionName"
					:value="item.positionID">
					</el-option>
				</el-select>
				<el-select clearable v-model="gender" placeholder="请选择性别" v-if='!isAlone' class="searchContent">
					<el-option
					v-for="item in genderData"
					:key="item.label"
					:label="item.label"
					:value="item.label">
					</el-option>
				</el-select>
				<el-button type="primary" @click="searchAlone" v-if='isAlone'>搜索</el-button>
				<el-button type="primary" @click="searchBatch" v-if='!isAlone'>搜索</el-button>
				<el-table
				:data="staffData"
				ref='staffTable'
				@selection-change="selsChangeAlone"
				height="300"
				style="width: 100%">
				<el-table-column 
			 	type="selection" 
			 	width="55">
				</el-table-column>
				<el-table-column
					prop="employeeCode"
					label="工号"
					min-width='80'>
				</el-table-column>
				<el-table-column
					prop="customerName"
					label="姓名"
					min-width='80'>
				</el-table-column>
				<el-table-column
					prop="gender"
					label="性别"
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
				<!-- <el-table-column
					prop="note"
					label="备注">
				</el-table-column> -->
				</el-table>
				<el-form :model="form" :inline="true" v-model="form" :rules="rules" ref="form">
					<el-form-item label="金额" prop='price'>
						<el-input v-model="form.price" type="number"></el-input>
					</el-form-item>
					<el-form-item label="补贴类型" prop="welfareTypeID">
						<el-select v-model="form.welfareTypeID" placeholder="请选择">
							<el-option
							v-for="item in welfareType"
							:key="item.welfareTypeID"
							:label="item.welfareTypeName"
							:value="item.welfareTypeID">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="备注">
						<el-input v-model="form.note"></el-input>
					</el-form-item>
				</el-form>
			</template>
			<template slot="foot">
				<el-button @click='aloneGrantVisible = false'>取消</el-button>
				<el-button type="primary" v-if='isAlone' @click="confirmAloneGrant">确认发放</el-button>
				<el-button type="primary" v-if='!isAlone' @click="confirmBatchGrant">确认发放</el-button>
			</template>
		</I-table-editor>
		<!-- 查看 -->
		<I-table-editor
		 title="发放明细"
		 v-model="checkDetailVisible"
		 v-loading='listLoading'	
		 class="aloneGrantDailog"	
		>
			<template slot="content">
				<el-table
				:data="grantDetailed"
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
					prop="welfareTypeName"
					label="补贴类型"
					width="120">
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
		<!-- 批量发放 -->
		<!-- <I-table-editor
		 title="批量发放"
		 v-model="batchGrantVisible"
		 height='300'
		 class="aloneGrantDailog"
		>
			<template slot="content">
				<el-upload
                    class="upload-demo uploadBtn"
                    :action="url"
                    :data='uploadData'
                    name='file'
                    :on-error="uploadError"
                    :on-success="uploadSuccess"
                    :show-file-list='false'
                    >
                    <el-button type="primary">点击上传</el-button>
                </el-upload>
				<el-table
				:data="staffData"
				height="250"
				style="width: 100%">
				<el-table-column 
			 	type="selection" 
			 	width="55">
				</el-table-column>
				<el-table-column
					prop="name"
					label="姓名"
					min-width='80'>
				</el-table-column>
				<el-table-column
					prop="department"
					label="部门"
					>
				</el-table-column>
				<el-table-column
					prop="position"
					label="职位">
				</el-table-column>
				<el-table-column
					prop="remarks"
					label="备注">
				</el-table-column>
				</el-table>
				<el-form :model="form" :inline="true" v-model="form" :rules="rules" ref="form">
					<el-form-item label="金额" prop='price'>
						<el-input v-model="form.price"></el-input>
					</el-form-item>
					<el-form-item label="补贴类型" prop="welfareTypeID">
						<el-select v-model="form.welfareTypeID" placeholder="请选择">
							<el-option
							v-for="item in welfareType"
							:key="item.welfareTypeID"
							:label="item.welfareTypeName"
							:value="item.welfareTypeID">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="备注">
						<el-input v-model="form.note"></el-input>
					</el-form-item>
				</el-form>
			</template>
			<template slot="foot">
				<el-button @click='batchGrantVisible = false'>取消</el-button>
				<el-button type="primary">确认发放</el-button>
			</template>
		</I-table-editor> -->
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import ITableEditor from '../../components/Table/TableEditor.vue'
	import configUrl from '../../common/js/url.js'
    import { valid } from 'semver';

	export default {
		data() {
			return {
				tableData: [],//列表数据
				aloneGrantVisible: false,//单独发放弹框
				batchGrantVisible: false,//批量发放弹框
				checkDetailVisible: false,//查看明细
				staffData:[],//单独发放员工数据
				value:'1',
				welfareType:[],//补贴类型
				total: 0,
				currentPage: 1,
				pageSize:10,
				listLoading: false,
				sels: [],//列表选中列
				name:'',//搜索名字
				gender:'',//搜索性别
				departmentID:'',//搜索部门
				positionID:'',//搜索职位
				form: {
					price:'',
					welfareTypeID:'',
					note:''
				},
				rules:{
					price: [
						{ required: true, message: '请输入金额', trigger: 'blur' }
					],
					welfareTypeID: [
						{ required: true, message: '请选择补贴类型',}
					]
				},
				enterpriseID: 0,
				downLoadUrl:'',
				url:'',//上传的url
				uploadData:{},//上传附带的参数
				selsAlone:[],//单独发放选中员工
				title: '',//发放的标题
				isAlone: true,//单独发放
				departmentData:[],//部门数据
				positionData:[],//职位数据
				genderData: [
					{
						label:'男'
					},
					{
						label:'女'
					}
				],
				grantDetailed:[],//发放明细数据
				//操作按钮
                checkBtn: false,
                editBtn: false,
			}
		},
		mounted() {
			this.enterpriseID = JSON.parse(localStorage.getItem('user')).enterpriseID;
			this.downLoadUrl = configUrl.url_download + this.enterpriseID;
			this.init();
			this.getBtn();
			this.getStaffList();
			this.getWelfareType();
			this.getDepartmentData();
			this.getPositionData();
		},
		methods: {
			//操作按钮是否显示
            getBtn() {
                let permissions = JSON.parse(localStorage.getItem('user')).permissions;
                if(permissions.indexOf('431') > -1) {
                    this.editBtn = true;
                }
                if(permissions.indexOf('432') > -1) {
					this.checkBtn = true;
                }
            },
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取福利类型
			getWelfareType() {
				this.$fetch('/config/welfareType').then(res => {
					this.welfareType = res.data;
				})
			},
			//获取福利发放操作记录
			init() {
				let consumingTypeID = 4; //福利卡发放（系统配好）
				this.$fetch('/welfareRecord/' + this.enterpriseID + '/'+ consumingTypeID + '/' + this.currentPage + '/' + this.pageSize ).then(res => {
					if(this.currentPage > 1) {
						if(!res.data) {
							this.currentPage = this.currentPage - 1;
							this.init();
						}
					}
					this.tableData = res.data.list;
					this.total = res.data.total;
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
			//获取就餐用户列表
            getStaffList() {
                this.$fetch('/customers/' + this.enterpriseID + '/' + 0 + '/' + 0).then(res => {
                    this.staffData = res.data.list;
                })
            },
			//查看
			handleCheck(row) {
				this.listLoading = true;
				this.$fetch('/consumingRecords/' + row.orderID).then(res => {
					// console.log('详情',res);
					if(res.state) {
						this.grantDetailed = res.data;
						this.checkDetailVisible = true;
						this.listLoading = false;
					}
				})
			},
			//批量发放弹框
			handleBatchGrant() {
				this.aloneGrantVisible = true;
				this.title = '批量发放';
				this.isAlone = false;
				this.departmentID = '';
				this.positionID = '';
				this.gender = '';
				this.selsAlone = [];
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//弹框关闭
			closeDialog() {
				this.$refs['form'].resetFields();
				this.$refs.staffTable.clearSelection();
			},
			//单独发放弹框
			handleAloneGrant() {
				this.title = '单独发放';
				this.isAlone = true;
				this.aloneGrantVisible = true;
				this.name = '';
				this.selsAlone = [];
			},
			//单独发放搜索
			searchAlone() {
				if(this.name == '') {
					this.getStaffList();
				} else {
					this.$fetch('/customer/' + this.enterpriseID + '/' + this.name).then(res => {
						if(res.state) {
							this.staffData = res.data;
						}
					})
				}
				
			},
			//批量发放搜索
			searchBatch() {
				if(this.departmentID == '') this.departmentID = null;
				if(this.positionID == '') this.positionID = null;
				if(this.gender == '') this.gender = null;
				let para = {
					enterpriseID: this.enterpriseID,
					departmentID: this.departmentID,
					positionID: this.positionID,
					gender: this.gender
				}
				this.$post('/customers/moreCondition',para).then(res => {
					if(res.state) {
						this.staffData = res.data;
					}
				})
				
			},
			selsChangeAlone(sels) {
				this.selsAlone = sels;
			},
			//确认发放（单独）
			confirmAloneGrant() {
				this.$refs.form.validate((valid) => {
					if(valid) {
						if(this.selsAlone.length == 0) {
							this.$message.info('请选择员工');
							return;
						} else if(this.selsAlone.length > 1) {
							this.$message.info('只能选择一个员工');
							return;
						}
						let customerID = this.selsAlone.map(item => item.customerID);
						let para = {
							enterpriseID: this.enterpriseID,
							customerIDs: customerID,
							price: Number(this.form.price),
							welfareTypeID: this.form.welfareTypeID,
							oprator: JSON.parse(localStorage.getItem('user')).contacts
						}
						console.log('单独发放参数',para)
						this.$post('/consumingRecords/sending',para).then(res => {
							if(res.state) {
								this.$message.success(res.msg);
								this.aloneGrantVisible = false;
								this.init();
								this.$refs['form'].resetFields();
							}
						})
					}
				})
			},
			//确认发放（批量）
			confirmBatchGrant() {
				this.$refs.form.validate((valid) => {
					if(valid) {
						if(this.selsAlone.length == 0) {
							this.$message.info('请选择员工');
							return;
						}
						let ids = this.selsAlone.map(item => item.customerID);
						let para = {
							customerIDs: ids,
							enterpriseID: this.enterpriseID,
							price: Number(this.form.price),
							welfareTypeID: this.form.welfareTypeID,
							oprator: JSON.parse(localStorage.getItem('user')).contacts
						}
						this.$post('/consumingRecords/sending',para).then(res => {
							if(res.state) {
								this.$message.success(res.msg);
								this.aloneGrantVisible = false;
								this.init();
								this.$refs['form'].resetFields();
							}
						})
					}
				})
			},

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
			.el-input {
				width:50%;
				margin-right: 14px;
			}
			.el-table {
				margin-top: 10px;
				margin-bottom: 20px;
			}
			.el-form--inline {
				.el-input {
					width: 90%;
				}
				.el-form-item:nth-child(2) {
					width: 50%;
					.el-form-item__content {
						width: 50%;
					}
					
				}
				.el-form-item:nth-child(3) {
					.el-input {
						width: 140%;
					}
				}
			}
			.searchContent {
				width: 150px;
				.el-input {
					width: 100%;
				}
			}
			.el-select {
				margin-right: 15px;
			}
		}
	}
	//去掉input type为number的箭头
	input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    input[type="number"]{
        -moz-appearance: textfield;
    }
	.aloneGrantDailog .el-dialog--small .el-table:first-child div.cell {
		font-size: 14px;
	}
</style>