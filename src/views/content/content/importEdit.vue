<template>
  <section class="cms-body flex" >
    <!-- 返回组件 -->
    <a class="cms-back" href="javascript:void(0)" @click="back"></a>
    <!-- <cms-tree @change="getChannelId"></cms-tree> -->
    <div class="">
      <el-form  ref="form" :model="info" :rules="rules" class="cms-form" label-width="162px" v-loading="loading">
        <!-- 动态表单 -->

       <!-- 栏目 -->
        <el-form-item label="选择栏目" class="flex-50" prop="parentId">
          <el-cascader class="cms-width"
                      disabled
                      :props="{'value':'id','label':'name','children':'child'}"
                      :options="channelList"
                      v-model="info.parentId"
                      filterable>
          </el-cascader>
          <span class="gray">只能选择最后一层</span>
        </el-form-item>

        <!--关联副栏目  -->
        <el-form-item label="关联副栏目" class="flex-50">
          <el-button @click="channelVisble=true">关联副栏目</el-button>
          <span class="gray">关联后本条内容将会出现在所选的栏目页，需要结合标签使用</span>
        </el-form-item>
        <!-- 模型弹窗 -->
        <el-dialog class="dialog" title="选择副栏目" :visible.sync="channelVisble" width="30%">
          <div class="tree-layout">
            <div class="tree">
              <el-tree :load="ansyTree" lazy ref="channelTree" :props="props"
                       :default-expanded-keys="['']"  :default-checked-keys="info.channelIds" show-checkbox :indent="16" node-key="id">
              </el-tree>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
              <el-button @click="channelVisble = false">取消</el-button>
              <el-button type="primary" @click="channelVisble=false">选择</el-button>
            </span>
        </el-dialog>

        <!-- 关联专题 -->
        <el-form-item label="关联专题" class="flex-50"  prop="topicIds">
          <el-select class="cms-width" v-model="info['topicIds']">
            <el-option v-for="(item,index) in topicList"  :key="index"
                       :label="item.name"
                       :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="flex-50"></el-form-item>

        <el-form-item class="flex-100" label="标题" prop="title">
          <el-input class="cms-width" style=""  v-model="info['title']"> </el-input>
          <span v-if="redWarningBox1">敏感词:<i class="redWarning">({{redWarningTxt[0]}})</i></span>
        </el-form-item>
        <!-- 简短标题 -->
        <el-form-item class="flex-100" label="简短标题">
          <el-input class="cms-width"  v-model="info['shortTitle']"> </el-input>
          <span v-if="redWarningBox2">敏感词:<i class="redWarning">({{redWarningTxt[1]}})</i></span>
        </el-form-item>
        <!-- Tag标签 -->
        <el-form-item class="flex-100" label="关键字" prop="tagStr">
          <el-input class="cms-width"  v-model="info['tagStr']"> </el-input>
          <span v-if="redWarningBox3">敏感词:<i class="redWarning">({{redWarningTxt[2]}})</i></span>
        </el-form-item>
        <!-- 摘要 -->
        <el-form-item class="flex-100" label="摘要" prop="description">
          <el-input class="cms-width"  v-model="info['description']"> </el-input>
          <span v-if="redWarningBox4">敏感词:<i class="redWarning">({{redWarningTxt[3]}})</i></span>
        </el-form-item>
        <!-- 内容 -->
        <el-form-item class="flex-100" label="内容">
          <el-input class="cms-width"  v-model="info['txt']" property=""> </el-input>
          <span v-if="redWarningBox5">敏感词:<i class="redWarning">({{redWarningTxt[4]}})</i></span>
        </el-form-item>
        <!-- 栏目模版 -->
        <el-form-item class="flex-50" label="PC模版">
          <el-select  class="cms-width" v-model="info['pcTempletName']">
            <el-option label="默认" value=""></el-option>
            <el-option v-for="(item,index) in tplAll.contentTpl"
                       :key="index"
                       :label="item"
                       :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 栏目手机模板 -->
        <el-form-item class="flex-50" label="手机模版">
          <el-select  class="cms-width" v-model="info['mobileTempletName']">
            <el-option label="默认" value=""></el-option>
            <el-option v-for="(item,index) in tplAll.contentMobileTpl"
                        :key="index"
                        :label="item"
                        :value="item">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item class="flex-100" label="外部链接地址" v-if="isLink">
          <el-input class="cms-width" v-model="info['link']"></el-input>
        </el-form-item> -->
        <!-- 系统字段 -->
        <!-- <el-form-item v-for="(item,index) in itemList" :key="index" -->



        <!-- 动态表单 -->
        <div class="form-footer">
          <el-button  type="primary"  @click="update(false)"
                      v-perms="'/content/update'">修改</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </div>
      </el-form>
    </div>
  </section>
</template>
<script>
  import formMixins from "@/mixins/form";
  import axios from "axios";
  import va from "@/rules";
  export default {
    mixins: [formMixins],
    data() {
      let self = this;
      let required = va.required('此项必填');
      let number = va.number('只能输入数字');
      let string = va.string('只能输入英文字母');
      return {
        params: this.$route.query, //前一个页面带过来的数据
        rules: {
          parentId:[required],
          title:[required],
          typeId:[required,number],
          description:[required],
          tagStr:[required],
        },
        redWarningBox1: false,  //敏感词块是否显示
        redWarningBox2: false,  //敏感词块是否显示
        redWarningBox3: false, //敏感词块是否显示
        redWarningBox4: false,  //敏感词块是否显示
        redWarningBox5: false,  //敏感词块是否显示
        parentId:'',
        dataState: false,
        isLink:false,//是否开启外部链接
        hasContentImg:false,
        hasTitleImg:false,
        channelList: [], //栏目列表
        itemList: [], //动态列表
        topicList: [], //专题列表
        typeList: [], //内容类型列表
        groupList: [], //用户组列表
        workflowList: [], //工作流
        tplAll:[],//所有模型
        chargeMap:[],
        contentInfo:{},
        redWarningTxt: [],//敏感词标红
        info: {
          parentId: [], //上层栏目id,
          channelId:'',//栏目id
          channelIds:[],//副栏目
          bold:false,
          topicIds:'',//专题id
          link:'',//外部链接地址
          originUrl:'',//来源地址
          topLevelDate:'',
          sortDate:'',
          releaseDate:'',
          pigeonholeDate:'',
          queryNewsDetail: '' ,
          typeId:'',
          recommend:false,
          recommendLevel:1,
          draft:false,
          tplContent:'',
          tplMobileContent:'',
          charge:false,
          txt: '', //内容
          attachments:[],
          attachmentNames:[],//附件名称
          attachmentPaths:[],//附件地址
          mediaPath:'',//媒体路径
          mediaType:'CK', //媒体类型
          pics:[],
          picPaths:[],//图片地址
          picDescs:[],//图片描述
          chargeAmount:'',//总费
          rewardPattern:false,//奖励模式
          rewardFix:'',//固定奖
          rewardRandomMin:0,//随机奖励最小值
          rewardRandomMax:10,//随机奖励最大值
          docPath:'',//doc地址
          docFile:'',//文档名称
          downNeed:0,//下载需要财富值
          isOpen:false,//是否开启
          pcTempletName: '',   //pc模版
          mobileTempletName: '',//手机模版
        },
        isTypeImg:false,
        props: {
          label: "name",
          children:"zones",
          isLeaf: "isChild",
          id: "id"
        },
        channelVisble:false,//选择模型模版弹窗
        ue:[],
        updateChooseNews:{},  //修改返回列表对象
      };
    },
    methods: {

      back(){
        this.routerLink('/content/import','import',this.parentId);
      },
      getChannelId(data,node){
        this.routerLink('/content/import','import',data.id);
      },
      // checkChange(node, checkStatus, childStatus){//副栏目选择
      //   // this.info.channelIds=this.$refs["channelTree"].getCheckedKeys();//获取副栏目
      //   console.log(node);

      // },
      handleClose(){},
      ansyTree(node, resolve) {//异步加载栏目树形结构
        if (node.level === 0) {
          return resolve([
            {
              name: '根目录',
              id: "",
              isChild: true
            }
          ]);
        }
        if (node.level > 0) {
          axios
            .post(this.$api.channelList, { parentId: node.data.id })
            .then(res => {
              const data = [];
              for (let i in res.body) {
                let obj = {};
                obj.id = res.body[i].id;
                obj.isChild = res.body[i].childCount > 0 ? false : true;
                obj.name = res.body[i].name;
                data.push(obj);
              }
              return resolve(data);
            });
        }
      },
      getTypeId(val){
        axios.post(this.$api.typeGet,{id:val}).then(res=>{
          if(res.code=='200'){
            this.isTypeImg=res.body.hasImage;
          }
        })
      },
      getPath(event){
        if(event.target.value!=''){
          axios.post(this.$api.channelCreatPath,{name:event.target.value}).then(res=>{
            this.info.path=res.body;
          })
        }
      },
      getFieldImg(path,field,index,pindex){
        this.info[field]=path;
      },
      getAttachments(res){
        this.info.attachments=res;//附件对象数组
      },
      getPics(res){//图片
        this.info.pics=res;//附件对象数组
      },
      getDocPath(res){//文档路径
        this.info.docPath=res.uploadPath;//文档路径
        this.info.docFile=res.fileName;
      },
      getDocTxt(txt,index){
        this.ue[index].execCommand('inserthtml',txt);
      },
      getMediaPath(path,field){//动态媒体路径

        this.info[field]=path;//媒体路径
      },
      getUeditor(ue,index){
        this.ue[index]=ue;//获取ue实例
      },
      getTitleImg(path){//标题图
        this.info.titleImg=path;
      },
      getContentImg(path){//内容图
        this.info.contentImg=path;
      },
      getTypeImg(path){//类型图
        this.info.typeImg=path;
      },
      // 敏感词汇标注
      redWarning(item) {
        if (item.sensitivity != '') { //有敏感词
          console.log(item.sensitivity);
          item.sensitivity.forEach((element,index) => {
            if (element == "标题") {
              this.redWarningBox1 = true;
              this.redWarningTxt[0] = item.sensitivity[index+1];
              console.log(element);
            }else if(element == "简短标题"){
              this.redWarningBox2 = true;
              this.redWarningTxt[1] = item.sensitivity[index+1];
              console.log("简短标题");

            }else if(element == "Tag标签"){
              this.redWarningBox0 = true;

              this.redWarningTxt3 = item.sensitivity[index+1];
              console.log("Tag标签");

            }else if(element == "摘要"){
              this.redWarningBox4 = true;

              this.redWarningTxt[3] = item.sensitivity[index+1];
              console.log("摘要");

            }else if(element == "内容"){
              this.redWarningBox5 = true;
              this.redWarningTxt[4] = item.sensitivity[index+1];
              console.log("内容");

            }
          });
        }
      },
      getContentInfo(id){
        //获取栏目默认信息
        // axios.post(this.$api.contentGet, { id: id }).then(res => {
        // axios.post("http://192.168.102.139:8080/qkkx/api/admin/content/queryNewsDetail", { newsId: id }).then(res => {
        axios.post(this.$api.queryNewsDetail, { newsId: id }).then(res => {
          let channelIds = res.body.channelIds.split(',');
          this.contentInfo = res.body;
          this.params.modelId = res.body.modelId;
          this.info.modelId = res.body.modelId;
          this.info.tagStr= res.body.tagStr;
          this.info.txt = res.body.txt;
          this.params.parentId = res.body.channelId;
          this.parentId= res.body.channelId;
          channelIds.forEach(item =>{
            let itemNub = parseInt(item);
            this.info.channelIds.push(itemNub);//副模版id
          })
          this.info.pcTempletName= res.body.pcTempletName;   //pc模版
          this.info.mobileTempletName= res.body.mobileTempletName; //手机模版
          this.getDataInfo(id);
          this.redWarning(this.contentInfo);  //敏感词标红
        });
      },
      getDataInfo(id) {
        this.loading = true;
        //先获取模型id
        let modelParams = {
          modelId: this.params.modelId,
          isChannel: false
        };
        axios.post(this.$api.itemList,modelParams)
          .then(res => {
            this.loading=false;
            this.$refs["form"].resetFields();
            this.info.titleImg='';//滞空处理
            this.info.contentImg='';//滞空处理
            let itemList = res.body;//渲染数据字段模型
            for (let i in itemList) {
              // if(i.label === ""){

              // }
              if (itemList[i].custom) {
                //判断是否是系统字段
                if (itemList[i].dataType == 7) {
                  //判断是否为多选框
                  this.$set(this.info,"attr_" + itemList[i].field,this.contentInfo["attr_" + itemList[i].field]); //转换为数组
                } else {
                  this.$set(this.info, "attr_" + itemList[i].field, this.contentInfo["attr_" + itemList[i].field]);
                }
              } else {
                if (itemList[i].dataType == 7){
                  this.$set(this.info, itemList[i].field,this.contentInfo[itemList[i].field]);
                }else{
                  this.$set(this.info, itemList[i].field,this.contentInfo[itemList[i].field]);
                }
              }
            }
            this.itemList = itemList;
            this.getAllList();//获取辅助字段列表
            this.getDefaultInfo(this.params.id);//数据回填
          })
          .catch(err => {
            this.loading = false;
          });
      },
      getDefaultInfo(id){//数据回填
        this.info.bold=this.contentInfo.bold;
        this.info.originUrl= this.contentInfo.originUrl;
        this.info.sortDate=this.contentInfo.sortDate;
        this.info.topLevelDate=this.contentInfo.topLevelDate;
        this.info.pigeonholeDate=this.contentInfo.pigeonholeDate;
        this.info.viewGroupIds=this.contentInfo.viewGroupIds;
        this.info.typeId=this.contentInfo.typeId;
        this.info.downNeed=this.contentInfo.downNeed;
        this.info.isOpen=this.contentInfo.isOpen;
        this.info.recommend=this.contentInfo.recommend;
        this.info.recommendLevel=this.contentInfo.recommendLevel;
        this.info.draft=this.contentInfo.draft;
        this.info.topicIds=this.contentInfo.topicIds[0];
        this.info.tagStr=this.contentInfo.tagStr;
        this.info.channelIds=this.contentInfo.channelIds;
        this.info.mediaPath=this.contentInfo.mediaPath;
        this.info.chargeAmount=this.contentInfo.chargeAmount;
        this.info.charge=this.contentInfo.charge;
        this.$set(this.info,'rewardPattern',this.contentInfo.rewardPattern);
        this.$set(this.info,'rewardRandomMax',this.contentInfo.rewardRandomMax);
        this.$set(this.info,'rewardRandomMin',this.contentInfo.rewardRandomMin);
        this.getTypeId(this.info.typeId);
        this.$set(this.info,'attachments',[]);
        this.$set(this.info,'pics',[]);
        if(this.contentInfo.link!=''){
          this.isLink=true;
          this.info.link= this.contentInfo.link;
        }
        if(this.contentInfo.isOpen==''){//是否开放
          this.info.isOpen=true;
        }
        if(this.contentInfo.rewardFix.length>0){
          this.chargeMap= this.contentInfo.rewardFix;
        }else{
          axios.post(this.$api.configContentChargeGet).then(res=>{
            let aa=[];
            for(let i in res.body.fixMap){
              aa.push(res.body.fixMap[i].value)
            }
            this.chargeMap = aa; //打赏固定金额
          })
        }
        if(this.contentInfo.attachArr.length>0){
          for(let i in this.contentInfo.attachArr){
            let obj={  name:this.contentInfo.attachArr[i].attachmentNames,
              path:this.contentInfo.attachArr[i].attachmentPaths
            };
            this.info.attachments.push(obj)
          }
        }
        if(this.contentInfo.picArr.length>0){
          for(let j in  this.contentInfo.picArr){
            let obj={
              name:this.contentInfo.picArr[j].picDescs,
              path:this.contentInfo.picArr[j].picPaths
            };
            this.info.pics.push(obj)
          }
        }
        this.dataState=true;
      },
      getAllList() {
        let api = this.$api; //API地址
        axios.post(api.channelGet, { id: this.params.parentId }).then(res => {
          this.hasContentImg=res.body.hasContentImg;
          this.hasTitleImg=res.body.hasTitleImg
          if (this.params.parentId != "") {
            //栏目数据回填
            this.info.parentId = res.body.nodeIds; //层级id[]
          } else {
            this.info.parentId = [""]; //层级id[]
          }
        });
        axios
          .all([
            axios.post(api.fullTextSearchChannelList, { hasContentOnly: true }), //栏目列表
            axios.post(api.topicListAll, { channelId: this.params.parentId }), //关联专题列表
            axios.post(api.typeList, { containDisabled:false }), //内容类型列表
            axios.post(api.groupList), //会员组列表
            axios.post(api.tplModelList,{modelId:this.params.modelId}),
          ])
          .then(
            axios.spread((channels,topicList,type,groups,tplAll) => {
              this.channelList = channels.body; //栏目列表
              this.topicList=topicList.body;//关联专题列表
              this.typeList = type.body; //内容类型列表
              this.groupList = groups.body; //会员组列表
              this.tplAll=tplAll.body;//所有模型
            })
          )
          .catch(err => {
            this.loading = false;
          });
      },
      // getEditorContent(){
      //   //处理一下栏目的富文本内容,固定只有四个
      //   if(this.info.txt!=undefined){

      //     this.info.txt=this.ue[0].getContent();
      //   }
      //   if(this.info.txt1!=undefined){
      //     this.info.txt1=this.ue[1].getContent();
      //   }
      //   if(this.info.txt2 !=undefined){
      //     this.info.txt2=this.ue[2].getContent();
      //   }
      //   if(this.info.txt3 !=undefined){
      //     this.info.txt3=this.ue[3].getContent();
      //   }
      // },
      getParams(){//获取到处理完成给后台提交的对象
        let params={} //数组对象换成字符串
        let picPaths=[];
        let picDescs=[];
        let attachmentNames=[];
        let attachmentPaths=[];
        // this.getEditorContent();
        this.info.rewardFix=this.chargeMap;
        for(let j =0; j<this.info.pics.length;j++){//处理图集
          picPaths.push(this.info.pics[j].path);
          picDescs.push(this.info.pics[j].name);
        }
        for(let i in this.info.attachments){//处理附件
          attachmentNames.push(this.info.attachments[i].name);
          attachmentPaths.push(this.info.attachments[i].path);
        }
        this.info.picPaths=picPaths;
        this.info.picDescs=picDescs;
        this.info.attachmentNames=attachmentNames;
        this.info.attachmentPaths=attachmentPaths;
        for(let key in this.info){
          if(this.info[key] instanceof Array){
            params[key]=this.info[key].join(',');
          }else{
            params[key]=this.info[key];
          }
        }
        delete params.attachments;
        delete params.pics;
        params.channelId=params.parentId.substring(params.parentId.lastIndexOf(',')+1);
        params.id=this.params.id;
        return params;

      },
      update(state){//修改栏目
        let params = this.getParams();
        if (params.channelId == "") {
          this.errorMessage("请选择一个栏目");
          return false;
        }
        let form = this.$refs["form"];
        form.validate(valid => {
          //验证方法
          if (valid) {
            this.loading = true;
            console.log(this.getParams())
            // axios.post("http://192.168.102.139:8080/qkkx/api/admin/content/updateChooseNews", this.getParams()).then(res => {
            axios.post(this.$api.updateChooseNews, this.getParams()).then(res => {
              if (res.code == "200") {
                this.successMessage("修改成功!");
                setTimeout(() => {
                  // this.routerLink("/content/list", "list",this.parentId);
                  this.routerLink("/content/import", "import",this.parentId);
                }, 1000);
              }else{
                this.errorMessage(res.message);
                return false;
              }
              this.loading = false;
            })
              .catch(error => {
                this.loading = false;
              });
          } else {
            return false;
          }
        });
      }
    },
    created() {
      this.$store.dispatch("setCollapse", true); //收缩状态栏


      //初始获取数据
      this.getContentInfo(this.params.id);
    },
    mounted(){

    }
  };
</script>

<style >
  .w40p{
    width: 35% !important;
  }
  .redWarning{
    font-size: 12px;
    color: red;
  }
</style>
