<template>
	<section>
        <!-- 窗口管理 -->
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-select v-model="canteenID" placeholder="请选择门店" @change="storeChange" v-if="!selectBtn">
						<el-option
						v-for="item in storeData"
						:key="item.canteenID"
						:label="item.canteenName"
						:value="item.canteenID">
						</el-option>
					</el-select>
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
			 label="序号"
			 align="center"
			 type="index"
			 width="100">
			</el-table-column>
            <el-table-column 
			 prop="windowName" 
			 label="窗口名称" 
			 width="180">
			</el-table-column>
			<el-table-column 
			 prop="windowNote" 
			 label="描述" 
			 min-width="150">
			</el-table-column>
			<el-table-column 
			 v-if='checkBtn || editBtn'
             label="操作" 
             width="400">
                <template slot-scope="scope">
                    <!-- <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
					<el-button type="primary" size="small" v-if="checkBtn" @click="codeBtn(scope.$index, scope.row)">查看二维码</el-button>
					<el-button type="primary" size="small" v-if='editBtn && scope.row.state === 0'   @click="creatAccount(scope.$index, scope.row)">创建账号</el-button>
					<el-button type="primary" size="small" v-if='checkBtn && scope.row.state > 0'  @click="checkAccount(scope.$index, scope.row)">查看账号</el-button>
					<el-button type="primary" size="small" v-if="checkBtn" @click="checkMenu(scope.$index, scope.row)">查看菜单</el-button>
                </template>
            </el-table-column>
		</el-table>

		<!--工具条-->
		<!-- <el-col :span="24" class="toolbar">
			<el-pagination 
			 layout="prev, pager, next" 
			 @current-change="handleCurrentChange" 
			 :page-size="pageSize" 
			 :total="total" 
			 style="float:right;">
			</el-pagination>
		</el-col> -->
		<!-- 编辑 -->
        <!-- <I-table-editor
         :title='title'
         v-model="addFormVisible"
		 class="editDialog"
        >
            <template slot="content">
                <el-form :model="form" label-width="120px">
                    <el-form-item label="窗口名称">
						<el-input v-model="form.windowName"></el-input>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input type="textarea" v-model="form.windowNote"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <template slot="foot">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="addLoading">提交</el-button>
            </template>
        </I-table-editor> -->
		<!-- 生成二维码、查看二维码 -->
		<I-table-editor
		 title='查看二维码'
		 v-model="codeVisible"
		 class="codeBox"
		>
			<template slot="content">
				<div class="code">
					<qriously :value="codeValue" :size="size"/>
				</div>
				<!-- <el-button class="downLoadBtn" type="primary">下载</el-button> -->
			</template>
		</I-table-editor>
		<!-- 查看菜单 -->
		<I-table-editor
		 :title='checkMenuTitle'
		 v-model="menuVisible"
		 class="menuBox"
		>
			<template slot="content">
				<el-tabs v-model="activeName" tab-position="top" @tab-click="tabClick">
					<el-tab-pane v-for='item in mealData' :label="item.mealPartitionName" :key='item.mealPartitionID' :name='item.mealPartitionID.toString()'>
						<el-table
						:data="checkMenuData"
						height="600"
						style="width: 100%">
							<el-table-column
								label="缩略图"
								width="100">
								<template slot-scope='scope'>
									<img :src="scope.row.imageUrl" alt="" style="width:30px;height:30px;">
								</template>
							</el-table-column>
							<el-table-column
								prop="dishesName"
								label="名称"
								width="150">
							</el-table-column>
							<el-table-column
								prop="dishesPrice"
								label="单价">
							</el-table-column>
							<el-table-column
								prop="unit"
								label="单位">
							</el-table-column>
							<el-table-column
								prop="note"
								label="描述">
							</el-table-column>
						</el-table>
					</el-tab-pane>
				</el-tabs>
			</template>
			<!-- <template slot="foot">
				<el-button @click="menuVisible = false">取消</el-button>
				<el-button type="primary">确认</el-button>
			</template> -->
		</I-table-editor>
		<!-- 查看账号 -->
		<I-table-editor 
		 title="查看账号"
		 v-model="creatAccountVisible"
		 class="accountDialog"
		>
			<template slot="content">
				<el-form :model="accountForm" label-width="80px" :rules="rules" ref="form">
                    <!-- <el-form-item label="设备号" prop="name">
                        <el-input v-model="accountForm.equipment" auto-complete="off" placeholder="请输入设备号"></el-input>
                    </el-form-item> -->
                    <el-form-item label="账号">
                        <el-input v-model="accountForm.userName" readonly></el-input>
                    </el-form-item>
					<el-form-item label="密码">
                        <el-input v-model="accountForm.password" readonly></el-input>
                    </el-form-item>
                </el-form>
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
				activeName:'',
				tableData: [],//列表数据
				value:'1',
				options:[
					{
						value:'1',
						label:'门店1'
					},
					{
						value:'2',
						label:'门店2'
					}
				],
				title:'',//新增、编辑菜单
				checkMenuTitle:'',//查看菜单标题
				codeVisible: false,//是否显示二维码弹框
				codeTitle:'',//生成二维码、查看二维码标题
				codeValue:'520',//二维码的内容
				size: 200,
				storeData:[],
				menuVisible: false,//是否显示查看菜单弹框
				menuData:[],//菜单数据
				creatAccountVisible: false,//显示创建账号弹框
				isAdd: false,
				total: 0,
				currentPage: 1,
				pageSize:10,
				listLoading: false,
				sels: [],//列表选中列
				//表单数据
				form: {
					windowsName: '',
					note: ''
				},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				//创建账号表单数据
				accountForm: {},
				rules: {},
				enterpriseID: 0,
				canteenID: 0,
				mealData:[],//查看菜单数据
				checkMenuData:[],//查看菜单数据
				disableBtn: false,
				//操作按钮
                checkBtn: false,
				editBtn: false,
				selectBtn: false,
			}
		},
		mounted() {
			this.enterpriseID = JSON.parse(localStorage.getItem('user')).enterpriseID;
			this.getStore();
			this.getBtn();
		},
		methods: {
			//操作按钮是否显示
            getBtn() {
                let permissions = JSON.parse(localStorage.getItem('user')).permissions;
                if(permissions.indexOf('221') > -1) {
                    this.checkBtn = true;
                }
                if(permissions.indexOf('223') > -1) {
                    this.editBtn = true;
                }
			},
			//获取当前登陆用户可操作门店
            getStore() {
                let para = {
                    enterpriseID: this.enterpriseID,
                    canteenID: JSON.parse(localStorage.getItem('user')).canteenID,
                    userID: JSON.parse(localStorage.getItem('user')).userID
				}
				console.log('参数',para);
                this.$post('/canteens/operable',para).then(res => {
                    console.log('操作门店',res.data);
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
					this.selectBtn = true;
					this.getWindowList(this.canteenID);
                } else {
					this.canteenID = this.storeData[0].canteenID;
                    this.getWindowList(this.canteenID);
                }
            },
			//门店切换
			storeChange() {
				this.getWindowList(this.canteenID)
			},
			//获取窗口数据
			getWindowList(canteenID) {
				this.$fetch('/canteenWindows/' + this.canteenID).then(res => {
					console.log('窗口列表数据',res)
					this.tableData = res.data;
				})
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getWindowList();
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit(index, row) {
				this.addFormVisible = true;
				this.title = '编辑';
				this.form = Object.assign({}, row);
				console.log(row);
			},
			//查看二维码弹框
			codeBtn(index,row) {
				// console.log(row);
				this.codeVisible = true;
				this.codeValue = 'http://yyyy.wezoz.com/wx/payment.html?windowID='+ row.windowID.toString();
				console.log(this.codeValue)
			},
			//创建账号
			creatAccount(index,row) {
				console.log(row)
				let para = {
					canteenID: this.canteenID,
					level: 3,
					enterpriseID: this.enterpriseID,
					windowID: row.windowID,
					roleList:[{roleID: 3}]
				}

				this.$post('/user',para).then(res => {
					if(res.state) {
						this.$message.success('创建账号成功');
						this.getWindowList(this.canteenID);
					} else {
						this.$message.error(res.msg)
					}
				})
			},
			//查看账号
			checkAccount(index,row) {
				this.$fetch('/user/' + row.state).then(res => {
					console.log(res);
					if(res.state) {
						this.creatAccountVisible = true;
						this.accountForm = res.data;
					}
				})
			},
			//确认创建
			creatSubmit() {

			},
			//查看菜单
			checkMenu(index,row) {
				console.log(row)
				this.menuVisible = true;
				this.$fetch('/dishesDetail/' + row.windowID).then(res => {
					console.log('查看菜单',res);
					this.mealData = res.data.mealPartitionList;
					this.checkMenuTitle = '查看菜单' + '-' +res.data.windowName;
					this.activeName = res.data.mealPartitionList[0].mealPartitionID.toString();
					for(var i = 0; i < this.mealData.length; i ++) {
						if(this.mealData[i].mealPartitionID == this.activeName) {
							this.checkMenuData = this.mealData[i].dishesList;
						}
					}
				})
			},
			tabClick() {
				for(var i = 0; i < this.mealData.length; i ++) {
					if(this.mealData[i].mealPartitionID == this.activeName) {
						this.checkMenuData = this.mealData[i].dishesList;
					}
				}
			},
			//编辑
			editSubmit: function () {
				this.$confirm('确认提交吗？', '提示', {}).then(() => {
					this.editLoading = true;
					//NProgress.start();
					let para = Object.assign({}, this.editForm);
					para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
					editUser(para).then((res) => {
						this.editLoading = false;
						//NProgress.done();
						this.$message({
							message: '提交成功',
							type: 'success'
						});
						this.$refs['editForm'].resetFields();
						this.editFormVisible = false;
						this.getUsers();
					});
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
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
	//二维码
	.codeBox {
		.el-dialog {
			width: 480px;
			padding-bottom: 50px;
			.el-dialog__body {
				padding-top: 60px;
			}
		}
		.code {
			width: 200px;
			height: 200px;
			margin: 0 auto;
		}
		// .downLoadBtn {
		// 	width:64px;
		// 	margin-left: 80%;
		// 	margin-top: 80px;
		// }
	}
	//查看菜单
	.menuBox {
		.el-dialog {
			width: 740px;
			height: 750px;
			.el-tabs__header {
				border-bottom: none;
				.el-tabs__active-bar {
					width: 0 !important;
				}
			}
			.el-tabs__item {
				border:1px solid #1FA0FE;
				height: 30px;
				line-height: 30px;
				font-size: 16px;
				margin-right: 30px;
				border-radius: 4px;
			}
			.el-tabs__item.is-active {
				background: #1FA0FE;
				color:#fff;
			}
			.el-table {
				border: none;
				th.is-leaf {
					border-bottom: 0;
				}
				.el-table__header-wrapper thead div,th {
					background: #F5F5F5;
				}
			}
			.cell {
				text-align: center;
			}
			.el-table::after, .el-table::before {
				background-color: #fff;
			}
			.el-tabs__item.is-top:nth-child(2) {
				padding: 0 20px;
			}
			.el-tabs--top .el-tabs__item.is-top:last-child {
				padding: 0 20px;
			}
			.el-tabs__nav-wrap::after {
				height: 0;
			}
		}
	}
	//编辑
	.editDialog{
		.el-dialog {
			width: 740px;
			.el-form {
				margin: 0 auto;
			}
		}
	}
	//查看账号
	.accountDialog {
		.el-dialog {
			width: 480px;
			height: 300px;
			.el-dialog__body {
				margin-top: 28px;
			}
			.el-form {
				width: 70%;
				margin: 0 auto;
				.el-form-item__label {
					font-size: 18px;
					letter-spacing: 2px;
				}
			}
		}
	}
	
</style>