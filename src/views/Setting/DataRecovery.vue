<template>
	<section>
        <!-- 数据恢复 -->
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 8px;">
			<el-select v-model="value" placeholder="请选择" @change='selectChange'>
				<el-option
				v-for="item in options"
				:key="item.value"
				:label="item.label"
				:value="item.value"
				>
				</el-option>
			</el-select>
		</el-col>

		<!--列表-->
		<!-- 员工 -->
		<el-table
         :data='staffData' 
         highlight-current-row 
         v-loading="listLoading" 
		 key='firstTable'
		 v-if="value == '1'"
         @selection-change="selsChange" 
         style="width: 100%;">
            <el-table-column 
             type="selection" 
             width="55">
            </el-table-column>
            <el-table-column 
             type="index" 
             label="序号" 
             width="120" 
             sortable/>
            <el-table-column 
             prop="name" 
             label="姓名" 
             width="120" 
             />
            <el-table-column 
             prop="position" 
             label="职位" 
             width="120" 
             />
            <el-table-column 
             prop="department" 
             label="部门" 
             width="120" 
             />
            <el-table-column 
             prop="phoneNumber" 
             label="电话" 
             width="150" 
             />
            <el-table-column 
             prop="email" 
             label="邮箱" 
             min-width="180" 
             >
            </el-table-column>
            <el-table-column 
             label="操作" 
             width="150">
                <template slot-scope="scope">
                    <el-button type="primary" size="small">恢复</el-button>
                    <el-button size="small">清除</el-button>
                </template>
            </el-table-column>
        </el-table>
		<!-- 客户 -->
		<el-table 
         :data='customData'
         highlight-current-row 
         v-loading="listLoading" 
		 key='secondTable'
		 v-if="value == '2'"
         @selection-change="selsChange" 
         style="width: 100%;">
            <el-table-column 
             type="selection" 
             width="55">
            </el-table-column>
            <el-table-column 
             prop="companyName" 
             label="公司名称" 
             width="150" 
             >
            </el-table-column>
            <el-table-column 
             prop="type" 
             label="选择类型" 
             width="150" 
             >
            </el-table-column>
            <el-table-column 
             prop="industry" 
             label="所属行业" 
             width="150" 
             >
            </el-table-column>
            <el-table-column 
             prop="websiteUrl" 
             label="网站地址" 
             width="150" 
             >
            </el-table-column>
            <el-table-column 
             prop="contacts" 
             label="联系人" 
             width="150" 
             >
            </el-table-column>
            <el-table-column 
             prop="email" 
             label="联系邮箱" 
             width="150" 
             >
            </el-table-column>
            <el-table-column 
             prop="phoneNumber" 
             label="联系电话" 
             min-width="120" 
             >
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="primary" size="small">恢复</el-button>
                    <el-button size="small">清除</el-button>
                </template>
            </el-table-column>
        </el-table>
		<!-- 门店 -->
		<el-table 
         :data='storeData'
         highlight-current-row 
         v-loading="listLoading" 
		 key='thirdTable'
		 v-if="value == '3'"
         @selection-change="selsChange" 
         style="width: 100%;">
            <el-table-column 
             type="selection" 
             width="55">
            </el-table-column>
            <el-table-column 
             type="index" 
			 label="序号"
             width="80">
            </el-table-column>
            <el-table-column 
             prop="canteenName" 
             label="名称" 
             width="120" 
             >
            </el-table-column>
            <el-table-column 
             prop="address" 
             label="地址" 
             width="100" 
             >
            </el-table-column>
            <el-table-column 
             prop="enterpriseEmpID" 
             label="负责人" 
             width="100" 
             >
            </el-table-column>
            <el-table-column 
             prop="phoneNumber" 
             label="电话" 
             width="150" 
             >
            </el-table-column>
            <el-table-column 
             prop="note" 
             label="说明" 
             min-width="180" 
             >
            </el-table-column>
            <el-table-column 
             label="操作" 
             width="180">
                <template slot-scope="scope">
                    <el-button type="primary" size="small">恢复</el-button>
                    <el-button size="small">清除</el-button>
                </template>
            </el-table-column>
        </el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination 
			 layout="prev, pager, next" 
			 @current-change="handleCurrentChange" 
			 :page-size="20" 
			 :total="total" 
			 style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				value:'1',
				options:[
					{
						value:'1',
						label:'员工信息'
					},
					{
						value:'2',
						label:'客户信息'
					},
					{
						value:'3',
						label:'门店信息'
					},
				],
				staffData: [],//员工数据
				customData:[],//客户数据
				storeData:[],//门店数据
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列
			}
		},
		mounted() {
		},
		methods: {
			selectChange(val) {
				if(val == '1') {
					this.value = '1';
				} else if(val == '2') {
					this.value = '2';
				} else if(val == '3') {
					this.value = '3';
				}
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
		},
		
	}

</script>

<style scoped>

</style>