<template>
	<div class="user">
		 <div v-if="logShow" class="check-login">
		 	登录之后才可以查看个人信息
		 	<el-button type="primary" @click="goLogin" v-bind:style="{marginLeft:'20px'}">登录</el-button>
		 </div>
	     <el-form v-else :model="ruleForm" status-icon :rules="rules":label-position="labelPosition" ref="ruleForm" label-width="160px" class="demo-ruleForm">
			  <el-form-item label="请输入身份证号" prop="idcard">
			    <el-input  v-model="ruleForm.idcard" placeholder="请输入身份证号" :disabled="perfect"></el-input>
			  </el-form-item>
			  <el-form-item label="请上传身份证正面照片">
			  	<el-upload
				  class="upload-demo"
				  :disabled="perfect"
				  action="../center/uploadImg"
				  name="img"
				  :show-file-list="showlist"
				   multiple
				  :limit="1"
				  :on-exceed="handleExceed"
				  :on-success="handleSuccess">
				   <el-button type="primary" :disabled="perfect">浏览</el-button>
				</el-upload>
			  	
			  </el-form-item>
			  <div class="img-wrapper"><img v-bind:src="imgsrc" alt=""/></div>
			  <el-form-item label="请填写国外就读大学" prop="university">
			    <el-input  v-model="ruleForm.university" placeholder="请输入国外就读大学" :disabled="perfect"></el-input>
			  </el-form-item>
			  <el-form-item>
			    <el-button type="primary" @click="submitForm('ruleForm')" v-if="!perfect" v-loading.fullscreen.lock="loadingFlag" element-loading-text="拼命提交中"
	    element-loading-spinner="el-icon-loading"
	    element-loading-background="rgba(0, 0, 0, 0.8)">提交</el-button>
			  </el-form-item>
		</el-form>
	</div>
</template>

<script>
 import axios from 'axios';
 const querystring = require('querystring');
 export default {
 	name: 'User',
    data() {
      var checkIdCard = (rule, value, callback) => {
      	if(this.perfect){
      		return false;
      	}
        if (!value) {
          callback(new Error('请输入身份证号'));
        }else if(!this.cardreg.test(value)){
          callback(new Error('身份证格式不正确'));
        }else{
          callback();
        }
      };
      var checkUniversity = (rule, value, callback) => {
      	if(this.perfect){
      		return false;
      	}
        if (!value) {
          callback(new Error('请输入国外就读大学'));
        }else{
          callback();
        }
      };
      return {
      	loadingFlag:false,
      	logShow:true,
      	student:null,
      	perfect:false,
      	studentId:null,
      	cardreg:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      	labelPosition:'left',
      	imgsrc:'',
      	showlist:false,
      	uploader:false,
        ruleForm: {
          idcard: '',
          university:''
        },
        rules: {
          idcard: [
            { validator: checkIdCard, trigger: 'blur' }
          ],
          university: [
            { validator: checkUniversity, trigger: 'blur' }
          ]
        }
      };
    },
    beforeMount(){
       this.student = JSON.parse(sessionStorage.getItem('student'));
       if(this.student){
       	  this.studentId = this.student.studentId;
       	  this.logShow = false;
//     	  console.log(this.student)
       	  this.perfect = this.student.perfect;
       	  if(this.student.perfect){
       	  	  this.imgsrc = this.student.idCardPic;
	       	  this.ruleForm.idcard = this.student.idCardNo;
	       	  this.ruleForm.university = this.student.university;
       	  }
       }else{
       	   this.logShow = true;
//     	   this.$router.push({name:'Login'});
       }
    },
    methods: {
      goLogin(){
      	this.$router.push({name:'Login'});
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
          	 if(this.uploader){
          	 	this.subData()
          	 }else{
          	 	this.$message({
		          message:'请上传图片',
		          type: 'warning',
		          duration:1500,
		          center:true
	           });
          	 }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      handleSuccess(response,file, fileList){
//    	 console.log(response);
      	 if(response.success){
      	 	 this.$message({
		          message:'上传成功',
		          type: 'success',
		          duration:1500,
		          center:true
	         });
      	 	 this.imgsrc = response.data.url;
      	 	 this.uploader = true;
      	 }else{
      	 	 this.uploader = false;
	  	 	 this.$message({
		          message:'上传失败',
		          type: 'error',
		          duration:1500,
		          center:true
	         });
      	 }
      },
      subData(){
      	  this.loadingFlag = true;
  	      var that = this;
      	  axios({
			  method: 'post',
			  url:'../center/updateInformation',
			  data:querystring.stringify({
			  	 studentId:this.studentId,
			  	 idCardNo:this.ruleForm.idcard,
			  	 idCardPic:this.imgsrc,
			  	 university:this.ruleForm.university
			  })
		  })
      	  .then(function(r){
      	  	  that.loadingFlag = false;
              if(r.data.success){
              	 that.student.idCardNo = that.ruleForm.idcard;
              	 that.student.idCardPic = that.imgsrc;
              	 that.student.university = that.ruleForm.university;
              	 that.student.perfect = true;
              	 sessionStorage.setItem('student',JSON.stringify(that.student));
              	 that.$router.push({ name: 'ImproveSuccess'});
              }else{
              	  that.$message({
			          message:r.data.desc,
			          type: 'error',
			          duration:1500,
			          center:true
                  });
              }
      	  })
      	  .catch(function (error) {
               that.$message({
		          message:'请求失败',
		          type: 'error',
		          duration:1500,
		          center:true
               });
  		  });
      }
    }
  }
</script>

<style scoped>
   .user{
   	  height:100%;
   }
   .check-login{
   	    text-align:center;
  	    line-height:560px;
   }
   form{
   	 padding-top:56px;
   	 padding-left:176px;
   }
   .el-input{
		width:400px;
    }
    .img-wrapper{
    	width:560px;
    	height:160px;
    	margin-bottom:30px;
    	border-radius: 4px;
        border: 1px solid #dcdfe6;
    }
     .img-wrapper>img{
    	width:100%;
    	height:100%;
    }
</style>