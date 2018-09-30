<template>
    <section>
        <!-- <el-input style="width:35%;margin-bottom:20px;display:block;" placeholder="请输入就餐时间"></el-input> -->
        <el-input style="width:50%;margin-bottom:20px;margin-right:10px;margin-top:20px;" placeholder="请输入菜品名称" v-model="searchName"></el-input>
        <el-button type="primary" @click='search'>搜索</el-button>
        <el-table
        :data="menuData"
        height="250"
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
                label="操作" 
                width="150"
            >
                <template slot-scope="scope">
                    <span type="primary" size="small" @click="addMenu(scope.row)" v-if='!scope.row.flag' style="color:#20A0FF;cursor:default;">添加</span>
                    <span type="primary" size="small" v-if='scope.row.flag' style="color:#B5DFFF;cursor:default;">已添加</span>
                </template>
            </el-table-column>
        </el-table>
        <p style="font-size:18px;font-weight:bold;">已添加的菜单</p>
        <!-- 已添加菜单 -->
        <el-table
        :data="menuAddData"
        height="250"
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
                label="操作" 
                width="150"
            >
                <template slot-scope="scope">
                    <span type="danger" size="small" @click="deleteMenu(scope.row)" style="cursor:default;color:#F44831;">删除</span>
                </template>
            </el-table-column>
        </el-table>
    </section>
</template>
<script>
    export default {
        name: 'Eltable',
        props: {
            menuValue: {
                type: Array,
                default:() => {
                    return [];
                }
            },
            menuAddValue: {
                type: Array,
                default:() => {
                    return [];
                }
            }
        },
        data() {
            return {
                menuData: this.menuValue,
                menuAddData: this.menuAddValue,
                searchName:''
            }
        },
        watch: {
            menuValue(newValue) {
                this.menuData = newValue;
            },
            menuAddValue(newValue) {
                this.menuAddData = newValue;
            }
        },
        mounted() {
            // console.log("hahah",this.menuData)
        },
        methods: {
            //查询
            search() {
                this.$emit('searchBtn',this.searchName);
                
            },
            //添加
            addMenu(val) {
                this.$emit('addBtn',val);
            },
            //删除
            deleteMenu(val) {
                this.$emit('deleteBtn',val);
            }
        }
    }
</script>
<style lang='scss'>
    .el-table__header {
        width: 100% !important;
    }

</style>
