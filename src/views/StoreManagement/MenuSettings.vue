<template>
	<section>
        <!-- 菜单设置 -->
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
				<el-form-item>
					<el-button id="menuLibrary" type="primary" @click="menuLibraryBtn">菜单库</el-button>
				</el-form-item>
				<el-form-item>
					<el-button id="menuEdit"  @click="menuEditBtn">菜单编辑</el-button>
				</el-form-item>
				<el-form-item v-if="flag && addBtn">
					<el-button  @click='handleAdd'>新增</el-button>
				</el-form-item>
				<el-form-item v-if="flag && deleBtn">
                    <el-button type="danger" @click="batchRemove" :disabled="this.sels.length < 2">批量删除</el-button>
                </el-form-item>
			</el-form>
		</el-col>

		<!--菜单库列表-->
		<el-table 
		 key='firstTable'
		 :data="menuLibraryData" 
		 highlight-current-row 
		 v-loading="listLoading" 
		 @selection-change="selsChange" 
		 v-if="flag"
		 style="width: 100%;" >
			<el-table-column 
			 type="selection" 
			 width="55">
			</el-table-column>
            <el-table-column 
			 align="center"
			 label="序号" 
			 width="80">
			  <template slot-scope="scope">
					<span>{{scope.$index+(currentPage - 1) * pageSize + 1}} </span>
				</template>
			</el-table-column>
            <el-table-column 
			 
			 label="缩略图" 
			 width="100">
			 <template slot-scope='scope'>
				 <img :src="scope.row.imageUrl" alt="无图片" style="width:30px;height:30px;">
			 </template>
			</el-table-column>
            <el-table-column 
			 prop="dishesName" 
			 label="名称" 
			 min-width="100">
			</el-table-column>
			<el-table-column 
			 prop="unit" 
			 label="单位" 
			 min-width="120">
			</el-table-column>
			<el-table-column 
			 prop="dishesPrice" 
			 label="价格" 
			 min-width="120" 
			 >
			</el-table-column>
			<el-table-column 
			 prop="dishesType" 
			 label="类别" 
			 min-width="120" 
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
             width="300">
                <template slot-scope="scope">
					<el-button type="primary" size="small" v-if="editBtn" @click="uploadImage(scope.$index, scope.row)">上传图片</el-button>
                    <el-button type="primary" size="small" v-if="editBtn" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" v-if="deleBtn" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
		</el-table>
		<!-- 菜单编辑 列表 -->
		<el-table 
		 key='secondTable'
		 :data="tableData" 
		 highlight-current-row 
		 v-loading="listLoading" 
		 @selection-change="selsChange"
		 v-if="!flag"
		 class="menuListTable"
		 style="width: 100%;" >
			<el-table-column 
			 type="selection" 
			 width="55">
			</el-table-column>
            <el-table-column 
			 label="序号"
			 type="index" 
			 width="100">
			</el-table-column>
            <el-table-column 
			 prop="windowName" 
			 label="窗口" 
			 width="100">
			</el-table-column>
			<el-table-column 
			 label="餐段" 
			 width="180">
			 	<template slot-scope="scope">
				 <ul class="ulbox">
					 <li class="firstLi" v-for="(item,index) in scope.row.mealPartitionList" :key="index">
						 {{item.mealPartitionName + '  ' + item.openingTime + '-' + item.closeTime}}
					</li>
				 </ul>
			 </template>
			</el-table-column>
			<el-table-column 
			 label="菜单明细" 
			 min-width="180" 
			 >
			 	<template slot-scope='scope'>
				 <ul class="ulbox">
					 <li style="overflow:hidden;" v-for="(item,index) in scope.row.mealPartitionList" :key="index">
						<span v-for="(_item,_index) in item.dishesList" :key='_index'>{{_item.dishesName}}&nbsp;&nbsp;&nbsp;</span>
					 </li>
				 </ul>
			 </template>
			</el-table-column>
			<el-table-column 
			 label="状态"
			 width="180">
				<template slot-scope="scope">
					<el-tag type="success" v-if='scope.row.published == 1'>已发布</el-tag>
					<el-tag type="danger" v-if='scope.row.published == 0'>未发布</el-tag>
					<el-tag type="danger" v-if='scope.row.published == 2'>已清空</el-tag>
				</template>
			</el-table-column>
			<el-table-column
			 v-if='checkBtn || editBtn' 
             label="操作" 
             width="150"
			 >
                <template slot-scope="scope">
                    <el-button class="operationBtn" type="primary" size="small" v-if="editBtn" @click="editMenu(scope.$index, scope.row)">编辑菜单</el-button>
					<el-button class="operationBtn" type="primary" size="small" v-if="checkBtn" @click="checkMenu(scope.$index, scope.row)">查看菜单</el-button>
					<el-button class="operationBtn" type="primary" size="small" v-if="editBtn" @click="clearMenu(scope.$index, scope.row)">清空菜单</el-button>
					<el-button class="operationBtn" type="primary" size="small" v-if="editBtn" @click="handlePublish(scope.$index, scope.row)">确认发布</el-button>
                </template>
            </el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar" v-if="flag">
			<el-pagination 
			 layout="prev, pager, next"
			 @current-change="handleCurrentChange" 
			 :page-size="pageSize" 
			 :total="total" 
			 style="float:right;">
			</el-pagination>
		</el-col>
		<!-- 菜单设置新增、编辑 开始-->
		<I-table-editor
		 :title='title'
		 v-model="addFormVisible"
		 @dialogVisibleClose='closeDialogEdit'
		 class="addDialogMenuSetting"
		>
			<template slot='content'>
				<el-form :model="form" label-width="80px" :rules="rules" ref="form">
                    <!-- <el-form-item label="图片" prop="image">
						<el-upload
						class="upload-demo"
						ref="upload"
						:action="logoImageUploadUrl"
						:data='uploadData'
						name='image'
						:on-preview="handlePreview"
						:on-success="handleSuccess"
						:on-remove="handleRemove"
						:file-list="fileList"
						list-type="picture"
						:auto-upload="false">
						<el-button slot="trigger" size="small" type="primary">上传图片</el-button>
						</el-upload>
						<div v-if='showEditImg' class="img_content">
							<span><img src="../../assets/delete.png" alt="" @click="deleteImage"></span>
							<img  :src="form.imageUrl" alt="" >
						</div>
                    </el-form-item> -->
					<el-form-item label="名称" prop='dishesName'>
                        <el-input v-model="form.dishesName" auto-complete="off"></el-input>
                    </el-form-item>
					<el-form-item label="单位" prop='unit'>
                        <el-input v-model="form.unit" auto-complete="off"></el-input>
                    </el-form-item>
					<el-form-item label="价格" prop='dishesPrice'>
                        <el-input v-model="form.dishesPrice" auto-complete="off"></el-input>
                    </el-form-item>
					<el-form-item label="类别" prop="dishesTypeID">
                        <el-select v-model="form.dishesTypeID" placeholder="请选择">
							<el-option
							v-for="item in dishData"
							:key="item.classificationDishesID"
							:label="item.dishesType"
							:value="item.classificationDishesID">
							</el-option>
						</el-select>
                    </el-form-item>
                    <el-form-item label="说明">
                        <el-input type="textarea" v-model="form.note"></el-input>
                    </el-form-item>
                </el-form>
			</template>
			<template slot="foot">
                <el-button @click="closeDialogEdit">取消</el-button>
                <el-button v-if='isAdd == true' type="primary" @click="addSubmit" :loading="addLoading">提交</el-button>
                <el-button v-if='isAdd == false' type="primary" @click="editSubmit" :loading="addLoading">提交</el-button>
            </template>
		</I-table-editor>
		<!-- 菜单设置新增、编辑 结束-->
		<!-- 菜单编辑  编辑 开始-->
		<I-table-editor
		 :title="editTitle"
		 v-model="menuEditVisible"
		 :isClose='false'
		 class="menuEditBox"
		>
			<template slot="content">
				<el-tabs v-model="activeName" tab-position="top" @tab-click="tabClick">
					<el-tab-pane v-for='item in mealData' :key="item.mealPartitionID" :label="item.mealPartitionName" :name="item.mealPartitionID.toString()">
						<I-eltable
						:menuValue="menuData"
						@searchBtn='handleSearch'
						@addBtn='handleAddBtn'
						:menuAddValue='menuAddData'
						@deleteBtn='handleDelete'
						>
						</I-eltable>
					</el-tab-pane>
				</el-tabs>
			</template>
			<template slot="foot">
				<el-button @click='closeDialog'>关闭</el-button>
				<el-button type="primary" @click="saveMenu">保存</el-button>
			</template>
		</I-table-editor>
		<!-- 菜单编辑  编辑 结束-->
		<!-- 查看菜单 开始-->
		<I-table-editor
		 :title="checkMenuTitle"
		 v-model="checkMenuVisible"
		 class="menuEditBox"
		>
			<template slot="content">
				<el-tabs v-model="activeName2" tab-position="top" @tab-click="checkTabClick">
					
					<el-tab-pane v-for='item in mealData2' :label="item.mealPartitionName" :key='item.mealPartitionID' :name='item.mealPartitionID.toString()'>
						<div>
							<el-input style="width:35%;margin-bottom:20px;display:block;" :disabled="true" :value="item.openingTime + '-' + item.closeTime"> </el-input>
							<el-table
							:data="checkMenuData"
							height="700"
							style="width: 100%">
								<el-table-column
									prop="dishesName"
									label="名称"
									min-width="120">
								</el-table-column>
								<el-table-column
									prop="unit"
									label="单位"
									min-width="120">
								</el-table-column>
								<el-table-column
									prop="dishesPrice"
									label="单价"
									min-width="120">
								</el-table-column>
								<el-table-column
									prop="note" 
									label="说明" 
									width="150"
								>
								</el-table-column>
							</el-table>
						</div>
					</el-tab-pane>
				</el-tabs>
			</template>
		</I-table-editor>
		<!-- 查看菜单 结束-->
		<!-- 确认发布 开始-->
		<I-table-editor
		 title="发布消息"
		 v-model="publishVisible"
		 class="publishbox"
		>
			<template slot="content">
				<div class="publishMsg">
					<p>发布成功已同步到一体机</p>
					<p>请及时通知窗口人员</p>
				</div>
			</template>
			<template slot="foot">
				<el-button type="primary" @click='publishVisible = false'>确认</el-button>
			</template>
		</I-table-editor>
		<!-- 确认发布 结束-->
		<!-- 清空 开始 -->
		<I-table-editor
		 title="清空"
		 v-model="emptyVisble"
		 class="emptyBox"
		>
			<template slot="content">
				<div class="emptyText">
					<p>是否清空此菜单</p>
					<p>清空后不可恢复</p>
				</div>
			</template>
			<template slot="foot">
				<el-button @click="emptyVisble = false">取消</el-button>
				<el-button type="primary" @click="emptyMenu">确认</el-button>
			</template>
		</I-table-editor>
		<!-- 清空 结束 -->
		<!-- 上传菜单图片开始 -->
		<I-table-editor
			title="上传图片"
			v-model="uploadImageVisible"
			class="uploadImageDialog"
		>
			<template slot="content">
				<el-form>
					<el-form-item label="菜品图片">
						<el-upload 
							class="avatar-uploader" 
							:class="{disabled:uploadDisabled}" 
							:action="logoImageUploadUrl" 
							list-type="picture-card" 
							:file-list="imagelist" 
							name="image" 
							:data='uploadData'
							:headers="obj"
							:on-change="handleChange"
							:on-success="handleSuccess"
							:on-error="handleError"
							:before-upload="beforeAvatarUpload"  
							:on-remove="handleRemove">
							<i class="el-icon-plus"></i>
							<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
						</el-upload>
					</el-form-item>
				</el-form>
				
			</template>
		</I-table-editor>
		<!-- 上传菜单图片结束 -->
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import ITableEditor from '../../components/Table/TableEditor.vue'
	import IEltable from '../../components/Table/Eltable.vue'
	import configUrl from '../../common/js/url.js'
	
	export default {
		data() {
			return {
				activeName: '',
				activeName2: '',
				value:'1',//门店下拉选择数据
				menuLibraryData: [],//菜单库列表数据
				checkMenuTitle:'',//查看菜单标题
				editTitle:'',//菜单编辑弹框标题
				tableData:[],//菜单编辑列表数据
				menuData:[],//菜单数据
				menuAddData:[],//已添加菜单数据
				checkMenuData:[],//查看菜单的数据
				flag: true,
				title:'',//新增编辑标题
				isAdd: false,
				showEditImg: false,
				addFormVisible: false,//显示新增编辑弹框
				menuEditVisible: false,
				uploadImageVisible: false,//上传图片弹框
				publishVisible: false,//发布弹框
				checkMenuVisible: false,//查看菜单弹框
				emptyVisble: false,//清空弹框
				total: 0,
				currentPage: 1,
				pageSize: 10,
				listLoading: false,
				sels: [],//列表选中列
				form: {
					dishesName:'',
					dishesPrice: '',
					unit:'',
					dishesTypeID:'',
					note:''
				},
				rules: {
                    dishesName: [
                        { required: true, message: '请输入名称', trigger: 'blur' }
					],
					unit: [
						{ required: true, message: '请输入单位', trigger: 'blur' }
					],
					dishesPrice: [
						{ required: true, message: '请输入价格', trigger: 'blur' }
					],
					dishesTypeID: [
						{ required: true, message: '请选择类别'}
					]
				},
				enterpriseID: 0,
				canteenID:0,
				addLoading: false,
				fileList:[],
				logoImageUploadUrl: '',
				uploadData: {
					dishesID: 0
				},
				obj:{'Authorization':''},
				storeData:[],//门店数据
				dishData:[],//菜品类别数据
				imagelist:[],
				mealData:[],//早餐，中餐(编辑菜单)
				mealData2:[],//查看菜单（早中晚）
				windowID:0,//窗口ID
				updateFlag: false,
				windowData:{},//窗口数据
				//操作按钮
                checkBtn: false,
                editBtn: false,
                deleBtn: false,
				addBtn: false,
				selectBtn: false,
			}
		},
		//离开页面前
		// beforeDestroy() {
		// 	if(this.updateFlag) { 
		// 		this.$confirm('编辑菜单后未发布，请确定是否要离开？', '离开当前页', {
		// 			confirmButtonText: '否',
		// 			cancelButtonText: '是',
		// 			type: 'warning'
		// 		}).then(() => {
		// 			this.$router.push({path: '/menuSettings'});
		// 		}).catch(() => {

		// 		});
		// 	}
		// },
		mounted() {
			this.enterpriseID = JSON.parse(localStorage.getItem('user')).enterpriseID;
			this.obj.Authorization = localStorage.getItem('token');
			this.getStore();
			this.getBtn();
		},
		computed: {
			uploadDisabled: function() {
                return this.imagelist.length > 0
            }
		},
		methods: {
			//操作按钮是否显示
            getBtn() {
                let permissions = JSON.parse(localStorage.getItem('user')).permissions;
                if(permissions.indexOf('231') > -1) {
					this.addBtn = true;
                }
                if(permissions.indexOf('232') > -1) {
                    this.checkBtn = true;
                }
                if(permissions.indexOf('233') > -1) {
                    this.editBtn = true;
                }
                if(permissions.indexOf('234') > -1) {
					this.deleBtn = true;
                }
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
					this.selectBtn = true;
					this.init();
					this.getDishList();
					this.getEditList();
                } else {
					this.canteenID = this.storeData[0].canteenID;
					this.init();
					this.getDishList();
					this.getEditList();
                }
			},
			//门店切换
			storeChange() {
				this.currentPage = 1;
				this.init();
				this.getEditList();
			},
			handlePreview(file) {
				console.log(file);
			},
			//上传文件之前
			beforeAvatarUpload(file) {
				console.log('文件类型',file);
				const isLt2M = file.size / 1024 / 1024 < 2;
				let flag = true;
				if(file.type != 'image/jpeg' && file.type != 'image/png') {
                    console.log('-----')
                    this.$message.error('上传文件图片只能是 JPG/PNG 格式!');
                    flag = false;
                } 
                if(!isLt2M) {
                    this.$message.error('上传图片大小不能超过2M');
                }
				return flag && isLt2M;
			},
			//上传成功
			handleSuccess(res, file, fileList) {
				// this.uploadImageVisible = false;
				this.init();
			},
			handleError(err, file, fileList) {
				console.log(err);
			},
			handleRemove(file,fileList) {
				console.log(file);
				this.imagelist = fileList;
			},
			handleChange(file,fileList) {
				console.log(fileList);
				this.imagelist = fileList;
			},
			//获取菜品类别
			getDishList() {
				this.$fetch('/classificationDishes/'+ this.enterpriseID + '/' + this.canteenID).then(res => {
					console.log('菜品类别数据',res)
					this.dishData = res.data
				})
			},
			//关闭弹框
            closeDialogEdit() {
				this.$refs['form'].resetFields();
				this.addFormVisible = false;
				this.showEditImg = false;
				
            },
			//切换菜单库和菜单编辑
			menuLibraryBtn() {
				this.flag = true;
				let menuLibrary = document.getElementById('menuLibrary');
				menuLibrary.style.backgroundColor = "#20a0ff"; 
				menuLibrary.style.color = "#fff";
				menuLibrary.style.borderColor = "#c4c4c4";

				let menuEdit = document.getElementById('menuEdit');
				menuEdit.style.backgroundColor = "#fff";
				menuEdit.style.color = "#1f2d3d";
			},
			//菜单编辑
			menuEditBtn() {
				this.flag = false;//#1f2d3d #20a0ff
				let menuLibrary = document.getElementById('menuLibrary');
				menuLibrary.style.backgroundColor = "#fff"; 
				menuLibrary.style.color = "#1f2d3d";
				menuLibrary.style.borderColor = "#c4c4c4";

				let menuEdit = document.getElementById('menuEdit');
				menuEdit.style.backgroundColor = "#20a0ff";
				menuEdit.style.color = "#fff";

				// this.getEditList();
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.init();
			},
			//获取菜单库列表
			init() {
				// this.listLoading = true;
				this.$fetch('/dishes/' + this.canteenID + '/' + this.currentPage + '/' + this.pageSize).then(res => {
					// console.log(res.data.list);
					if(this.currentPage > 1) {
						if(!res.data) {
							this.currentPage = this.currentPage - 1;
							this.init();
							return;
						}
					}
					this.menuLibraryData = res.data.list;
					this.total = res.data.total;
				})
			},
			//获取所有的菜单库列表
			getMenuList() {
				this.$fetch('/dishes/' + this.canteenID + '/' + 0 + '/' + 0).then(res => {
					let data = res.data.list;
					for(let i = 0; i < data.length; i ++) {
						data[i].flag = false;
					}
					this.menuData = data;
					console.log('菜单库',this.menuData)
				})
			},
			//获取菜单编辑 列表
			getEditList() {
				this.$fetch('/dishesDetails/editor/' + this.canteenID).then(res => {
					console.log(res.data);
					this.tableData = res.data;
				})
			},
			//显示新增 
			handleAdd() {
				this.title = '新增';
				this.addFormVisible = true;
				this.isAdd = true;
				this.form.note = '';
			},
			//编辑弹框
			handleEdit(index,val) {
				console.log('编辑',val)
				this.title = '编辑';
				this.addFormVisible = true;
				this.isAdd = false;
				this.showEditImg = true;
				this.form = Object.assign({},val);
				this.form.dishesPrice = this.form.dishesPrice.toString();

			},
			//删除编辑图片的显示
			deleteImage() {
				this.showEditImg = false;
			},
			//确认新增
			addSubmit() {
				console.log('确认新增数据',this.form);
				this.$refs['form'].validate((valid) => {
                    if(valid) {
						let para = Object.assign({},this.form);
						para.enterpriseID = this.enterpriseID;
						para.canteenID = this.canteenID;
						console.log('para',para)
						this.$post('/dish',para).then(res => {
							console.log(res)
							if(res.state) {
								this.addFormVisible = false;
								this.init();
							}
						})
                    }
                })
			},
			//上传菜品图片
			uploadImage(index,row) {
				console.log('上传图片',row)
				let el = document.getElementsByClassName('el-upload-list__item-thumbnail');
				if(el.length == 1) {
					el[0].src = row.imageUrl;
				}
				this.uploadImageVisible = true;
				this.logoImageUploadUrl = configUrl.url + 'dish/image';
				this.uploadData.dishesID = row.dishesID;
			},
			//确认编辑
			editSubmit() {
				console.log('编辑')
				this.$refs['form'].validate((valid) => {
                    if(valid) {
						console.log(this.form);
						this.$put('/dish',this.form).then(res => {
							console.log(res);
							if(res.state) {
								this.$message.success('修改成功');
								this.addFormVisible = false;
								this.init();
							}
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
					this.$remove('/dish/' + row.dishesID).then(res => {
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
				var ids = this.sels.map(item => item.dishesID).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					// this.listLoading = true;
					this.$remove('/dishes/' + ids).then(res => {
						if(res.state) {
							this.$message.success('批量删除成功');
							this.init();
						}
					})
				}).catch(() => {

				});
			},
			//编辑菜单(菜单编辑)
			editMenu(index,row) {
				console.log(row);
				this.getMenuList();
				for(let i = 0; i < this.menuData.length; i ++) {
					this.menuData[i].flag = false;
				}
				this.menuEditVisible = true;
				this.updateFlag = false;
				this.windowData = Object.assign({},row);
				this.editTitle = '编辑菜单' + '-' + row.windowName;
				this.activeName = row.mealPartitionList[0].mealPartitionID.toString();
				this.mealData = [...row.mealPartitionList];
				for(var i = 0; i < this.mealData.length; i ++) {
					if(this.mealData[i].mealPartitionID == this.activeName) {
						this.menuAddData = [...this.mealData[i].dishesList];
					}
				}
			},
			//保存菜单
			saveMenu() {
				console.log(this.windowData.mealPartitionList);
				let data = JSON.parse(JSON.stringify(this.windowData.mealPartitionList));
				for(var i = 0; i < data.length; i ++) {
					if(data[i].mealPartitionID == this.activeName) {
						data[i].dishesList = this.menuAddData;
						break;
					}
				}
				console.log('data',data)
				
				this.windowData.mealPartitionList = data;
				console.log('this.windowData',this.windowData)
				this.$post('/canteenWindow/dishesSave',this.windowData).then(res => {
					if(res.state) {
						this.menuEditVisible = false;
						this.getEditList();
					}
				})
			},
			//编辑菜单弹框关闭
			closeDialog() {
				console.log(this.updateFlag)
				if(this.updateFlag) {
					this.$confirm('添加的菜单未保存，确定要关闭吗？','提示', {
						type:'warning'
					}).then(() => {
						this.menuEditVisible = false;
						this.updateFlag = false;
					}).catch(() => {

					})
				} else {
					this.menuEditVisible = false;
					this.updateFlag = false;
				}
				
				// this.menuEditVisible = false;

			},
			//搜索菜名
			handleSearch(msg) {
				this.$fetch('/dish/' + this.canteenID + '/' + msg).then(res => {
					console.log(res);
					this.menuData = res.data;
					if(!msg) {
						this.init();
					}
					
				})
			},
			//添加菜品
			handleAddBtn(msg) {
				console.log('添加菜单',msg)
				for(let i = 0; i < this.menuData.length; i ++) {
					if(this.menuData[i].dishesID == msg.dishesID) {
						this.menuData[i].flag = true;
						break;
					}
				}
				this.menuAddData.push(msg);
				this.updateFlag = true;
			},
			//删除菜品
			handleDelete(msg) {
				let len = this.menuAddData.length;
				for(let i = 0; i < this.menuData.length; i ++) {
					if(this.menuData[i].dishesID == msg.dishesID) {
						this.menuData[i].flag = false;
						break;
					}
				}
				for(let i = 0; i < len; i ++) {
					if(this.menuAddData[i].dishesID == msg.dishesID) {
						this.menuAddData.splice(i,1);
						break;
					}
				}
				this.updateFlag = true;
			},
			//确认发布
			handlePublish(index,row) {
				console.log('发布数据',row);
				this.$post('/canteenWindow/dishesPaublish',row).then(res => {
					console.log(res);
					if(res.state) {
						this.publishVisible = true;
						this.getEditList();
					}
				})

			},
			//查看菜单
			checkMenu(index,row) {
				console.log('查看菜单',row)
				this.checkMenuTitle = '查看菜单' + '-' + row.windowName; 
				this.checkMenuVisible = true;
				this.mealData2 = row.mealPartitionList;
				this.activeName2 = row.mealPartitionList[0].mealPartitionID.toString();
				for(var i = 0; i < this.mealData2.length; i ++) {
					if(this.mealData2[i].mealPartitionID == this.activeName2) {
						this.checkMenuData = this.mealData2[i].dishesList;
					}
				}
				
			},
			//清空菜单弹框
			clearMenu(index,row) {
				this.emptyVisble = true;
				this.windowID = row.windowID;
			},
			//确认清空菜单
			emptyMenu() {
				this.$remove('/dishesDetail/' + this.windowID).then(res => {
					if(res.state) {
						this.$message.success('清空菜单成功');
						this.emptyVisble = false;
						this.getEditList();
					}
				})
			},
			//编辑菜单，切换
			tabClick() {
				for(var i = 0; i < this.mealData.length; i ++) {
					if(this.mealData[i].mealPartitionID == this.activeName) {
						this.menuAddData = [...this.mealData[i].dishesList];
					}
				}
			},
			//查看菜单，切换
			checkTabClick() {
				for(var i = 0; i < this.mealData2.length; i ++) {
					if(this.mealData2[i].mealPartitionID == this.activeName2) {
						this.checkMenuData = this.mealData2[i].dishesList;
					}
				}
			}
		},
		components: {
			ITableEditor,
			IEltable
		}
	}

</script>

<style lang='scss'>
	.menuListTable {
		.el-table__header th .cell {
			padding:0;
			text-align: center;
		}
		.el-table__body {
			.cell {
				padding:0;
				text-align: center;
				.el-tag {
					width: 100px;
					height: 30px;
					line-height:30px; 
				}
				.ulbox {
					padding: 0;
					li {
						border: 1px solid #ccc;
						height: 50px;
						line-height: 50px;
						border-bottom: 0;
						padding-left: 20px;
						padding-right: 20px;
					}
					li:last-child {
						border-bottom: 1px solid #ccc;
					}
					li.firstLi {
						border-right: 0;
					}
				}
			}
			.el-button {
				margin-left: 0;
			}
			.operationBtn {
				margin-left: 38px;
				margin-bottom: 20px;
			}
		}
		.el-checkbox {
			margin-left: 10px;
		}
	}
	.publishbox .el-dialog {
		width: 740px;
		.publishMsg {
			width: 50%;
			margin: 0 auto;
			text-align: center;
			p {
				font-weight: bold;
			}
			p:first-child {
				font-size: 24px;
			}
			
		}
	}
	.menuEditBox {
		.el-dialog {
			width: 740px;
			.el-dialog__header {
				height: 40px;
				line-height: 40px;
			}
			.el-dialog__body {
				position: relative;
				.windowsSelectPlay {
					position: absolute;
					top: -47px;
					left: 100px;
					font-weight: bold;
				}
			}
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
	.el-select-dropdown__item.selected  {
		color: #20a0ff;
		background-color:#fff;
	}
	.el-select-dropdown__item.selected.hover {
		background-color: #fff;
	}
	.emptyBox {
		.el-dialog {
			width: 740px;
			div.emptyText {
				width: 50%;
				margin: 0 auto;
				text-align: center;
				p {
					font-weight: bold;
				}
				p:first-child {
					font-size: 20px;
				}
			}
		}
	}
	.upload-demo {
		display: block;
	}
	.img_content {
		width: 90px;
		padding-right: 20px;
		position: relative;
		span {
			display: inline-block;
			width: 20px;
			height: 20px;
			position: absolute;
			right: 4px;
			top: 4px;
		}
		img {
			width: auto;
			height: auto;
			max-width: 100%;
			max-height: 100%;
		}
	}
	.uploadImageDialog {
		.el-dialog {
			width: 740px;
			height: 400px;
			.el-form {
				width: 60%;
				margin: 0 auto;
				.el-form-item__content {
					margin-left: 136px;
				}
				.el-form-item__label {
					font-size: 18px;
				}
			}
		}
	}
	.disabled .el-upload--picture-card {
        display: none;
	}
	.addDialogMenuSetting {
		.el-dialog {
			width: 740px;
			.el-form {
				width: 60%;
				margin: 0 auto;
				.el-form-item__label {
					letter-spacing: 2px;
					font-size: 16px;
					font-weight: bold;
				}
				.el-select {
					width: 100%;
				}
			}
		}
	}
</style>