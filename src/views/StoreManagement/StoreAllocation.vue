<template>
	<section>
        <!-- 门店配置 -->
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="请输入门店名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-if="checkBtn" v-on:click="search">查询</el-button>
				</el-form-item>
				<el-form-item v-if="addBtn">
					<el-button type="primary"  v-on:click="handleAdd">新增</el-button>
				</el-form-item>
				<el-form-item v-if='deleBtn'>
                    <el-button type="danger"  @click="batchRemove" :disabled="this.sels.length < 2">批量删除</el-button>
                </el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table 
		 :data="tableData" 
		 highlight-current-row 
		 v-loading="listLoading" 
		 @selection-change="selsChange" 
		 style="width: 100%;" >
			<el-table-column 
			 type="selection" 
			 width="55">
			</el-table-column>
			<el-table-column
			 align="center"
			 label="序号" 
			 width="100">
				<template slot-scope="scope">
					<span>{{scope.$index+(currentPage - 1) * pageSize + 1}} </span>
				</template>
			</el-table-column>
            <el-table-column 
			 prop="canteenName" 
			 label="门店名称" 
			 width="120">
			</el-table-column>
			<el-table-column 
			 prop="cateringName" 
			 label="餐饮公司" 
			 min-width="80">
			</el-table-column>
			<el-table-column 
			 prop="enterpriseName" 
			 label="甲方客户" 
			 min-width="80" 
			 >
			</el-table-column>
			<el-table-column 
			 prop="note" 
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
		 class="addDialogStore"
        >
            <template slot="content">
                <el-form :model="form" label-width="120px" :rules="rules" ref="form">
                    <el-form-item label="门店名称" prop="canteenID">
						<el-select v-model="form.canteenID" placeholder="请选择门店">
							<el-option
							v-for="item in storeData"
							:key="item.canteenID"
							:label="item.canteenName"
							:value="item.canteenID">
							</el-option>
						</el-select>
                    </el-form-item>
					<el-form-item label="餐饮公司" prop="cateringID">
						<el-select v-model="form.cateringID" placeholder="请选择餐饮公司">
							<el-option
							v-for="item in caterData"
							:key="item.cateringID"
							:label="item.cateringName"
							:value="item.cateringID">
							</el-option>
						</el-select>
                    </el-form-item>
					<el-form-item label="甲方客户" prop="enterpriseID">
						<el-select v-model="form.enterpriseID" placeholder="请选择甲方客户">
							<el-option
							v-for="item in customerData"
							:key="item.enterpriseID"
							:label="item.enterpriseName"
							:value="item.enterpriseID">
							</el-option>
						</el-select>
                    </el-form-item>
                    <el-form-item label="说明">
                        <el-input type="textarea" v-model="form.note"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <template slot="foot">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button v-if='isAdd == true' type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
                <el-button v-if='isAdd == false' type="primary" @click.native="editSubmit" :loading="addLoading">提交</el-button>
            </template>
        </I-table-editor>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import ITableEditor from '../../components/Table/TableEditor.vue'

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				tableData: [],//列表数据
				title:'',//新增、编辑标题
				addFormVisible: false,//新增弹框显示
				isAdd: false,
				total: 0,
				currentPage: 1,
				pageSize:10,
				listLoading: false,
				sels: [],//列表选中列
				form: {
					canteenID:0,
					cateringID:0,
					enterpriseID:0,
					note:''
				},
				rules: {
                    canteenID: [
                        { required: true, message: '请选择门店' }
					],
					cateringID: [
						{ required: true, message: '请选择餐饮公司' }
					],
					enterpriseID: [
						{ required: true, message: '请选择甲方客户'}
					]
					
				},
				addLoading: false,
				enterpriseID: 0,
				storeData:[],//门店列表数据
				caterData:[
					{
						cateringID: 0,
						cateringName: ''
					}
				],//餐饮公司数据
				customerData:[],//甲方客户数据
				//操作按钮
                checkBtn: false,
                editBtn: false,
                deleBtn: false,
                addBtn: false,

			}
		},
		mounted() {
			this.enterpriseID = JSON.parse(localStorage.getItem('user')).enterpriseID;
			this.init();
			this.getBtn();
			this.getStoreList();
			this.getCompanyList();
			this.getCaterList();
		},
		methods: {
			//操作按钮是否显示
            getBtn() {
                let permissions = JSON.parse(localStorage.getItem('user')).permissions;
                if(permissions.indexOf('211') > -1) {
                    this.checkBtn = true;
                }
                if(permissions.indexOf('212') > -1) {
                    this.addBtn = true;
                }
                if(permissions.indexOf('213') > -1) {
                    this.deleBtn = true;
                }
                if(permissions.indexOf('214') > -1) {
                    this.editBtn = true;
                }
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.init();
			},
			//初始化
			init() {
				this.$fetch('/settlementCycles/' + this.enterpriseID + '/' + this.currentPage + '/' + this.pageSize).then(res => {
					if(res.state) {
						console.log('初始化',res.data)
						if(this.currentPage > 1) {
							if(!res.data) {
								this.currentPage = this.currentPage - 1
								this.init()
								return;
							}
						}
						this.tableData = res.data.list;
						this.total = res.data.total;
					}
				})
			},
			//查询
			search() {
				console.log(this.filters.name)
				if(!this.filters.name) {
					this.init();
					return;
				}
				this.$fetch('/settlementCycle/' + this.enterpriseID + '/' + this.filters.name).then(res => {
					console.log(res)
					if(res.state) {
						this.tableData = res.data;
					}
				})
			},
			//获取门店数据
			getStoreList() {
				this.$fetch('/canteens/' + this.enterpriseID).then(res => {
					// console.log('门店',res.data)
					this.storeData = res.data;
				})
			},
			//获取餐饮公司
			getCaterList() {
				this.$fetch('/enterprise/' + this.enterpriseID).then(res => {
					console.log('餐饮公司',res)
					if(res.state) {
						this.caterData[0].cateringID = res.data.enterpriseID;
						this.caterData[0].cateringName = res.data.enterpriseName;
					}
				})
			},
			//获取甲方客户
			getCompanyList() {
				this.$fetch('/enterprises/' + this.enterpriseID).then(res => {
					if(res.state) {
						for(let i = 0, len = res.data.length; i < len; i ++) {
							if(res.data[i].enterpriseTypeID == 2) {
								this.customerData.push(res.data[i]);
							}
						}
						// console.log('甲方客户',this.customerData);
					}
				})
			},
			//弹框关闭
			closeDialog() {
				this.$refs['form'].resetFields();
			},
			//显示新增窗口
			handleAdd() {
				this.addFormVisible = true;
				this.title = '新增';
				this.isAdd = true;
				this.form = {
					canteenID:'',
					cateringID: this.caterData[0].cateringID,
					enterpriseID:'',
					note:''
				}
				console.log(this.form)
			},
			//显示编辑窗口
			handleEdit(index,val) {
				console.log(val)
				this.form = Object.assign({},val);
				this.addFormVisible = true;
				this.title = '编辑';
				this.isAdd = false;
			},
			//确认新增
			addSubmit() {
				this.$refs.form.validate((valid) => {
					if(valid) {
						this.$confirm('确认提交吗？','提示',{}).then(() => {
							let para = Object.assign({},this.form);
							para.cycle = '';
							console.log('确认提交的数据',this.form)
							this.$post('/settlementCycle',para).then(res => {
								console.log(res)
								if(res.state) {
									this.$message.success('新增成功');
									this.addFormVisible = false;
									this.$refs['form'].resetFields();
									this.init();
								}
							})
						})
					}
				})
			},
			//确认编辑
			editSubmit() {
				this.$refs.form.validate((valid) => {
					if(valid) {
						this.$confirm('确认提交吗？','提示',{}).then(() => {
							console.log('确认提交的数据',this.form)
							this.$put('/settlementCycle',this.form).then(res => {
								console.log(res)
								if(res.state) {
									this.$message.success('修改成功');
									this.addFormVisible = false;
									this.init();
								}
							})
						})
					}
				})
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					// this.listLoading = true;
					this.$remove('/settlementCycle/' + row.settlementCycleID).then(res => {
						if(res.state) {
							this.$message.success('删除成功');
							this.init();
						}
					})
				}).catch(() => {

				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.settlementCycleID).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					// this.listLoading = true;
					this.$remove('/settlementCycles/' + ids).then(res => {
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
	.addDialogStore {
		.el-dialog {
			width: 740px;
			border-radius: 12px;
			.el-dialog__body {
				.el-form {
					width: 60%;
					margin: 0 auto;
					.el-select {
						width: 100%;
					}
				}
				.el-form-item__label {
					font-weight: bold;
					font-size: 16px;
				}
				.el-select-dropdown__item.selected.hover {
					background: #fff;
				}
			}
		}
	}
</style>