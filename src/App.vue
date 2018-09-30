<template>
	<div id="app">
		<transition name="fade"
		            mode="out-in">
			<router-view></router-view>
		</transition>
		
	</div>
</template>

<script>
// import { dynamicRouter, getRouters } from './dyRouter.js'
import Home from './views/Home.vue'
import Staff from './assets/staff.png'
import './styles/common.scss'
export default {
	name: 'app',
	data() {
		return {
			
		}
	},
	methods: {
		
	},
	created() {
	},
	mounted() {
		
	},
	components: {
	}
}

</script>
<style lang="scss">
html {
	width: 100%;
	height: 100%;
}
body {
	width:100%;
	height: 100%;
	margin: 0px;
	padding: 0px;
	/*background: url(assets/bg1.jpg) center !important;
		background-size: cover;*/
	// background: #1F2D3D;
	font-family: Helvetica Neue, Helvetica, Hiragino Sans GB, PingFang SC, Microsoft YaHei, SimSun, sans-serif,Arial;
	// font-family: 'PingFangSC-Bold';
	font-size: 14px;
	-webkit-font-smoothing: antialiased;
}
textarea {
	font-family: Helvetica Neue, Helvetica, Hiragino Sans GB, PingFang SC, Microsoft YaHei, SimSun, sans-serif,Arial;
}
#app {
	width: 100%;
	height: 100%;
}

.el-submenu [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}
.el-menu-item.white {
	color: #fff;
}
.el-menu-item [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}
.el-submenu__title {
	color: #fff !important;
}
.toolbar {
	background-color:#F4F3EF;
	padding: 10px;
	//border:1px solid #dfe6ec;
	margin: 10px 0px;
	white-space: nowrap;
	overflow-x: auto;
	.el-form-item {
		margin-bottom: 10px;
	}
}
.fade-enter-active,
.fade-leave-active {
	transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}
ul {
	list-style: none;
}
.addDialog {
	.el-dialog-small {
		width: 740px;
		.el-form {
			width: 80%;
			margin: 0 auto;
		}
	}
}
.el-dialog { 
	backface-visibility:hidden;
	-webkit-backface-visibility:hidden;	/* Chrome 和 Safari */
	-moz-backface-visibility:hidden; 	/* Firefox */
	-ms-backface-visibility:hidden; 	/* Internet Explorer */
}
.el-dialog__header {
	background-color:#F4F3EF;
	border-radius: 12px 12px 0 0 !important;
	padding: 16px 16px 16px 16px !important;
	.el-dialog__title {
		font-size: 22px;
	}
}

//财务流水-数据展示
ul.dataPlay {
		display: flex;
		width: 100%;
		background: #f4f3ef;
		padding: 0;
		height: 240px;
		li {
			width: 390px;
			height: 190px;
			background: gray;
			margin-top: 25px;
			margin-left: 30px; 
			vertical-align: middle;
			color: #fff;
			div.title {
				float: left;
				width: 40%;
				height: 188px;
				border: 1px solid #fff;
				text-align: center;
				p {
					font-size: 20px;
					margin: 0;
					margin-top: 10px;
				}
				p:first-child {
					margin-top: 67px;
				}

			}
			div.list {
				float: left;
				width: 58%;
				position:relative;
				height:100%;
				div {
					width: 100%;
					text-align: center;
					position:absolute;
					top:50%;
					left:50%; 
					transform: translate(-50%, -50%);
					p>span {
						display:inline-block;
						text-align:right; 
						width:85px;
					}
					p>span:nth-child(2) {
						text-align: left;
					}
				}
			}
		}
		li:nth-child(1) {
			background: #fe6e00;
			div.title {
				border-top: 1px solid #fe6e00;
				border-left: 1px solid #fe6e00;
				border-bottom: 1px solid #fe6e00;
			}
			
		}
		li:nth-child(2) {
			background: #00bdbc;
			div.title {
				border-top: 1px solid #00bdbc;
				border-left: 1px solid #00bdbc;
				border-bottom: 1px solid #00bdbc;
				
			}
			
		}
	}

</style>