<template>
	<section style="height:100%;">
        <!-- 权限设置-->
		<div class="settingBox">
			<div class="chooseRole">
				<p>角色选择</p>
				<div class="checkbox">
					<el-select v-model="roleID" placeholder="请选择角色" @change="roleChange" v-if="editBtn">
						<el-option
						v-for="item in roleData"
						:key="item.roleID"
						:label="item.roleName"
						:value="item.roleID">
						</el-option>
					</el-select>
					<!-- <el-checkbox-group v-model="checkList">
						<el-checkbox v-for='item in roleData' :label='item.roleName' :key="item.roleID"></el-checkbox>
					</el-checkbox-group> -->
				</div>
			</div>
			<div class="arrow">
				<img src="../../assets/arrows.png" alt="">
			</div>
			
			<div class="chooseJurisdiction">
				<p>权限选择</p>
				<!-- <div v-for="(item,index) in data" :key='index'> -->
					<el-tree
					:data="data"
					accordion
					show-checkbox
					node-key="resourceID"
					ref='tree'
					>
					</el-tree>
				<!-- </div> -->
				
			</div>
			<div class="save">
				<el-button type="primary" @click="saveSetting" v-if="editBtn">保存</el-button>
			</div>
		</div>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	export default {
		data() {
			return {
				tableData: [],//列表数据
				checkList:[],
				roleData:[],//角色数据
				data:[],
				data1:[],
				tableData1: [
					{
						id: 1,
						label: '基础信息维护',
						children: [
							{
								id: 11,
								label: '公司基础信息维护',
								isChoosed: true,
								add: true,
								update: true,
								delete: true,
								check: false,
								other: [
									{
										id: 111,
										label: '其它权限',
										isSelect: true
									}
								]
							}
							
						]
					},
					{
						id: 2,
						label: '门店管理',
						children: [
							{
								id: 21,
								label: '门店配置',
								isChoosed: true,
								add: false,
								update: false,
								delete: true,
								check: false,
								other: [
									{
										id: 111,
										label: '其它权限',
										isSelect: true
									}
								]
							},
							{
								id: 22,
								label: '窗口管理',
								isChoosed: true,
								add: false,
								update: false,
								delete: true,
								check: false,
								other: [
									{
										id: 111,
										label: '其它权限',
										isSelect: true
									}
								]
							},
							{
								id: 23,
								label: '菜单设置',
								isChoosed: true,
								add: false,
								update: false,
								delete: true,
								check: false
							}
						]
					}
				],
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				roleID: null,
				enterpriseID: 0,
				includeHalfChecked:true,
				leafOnly: false,
				userID: 0,
				//操作按钮
				checkBtn: false,
				editBtn: false,

			}
		},
		mounted() {
			this.enterpriseID = JSON.parse(localStorage.getItem('user')).enterpriseID;
			this.userID = JSON.parse(localStorage.getItem('user')).userID;
			this.getRoleList();
			this.getBtn();
			this.getModels();
		},
		methods: {
			//操作按钮是否显示
            getBtn() {
                let permissions = JSON.parse(localStorage.getItem('user')).permissions;
                if(permissions.indexOf('711') > -1) {
                    this.checkBtn = true;
                }
                if(permissions.indexOf('712') > -1) {
					this.editBtn = true;
                }
            },
			//获取角色
			getRoleList() {
				this.$fetch('/roles/'+this.enterpriseID).then(res => {
					console.log('角色列表',res.data);
					if(!res.state) {
						this.$message.error(res.msg)
					} else {
						this.roleData = res.data;
					}
                }).catch(res => {

                })
			},
			//获取权限模块
			getModels() {
				this.$fetch('/resources/user/' + this.userID).then(res => {
					console.log('模块',res.data)
					if(res.state) {
						// for(let i = 0; i < res.data.length; i ++) {
						// 	let arr = [];
						// 	arr.push(res.data[i]);
						// 	this.data.push(arr);
						// }
						this.data = res.data
					}
				})
			},
			//保存
			saveSetting() {
				let tree = this.$refs.tree;
				let arr = tree.getCheckedKeys();
				// console.log('0000',tree.getCheckedKeys());
				for(let j = 0; j < arr.length; j ++) {
					arr[j] = Number(arr[j]);
				}
				let para = {
					roleID: this.roleID,
					resourceIDs: arr
				}
				this.$post('/role/resource',para).then(res => {
					console.log(res);
					if(!res.state) {
						this.$message.error(res.msg);
					} else {
						this.$message.success('保存成功');
						setTimeout(() => {
							this.$router.go(0);
						},1000)
					}
				})
			},
			roleChange() {
				this.$fetch('/resources/' + this.roleID).then(res => {
					// console.log('88888888888',res.data);
					let tree = this.$refs.tree;
					let data = [];
					let arr = [];
					for(let i = 0; i < res.data.length; i ++) {
						for(let j = 0; j < res.data[i].children.length; j ++) {
							arr.push(res.data[i].children[j].children);
						}
					}
					// console.log('arr',arr);
					for(let m = 0; m < arr.length; m ++) {
						for(let n = 0; n < arr[m].length; n ++) {
							data.push(arr[m][n]);
						}
					}
					tree.setCheckedNodes(data);
				
					// console.log('data',data)
				})
			}
		}
	}

</script>

<style lang='scss'>
	.content-wrapper {
		height: 800px;
	}
	.settingBox {
		width: 92%;
		height: 100%;
		margin-top: 10px;
		overflow: hidden;
		background: #f5f5f5;
		padding-bottom: 20px;
		padding-left: 8%;
		.chooseRole {
			width: 22%;
			float: left;
			p {
				font-size: 24px;
				font-weight: bold;
				color: #3D77FF;
				text-align: center;
				margin-top: 20px;
				margin-bottom: 10px;
			}
			div.checkbox {
				width: 100%;
				// height: 844px;
				padding-bottom: 305px;
				// border: 1px solid #707070;
				// background: #fff;
				.el-select {
					width: 88%;
					margin-top: 30px;
					margin-left: 10%;
				}
				.el-checkbox {
					display: block;
					margin-top: 20px;
					margin-left: 20px;
					.el-checkbox__label {
						font-size: 16px;
					}
				}
			}
		}
		.arrow {
			float: left;
			width: 5%;;
			text-align: center;
			margin-top: 90px;
			img {
				width: 44px;
			}
		}
		.chooseJurisdiction {
			width: 30%;
			float: left;
			p {
				font-size: 24px;
				font-weight: bold;
				color: #00BCBC;
				text-align: center;
				margin-top: 20px;
				margin-bottom: 10px;
			}
			.el-tree {
				border: none;
				background-color: transparent;
			}
			.el-tree-node__content {
				margin-bottom: 8px;
			}
			.el-tree-node__label {
				font-size: 16px;
				color: #707070;

			}
		}
		.save {
			position: relative;
			top: 18px;
			right: -10%;
		}
	}
</style>