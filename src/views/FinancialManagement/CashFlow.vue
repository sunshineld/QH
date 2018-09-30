<template>
    <!-- 现金流水 -->
    <section>
    <!-- 工具条 -->
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
				@change="getDate"
                :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
            <!-- <el-form-item label="餐饮公司">
                <el-input></el-input>
            </el-form-item>
            <el-form-item label="门店名称">
                <el-select v-model="canteenName" placeholder="请选择" clearable>
					<el-option
					v-for="item in storeData"
					:key="item.canteenID"
					:label="item.canteenName"
					:value="item.canteenID">
					</el-option>
				</el-select>
            </el-form-item> -->
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
            <el-form-item label="用户名称">
                <el-input v-model="filters.customerName" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
        </el-form>
    </el-col>
    <!-- 数据展示 -->
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
			 prop="price" 
			 label="金额（元）" 
			 >
			</el-table-column>
			<el-table-column 
			 prop="operateTime" 
			 label="时间" 
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
					enterpriseID: null,
					customerName:'',
					consumingTypeID: 3,//充值

					cateringID: null,
					startTime: '',
					endTime: '',
					currentPage: 1,
					pageSize: 10
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
                tableData:[],//列表数据
				sels:[],
				total:0,
				listLoading: false,
				customerData:[],//客户数据
				storeData:[],//门店数据
				cateringID: 0,
				enterpriseID:null,
				turnOver:0,
            }
        },
        mounted() {
			this.enterpriseID = JSON.parse(localStorage.getItem('user')).enterpriseID;
			this.initTime();
			this.initData();
			this.getCustomersList();
        },
        methods: {
			handleCurrentChange(val) {
				this.filters.currentPage = val;
				this.getCashFlow();
			},
            selsChange(sels) {
                this.sels = sels
			},
			//获取客户
			getCustomersList() {
				this.$fetch('/enterprises/' + this.enterpriseID).then(res => {
                    if(res.state) {
						this.customerData = res.data;
						let obj = {
							enterpriseID: null,
							enterpriseName: '全部'
						}
						this.customerData.unshift(obj);
                    }
                })
			},
			//获取日期
			getDate() {
				if(typeof this.timer == undefined) return;
				if(typeof this.timer == 'object') {
					console.log(typeof this.timer[0])
					if(typeof this.timer[0] == 'object') {
						if(this.timer[0] == null && this.timer[1] == null){
							console.log('null')			
						} else {
							this.filters.start_time = util.formatDate.format(this.timer[0]);
							this.filters.end_time = util.formatDate.format(this.timer[1]);
						}
					}
				}	
			},
			//查询
			search() {
				this.filters.currentPage = 1;
				this.initData();
			},
			//初始化时间
			initTime() {
				let start_time = util.formatDate.getCurrentMonthFirst();
				start_time = util.formatDate.format(start_time);//获取当月的1号
				let end_time = util.formatDate.getDay(1);//获取当天日期
				this.filters.startTime = start_time;
				this.filters.endTime = end_time;
				this.timer.push(start_time);
				this.timer.push(end_time);

			},
			//获取页面初始数据
			initData() {
				this.getCashFlow();
				this.getTurnover();
			},
			//获取现金充值流水
			getCashFlow() {
				// console.log('参数',this.filters)
				this.$post('/consumingRecords',this.filters).then(res => {
					if(res.state) {
						this.tableData = res.data.list;
						this.total = res.data.total;
					}
					
				})
				
			},
			//获取营业额
			getTurnover() {
				// let para = this.getParameter();
				this.$post('/consumingRecords/enterpriseBusinessVolumeAnalysis',this.filters).then(res => {
					if(res.state) {
						this.turnOver = res.data.totalMoney;
					}
				})
			}
        }
    }
</script>
<style lang='scss' scoped>
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

