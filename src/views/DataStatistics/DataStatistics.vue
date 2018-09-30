<template>
    <!-- 数据统计 -->
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-date-picker
					v-model="timer"
					type="daterange"
					align="right"
					unlink-panels
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
                    @change="getDate"
                    :clearable='false'
					:picker-options="pickerOptions">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="门店">
					<el-select v-model="canteenID" placeholder="请选择">
						<el-option
						v-for="item in storeData"
						:key="item.canteenID"
						:label="item.canteenName"
						:value="item.canteenID">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="search">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
        <!-- 数据展示 -->
        <ul class="dataPlay">
            <li>
                <div class="imgPeople"><img src="../../assets/people.png" alt=""></div>
                <div class="text">
                    <p>{{totalPeople}}人</p>
                    <p>就餐人数</p>
                </div>
            </li>
            <li>
                <div class="imgMoney"><img src="../../assets/money.png" alt=""></div>
                <div class="text">
                    <p>{{turnOver}}元</p>
                    <p>营业额</p>
                </div>
            </li>
        </ul>
        <!-- 图形展示 -->
        <section class="echartsPlay">
            <el-row>
                <el-col :span="24">
                    <div id="chartLine" style="width:100%; height:400px;"></div>
                </el-col>
                <el-col :span="14" class="bar">
                    <div id="chartBar" style="width:100%; height:400px;"></div>
                </el-col>
                <el-col :span="10">
                    <div id="chartPie" style="width:100%; height:400px;"></div>
                </el-col>
            </el-row>
        </section>
        <!-- 具体描述 -->
        <section class="description">
            <div class="title">具体描述 <span>Specific description</span></div>
            <el-row :gutter="40">
                <el-col :span="6" v-for="(item,index) in specificData" :key='index'>
                    <div class="bg-white">
                        <p class="text">{{item.text}}</p>
                        <p class="number">{{item.number}}</p>
                    </div>
                </el-col>
            </el-row>
            <div class="foot">
                <p>当前统计时间段为{{start_time}}至{{end_time}}</p>
            </div>
        </section>
    </section>
</template>
<script>
    import echarts from 'echarts'
    import util from '../../common/js/util'
    export default {
        data() {
            return {
                specificData:[
                    {
                        text:'总营业额',
                        number:'9999元'
                    },
                    {
                        text:'总退款金额',
                        number:'888元'
                    },
                    {
                        text:'固定就餐人数',
                        number:'1200人'
                    },
                    {
                        text:'临时就餐人数',
                        number:'100人'
                    },
                    {
                        text:'下属门店数量',
                        number:'50家'
                    },
                    {
                        text:'微信支付人数',
                        number:'333人'
                    },
                    {
                        text:'现金账户支付人数',
                        number:'555人'
                    },
                    {
                        text:'福利金账户支付人数',
                        number:'666人'
                    }
                ],
                timer:[],//查询时间
                start_time:'',
                end_time:'',
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
                canteenID:null,//门店ID
                chartBar: null,
                chartLine: null,
                chartPie: null,
                storeData:[],
                enterpriseID: 0,
                totalPeople:0,//就餐人数
                turnOver:0,//营业额
                breakFirstData:[],
                lunchData:[],
                dinnerData:[],
                nightSnackData:[],
                tempData:[],
                lineDateX:[],
                wechatData:[],
                cashData:[],
                welfareData:[],
                barDateX:[],
                wechatPieData:0,
                cashPieData:0,
                welfarePieData:0,
            }
        },
        mounted() {
            this.enterpriseID = JSON.parse(localStorage.getItem('user')).enterpriseID;
            this.drawLineChart();
            this.drawBarChart();
            this.drawPieChart();
            this.getLine();
            this.getBar();
            this.getPie();
            this.getStoreList();
            this.getCustomersData();
            this.getTurnover();
            this.getTotalData();
            //图表根据窗口适应大小
            let _this = this;
            window.addEventListener('resize',function(){
                _this.chartBar.resize();
                _this.chartLine.resize();
                _this.chartPie.resize();
            })
            
        },
        methods: {
            //折线图
            drawLineChart() {
                this.chartLine = echarts.init(document.getElementById('chartLine'));
                this.chartLine.setOption({
                    backgroundColor: "#fff",
                    title: {
                        text: '线性图',
                        subtext:'Line Chart'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['早餐', '午餐', '晚餐', '夜宵','临时加餐']
                    },
                    grid: {
                        left: '10%',
                        right: '10%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.lineDateX,
                        axisLabel:{
                            //X轴刻度配置
                            interval:'auto' //0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
                        }
                    },
                    yAxis: {
                        type: 'value',
                        name:'单位/元'
                    },
                    series: [
                        {
                            name: '早餐',
                            type: 'line',
                            stack: '总量',
                            data: this.breakFirstData
                        },
                        {
                            name: '午餐',
                            type: 'line',
                            stack: '总量',
                            data: this.lunchData
                        },
                        {
                            name: '晚餐',
                            type: 'line',
                            stack: '总量',
                            data: this.dinnerData
                        },
                        {
                            name: '夜宵',
                            type: 'line',
                            stack: '总量',
                            data: this.nightSnackData
                        },
                        {
                            name: '临时加餐',
                            type: 'line',
                            stack: '总量',
                            data: this.tempData
                        }
                    ]
                });
            },
            //柱状图
            drawBarChart() {
                 this.chartBar = echarts.init(document.getElementById('chartBar'));
                 this.chartBar.setOption({
                    backgroundColor:'#FFFFFF',
                    title: {
                        text: '柱状图',
                        subtext: 'Bar Chart Example',
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data: ['现金', '福利金', '微信']
                    },
                    
                    grid: {
                        left: '11%',
                        right: '10%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        data: this.barDateX
                    }],
                    yAxis: [{
                        type: 'value',
                        name: '单位/元',
                        axisLabel: {
                            formatter: '{value}',
                            interval:'auto',
                        }
                    }],
                    series: [{
                        name: '现金',
                        type: 'bar',
                        stack: '金额',
                        itemStyle:{
                            normal:{color:'#015dc9'},
                        },
                        barWidth: 16,
                        data: this.cashData
                    }, {
                        name: '福利金',
                        type: 'bar',
                        stack: '金额',
                        itemStyle:{
                            normal:{color:'#00bdbc'},
                        },
                        barWidth: 16,
                        data: this.welfareData
                    }, {
                        name: '微信',
                        type: 'bar',
                        stack: '金额',
                        itemStyle:{
                            normal:{color:'#815ee9'},
                        },
                        barWidth: 16,
                        data: this.wechatData
                    }]
                 });
            },
            //饼图
            drawPieChart() {
                this.chartPie = echarts.init(document.getElementById('chartPie'));
                this.chartPie.setOption({
                    backgroundColor: "#fff",
                    title: {
                        text: '饼状图',
                        subtext: 'Donut Chart Example',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['现金账户', '微信账户', '福利卡账户']
                    },
                    
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '50%',
                            center: ['50%', '50%'],
                            data: [
                                { value: this.cashPieData, name: '现金账户' },
                                { value: this.wechatPieData, name: '微信账户' },
                                { value: this.welfarePieData, name: '福利卡账户' },
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
            },
            //获取初始参数
            getParameter() {
                this.start_time = util.formatDate.getCurrentMonthFirst();
				this.start_time = util.formatDate.format(this.start_time);//获取当月的1号
                this.end_time = util.formatDate.getDay(1);//获取当天日期
                let para = {
                    startTime: this.start_time,
                    endTime: this.end_time,
                    cateringID: this.enterpriseID,
                    canteenID: this.canteenID
                }
                return para;
            },
            //查询
            search() {
                console.log(this.start_time,this.end_time,'门店',this.canteenID);
                let para = {
                    startTime: this.start_time,
                    endTime: this.end_time,
                    canteenID: this.canteenID,
                    cateringID: this.enterpriseID
                }
                this.getLineAjax(para);
                this.getBarAjax(para);
                this.getPieAjax(para);
                this.getCustomersAjax(para);
                this.getTurnoverAjax(para);
            },
            //获取折线图
            getLine() {
                let para = this.getParameter();
                this.timer.push(this.start_time);
                this.timer.push(this.end_time);
                // console.log('参数',para);
                this.getLineAjax(para);
            },
            //获取折线图ajax
            getLineAjax(para) {
                this.$post('/consumingRecords/canteenDayBusinessVolumeAnalysis',para).then(res => {
                    // console.log('初始化',res);
                    if(res.state) {
                        this.breakFirstData = res.data.breakfast;
                        this.lunchData = res.data.lunch;
                        this.dinnerData = res.data.dinner;
                        this.nightSnackData = res.nightSnack;
                        this.tempData = res.data.temp;
                        this.lineDateX = res.data.date;
                        this.drawLineChart();
                    }
                })
            },
            //获取柱状图
            getBar() {
                let para = this.getParameter();
                this.getBarAjax(para);
            },
            //获取柱状图ajax
            getBarAjax(para) {
                this.$post('/consumingRecords/canteenDayPayTypeAnalysis',para).then(res => {
                    // console.log('柱状图',res)
                    if(res.state) {
                        this.wechatData = res.data.wechat;
                        this.cashData = res.data.cash;
                        this.welfareData = res.data.welfare;
                        this.barDateX = res.data.day;
                        this.drawBarChart();
                    }
                })
            },
            //获取饼状图
            getPie() {
                let para = this.getParameter();
                this.getPieAjax(para);
            },
            //获取饼状图ajax
            getPieAjax(para) {
                this.$post('/consumingRecords/enterprisePayTypeAnalysis', para).then(res => {
                    // console.log('饼状图',res);
                    if(res.state) {
                        this.wechatPieData = res.data.wechat;
                        this.cashPieData = res.data.cash;
                        this.welfarePieData = res.data.welfare;
                        this.drawPieChart();
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
							this.start_time = util.formatDate.format(this.timer[0]);
							this.end_time = util.formatDate.format(this.timer[1]);
							console.log('change_start', this.start_time);
							console.log('change_end',this.end_time);
						}
					}
				}	
            },
            //获取门店
			getStoreList() {
				this.$fetch('/canteens/' + this.enterpriseID).then(res => {
                    this.storeData = res.data;
                })
            },
            //获取就餐人数
			getCustomersData() {
				let para = this.getParameter();
				this.getCustomersAjax(para);
            },
            //获取就餐人数ajax
            getCustomersAjax(para) {
                this.$post('/consumingRecords/enterpriseCustomerAnalysis',para).then(res => {
					if(res.state) {
						let enterpriseCustome = res.data.enterpriseCustome;
						let tempCustome = res.data.tempCustome;
                        this.totalPeople = enterpriseCustome + tempCustome;
					}
				})
            },
            //获取营业额
			getTurnover() {
				let para = this.getParameter();
				this.getTurnoverAjax(para)
            },
            //获取营业额ajax
            getTurnoverAjax(para) {
                this.$post('/consumingRecords/enterpriseBusinessVolumeAnalysis',para).then(res => {
                    if(res.state) {
                        this.turnOver = res.data.totalMoney;
                    }
				})
            },
            //获取具体描述数据
            getTotalData() {
                let para = {
                    cateringID: this.enterpriseID
                };
                this.$post('/consumingRecords/windowAnalysis',para).then(res => {
                    console.log('total',res);
                    for(let i = 0,len = this.specificData.length; i < len; i ++) {
                        if(this.specificData[i].text == '总营业额') this.specificData[i].number = res.data.totalMoney;
                        if(this.specificData[i].text == '总退款金额') this.specificData[i].number = res.data.refundMoney;
                        if(this.specificData[i].text == '固定就餐人数') this.specificData[i].number = res.data.enterpriseCustome;
                        if(this.specificData[i].text == '临时就餐人数') this.specificData[i].number = res.data.tempCustome;
                        if(this.specificData[i].text == '下属门店数量') this.specificData[i].number = res.data.canteenCount;
                        if(this.specificData[i].text == '微信支付人数') this.specificData[i].number = res.data.wechat;
                        if(this.specificData[i].text == '现金账户支付人数') this.specificData[i].number = res.data.cash;
                        if(this.specificData[i].text == '福利金账户支付人数') this.specificData[i].number = res.data.welfare;
                    }
                })
            },
        }
    }
</script>
<style lang='scss' scoped>
    ul.dataPlay {
        height: 158px;
        li {
            width: 260px;
            height: 110px;
            color: #777;
            background: #fff;
            box-shadow: 0px 1px 8px #888888;
            div.imgPeople, div.imgMoney {
                float: left;
                width: 60px;
                height: 60px;
                line-height: 60px;
                border-radius: 50%;
                text-align: center;
                margin-left: 20px;
                margin-right: 34px;
                margin-top: 25px;
                img {
                    vertical-align: middle;
                }
            }
            div.imgPeople {
                background: #008dfe;
            }
            div.imgMoney {
                background: #F44932;
            }
            div.text {
                float:left;
                margin-top: 17px;
                p {
                    margin: 0;
                }
                p:nth-child(1) {
                    margin-bottom: 18px;
                    font-size: 24px;
                }
            }
        }
        li:nth-child(1) {
            margin-right: 20px;
        }
    } 
    .echartsPlay {
        background: #f4f3ef;
        padding: 20px 20px;
        #chartLine {
            padding-top: 50px;
            padding-bottom: 50px;
        }
        #chartBar, #chartPie {
            padding-top: 50px;
            margin-top: 30px;
        }
    //    .bar {
    //     //    margin-right: 20px;
    //    }
    }
    .description {
        background: #f4f3ef;
        padding: 0 26px 50px 26px;
        div.title {
            background: #fff;
            font-size: 20px;
            font-weight: bold;
            padding:16px 0 16px 30px;
            span {
                font-size: 14px;
                font-weight: normal;
                color: #555;
            }
        }
        .el-row {
            background: #f4f3ef;
        }
        .bg-white {
            margin-top: 24px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0px 1px 8px #888888;
            overflow: hidden;
            font-size: 18px;
            color: #555;
            p.text {
                float: left;
                font-weight: bold;
                margin-left: 24px;
            }
            p.number {
                float: right;
                margin-right: 40px;
            }
        }
        div.foot {
            margin-top: 104px;
            font-size: 18px;
            color: #888;
            overflow: hidden;
            p {
                float: right;
            }
        }
    }
    
</style>
