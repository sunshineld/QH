<!--合作客户-->
<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="请输入公司名称" clearable></el-input>
                </el-form-item>
                <el-form-item v-if="checkBtn">
                    <el-button type="primary"  @click="search">查询</el-button>
                </el-form-item>
                <el-form-item v-if="addBtn">
                    <el-button type="primary"  @click="handleAdd">新增</el-button>
                </el-form-item>
                <el-form-item v-if='deleBtn'>
                    <el-button type="danger"  @click="batchRemove" :disabled="this.sels.length < 2">批量删除</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table 
         :data='tableData'
         highlight-current-row 
         v-loading="listLoading" 
         @selection-change="selsChange" 
         style="width: 100%;">
            <el-table-column 
             type="selection" 
             width="55">
            </el-table-column>
            <el-table-column 
             prop="enterpriseName" 
             label="公司名称" 
             width="150" 
             >
            </el-table-column>
            <el-table-column 
             prop="enterpriseTypeName" 
             label="选择类型" 
             width="150" 
             >
            </el-table-column>
            <el-table-column 
             prop="industryType" 
             label="所属行业" 
             width="150" 
             >
            </el-table-column>
            <el-table-column 
             prop="website" 
             label="网站地址" 
             width="200" 
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
             width="200" 
             >
            </el-table-column>
            <el-table-column 
             prop="contactNumber" 
             label="联系电话" 
             min-width="150" 
             >
            </el-table-column>
            <el-table-column 
             label="状态" 
             width="100" 
             >
             <template slot-scope="scope">
                <el-tag type="success" v-if='scope.row.state'>正常</el-tag>
                <el-tag type="danger"  v-if='!scope.row.state'>已停用</el-tag>
             </template>
            </el-table-column>
            <el-table-column label="操作" min-width="300">
                <template slot-scope="scope">
                    <el-button size="small" type="primary" v-if="checkBtn" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
                    <el-button size="small" type="primary" v-if="editBtn" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="primary" size="small" v-if='editBtn && !scope.row.state' @click="startUsing(scope.$index, scope.row)">启用</el-button>
                    <el-button type="danger" size="small"  v-if='editBtn && scope.row.state' @click="stopUsing(scope.$index, scope.row)">停用</el-button>
                    <el-button type="danger" size="small" v-if='deleBtn' @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <!-- <el-col :span="24" class="toolbar">
            <el-pagination 
             layout="prev, pager, next" 
             @current-change="handleCurrentChange" 
             :page-size="20" 
             :total="total" 
             style="float:right;">
            </el-pagination>
        </el-col> -->
        <!-- 编辑 -->
        <I-table-editor
         :title='title'
         v-model="addFormVisible"
         @dialogVisibleClose='closeDialog'
         class="dailogBox"
        >
            <template slot='content'>
                <el-form :model="form" label-width="120px" :rules="rules" ref="form">
                <el-form-item label="公司名称" prop="enterpriseName">
                    <el-input v-model="form.enterpriseName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="选择类型" prop="enterpriseTypeID">
                    <el-select v-model="form.enterpriseTypeID" placeholder="请选择">
                        <el-option
                        v-for="item in typeOptions"
                        :key="item.enterpriseTypeID"
                        :label="item.enterpriseTypeName"
                        :value="item.enterpriseTypeID">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属行业" prop="industryType">
                    <el-input v-model="form.industryType" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="网站地址" prop="website">
                    <el-input v-model="form.website" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="contacts">
                    <el-input v-model="form.contacts" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系邮箱" prop="email">
                    <el-input v-model="form.email" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="contactNumber">
                    <el-input v-model="form.contactNumber" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="提供资质文件" class='labelBtn first'>
                    <ul>
                        <li>
                            <el-upload 
                                class="avatar-uploader" 
                                :class="{disabled:uploadDisabledY}" 
                                :action="logoImageUploadUrl" 
                                list-type="picture-card" 
                                :file-list="imagelistY" 
                                name="license" 
                                :data='uploadData'
                                :headers="obj"
                                :on-change="handleChangeY"
                                :before-upload="beforeAvatarUpload"
                                :on-error="handleUploadError"
                                :on-success="handleUploadSuccess"
                                :on-remove="handleRemoveY" 
                                >
                                <img :src='form.licenseURL' alt="" class="imgStyle"/>
                                <i class='el-icon-plus' v-if='!form.licenseURL'></i>
                            </el-upload>
                            <!-- <el-dialog :visible.sync="dialogVisible" title='图片预览'>
                                <img width="100%" :src="dialogImageUrl" alt="">
                            </el-dialog> -->
                            <p>营业执照</p>
                            
                        </li>
                        <li>
                            <el-upload 
                                class="avatar-uploader" 
                                :class="{disabled:uploadDisabledK}" 
                                :action="logoImageUploadUrl" 
                                list-type="picture-card" 
                                :file-list="imagelistK" 
                                :data='uploadData'
                                :headers="obj"
                                name="permit" 
                                :on-change="handleChangeK"
                                :before-upload="beforeAvatarUpload"
                                :on-error="handleUploadError"
                                :on-success="handleUploadSuccess" 
                                :on-remove="handleRemoveK">
                                <img :src='form.permitURL' alt="" class="imgStyle"/>
                                <i class='el-icon-plus' v-if='!form.permitURL'></i>
                            </el-upload>
                            <p>开户许可证</p>
                        </li>
                        <li>
                            <el-upload 
                                class="avatar-uploader" 
                                :class="{disabled:uploadDisabledS}" 
                                :action="logoImageUploadUrl" 
                                list-type="picture-card" 
                                :file-list="imagelistS" 
                                name="applicationDocuments" 
                                :data='uploadData'
                                :headers="obj"
                                :on-change="handleChangeS"
                                :before-upload="beforeAvatarUpload"
                                :on-error="handleUploadError"
                                :on-success="handleUploadSuccess" 
                                :on-remove="handleRemoveS">
                                <img :src="form.applicationDocumentsURL" alt="" class="imgStyle">
                                <i class='el-icon-plus' v-if='!form.applicationDocumentsURL'></i>
                            </el-upload>
                            <p>申请人盖章</p>
                        </li>
                    </ul>
                </el-form-item>
                <el-form-item label="法人身份证" class='labelBtn'>
                    <ul>
                        <li>
                            <el-upload 
                                class="avatar-uploader" 
                                :class="{disabled:uploadDisabledFA}" 
                                :action="logoImageUploadUrl" 
                                list-type="picture-card" 
                                :file-list="imagelistFA" 
                                name="legalPersonIDcardA" 
                                :data='uploadData'
                                :headers="obj"
                                :on-change="handleChangeFA"
                                :before-upload="beforeAvatarUpload"
                                :on-error="handleUploadError"
                                :on-success="handleUploadSuccess" 
                                :on-remove="handleRemoveFA">
                                <img :src='form.legalPersonIDcardAURL' alt="" class="imgStyle"/>
                                <i class='el-icon-plus' v-if='!form.legalPersonIDcardAURL'></i>
                            </el-upload>
                            <p>正面</p>
                        </li>
                        <li>
                            <el-upload 
                                class="avatar-uploader" 
                                :class="{disabled:uploadDisabledFB}" 
                                :action="logoImageUploadUrl" 
                                list-type="picture-card" 
                                :file-list="imagelistFB" 
                                name="legalPersonIDcardB" 
                                :data='uploadData'
                                :headers="obj"
                                :on-change="handleChangeFB"
                                :before-upload="beforeAvatarUpload"
                                :on-error="handleUploadError"
                                :on-success="handleUploadSuccess" 
                                :on-remove="handleRemoveFB">
                                <img :src='form.legalPersonIDcardBURL' alt="" class="imgStyle"/>
                                <i class='el-icon-plus' v-if='!form.legalPersonIDcardBURL'></i>
                            </el-upload>
                            <p>反面</p>
                        </li>
                    </ul>
                </el-form-item>
                <el-form-item label="授权人身份证" class='labelBtn'>
                    <ul>
                        <li>
                            <el-upload 
                                class="avatar-uploader" 
                                :class="{disabled:uploadDisabledSQA}" 
                                :action="logoImageUploadUrl" 
                                list-type="picture-card" 
                                :file-list="imagelistSQA" 
                                name="authorizerIDcardA"
                                :data='uploadData' 
                                :headers="obj"
                                :on-change="handleChangeSQA"
                                :before-upload="beforeAvatarUpload"
                                :on-error="handleUploadError"
                                :on-success="handleUploadSuccess" 
                                :on-remove="handleRemoveSQA">
                                <img :src="form.authorizerIDcardAURL" alt="" class="imgStyle">
                                <i class='el-icon-plus' v-if='!form.authorizerIDcardAURL'></i>
                            </el-upload>
                            <p>正面</p>
                        </li>
                        <li>
                            <el-upload 
                                class="avatar-uploader" 
                                :class="{disabled:uploadDisabledSQB}" 
                                :action="logoImageUploadUrl" 
                                list-type="picture-card" 
                                :file-list="imagelistSQB" 
                                name="authorizerIDcardB"
                                :data='uploadData' 
                                :on-change="handleChangeSQB"
                                :before-upload="beforeAvatarUpload"
                                :on-error="handleUploadError"
                                :on-success="handleUploadSuccess" 
                                :on-remove="handleRemoveSQB">
                                <img :src="form.authorizerIDcardBURL" alt="" class="imgStyle">
                                <i class='el-icon-plus' v-if='!form.authorizerIDcardBURL'></i>
                            </el-upload>
                            <p>反面</p>
                        </li>
                    </ul>
                </el-form-item>
                <el-form-item label="">
                    <el-checkbox v-model="checked">同意用户协议</el-checkbox>
                    <span class='checkProtocol' @click='userProtocolVisible = true'>查看用户协议</span>
                </el-form-item>
                
            </el-form>
            </template>
            <template slot='foot'>
                <el-button @click.native="closeDialog">取消</el-button>
                <el-button v-if='isAdd == true' type="primary" @click.native="addSubmit($event)" :disabled="checked?false:true" :loading="addLoading">提交</el-button>
                <el-button v-if='isAdd == false' type="primary" @click.native="editSubmit" :disabled="checked?false:true" :loading="addLoading">提交</el-button>
            </template>
        </I-table-editor>
        <!-- 新增 -->
        <I-table-editor
        v-model="addVisible"
        @dialogVisibleClose='addDialogClose'
        class="addContainer"
        >
            <template slot="content">
                <div class="content">
                 <el-tabs v-model="activeName">
                    <el-tab-pane label="第一步:填写信息" name="first" disabled>
                        <el-form :model="form" label-width="120px" :rules="rules" ref="form">
                            <el-form-item label="公司名称" prop="enterpriseName">
                                <el-input v-model="form.enterpriseName" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="选择类型" prop="enterpriseTypeID">
                                <el-select v-model="form.enterpriseTypeID" placeholder="请选择">
                                    <el-option
                                    v-for="item in typeOptions"
                                    :key="item.enterpriseTypeID"
                                    :label="item.enterpriseTypeName"
                                    :value="item.enterpriseTypeID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="所属行业" prop="industryType">
                                <el-input v-model="form.industryType" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="网站地址" prop="website">
                                <el-input v-model="form.website" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="联系人" prop="contacts">
                                <el-input v-model="form.contacts" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="联系邮箱" prop="email">
                                <el-input v-model="form.email" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="联系电话" prop="contactNumber">
                                <el-input v-model="form.contactNumber" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="">
                                <el-checkbox v-model="checked">同意用户协议</el-checkbox>
                                <span class='checkProtocol' @click='userProtocolVisible = true'>查看用户协议</span>
                            </el-form-item>
                        </el-form>
                        <div class="nextbox">
                            <el-button type="primary" @click="handleNext" :disabled="checked?false:true" class="next">下一步</el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="第二步:上传文件" name="second" disabled>
                        <div class="fileContent">
                            <el-form>
                                <el-form-item label="提供资质文件" class='labelBtn first'>
                                    <ul>
                                        <li>
                                            <el-upload 
                                                class="avatar-uploader" 
                                                :class="{disabled:uploadDisabledY}" 
                                                :action="logoImageUploadUrl" 
                                                list-type="picture-card" 
                                                :file-list="imagelistY" 
                                                name="license" 
                                                :headers='obj'
                                                :data='uploadData'
                                                :on-change="handleChangeY"
                                                :before-upload="beforeAvatarUpload"
                                                :on-success="handleUploadSuccess"
                                                :on-error="handleUploadError" 
                                                :on-remove="handleRemoveY">
                                                <i class="el-icon-plus"></i>
                                            </el-upload>
                                            <p>营业执照</p>
                                        </li>
                                        <li>
                                            <el-upload 
                                                class="avatar-uploader" 
                                                :class="{disabled:uploadDisabledK}" 
                                                :action="logoImageUploadUrl" 
                                                list-type="picture-card" 
                                                :file-list="imagelistK"
                                                :headers='obj' 
                                                :data='uploadData'
                                                name="permit" 
                                                :on-change="handleChangeK"
                                                :before-upload="beforeAvatarUpload"
                                                :on-success="handleUploadSuccess"
                                                :on-error="handleUploadError"  
                                                :on-remove="handleRemoveK">
                                                <i class="el-icon-plus"></i>
                                            </el-upload>
                                            <p>开户许可证</p>
                                        </li>
                                        <li>
                                            <el-upload 
                                                class="avatar-uploader" 
                                                :class="{disabled:uploadDisabledS}" 
                                                :action="logoImageUploadUrl" 
                                                list-type="picture-card" 
                                                :file-list="imagelistS" 
                                                :headers='obj'
                                                :data='uploadData'
                                                name="applicationDocuments" 
                                                :on-change="handleChangeS"
                                                :before-upload="beforeAvatarUpload"
                                                :on-success="handleUploadSuccess"
                                                :on-error="handleUploadError"  
                                                :on-remove="handleRemoveS">
                                                <i class="el-icon-plus"></i>
                                            </el-upload>
                                            <p>申请人盖章</p>
                                        </li>
                                    </ul>
                                </el-form-item>
                                <el-form-item label="法人身份证" class='labelBtn'>
                                    <ul>
                                        <li>
                                            <el-upload 
                                                class="avatar-uploader" 
                                                :class="{disabled:uploadDisabledFA}" 
                                                :action="logoImageUploadUrl" 
                                                list-type="picture-card" 
                                                :file-list="imagelistFA" 
                                                name="legalPersonIDcardA" 
                                                :data='uploadData'
                                                :headers='obj'
                                                :on-change="handleChangeFA"
                                                :before-upload="beforeAvatarUpload"
                                                :on-success="handleUploadSuccess"
                                                :on-error="handleUploadError"  
                                                :on-remove="handleRemoveFA">
                                                <i class="el-icon-plus"></i>
                                            </el-upload>
                                            <p>正面</p>
                                        </li>
                                        <li>
                                            <el-upload 
                                                class="avatar-uploader" 
                                                :class="{disabled:uploadDisabledFB}" 
                                                :action="logoImageUploadUrl" 
                                                list-type="picture-card" 
                                                :file-list="imagelistFB" 
                                                name="legalPersonIDcardB" 
                                                :data='uploadData'
                                                :headers='obj'
                                                :on-change="handleChangeFB"
                                                :before-upload="beforeAvatarUpload"
                                                :on-success="handleUploadSuccess" 
                                                :on-error="handleUploadError" 
                                                :on-remove="handleRemoveFB">
                                                <i class="el-icon-plus"></i>
                                            </el-upload>
                                            <p>反面</p>
                                        </li>
                                    </ul>
                                </el-form-item>
                                <el-form-item label="授权人身份证" class='labelBtn'>
                                    <ul>
                                        <li>
                                            <el-upload 
                                                class="avatar-uploader" 
                                                :class="{disabled:uploadDisabledSQA}" 
                                                :action="logoImageUploadUrl" 
                                                list-type="picture-card" 
                                                :file-list="imagelistSQA" 
                                                name="authorizerIDcardA"
                                                :data='uploadData' 
                                                :headers='obj'
                                                :on-change="handleChangeSQA"
                                                :before-upload="beforeAvatarUpload"
                                                :on-success="handleUploadSuccess"
                                                :on-error="handleUploadError"  
                                                :on-remove="handleRemoveSQA">
                                                <i class="el-icon-plus"></i>
                                            </el-upload>
                                            <p>正面</p>
                                        </li>
                                        <li>
                                            <el-upload 
                                                class="avatar-uploader" 
                                                :class="{disabled:uploadDisabledSQB}" 
                                                :action="logoImageUploadUrl" 
                                                list-type="picture-card" 
                                                :file-list="imagelistSQB" 
                                                name="authorizerIDcardB"
                                                :data='uploadData'
                                                :headers='obj' 
                                                :on-change="handleChangeSQB"
                                                :before-upload="beforeAvatarUpload"
                                                :on-success="handleUploadSuccess"
                                                :on-error="handleUploadError"  
                                                :on-remove="handleRemoveSQB">
                                                <i class="el-icon-plus"></i>
                                            </el-upload>
                                            <p>反面</p>
                                        </li>
                                    </ul>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-tab-pane>
                    
                </el-tabs>

            </div>
            </template>
            <template slot="foot">
                
            </template>
        </I-table-editor>
        <!-- 详情 -->
        <I-table-editor
         title='详情'
         v-model="detailVisible"
         class="dailogBox"
        >
            <template slot='content'>
                <el-form :model="form" label-width="120px">
                <el-form-item label="公司名称">
                    <el-input v-model="form.enterpriseName" auto-complete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="选择类型">
                    <!-- <el-input v-model="form.type" auto-complete="off"></el-input> -->
                    <el-select v-model="form.enterpriseTypeID" placeholder="请选择" disabled>
                        <el-option
                        v-for="item in typeOptions"
                        :key="item.enterpriseTypeID"
                        :label="item.enterpriseTypeName"
                        :value="item.enterpriseTypeID">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属行业">
                    <el-input v-model="form.industryType" auto-complete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="网站地址">
                    <el-input v-model="form.website" auto-complete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="联系人">
                    <el-input v-model="form.contacts" auto-complete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="联系邮箱">
                    <el-input v-model="form.email" auto-complete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input v-model="form.contactNumber" auto-complete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="提供资质文件" class='labelBtn first'>
                    <ul>
                        <li>
                            <div class="imgContainer">
                                <img :src="form.licenseURL" alt="" class="imgStyle" />
                                <!-- <zoom-img
                                :imgURL='form.licenseURL'
                                :itemID='licenseID'
                                ></zoom-img> -->
                            </div>
                            <p>营业执照</p>
                        </li>
                        <li>
                            <div class="imgContainer">
                                <img :src="form.permitURL" class="imgStyle" alt="" />
                                <!-- <zoom-img
                                :imgURL='form.permitURL'
                                :itemID='permitID'
                                ></zoom-img> -->
                            </div>
                            <p>开户许可证</p>
                        </li>
                        <li>
                            <div class="imgContainer">
                                <img :src="form.applicationDocumentsURL" class="imgStyle" alt="" />
                                <!-- <zoom-img
                                :imgURL='form.applicationDocumentsURL'
                                :itemID='applicationID'
                                ></zoom-img> -->
                            </div>
                            <p>申请人盖章</p>
                        </li>
                    </ul>
                </el-form-item>
                <el-form-item label="法人身份证" class='labelBtn'>
                    <ul>
                        <li>
                            <div class="imgContainer">
                                <img :src="form.legalPersonIDcardAURL" class="imgStyle" alt="" />
                                <!-- <zoom-img
                                :imgURL='form.legalPersonIDcardAURL'
                                :itemID='legalAID'
                                ></zoom-img> -->
                            </div>
                            <p>正面</p>
                        </li>
                        <li>
                            <div class="imgContainer">
                                <img :src="form.legalPersonIDcardBURL" class="imgStyle" alt="" />
                                <!-- <zoom-img
                                :imgURL='form.legalPersonIDcardBURL'
                                :itemID='legalBID'
                                ></zoom-img> -->
                            </div>
                            <p>反面</p>
                        </li>
                    </ul>
                </el-form-item>
                <el-form-item label="授权人身份证" class='labelBtn'>
                    <ul>
                        <li>
                            <div class="imgContainer">
                                <img :src="form.authorizerIDcardAURL" class="imgStyle" alt="" />
                                <!-- <zoom-img
                                :imgURL='form.authorizerIDcardAURL'
                                :itemID='authorAID'
                                ></zoom-img> -->
                            </div>
                            <p>正面</p>
                        </li>
                        <li>
                            <div class="imgContainer">
                                <img :src="form.authorizerIDcardBURL" alt="" class="imgStyle" />
                                <!-- <zoom-img
                                :imgURL='form.authorizerIDcardBURL'
                                :itemID='authorBID'
                                ></zoom-img> -->
                            </div>
                            <p>反面</p>
                        </li>
                    </ul>
                </el-form-item>
            </el-form>
            </template>
        </I-table-editor>
        <!-- 用户协议 -->
        <I-table-editor
         title='用户协议'
         v-model="userProtocolVisible"
         class="userProtocolBox"
        >
            <template slot="content">
                用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议
                用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议
                用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议
                用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议
                用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议
                用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议
                用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议
            </template>
            <template slot="foot">
                <el-button @click.native="cancel">取消</el-button>
                <el-button type="primary" @click.native="agree">同意</el-button>
            </template>
        </I-table-editor>
        <!-- 停用弹框 -->
        <I-table-editor
         title='停用'
         v-model="stopUsingVisible"
         class="stopUsingBox"
        >
            <template slot="content">
                <div class="text">
                    <p>是否停用？</p>
                    <p>停用后会引起该关联账号和信息不可用!</p>
                </div>
            </template>
            <template slot="foot">
                <el-button @click.native="stopUsingVisible = false">取消</el-button>
                <el-button type="primary" @click.native="confirmStop">确定</el-button>
            </template>
        </I-table-editor>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    import ITableEditor from '../../components/Table/TableEditor.vue'
    import ImgUpload from '../../components/ImgUpload.vue'
    import configUrl from '../../common/js/url.js'
    import ZoomImg from '../../components/ZoomImg.vue'
    //import NProgress from 'nprogress'
    export default {
        data() {
            var checkPhone = (rule, value, callback) => {
                if (!value) {
                return callback(new Error('请输入手机号'));
                } else {
                    const reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
                    if (reg.test(value)) {
                        callback();
                    } else {
                        return callback(new Error('请输入正确的手机号'));
                    }
                }
            };
            var checkWebsite = (rule, value, callback) => {
                if(!value) {
                    return callback(new Error('请输入网址'));
                } else {
                    const reg_web = /^((https|http|ftp|rtsp|mms){0,1}(:\/\/){0,1})www\.(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
                    if(reg_web.test(value)) {
                        callback();
                    } else {
                        return callback(new Error('请输入正确的网址'));
                    }
                }
            };
            return {
                logoImageUploadUrl: configUrl.url + 'enterprise/update',
                uploadData:{
                    enterpriseID: 0
                },
                obj:{},//请求头
                imagelistY: [],
                imagelistK: [],
                imagelistS: [],
                imagelistFA: [],
                imagelistFB: [],
                imagelistSQA: [],
                imagelistSQB: [],
                filters: {
                    name: ''
                },
                activeName:'first',
                tableData:[
                    {
                        name:''
                    }
                ],//列表数据
                checked:false,
                detailVisible: false,//详情显示
                userProtocolVisible: false,//用户协议弹框
                stopUsingVisible: false,//停用弹框
                currentPage: 1,//当前页
                pageSize:0,//每页显示的条数，为0，显示25条
                title:'',//弹框标题（新增、编辑）
                isAdd: true,
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                //表单数据
                form: {
                    enterpriseName: '',
                    enterpriseTypeID: '',
                    enterpriseName:'',
                    industryType: '',
                    website: '',
                    contacts: '',
                    email:'',
                    contactNumber:'',
                    licenseURL:'',
                    permitURL:'',
                    applicationDocumentsURL:'',
                    legalPersonIDcardAURL:'',
                    legalPersonIDcardBURL:'',
                    authorizerIDcardAURL:'',
                    authorizerIDcardBURL:''
                },
                addVisible: false,
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                rules: {
                    enterpriseName: [
                        { required: true, message: '请输入公司名称', trigger: 'blur' }
                    ],
                    enterpriseTypeID: [
                        { required: true, message: '请选择类型' }
                    ],
                    industryType: [
                        { required: true, message: '请输入所属行业' }
                    ],
                    website: [
                        { required: true, message: '请输入网址' },
                        { validator: checkWebsite, trigger: 'blur' }
                    ],
                    contacts: [
                        { required: true, message: '请输入联系人' }
                    ],
                    contactNumber: [
                        { required: true, message: '请输入手机号' },
                        { validator: checkPhone, trigger: 'blur'}
                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }
                    ]
                },
                typeOptions: [],
                license:'',
                enterpriseID:0,
                cateringID:0,
                cateringEnterpriseID:0,//企业ID
                enterpriseState: false,//企业状态
                dialogVisible: false,
                dialogImageUrl:'',
                licenseID:'license',
                permitID:'permit',
                applicationID:'application',
                legalAID:'legalA',
                legalBID:'legalB',
                authorAID:'authorA',
                authorBID:'authorB',
                //操作按钮
                checkBtn: false,
                editBtn: false,
                deleBtn: false,
                addBtn: false,
            }
        },
        mounted() {
            this.enterpriseID = JSON.parse(localStorage.getItem('user')).enterpriseID;
            this.uploadData.enterpriseID = this.enterpriseID;
            this.obj.Authorization = localStorage.getItem('token');
            this.init();//初始化
            this.getBtn();
            this.getEnterpriseType();
        },
        computed: {
            //营业执照
            uploadDisabledY: function() {
                return this.imagelistY.length > 0
            },
            //开户许可证
            uploadDisabledK: function() {
                return this.imagelistK.length > 0
            },
            //申请人盖章
            uploadDisabledS: function() {
                return this.imagelistS.length > 0
            },
            //法人身份证正面
            uploadDisabledFA: function() {
                return this.imagelistFA.length > 0
            },
            //法人身份证反面
            uploadDisabledFB: function() {
                return this.imagelistFB.length > 0
            },
            //授权人身份证反面
            uploadDisabledSQA: function() {
                return this.imagelistSQA.length > 0
            },
            //授权人身份证反面
            uploadDisabledSQB: function() {
                return this.imagelistSQB.length > 0
            },

        },
        methods: {
            //获取操作按钮
            getBtn() {
                let permissions = JSON.parse(localStorage.getItem('user')).permissions;
                if(permissions.indexOf('141') > -1) {
                    this.checkBtn = true;
                }
                if(permissions.indexOf('142') > -1) {
                    this.addBtn = true;
                }
                if(permissions.indexOf('143') > -1) {
                    this.deleBtn = true;
                }
                if(permissions.indexOf('144') > -1) {
                    this.editBtn = true;
                }
            },
            handleCurrentChange(val) {
                this.page = val;
                this.init();
            },
            //上传文件之前
			beforeAvatarUpload(file) {
				console.log('文件类型',file);
				const isLt2M = file.size / 1024 / 1024 < 2;
				let flag = true;
                if(file.type != 'image/jpeg' && file.type != 'image/png') {
                    console.log('-----')
                    this.$message.error('上传文件图片只能是 JPG/PNG 格式!');
                    flag = false;
                } 
                if(!isLt2M) {
                    this.$message.error('上传图片大小不能超过2M');
                }
                console.log(flag,isLt2M);
				return flag && isLt2M;
			},
            //预览
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            //上传成功
            handleUploadSuccess() {
                this.$message.success('上传成功');
                this.init();
            },
            handleUploadError(err, file, fileList) {
                this.$message.error(err);
            },
            handleRemove(file, fileList) {
                this.imagelist = fileList
            },
            handleRemoveY(file, fileList) {
                this.imagelistY = fileList;
                this.form.licenseURL = '';
            },
            handleRemoveK(file, fileList) {
                this.imagelistK = fileList
            },
            handleRemoveS(file, fileList) {
                this.imagelistS = fileList
            },
            handleRemoveFA(file, fileList) {
                this.imagelistFA = fileList
            },
            handleRemoveFB(file, fileList) {
                this.imagelistFB = fileList
            },
            handleRemoveSQA(file, fileList) {
                this.imagelistSQA = fileList
            },
            handleRemoveSQB(file, fileList) {
                this.imagelistSQB = fileList
            },
            //营业执照
            handleChangeY(file, fileList) {
                this.imagelistY = fileList;
            },
            //开户许可证
            handleChangeK(file, fileList) {
                this.imagelistK = fileList
            },
            //申请人盖章
            handleChangeS(file, fileList) {
                this.imagelistS = fileList
            },
            //法人身份证正面
            handleChangeFA(file, fileList) {
                this.imagelistFA = fileList
            },
            //法人身份证反面
            handleChangeFB(file, fileList) {
                this.imagelistFB = fileList
            },
            //授权人身份证正面
            handleChangeSQA(file, fileList) {
                this.imagelistSQA = fileList
            },
            //授权人身份证反面
            handleChangeSQB(file, fileList) {
                this.imagelistSQB = fileList
            },
            //下一步
            handleNext() {
                this.$refs.form.validate((valid) => {
                    if(valid) {
                        let para = Object.assign({},this.form);
                        para.cateringEnterpriseID = this.enterpriseID;
                        // console.log('新增数据',para);
                        this.$post('/enterprise',para).then(res => {
                            console.log(res)
                            if(res.state) {
                                this.uploadData.enterpriseID = res.data.enterpriseID;
                                this.activeName = 'second';
                                this.init();
                            } else {
                                this.$message.error(res.msg);
                            }
                        })
                    }
                })
            },
            //查询
            search() {
                this.$fetch('/enterprises/' + this.enterpriseID + '/' + this.filters.name).then(res => {
                    console.log(res);
                    if(res.state) {
                        this.tableData = res.data;
                    }
                })
            },
            //获取公司类型
            getEnterpriseType() {
                this.$fetch('/config/enterpriseType').then(res => {
                    console.log('公司类型',res);
                    this.typeOptions = res.data;
                })
            },
            //获取列表
            init() {
                // this.listLoading = true;
                this.$fetch('/enterprises/' + this.enterpriseID).then(res => {
                    // console.log(res)
                    if(res.state) {
                        this.tableData = res.data;
                    }
                })
            },
            //弹框关闭
            closeDialog() {
                this.addFormVisible = false;
                this.checked = false;
                this.$refs['form'].resetFields();
                
            },
            //新增弹框关闭
            addDialogClose() {
               this.checked = false;
               this.$refs['form'].resetFields();
               this.init();
            },
            //同意用户协议
            agree() {
                this.checked = true;
                this.userProtocolVisible = false;
            },
            //取消
            cancel() {
                this.checked = false;
                this.userProtocolVisible = false;
            },
            //停用弹框
            stopUsing(index,row) {
                console.log(row);
                this.stopUsingVisible = true;
                this.title = '停用';
                this.cateringEnterpriseID = row.cateringEnterpriseID;
                this.enterpriseState = row.state;
                this.cateringID = row.enterpriseID;
            },
            //确定停用
            confirmStop() {
                let para = {
                    cateringID: this.cateringEnterpriseID,
                    state: !this.enterpriseState,
                    enterpriseID: this.cateringID
                }
                console.log(para);
                this.$put('/enterprise/disable',para).then(res => {
                    console.log(res)
                    if(res.state) {
                        this.$message.success(res.msg);
                        this.stopUsingVisible = false;
                        this.init();
                    }
                })
            },
            //启用
            startUsing(index,row) {
                console.log('启用',row)
                let para = {
                    enterpriseID: row.enterpriseID,
                    state: !row.state,
                    cateringID:row.cateringEnterpriseID
                }
                this.$put('/enterprise/disable',para).then(res => {
                    console.log(res)
                    if(res.state) {
                        this.$message.success(res.msg);
                        this.init();
                    }
                })
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    // this.listLoading = true;
                    this.$remove('/enterprise/' + row.cateringEnterpriseID + '/' + row.enterpriseID).then(res => {
                        if(res.state) {
                            this.$message.success('删除成功');
                            this.init();
                        }
                    })
                    
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.addFormVisible = true;
                this.checked = true;
                this.title = '编辑';
                this.isAdd = false;
                this.form = Object.assign({}, row);
                this.uploadData.enterpriseID = row.enterpriseID;
                console.log('编辑数据',this.form)
            },
            //显示新增界面
            handleAdd: function () {
                this.addVisible = true;
                this.activeName = 'first';
                this.title = '新增';
                this.isAdd = true;
                this.checked = false;
                this.imagelistY = [];
                this.imagelistK = [];
                this.imagelistS = [];
                this.imagelistFA = [];
                this.imagelistFB = [];
                this.imagelistSQA = [];
                this.imagelistSQB = [];
                this.form = {
                    enterpriseName: '',
                    enterpriseTypeID: '',
                    enterpriseName:'',
                    industryType: '',
                    website: '',
                    contacts: '',
                    email:'',
                    contactNumber:'',
                    licenseURL:'',
                    permitURL:'',
                    applicationDocumentsURL:'',
                    legalPersonIDcardAURL:'',
                    legalPersonIDcardBURL:'',
                    authorizerIDcardAURL:'',
                    authorizerIDcardBURL:''
                }
            },
            //显示详情
            handleDetail(index,row) {
                console.log('详情数据',row)
                this.detailVisible = true;
                this.form = Object.assign({},row);
                console.log(this.form)
            },
            //编辑
            editSubmit: function () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            // this.editLoading = true;
                            //NProgress.start();
                            let para = {
                                enterpriseName: this.form.enterpriseName,
                                enterpriseID: this.form.enterpriseID,
                                enterpriseTypeID: this.form.enterpriseTypeID,
                                industryType: this.form.industryType,
                                contacts: this.form.contacts,
                                contactNumber: this.form.contactNumber,
                                email: this.form.email,
                                website: this.form.website
                            };
                            console.log('确认编辑',para);
                            this.$put('/enterprise',para).then(res => {
                                console.log(res);
                                if(!res.state) {
                                    this.$message.error(res.msg);
                                } else {
                                    this.$message.success(res.msg);
                                    this.addFormVisible = false;
                                    this.init();
                                }
                            })
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.enterpriseID).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    // this.listLoading = true;
                    this.$remove('/enterprises/' + this.enterpriseID + '/' + ids).then(res => {
                        if(res.state) {
                            this.$message.success('删除成功');
                            this.init();
                        }
                    })
                    
                }).catch(() => {

                });
            }
        },
        components: {
            ITableEditor,
            ImgUpload,
            ZoomImg
        }
    }

</script>

<style lang="scss">
    @import '../../styles/common.scss';
    .dailogBox  {
        .el-dialog {
            width: 780px;
        }
        .el-dialog__body {
            width: 80%;
            margin: 0 auto;
            .el-select {
                width: 100%;
            }
            .labelBtn {
                .el-form-item__label {
                    height: 100px;
                    line-height: 100px;
                }
            }
            .el-checkbox__label {
                color: #f44831;
                display: inline-block;
                margin-left: 10px;
                margin-right: 24px;
                font-size: 18px;
            }
            .checkProtocol {
                cursor: pointer;
            }
            .disabled .el-upload--picture-card {
                display: none;
            }
        }
        ul {
            display: flex;
            padding: 0;
            margin: 0;
            li {
                margin-right: 34px;
                img {
                    vertical-align: middle;
                }
                p {
                    text-align: center;
                    margin: 0;
                }
            }
            li:last-child {
                margin-right: 0;
            }
        }

    }
    .userProtocolBox {
        .el-dialog--small {
            width: 40%;
        }
        
    }
    .stopUsingBox {
        .el-dialog--small {
            width: 30%;
            .el-dialog__body {
                .text {
                    width: 60%;
                    margin-left: 30px;
                }
                p:first-child {
                    font-size: 20px;
                }
                p:last-child {
                    font-size: 14px;
                    color: #f44831;
                }
            }
        }
    }
    .fileBox {
        input {
            font-size: 0; /* 为了去掉‘未选择任何文件’这几个字，也可以随便弄到哪里*/
        }
        /* 注意不是直接input > input[type=button] 哦*/
        input::-webkit-file-upload-button {
            background: #efeeee;
            color: #333;
            border: 0;
            padding: 60px 50px;
            border-radius: 5px;
            font-size: 12px;
            box-shadow: 1px 1px 5px rgba(0,0,0,.1), 0 0 10px rgba(0,0,0,.12);
        }
    }
    //新增样式
    .addContainer {
        .el-dialog {
            width: 800px;
            height: 840px;
            border-radius: 12px;
            .el-dialog__header {
                background: #fff;
                padding: 10px;
            }
            .el-dialog__body {
                padding-top: 0;
                padding-bottom: 0;
            }
            div.content {
                .el-tabs__content {
                    padding-top: 30px;
                    .nextbox {
                        width: 200px;
                        margin: 0 auto;
                        padding-top: 50px;
                        .next {
                            width: 200px;
                            height: 40px;
                            font-size: 18px;
                        }
                    }
                    
                }
                .el-form {
                    width: 70%;
                    margin: 0 auto;
                    .el-select {
                        width: 100%;
                    }
                    .el-form-item {
                        margin-bottom: 28px;
                    }
                    .el-form-item__label {
                        font-size: 16px;
                        font-weight: bold;
                    }
                   
                }
                .el-tabs__item {
                    width: 375px;
                    text-align: center;
                    font-size: 20px;
                    color: #707070;
                    margin-bottom: 20px;
                }
                .el-checkbox__label {
                    color: #f44831;
                    display: inline-block;
                    margin-left: 10px;
                    margin-right: 24px;
                    font-size: 18px;
                }
                .checkProtocol {
                    cursor: pointer;
                }
            }
            div.fileContent {
                .el-form {
                    width: 90%;
                    .el-form-item__label {
                        width: 120px;
                        height: 100px;
                        line-height: 100px;
                        text-align: right;
                    }
                    
                }
                ul {
                    margin: 0;
                    padding: 0;
                    display: flex;
                    li {
                        margin-left: 20px;
                        text-align: center;
                    }
                }
                
            
            }
        }
    }
    .disabled .el-upload--picture-card {
        display: none;
    }
    .imgContainer {
        width:140px;
        height:150px;
        line-height:150px;
        border: 1px solid #ccc;
        border-radius: 4px;
        text-align: center;
    }
    .imgStyle {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
    }
</style>