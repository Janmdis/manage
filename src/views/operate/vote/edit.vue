<template>
  <section class="cms-body" >
    <!-- 返回组件 -->
    <cms-back></cms-back>        
    <el-form  ref="form" :model="source" :rules="rules" class="cms-form" label-width="162px">
        <!-- 名称 -->
        <el-form-item label="标题" class="flex-100 "  prop="title">
          <el-input class="cms-width" v-model="source.title"> </el-input>
        </el-form-item>
        <!-- 说明 -->
        <el-form-item label="说明" class="flex-100" >
          <el-input v-model="source.description" class="cms-width" type="textarea" ></el-input>
        </el-form-item>
        <!-- 有效时间 -->
        <el-form-item label="有效期" class="flex-50" >
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            align="right"
            value-format = "yyyy-MM-dd"
            unlink-panels
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            class="cms-width">
          </el-date-picker>
          <span class="gray">留空为不限制时间</span>
        </el-form-item> 
        <!-- 重复答卷限制 -->
        <el-form-item label="重复答卷限制" class="flex-50 ">
          <el-input class="cms-width" v-model="source.repeateHour" type="number" prop="repeateHour"> </el-input>
          <span class="gray">单位：小时。为空禁止重复投票；0为不限制重复投票。</span>
        </el-form-item>
        <!-- 是否开启答卷限制 -->
        <el-form-item label="答卷限制" class="flex-50 ">
          <el-radio-group v-model="source.restrictMember"  class="cms-width"> 
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>  
          <span class="gray">选择开启则表示必须登录才能参与答卷</span>
        </el-form-item>
        <el-form-item label="问卷类型" class="flex-50"> 
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-row>
          <el-checkbox v-model="checked">必答问卷 </el-checkbox>
          </el-row>
        </el-form-item>
        <!-- 设置问题区域 -->
        <el-form-item label=" " class="flex-100 ">
          <div class="cms-width el-input que-conent" v-for="(item,index) in queItems" :key="index">
            <el-row class="que-item">
              <el-col  :span="15" class="c_pos">
                <el-input class="cms-width" placeholder="请输入问题标题" v-model="queItems[index].title" prop="queTitle">
                </el-input>
                 <el-checkbox v-model="item.isShow" class="c_pol" v-if="queItems[index].questionType != 0 && index!=0">显示逻辑</el-checkbox>
                 <span v-if='item.isShow && index!=0' class="c_polt">
                   <el-popover
                       v-model="item.visibles"
                      placement="bottom"
                      width="800"
                      style="z-index:1;"
                      trigger="click">
                      <div class="closeBox">
                      <span class="cms_title" @click="showTitle(index,queItems)">添加显示逻辑</span> <span  @click="item.visibles = false" class="cms_close"><i class="el-icon-close"></i></span></div>
                      <cms-table :showTabele='true' :items='item'></cms-table>
                      <el-button slot="reference" @click="getTable(queItems,index)">编辑</el-button>
                      <div class="showTableBoxSize" v-if='item.showTableBox' v-clickoutside="handleClose" >
                          <cms-modelinput :isShows="true" :isFalse='true' :tableIndex='index' :source='queItems' @saveTable='handle'></cms-modelinput>
                      </div>
                    </el-popover>
                   </span>
              </el-col>
              <el-col  :span="9" v-if="queItems[index].questionType != 0">
                <el-form-item label="更换题型:" >
                  <el-select  placeholder="请选择"  v-model="queItems[index].questionType"  @change="swithcVoteType(index)">
                    <el-option label="单选题" :value="1"></el-option>
                    <el-option label="多选题" :value="2"></el-option>
                    <el-option label="问答题" :value="3"> </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <template v-if="queItems[index].questionType != 3 && queItems[index].questionType != 0">
              <el-row class="que-item-title" >
                  <el-col :span="14">选项</el-col>
                  <el-col :span="5">图片</el-col>
                  <el-col :span="5">操作</el-col>
              </el-row>
              <el-row v-for="(obj,objIndex) in queItems[index].voteItems" :key="objIndex"> 
                <el-row class="que-item">
                  <el-col  :span="14"  class="c_pos" >
                    <el-input class="cms-width" placeholder="选项" v-model="queItems[index].voteItems[objIndex].title" prop="itemTitle">
                    </el-input>
                    <div  class='c_boxp'> 
                       <el-checkbox v-model="obj.isShowBlank" style="">可填写</el-checkbox>
                    <el-checkbox v-if="obj.isShowBlank" v-model="obj.isBlankRequire" style="position:absolute;left:-30px;top:20px;">是否必填</el-checkbox> 
                    </div>
                  </el-col>
                  <el-col  :span="5">
                    <cms-upload :src='queItems[index].voteItems[objIndex].picture'  :pIndex="index" :index="objIndex" @change='getPath'></cms-upload>
                  </el-col>
                  <el-col  :span="5" >
                    <el-button icon="iconfont  icon-icon--3"  title="删除" @click="itemDelete(index,objIndex)"></el-button>
                    <el-button icon="iconfont  icon-icon--"  title="上移" @click="itemUp(index,objIndex)"></el-button>
                    <el-button icon="iconfont  icon-icon--1"  title="下移" @click="itemDown(index,objIndex)"></el-button>
                  </el-col>
                </el-row>
              </el-row>
            </template>
            <el-row class="que-item-btn text-right" :class="queItems[index].questionType == 0?'cms_pab':''">
              <el-button  v-if="queItems[index].questionType != 3 && queItems[index].questionType != 0" @click="itemAdd(index)" icon="iconfont icon-tianjia" size="small">添加</el-button>
              <el-button @click="queUp(index,queItems)" icon="iconfont icon-jiantoushang" size="small">上移</el-button>
              <el-button @click="queDown(index,queItems)" icon="iconfont icon-jiantouxia" size="small">下移</el-button>
              <el-button @click="queTop(index,queItems)" icon="iconfont icon-huidaodingbu" size="small">最前</el-button>
              <el-button @click="queUnder(index,queItems)" icon="iconfont icon-huidaodingbu-copy" size="small">最后</el-button>
              <el-button @click="queDelete(index,queItems)" icon="iconfont icon-shanchu1" size="small">{{queItems[index].questionType != 0?'删除题目':'删除分页'}}</el-button>
            </el-row>
          </div>
          <div class="cms-width el-input btn-add-group"  align="left">
              <el-row><span>提交后处理方式:</span></el-row>
               <el-row><el-radio v-model="submitType" label="1">跳转到指定页面：</el-radio><el-input v-show='submitType==1' class='c_w80' v-model="submitUrl" placeholder="请输入url地址"></el-input></el-row>
              <el-row><el-radio v-model="submitType" label="2">显示自定义文案：</el-radio><el-input v-show='submitType==2' class='c_w80' v-model="submitText" placeholder="请输入自定义文案"></el-input></el-row>
              <el-row><el-radio v-model="submitType" label="3">条件跳转：</el-radio><span v-show='submitType==3' >
                <!-- 设置条件 -->
                <el-popover
                  v-model="visible"
                  placement="button"
                  class="c_widthsize"
                  trigger="click">
                <div class="c_boxHiehg">
                  <!-- 筛选条件组件 -->
                  <input questionType="text" v-model="source.questionList">
                  <cms-modelinput :isShows="true" :isFalse='false'></cms-modelinput>
                  <el-row><el-radio v-model="radio1" label="1">跳转到指定页面：</el-radio><el-input v-show='radio1==1' class='c_w80' v-model="input" placeholder="请输入url地址"></el-input></el-row>
                  <el-row><el-radio v-model="radio1" label="2">显示自定义文案：</el-radio><el-input v-show='radio1==2' class='c_w80' v-model="input" placeholder="请输入自定义文案"></el-input></el-row>
                </div>
                <div align="center">
                  <el-button  @click="clickShow">保存</el-button>
                  <el-button @click="visible = false">取消</el-button>
                </div>
                <span slot="reference" @click="clickfalse">设置条件</span>
              </el-popover>
                <cms-table></cms-table>
                </span>
                </el-row>
          </div>
          <div class="cms-width el-input btn-add-group"  align="center">
           <el-button @click="queAdd(0)"  icon="el-icon-plus" size="small">添加分页</el-button>
            <el-button @click="queAdd(1)"  icon="el-icon-plus" size="small">添加单选题</el-button>
            <el-button @click="queAdd(2)"  icon="el-icon-plus" size="small">添加多选题</el-button>
            <el-button @click="queAdd(3)" icon="el-icon-plus" size="small">添加问答题</el-button>
          </div>
        </el-form-item>
        <!-- 按钮组 -->
        <div class="form-footer">
            <el-button type="warning" v-if="isType('save')" @click="add(true)" v-perms="'/vote/save'">
              提交并继续添加
            </el-button>
            <el-button type="primary"  @click="add(false)" v-perms="'/vote/save'">
              提交
            </el-button>
            <el-button type="primary" v-if="isType('update')" @click="update()" v-perms="'/vote/update'">
              修改
            </el-button>
            <el-button type="info" @click="reset">重置</el-button>
            <span class="gray" v-if="isType('save')">选择“提交并继续添加”按钮会停留在添加页面；选择“提交”按钮后将跳转到对应的列表页</span> 
        </div>
    </el-form>
</section>
</template>
<script>
import axios from "axios";
import va from "@/rules";
import formMixns from "@/mixins/form";
const clickoutside = {
    // 初始化指令
    bind(el, binding, vnode) {
        function documentHandler(e) {
            // 这里判断点击的元素是否是本身，是本身，则返回
            if (el.contains(e.target)) {
                return false;
            }
            // 判断指令中是否绑定了函数
            if (binding.expression) {
                // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
                binding.value(e);
            }
        }
        // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
        el.__vueClickOutside__ = documentHandler;
        document.addEventListener('click', documentHandler);
    },
    update() {},
    unbind(el, binding) {
        // 解除事件监听
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__;
    },
};

export default {
  mixins: [formMixns], //普通表单变量
  data() {
    let required = va.required('此项必填');
    let number = va.number('请输入数字');
    return {
      source:{
      },
      nums:'',
      checked:true,
      visible: false,
      input:'',
      submitType: '',
      submitText:"",
      submitUrl:'',
      questionList:'',
      radio1:'',
      options: [{
          value: '选项1',
          label: '问卷活动'
        }, {
          value: '选项2',
          label: '退租活动'
        }],
        value: '',
      dateRange:'',
      queItems:[],
      defaultRole:{},
      ftp_div_show:false,
      rules: {//校验规则
        title:[required],
        repeateHour:[number],
      },
      queFlage:false,
      voteFlage:false,
      fromFlage:false,
    };
  },
  mounted(){

  },
   directives: {clickoutside},
  methods: {
    getTable(data,index){
       this.$root.$emit('tableBox',data[index])
    },
    showTitle(j,data){
      console.log(j-2)
      let flag = false;
      for(let i =0;i<j;i++){
        if(!data[i].title.trim()&&(data[i].questionType!=0)){
          this.errorMessage("以上题目不能为空");
          return false
        }
        if(data[i].voteItems!=undefined){
          data[i].voteItems.forEach(element => {
            if(!element.title.trim()&&(data[i].questionType!=0)){
            this.errorMessage("答案不能为空");
            flag = true
          }
    
        });
        }
        
      }
      if(flag){
        return false
      }
       sessionStorage.setItem("num",j)
      //  this.$root.$emit("lookNum",j)
       this.queItems[j].showTableBox = !this.queItems[j].showTableBox,
      this.nums=j
      
    },
    handleClose(e) {
      this.queItems[this.nums].showTableBox = false;
    },
    //关闭表格
    showTableBox(){
      this.$root.$emit("isShowTabel",true)
    },
    CloseTabele(){
        this.visible = false
    },
    clickShow(){
      this.$root.$emit("isShowTabel",true)
      this.visible = false
    },
   
    clickfalse(){
      this.$root.$emit("isShowTabel",false)
    },
     //重置排序
    resetSort(arr){
      for(let i in arr){
        arr[i].priority = parseInt(i)+1;
      }
    },
    //切换题型事件
    swithcVoteType(index){
      let questionType = this.queItems[index].questionType;
      let obj = this.queItems[index];
      if(questionType == 3){
        delete obj.voteItems;
      }else{
        obj.voteItems = [{id:'',percent:0,title:'', voteCount:0, priority:1,picture:'',isShowBlank:false,isBlankRequire:false}];
      }
      // this.$set(this.queItems,obj,index);
    },
    //单选题或多选题中选项 “删除” 按钮点击事件
    itemDelete(index,objIndex){
      this.queItems[index].voteItems.splice(objIndex,1);
    },
    //单选题或多选题中选项 “上移” 按钮点击事件
    itemUp(index,objIndex){
      if(objIndex == 0){
        this.errorMessage("当前选项已经是第一项，无法移动");
        return false;
      }
      //调换数组顺序
      this.$switchArrOrder(this.queItems[index].voteItems,objIndex);
      //重置排序
      this.resetSort(this.queItems[index].voteItems);
      //vuex挂载
      this.$store.commit("getquerData",this.queItems)
    },
    //单选题或多选题中选项 “下移” 按钮点击事件
    itemDown(index,objIndex){
      if(this.queItems[index].voteItems.length == (objIndex+1)){
        this.errorMessage("当前选项已经是最后一项，无法移动");
        return false;
      }
      //调换数组顺序
      this.$switchArrOrder(this.queItems[index].voteItems,objIndex,'down');
      //重置排序
      this.resetSort(this.queItems[index].voteItems);
      //vuex挂载
      this.$store.commit("getquerData",this.queItems)
    },
    //单选题或多选题中选项 添加 按钮点击事件
    itemAdd(index){
      this.queItems[index].voteItems.push({id:'',percent:0,title:'', voteCount:0, priority:1,picture:'',isShowBlank:false,isBlankRequire:false});
    },                                          
    //问题 “删除” 按钮点击事件
    queDelete(index){
      this.queItems.splice(index,1);
    },
    //问题 “上移” 按钮点击事件
    queUp(index,val){
      if(index == 0){
        this.errorMessage("当前选项已经是第一项，无法移动");
        return false;
      }
      //调换数组顺序
      console.log(this.$switchArrOrder(this.queItems,index));
      //重置排序
      console.log(this.resetSort(this.queItems));
    },
    //问题 “下移” 按钮点击事件
    queDown(index,val){
      if(this.queItems.length == (index+1)){
        this.errorMessage("当前选项已经是最后一项，无法移动");
        return false;
      }
      //调换数组顺序
      this.$switchArrOrder(this.queItems,index,'down');
      //重置排序
      this.resetSort(this.queItems);
      //vuex挂载
      this.$store.commit("getquerData",this.queItems)
    },
    //问题 移动至最前 按钮点击事件
    queTop(index,val){
      if(index == 0){
        this.errorMessage("当前选项已经是第一项，无法移动");
        return false;
      }
      //调换数组顺序
      let objs = [];
      objs.push(this.queItems[index]);
      this.queItems.splice(index,1);
      objs = objs.concat(this.queItems);
      this.queItems = objs ;
      //重置排序
      this.resetSort(this.queItems);
      //vuex挂载
      this.$store.commit("getquerData",this.queItems)
    },
    //问题 移动至最后 按钮点击事件
    queUnder(index,val){
       if(this.queItems.length == (index+1)){
        this.errorMessage("当前选项已经是第后一项，无法移动");
        return false;
      }
      //调换数组顺序
      let obj = this.queItems[index];
      this.queItems.splice(index,1);
      this.queItems.push(obj);    
      //重置排序
      this.resetSort(this.queItems);
      //vuex挂载
      this.$store.commit("getquerData",this.queItems)
    },
    //添加问题点击事件
    queAdd(questionType){ 
      this.$store.commit("markId")
      this.visible = false
      let que = {id:this.$store.state.ques.markId,title:'',questionType:questionType,priority:1,isShow:false,showLogicList:[],showTableBox:false,visibles:false,voteItems:[{id:'',percent:0,title:'', voteCount:0, priority:1,picture:'',isShowBlank:false,isBlankRequire:false} ]}
      if(questionType == 3){
        que = {id:this.$store.state.ques.markId,title:'', questionType:3,priority:1,showTableBox:false,showLogicList:[]};
      }else if(questionType == 0){
        this.$store.commit("markPage")
        que = {id:this.$store.state.ques.markPage,title:'', questionType:0,priority:1};
      }
      this.queItems.push(que);
      
      this.resetSort(this.queItems)
      
      //vuex挂载
      this.$store.dispatch("getquerDatas",this.queItems)
    },
    getDataInfo(id) {//重写获取表单数据
      let api = this.$api; //API地址
      axios.post(this.$api.voteGet,{id:id})
        .then(res => {
          this.loading = false;
          this.source = res.body; 
          if(id == 0){
            this.queItems = [];
            this.queAdd(1);
          }else{
            if(res.body.subtopics.length > 0){
              this.queItems = res.body.subtopics;
              for(let i in this.queItems){
                if(this.queItems[i].questionType != 3 && !this.queItems[i].hasOwnProperty('voteItems')){
                  this.queItems[i].voteItems =  [{id:'', percent:0,title:'',voteCount:0,priority:1,picture:'', }];
                }
              }
            }
            this.dateRange = [res.body.startTime,res.body.endTime];
          }
        }).catch(err => {
          this.loading = false;
        });
    },
    getParam(){
      if(this.dateRange.length > 1){
        this.source.startTime = this.dateRange[0];
        this.source.endTime = this.dateRange[1];
      }
      this.source.questionList = this.queItems;
      delete this.source.subtopics;
    },
    getPath(path,objIndex,pIndex){
      this.queItems[pIndex].voteItems[objIndex].picture = path;
    },
    valiate(){
      this.fromFlage = this.voteFlage = this.queFlage = false;
      let arr = this.queItems;
      if(arr.length == 0){
        this.queFlage = true;
        return ;
      }
      for(let item of arr){
        if(item.title == ''){
          this.fromFlage = true;
          return ;
        }
        if(item.questionType != 3&&item.questionType != 0){
          if(item.voteItems == ''){
            this.voteFlage = true;
            return ;
          }
          if(item.voteItems.length == 0){
            this.voteItems = true;
            return ;
          }
          let arr1 = item.voteItems;
          for(let item1 of arr1){
            if(item1.title == ''){
              this.fromFlage = true;
              return ;
            }
          }
        }
      }
    },
    update(state) {
      this.valiate();
      if(this.queFlage){
        this.errorMessage('调查问卷至少添加一项题目，请确认!');
        return false;
      }
      if(this.voteFlage){
        this.errorMessage('单选题或多选题至少添加一项选项，请确认!');
        return false;
      }
      if(this.fromFlage){
        this.errorMessage('题目或题目选项未填写，请确认!');
        return false;
      }
      this.getParam();
      this.updateDataInfo(this.$api.voteUpdate, this.source, "list");
    },
    add(state) {
      this.valiate();
      if(this.queFlage){
        this.errorMessage('调查问卷至少添加一项题目，请确认!');
        return false;
      }
      if(this.voteFlage){
        this.errorMessage('单选题或多选题至少添加一项选项，请确认!');
        return false;
      }
      if(this.fromFlage){
        this.errorMessage('题目或题目选项未填写，请确认!');
        return false;
      }
      this.getParam();
      console.log( this.source)
      // this.saveDataInfo(state,this.$api.voteSave, this.source, "list");
    },
    handle(data){
      this.queItems[data.index].showTableBox = data.ishow;
        if(data.tableInfo==undefined){
          return false
        }
         this.$nextTick(() => {
          this.queItems[data.index].showLogicList.push(data.tableInfo)
         })
    }
  },
  created() {
    //初始获取数据
    this.getDataInfo(this.id);
    //  this.$root.$on("saveTable",(data)=>{
       

    //  });
  },
  mounted(){
     this.$root.$on("showTitleBox",data=>{
       let j =  sessionStorage.getItem("num")
       this.queItems[j].showTableBox = !this.queItems[j].showTableBox;

      })
    this.$root.$on("delBox",(data)=>{
      let num  =  sessionStorage.getItem("num")
       this.$nextTick(() => {
         this.queItems[num].showLogicList.splice(data,1)
        })
    })
  },

};
</script>
<style >
.que-conent,
.btn-add-group{
  padding: 10px;
  box-sizing: border-box;
  background-color: #FBFDFF;
  border: 1px dashed #E8EFF4;
  margin-top:10px;
}
.el-row .el-col .cms-upload .cms-upload-box ,
.el-row .el-col .cms-upload .avatar-uploader-icon,
.el-row .el-col .cms-upload .cms-upload-box .cms-progress,
.el-row .el-col .cms-upload .cms-upload-box .el-progress-circle{
  width: 60px !important;
  height: 60px !important;
  line-height: 60px;
}
.el-row .el-col .cms-upload .cms-upload-box .cms-zoom-icon{
  width: 50px;
  left:50%;
  margin-left: -20px;
  margin-top: -20px;
  font-size: 13px;
}
.el-row .el-col .cms-upload .cms-upload-box .cms-zoom-font{
  font-size: 10px;
}
.el-row .el-col .cms-upload .cms-upload-box .cms-img-bottom{
  height: 20px;
  line-height: 20px;
}
.que-item-title{
  height: 20px;
  line-height: 20px;
}
.que-item{
  height: 70px;
  line-height: 70px;
}
.c_w80{
  width: 80%;
}
.que-item .el-button{
  padding: 0px 0px;
  min-width: 0px;
  border: 0px solid #dcdfe6;
  color:#9DBED7;
}
.que-item .el-button:hover,
.que-item-btn .el-button:hover{
  background-color: #FFFFFF;
}
.que-item .el-button:focus,
.que-item-btn .el-button:focus {
  background-color: #FFFFFF;
} 
.que-item .el-button:active,
.que-item-btn .el-button:active {
  background-color: #FFFFFF;
} 
.que-item .el-button .iconfont{
  font-size: 30px;
}
.que-item-btn .el-button{
  margin: 20px 0px;
  padding: 7px 10px;
  min-width: 0px;
  border: 1px solid #FFCBA1;
  color:#FFCBA1;
}
.que-item-btn .el-button .iconfont {
  font-size: 12px;
  font-weight: 100;
}
.que-item .el-form-item{
  border:0px;
}
.el-form-item__error {
    left: 84%;
}
.c_boxp{
  position:absolute;
  left:50%;
  top:-10px;
}
.c_pos{
  position:relatvie;
}
.c_pol{
  position:absolute;
  left:55%;
}
.c_polt{
  position:absolute;left:58%;top:20px;
}
.c_boxHiehg{
  line-height: 40px;
}
.c_widthsize .el-popover{
  width: 96%;
  position: relative;
}
.cms_pab{
  position: absolute;
    right: 10px;
    top: 10px;
}
.closeBox:after{display:block;clear:both;content:"";visibility:hidden;height:0}
.closeBox{
      line-height: 40px;
}
.closeBox .cms_title{
  font-size: 16px;
  float: left;
  padding-left: 10px;
}
.closeBox .cms_close{
  font-size: 20px;
  float: right;
 margin-right: 10px;
}
.showTableBoxSize{
  position: absolute;
  border:1px solid #ebeef5;
  z-index: 999;
  background: #fff;
  width: 110%;
  left: -5%;
  top:10px;
  padding: 20px;
}
</style>
