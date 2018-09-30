<template>
    <el-upload 
        class="avatar-uploader" 
        :class="{disabled:uploadDisabled}" 
        :action="ImageUploadUrl" 
        list-type="picture-card" 
        :file-list="imagelist" 
        :auto-upload="false"
        name="logoImage" 
        :on-change="handleChange"
        :on-success="handleUploadSuccess" 
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
    </el-upload>
</template>
<script>
    export default {
        name:'UploadImg',
        data() {
            return {
                imagelist:[],

            }
        },
        computed: {
            uploadDisabled: function() {
                return this.imagelist.length > 0
            }
        },
        methods: {
            handleUploadSuccess() {
                console.log(this.imagelist)
            },
            handleRemove(file, fileList) {
                this.imagelist = fileList
            },
            handleChange(file, fileList) {
                this.imagelist = fileList
            },
        }
    }
</script>
<style lang='scss'>
    .disabled .el-upload--picture-card {
        display: none;
    }
</style>

