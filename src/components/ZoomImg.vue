<template>
    <div style="width:140px;height:150px;position:relative;border:1px solid #ccc;border-radius:6px;">
        <a href="javascript:void(0)" 
            @click="getImage($event)">
            <img :src="img_url" alt="" class="img_style_small">
            </a>
        <div :id="currentID" class="white_content">

            <img :src="img_url_new" alt="无图片" style="width:auto;height:auto;max-width:100%;max-height:100%;">

            <a href="javascript:void(0)" 
                @click="closeImage($event)">
                <img src="../assets/delete.png" alt="" style="width:30px;position: absolute;top: 4px;right: 10px;">
            </a>
        </div>
        <!-- <div id="fade" class="black_overlay"></div> -->
    </div>
</template>
<script>
    export default {
        name:'ZoomImg',
        props: {
            imgURL: {
                type: String,
                default:''
            },
            itemID: {
                type: String,
                default:''
            }
        },
        data() {
            return {
                img_url: this.imgURL,
                img_url_new:'',
                currentID: this.itemID
            }
        },
        mounted() {
        },
        methods: {
            getImage(e) {
                this.img_url_new = "";
                this.img_url_new  = e.target.src;
                document.getElementById(this.currentID).style.display='block';
                // document.getElementById('fade').style.display='block';
            },
            closeImage(e) {
                document.getElementById(this.currentID).style.display='none';
                // document.getElementById('fade').style.display='none'
            }
           
        }

    }
</script>
<style lang='scss' scoped>
    .black_overlay{
        display: none;
        position: absolute;
        top: 0%;
        left: 0%;
        width: 100%;
        height: 100%;
        background-color: #888;
        z-index: 8888;
    }
    .white_content{
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        width: 500px;
        height: 500px;
        margin-left: -250px;
        margin-top: -50%;
        padding: 30px;
        background-color: white;
        border-radius: 10px;
        z-index: 8889;
        overflow: hidden;
        text-align: center;
        box-shadow:  0px 2px 20px 5px;
    }
    .img_style_small {
        margin:0 auto;
        width:auto;
        height:auto;
        max-width:100%;
        max-height:100%;
        display:block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
</style>

