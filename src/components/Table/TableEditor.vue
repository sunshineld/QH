<template>
    <el-dialog
    :title="title" 
    :visible.sync="visible"
    @open="dialogVisibleOpen"
    @close="dialogVisibleClose"
    :close-on-click-modal="clickClose"
    :show-close="isClose"
    >
        <slot name="content"></slot>
        <template slot="footer">
            <slot name="foot"></slot>
        </template>
    </el-dialog>
</template>

<script>
    export default {
        name: 'ITableEditor',
        props: {
            value: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            },
            clickClose: {
                type: Boolean,
                default: false
            },
            isClose: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                visible: this.value
            }
        },
         watch: {
            value(newValue) {
                this.visible = newValue;
            },
            visible(newValue) {
                this.$emit("input", newValue);
            }
        },
        methods: {
            dialogVisibleClose() {
                this.$emit('dialogVisibleClose');
            },
            dialogVisibleOpen() {
                this.$emit('dialogVisibleOpen');
            }
        }
    }
</script>
<style lang='scss'>
    .el-dialog__header {
        border-radius: 12px 12px 0 0;
    }
    .el-dialog {
        border-radius: 12px;
    }
</style>
