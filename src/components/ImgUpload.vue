<template>
  <div class='finish_room'
  >
  	   <div class='finish_room2'>
       	   <div v-for='(item ,index ) in imgs' class='room_img' :key="index">
       	   	  <img :src="item">
				<span @click='delete_img(index)' style="width:20px;"><img src="../assets/delete.png"></span>
       	   </div>
           <div class='room_add_img' v-show="flag">
           	    <span><img src="../assets/licenseBtn.png" alt=""></span>
           	    <input @change='add_img'  type="file" id="fileUpload" name='license'>
           </div>
       </div>
  </div>

</template>

<script >
	export default {
		name: 'ImgUpload',
		props: {
			showAdd: {
				type: Boolean,
				default: true
			}
		},
		data(){
			return{
				imgs: [],
				flag: this.showAdd,
				filesData:{}
			}
		},
		mounted() {
			this.flag = true;
			this.imgs = [];
		},
		methods: {
			delete_img(item){
				this.imgs.splice(item,1);
				this.flag = true;
			},
			add_img(event){
				
				var reader =new FileReader();
				var img1=event.target.files[0];
				reader.readAsDataURL(img1);
				var that=this;
				reader.onloadend=function(){
					that.imgs.push(reader.result)
					that.flag = false;
					console.log('图片',that.imgs)
					
				}
				var files = document.getElementById('fileUpload');
				console.log('----------',files.files);
				this.filesData = files.files;
				this.sendMsgParent();
				
			},
			sendMsgParent() {
				console.log('lalallalalal')
				this.$emit('reciveMsgChild',this.filesData);
				
			}
		}
		  

	}

</script>
<style scoped >
	 .finish_room{
		  width: 100%;
		  height: auto;
	}

     .finish_room2{
   	 width: 100%;
   	 height: auto;
   	 padding-top: 15px;
   	 padding-bottom: 15px;
   }
    
   .finish_room2 .room_img{
   	 width: 150px;
   	 height: 100px;
   	 margin-right: 10px;
   	 position: relative;
   	 overflow: hidden;
   }
   .finish_room2 .room_img img{
   	 
   	 width: 100%;
   	 height: 100%;
   }
   .finish_room2>.room_img span{
   	  position: absolute;
   	  width: auto;
   	  height: auto;
   	  right: 5px;
   	  top:3px;
   }



   .room_add_img{
   	 width: 100%;
   	 height: 100%;
	 line-height:28px;
	 text-align: center; 
	 margin: 0 auto;
	 background: #20a0ff;
	 color: #fff;
	 border-radius: 4px;
   	 border:1px solid #e1e1e1;
   	 position: relative;
   }
   .room_add_img >span:nth-child(1){
   	 overflow: hidden;
   }
   .room_add_img >span:nth-child(2){
   	  margin-bottom: 10px;
   }

  .room_add_img input{
  	  position: absolute;
  	  top: 0px;
  	  left: 0px;
  	  width: 100%;
  	  height: 100%;
  	  z-index: 99999;
  	  opacity: 0;
  }




</style>