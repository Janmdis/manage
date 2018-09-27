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
        <el-form-item label="有效期" class="flex-50"  prop="dateRange" >
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
        <el-form-item label="问卷类型" class="flex-50" prop="topicType"> 
          <el-select v-model="source.topicType" placeholder="请选择">
            <el-option label="活动问卷" value="1"></el-option>
            <el-option label="退租问卷" value="2"></el-option>
          </el-select>
          <el-row>
          <el-checkbox v-model="isRequireAnswer">必答问卷 </el-checkbox>
          </el-row>
        </el-form-item>
        <!-- 设置问题区域 -->
        <el-form-item label=" " class="flex-100 ">
          <div class="cms-width el-input que-conent" v-for="(item,index) in queItems" :key="index">
            <el-row class="que-item">
              <el-col  :span="15" class="c_pos">
                <el-input class="cms-width" placeholder="请输入问题标题" v-model="queItems[index].title" prop="queTitle">
                </el-input>
                 <el-checkbox v-model="queItems[index].isShow" class="c_pol" v-if="queItems[index].questionType != 0 && index!=0">显示逻辑</el-checkbox>
                 <span v-if='queItems[index].isShow && index!=0' class="c_polt">
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
                          <cms-modelinput :isShows="true" :isOr='true' :isFalse='true' :tableIndex='index' :source='queItems' @saveTable='handle'></cms-modelinput>
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
                  <el-col  :span="5" style="position: relative;">
                    <el-checkbox v-model="obj.isWatermarke" style="position:absolute;right:21px;">水印</el-checkbox>
                    <cms-upload :src='queItems[index].voteItems[objIndex].picture' :isMark="false" :pIndex="index" :index="objIndex" @change='getPath'></cms-upload>
                  </el-col>
                  <el-col  :span="5" >
                    <el-button icon="iconfont  icon-icon--3"  title="删除" @click="itemDelete(index,objIndex,obj)"></el-button>
                    <el-button icon="iconfont  icon-icon--"  title="上移" @click="itemUp(index,objIndex)"></el-button>
                    <el-button icon="iconfont  icon-icon--1"  title="下移" @click="itemDown(index,objIndex)"></el-button>
                  </el-col>
                </el-row>
              </el-row>
            </template>
            <el-row class="que-item-btn text-right" :class="queItems[index].questionType == 0?'cms_pab':''">
              <el-button  v-if="queItems[index].questionType != 3 && queItems[index].questionType != 0" @click="itemAdd(index)" icon="iconfont icon-tianjia" size="small">添加</el-button>
              <el-button @click="queUp(index,queItems,item)" icon="iconfont icon-jiantoushang" size="small">上移</el-button>
              <el-button @click="queDown(index,queItems,item)" icon="iconfont icon-jiantouxia" size="small">下移</el-button>
              <el-button @click="queTop(index,queItems,item)" icon="iconfont icon-huidaodingbu" size="small">最前</el-button>
              <el-button @click="queUnder(index,queItems,item)" icon="iconfont icon-huidaodingbu-copy" size="small">最后</el-button>
              <el-button @click="queDelete(index,queItems,item)" icon="iconfont icon-shanchu1" size="small">{{queItems[index].questionType != 0?'删除题目':'删除分页'}}</el-button>
            </el-row>
          </div>
          <div class="cms-width el-input btn-add-group"  align="left">
              <el-row><span>提交后处理方式:</span></el-row>
               <el-row><el-radio v-model="source.submitType" label="1">跳转到指定页面：</el-radio><el-input v-show='source.submitType==1' class='c_w80' v-model="source.submitUrl" placeholder="请输入url地址" ></el-input></el-row>
              <el-row><el-radio v-model="source.submitType" label="2">显示自定义文案：</el-radio><el-input v-show='source.submitType==2' class='c_w80' v-model="source.submitText" placeholder="请输入自定义文案" ></el-input></el-row>
              <el-row>
                 <el-form-item  v-show='source.submitType==3' label="条件全部不满足时跳转到：" class="titleBox"  >
                  <el-input v-model="source.noMatchUrl"></el-input>
                </el-form-item>   
                <el-radio v-model="source.submitType" label="3">条件跳转：
                </el-radio><span v-show='source.submitType==3' >
                <!-- 设置条件 -->
                <el-popover
                  v-model="visible"
                  placement="button"
                  class="c_widthsize"
                  trigger="click">
                <div class="c_boxHiehg">
                  <!-- 筛选条件组件 -->
                  <el-form-item label="活动名称：" class="titleSize">
                    <el-input v-model="name"></el-input>
                  </el-form-item>
                  <cms-modelinput style="positon" :isOr='true' ref="c1" :isShows="true" :isFalse='false'></cms-modelinput>
                  <el-row><el-radio v-model="radio1" label="1">跳转到指定页面：</el-radio><el-input v-show='radio1==1' class='c_w80' v-model="url" placeholder="请输入url地址"></el-input></el-row>
                  <el-row><el-radio v-model="radio1" label="2">显示自定义文案：</el-radio><el-input v-show='radio1==2' class='c_w80' v-model="text" placeholder="请输入自定义文案"></el-input></el-row>
                </div>
                <div align="center">
                  <el-button  @click="clickShow">保存</el-button>
                  <el-button @click="visible = false">取消</el-button>
                </div>
                <span slot="reference" @click="clickfalse(queItems)">设置条件</span> 
              </el-popover>
                <div>
                   <el-table
                   v-if="conditionJumpList.length!=0"
                    :data="conditionJumpList"
                    border
                    style="width: 100%">
                    <el-table-column
                      label="条件"
                      width='160px'>
                      <template slot-scope="scope">
                        <p :title="titlesss(scope.row)">{{scope.row.name}}</p>
                      </template>
                    </el-table-column>
                  <el-table-column
                    label="处理方式"
                    style="width: 60%">
                    <template slot-scope="scope">
                      <!-- {{scope.row.url}} -->
                        <p>{{scope.row.type==1?"跳转指定页面":"显示自定义文案"}}:{{(scope.row.type==1?scope.row.url:scope.row.text)}}</p>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                  width='200px'>
                    <template slot-scope="scope">
                      <el-button @click="cmshandleClick(scope.row,scope.$index)" type="text" size="small">删除</el-button>
                      <el-button @click="cmsydhandleUpdata(scope.row,scope.$index)" type="text" size="small">编辑</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                </div>
                </span>
                </el-row>
          </div>
          <div class="cms-width el-input btn-add-group"  align="left">
            <el-checkbox v-model="source.couponsId">绑定优惠活动</el-checkbox>
            <div  v-if="source.couponsId" style="width:60%; display:inline-block;">活动ID：<el-input style="width:60%;"  v-model="source.couponsText" placeholder="请输入活动ID"></el-input></div>
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
            <el-button type="primary" v-if="isType('save')||isType('copy')" @click="add(false)" v-perms="'/vote/save'">
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


export default {
  mixins: [formMixns], //普通表单变量
  data() {
    let required = va.required("此项必填");
    let number = va.number("请输入数字");
    return {
      source: {},
      conditionJumpList: [],
      nums: "",
      isRequireAnswer: false,
      visible: false,
      input: "",
      submitType: "",
      submitText: "",
      submitUrl: "",
      questionList: "",
      noMatchUrl: "",
      name: "",
      radio1: "",
      couponsId: false,
      couponsText: "",
      text: "",
      url: "",
      value: "",
      dateRange: "",
      queItems: [],
      defaultRole: {},
      ftp_div_show: false,
      rules: {
        //校验规则
        title: [required],
        topicType: [required],
        repeateHour: [number]
      },
      queFlage: false,
      voteFlage: false,
      fromFlage: false,
      endTimes: false, //日期字段
      submitTypes: false, //问卷方式
      regnoMatchUrl: false, //问卷方式
      regsubmitText: false,
      regsubmitUrl: false
    };
  },
  computed: {
    gets() {
      return this.$store.state.ques.setChildindex;
    },
    getPage() {
      return this.$store.state.ques.querData.filter(ele => {
        return ele.questionType == 0;
      });
    },
    getdataAll() {
      return this.$store.state.ques.querData;
    },
    getUserIcons() {
      return this.$store.state.ques.querData.filter(ele => {
        return ele.questionType != 0;
      });
    },
    getLen() {
      return this.$store.state.ques.querData.filter(ele => {
        return ele.questionType != 0;
      }).length;
    }
  },
  methods: {
    // reset(){
    //   // this.conditionJumpList = []
    // },
    binarySearch(data, item) {
      var h = data.length - 1,
        l = 0;
      while (l <= h) {
        var m = Math.floor((h + l) / 2);
        if (data[m].id == item) {
          return data[m];
        }
        if (item > data[m].id) {
          l = m + 1;
        } else {
          h = m - 1;
        }
      }
      return { title: "kong" };
    },
    titlesss(row) {
      //表单字符转换
      console.log(row)
      let titile = "";
      if (row.submitShowConditionList.length > 0) {
        row.submitShowConditionList.forEach((element, index) => {
          let datas = this.binarySearch(this.getUserIcons, element.id);
          titile +=
            (index == 0 ? "当" : "并且") +
            '"' +
            datas.title +
            (element.conditionType == 1 ? "是" : "不是") +
            (datas.voteItems ? datas.voteItems[0].title : "空") +
            "时" +
            '"';
        });
      }
      return titile;
    },
    getTable(data, index) {
      //获取表单
      this.sortNum(this.queItems);
      if (this.queItems[index].sortNum !== undefined) {
        sessionStorage.setItem("sortNum", this.queItems[index].sortNum);
      }
      this.$root.$emit("tableBox", data[index]);
      sessionStorage.setItem("num", index);
    },
    showTitle(j, data) {
      //信息提示
      let flag = false;
      for (let i = 0; i < j; i++) {
        if (!data[i].title.trim() && data[i].questionType != 0) {
          this.errorMessage("以上题目不能为空");
          return false;
        }
        if (data[i].voteItems != undefined) {
          data[i].voteItems.forEach(element => {
            if (!element.title.trim() && data[i].questionType != 0) {
              this.errorMessage("以上题目均不能为空");
              flag = true;
            }
          });
        }
      }
      if (flag) {
        return false;
      }
      (this.queItems[j].showTableBox = !this.queItems[j].showTableBox),
        (this.nums = j);
    },
    handleClose(e) {
      this.queItems[this.nums].showTableBox = false;
    },
    //关闭表格
    showTableBox() {
      this.$root.$emit("isShowTabel", true);
    },
    CloseTabele() {
      this.visible = false;
    },
    clickShow() {
      //单个添加数据
      let objs = {};
      objs.submitShowConditionList = [];
      if (this.radio1 == 1) {
        objs.url = this.url;
        objs.text = "";
        objs.name = this.name;
        objs.type = this.radio1;
        objs.submitShowConditionList.push(...this.$refs.c1.saveOne());
      }
      if (this.radio1 == 2) {
        objs.text = this.text;
        objs.name = this.name;
        objs.url = "";
        objs.type = this.radio1;
        objs.submitShowConditionList.push(...this.$refs.c1.saveOne());
      }
      if (objs.submitShowConditionList.length <= 0) {
        this.errorMessage("答案不能为空");
        return false;
      }
      if (this.index !== "") {
        this.$set(this.conditionJumpList, this.index, objs);
      } else {
        this.conditionJumpList.push(objs);
      }
      this.$root.$emit("isShowTabel", true);
      this.visible = false;
      this.$refs.c1.clearInput();
      
    },
    cmsydhandleUpdata(ele, index) {
      this.index = index;
      this.$store.dispatch("setTableDates", [{
        data: ele.submitShowConditionList,
        index: index
      }]);

      this.name = ele.name;
      this.radio1 = ele.type;
      this.url = ele.url;
      this.text = ele.text;
      this.$refs.c1.updatedfn();
      this.visible = true;
    },
    cmshandleClick(ele, index) {
      this.conditionJumpList.splice(index, 1);
    },
    clickfalse(data) {
      sessionStorage.setItem("sortNum", this.getLen + 1);
      //
      this.$refs.c1.getdate();
      
      this.index = "";
      this.name = "";
      this.url = "";
      this.text = "";
    },
    //重置排序
    resetSort(arr) {
      for (let i in arr) {
        arr[i].priority = parseInt(i) + 1;
      }
    },
    sortNum(arr) {
      //除分页外的编号
      arr = arr.filter(ele => {
        return ele.questionType != 0;
      });

      for (let i in arr) {
        arr[i].sortNum = parseInt(i) + 1;
      }
    },
    sortPage(arr) {
      //分页编号
      arr = arr.filter(ele => {
        return ele.questionType == 0;
      });
      if (this.queItems[0].questionType == 0) {
        for (let i in arr) {
          arr[i].sortPage = parseInt(i) + 1;
        }
      } else {
        for (let i in arr) {
          arr[i].sortPage = parseInt(i + 1) + 1;
        }
      }
    },
    //切换题型事件
    swithcVoteType(index) {
      let questionType = this.queItems[index].questionType;
      let obj = this.queItems[index];
      if (questionType == 3) {
        delete obj.voteItems;
      } else {
        obj.voteItems = [
          {
            id: "",
            percent: 0,
            title: "",
            voteCount: 0,
            priority: 1,
            picture: "",
            isWatermarke: false,
            isShowBlank: false,
            isBlankRequire: false
          }
        ];
      }
      // this.$set(this.queItems,obj,index);
    },
    //单选题或多选题中选项 “删除” 按钮点击事件
    itemDelete(index, objIndex,data) {
      console.log(data)
      // this.queItems[index].voteItems.splice(objIndex, 1);
    },
    //单选题或多选题中选项 “上移” 按钮点击事件
    itemUp(index, objIndex) {
      if (objIndex == 0) {
        this.errorMessage("当前选项已经是第一项，无法移动");
        return false;
      }
      //调换数组顺序
      this.$switchArrOrder(this.queItems[index].voteItems, objIndex);
      //重置排序
      this.resetSort(this.queItems[index].voteItems);
      //vuex挂载
      this.$store.commit("getquerData", this.queItems);
    },
    //单选题或多选题中选项 “下移” 按钮点击事件
    itemDown(index, objIndex) {
      if (this.queItems[index].voteItems.length == objIndex + 1) {
        this.errorMessage("当前选项已经是最后一项，无法移动");
        return false;
      }
      //调换数组顺序
      this.$switchArrOrder(this.queItems[index].voteItems, objIndex, "down");
      //重置排序
      this.resetSort(this.queItems[index].voteItems);
      //vuex挂载
      this.$store.commit("getquerData", this.queItems);
    },
    //单选题或多选题中选项 添加 按钮点击事件
    itemAdd(index) {
      this.queItems[index].voteItems.push({
        id: "",
        percent: 0,
        title: "",
        voteCount: 0,
        priority: 1,
        picture: "",
        isWatermarke: false,
        isShowBlank: false,
        isBlankRequire: false
      });
    },
    //问题 “删除” 按钮点击事件
    queDelete(index, data, item) {
      if (data) {
        if (item.questionType != 0) {
          let arrBox = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].showLogicList != undefined) {
              for (let j = 0; j < data[i].showLogicList.length; j++) {
                if (data[i].showLogicList[j][0].id == data[index].id) {
                  arrBox.push(data[i].priority);
                }
              }
            }
          }
          if (arrBox.length != 0) {
            this.errorMessage("与第" + arrBox + "题绑定逻辑了无法删除");
            return false;
          }
        }
      }
      this.queItems.splice(index, 1);
      // this.$switchArrOrder(this.queItems, index);
      // // //重置排序
      this.resetSort(this.queItems);
      this.sortNum(this.queItems);
      this.sortPage(this.queItems);
    },
    //问题 “上移” 按钮点击事件
    queUp(index, val, item) {
      if (index == 0) {
        this.errorMessage("当前选项已经是第一项，无法移动");
        return false;
      }
      if (item.questionType != 0) {
        let arrBox = [];
        if (val[index].showLogicList != undefined) {
          for (var i = 0; i < val[index].showLogicList.length; i++) {
            for (let j = 0; j < val[index].showLogicList[i].length; j++) {
              arrBox.push(val[index].showLogicList[i][j].id);
            }
          }
        }
        let flag = false;
        arrBox.forEach(ele => {
          if (ele == val[index - 1].id) {
            flag = true;
          }
        });
        if (flag) {
          this.errorMessage(
            "与第" + val[index - 1].priority + "题绑定逻辑无法上移动"
          );
          return false;
        }
      }
      //调换数组顺序
      this.$switchArrOrder(this.queItems, index);
      //重置排序
      this.resetSort(this.queItems);
      this.sortNum(this.queItems);
      this.sortPage(this.queItems);
    },
    //问题 “下移” 按钮点击事件
    queDown(index, val, item) {
      if (this.queItems.length == index + 1) {
        this.errorMessage("当前选项已经是最后一项，无法移动");
        return false;
      }
      if (item.questionType != 0) {
        //绑定数据无法移动
        let arrBox = [];
        if (val[index].questionType != 0) {
          if (val[index].showLogicList != undefined) {
            if (val[index + 1].showLogicList != undefined) {
              for (let i = 0; i < val[index + 1].showLogicList.length; i++) {
                for (
                  let k = 0;
                  k < val[index + 1].showLogicList[i].length;
                  k++
                ) {
                  if (val[index + 1].showLogicList[i][k].id == val[index].id) {
                    arrBox.push(val[index + 1].priority);
                  }
                }
              }
            }
          }
        }
        if (arrBox.length > 0) {
          this.errorMessage("与第" + arrBox + "题绑定逻辑无法移动之后");
          return false;
        }
      }
      //调换数组顺序
      this.$switchArrOrder(this.queItems, index, "down");
      //重置排序
      this.resetSort(this.queItems);
      this.sortNum(this.queItems);
      this.sortPage(this.queItems);
      //vuex挂载
      if (val[index].questionType != 0) {
        this.$store.commit("getquerData", this.queItems);
      }
    },
    //问题 移动至最前 按钮点击事件
    queTop(index, val, item) {
      if (index == 0) {
        this.errorMessage("当前选项已经是第一项，无法移动");
        return false;
      }
      if (item.questionType != 0) {
        let arrBox = [];
        let showBox = [];
        if (val[index].showLogicList != undefined) {
          //判断绑定数据无法移动
          if (item.questionType != 0) {
            for (let i = 0; i < val[index].showLogicList.length; i++) {
              for (let j = 0; j < val[index].showLogicList[i].length; j++) {
                arrBox.push(val[index].showLogicList[i][j].id);
              }
            }
            for (var i = val[index].showLogicList.length; i >= 0; i--) {
              if (val[i].id != undefined) {
                if (val[i].id == arrBox) {
                  showBox.push(val[i].priority);
                }
              }
            }
          }
        }
        if (showBox.length > 0) {
          this.errorMessage("与第" + showBox + "题绑定逻辑无法移动之前");
          return false;
        }
      }
      //调换数组顺序
      let objs = [];
      objs.push(this.queItems[index]);
      this.queItems.splice(index, 1);
      objs = objs.concat(this.queItems);
      this.queItems = objs;
      //重置排序
      this.resetSort(this.queItems);
      this.sortNum(this.queItems);
      this.sortPage(this.queItems);
      //vuex挂载
      if (item.questionType != 0) {
        this.$store.commit("getquerData", this.queItems);
      }
    },
    //问题 移动至最后 按钮点击事件
    queUnder(index, val, item) {
      if (this.queItems.length == index + 1) {
        this.errorMessage("当前选项已经是第后一项，无法移动");
        return false;
      }
      if (item.questionType != 0) {
        let arrBox = [];
        for (var i = index + 1; i < val.length; i++) {
          //判断绑定数据无法移动
          if (val[i].showLogicList != undefined) {
            if (val[i].showLogicList.length != 0) {
              for (let k = 0; k < val[i].showLogicList.length; k++) {
                for (let j = 0; j < val[i].showLogicList[k].length; j++) {
                  if (val[i].showLogicList[k][j].id == val[index].id) {
                    arrBox.push(val[i].priority);
                  }
                }
              }
            }
          }
        }
        if (arrBox.length > 0) {
          this.errorMessage("与第" + arrBox + "题绑定逻辑无法移动之后");
          return false;
        }
      }
      //调换数组顺序
      let obj = this.queItems[index];
      this.queItems.splice(index, 1);
      this.queItems.push(obj);
      //重置排序
      this.resetSort(this.queItems);
      this.sortNum(this.queItems);
      this.sortPage(this.queItems);
      //vuex挂载
      if (item.questionType != 0) {
        this.$store.commit("getquerData", this.queItems);
      }
    },
    //添加问题点击事件
    queAdd(questionType) {
      this.$store.commit("markId");
      this.visible = false;
      let que = {
        id: new Date().getTime(),
        title: "",
        questionType: questionType,
        priority: 1,
        sortNum: 0,
        isShow: false,
        showLogicList: [],
        showTableBox: false,
        visibles: false,
        voteItems: [
          {
            id: "",
            percent: 0,
            title: "",
            voteCount: 0,
            priority: 1,
            picture: "",
            isWatermarke: false,
            isShowBlank: false,
            isBlankRequire: false
          }
        ]
      };
      if (questionType == 3) {
        que = {
          id: new Date().getTime(),
          title: "",
          questionType: 3,
          priority: 1,
          showTableBox: false,
          showLogicList: []
        };
      } else if (questionType == 0) {
        this.$store.commit("markPage");
        que = {
          id: new Date().getTime(),
          title: "",
          sortPage: 1,
          questionType: 0,
          priority: 1
        };
      }
      this.queItems.push(que);
      this.resetSort(this.queItems);
      this.sortPage(this.queItems);
      //vuex挂载
      this.$store.dispatch("getquerDatas", this.queItems);
    },
    getDataInfo(id) {
      //重写获取表单数据
      let api = this.$api; //API地址
      axios
        .post(this.$api.voteGet, { id: id })
        .then(res => {
          this.loading = false;
          this.source = res.body;
          if (id == 0) {
            this.queItems = [];
            this.queAdd(1);
          } else {
            if (res.body.subtopics.length > 0) {
              this.queItems = res.body.subtopics;
              for (let i in this.queItems) {
                if (
                  this.queItems[i].questionType != 3 &&
                  !this.queItems[i].hasOwnProperty("voteItems")
                ) {
                  this.queItems[i].voteItems = [
                    {
                      id: "",
                      percent: 0,
                      title: "",
                      voteCount: 0,
                      priority: 1,
                      picture: ""
                    }
                  ];
                }
              }
            }
            this.dateRange = [res.body.startTime, res.body.endTime];
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    getParam() {
      //提交信息
      if (this.dateRange.length > 1) {
        this.source.startTime = this.dateRange[0];
        this.source.endTime = this.dateRange[1];
      }
      if (this.source.submitType == 3) {
        this.source.submitText = "";
        this.source.submitUrl = "";
        this.source.conditionJumpList = JSON.stringify(this.conditionJumpList);
      }
      let pageList = [];
      this.queItems;
      if (this.queItems.length > 0) {
        let arrnew = [];
        let arrnewAll = [];
        let newArrBox = [];
        if (this.queItems[0].questionType != 0) {
          newArrBox = [...this.queItems];
          newArrBox.unshift({
            id: new Date().getTime(),
            priority: 1,
            questionType: 0,
            title:"",
            sortPage: 1
          });
        } else {
          newArrBox = [...this.queItems];
        }
        newArrBox.forEach((ele, index) => {
          if (ele.questionType == 0) {
            arrnew = [];
            arrnew.push(ele);
            arrnewAll.push(arrnew);
          } else {
            arrnew.push(ele);
          }
        });
        
        arrnewAll.forEach(item=>{
          let obj = {}
          let arrBox = [];
          item.forEach(items=>{
            if(items.questionType==0){
              obj.description =  items.title
              obj.questionPriority =  items.sortPage
            }else{
              arrBox.push(items.priority)
            }
          })
          obj.arr = arrBox.toString().replace(/[|]/,"")
          pageList.push(obj)
        })
      }

      this.source.pageList = JSON.stringify(pageList);
      this.source.questionList = JSON.stringify(this.queItems);
      delete this.source.subtopics;
    },
    getPath(path, objIndex, pIndex) {
      this.queItems[pIndex].voteItems[objIndex].picture = path;
    },
    marks(marks, pIndex, objIndex) {
      this.queItems[pIndex].voteItems[objIndex].isWatermarke = marks;
    },
    valiate() {
      this.regsubmitUrl = this.regsubmitText = this.regnoMatchUrl = this.topicTypes = this.submitTypes = this.endTimes = this.fromFlage = this.voteFlage = this.queFlage = false;
      let arr = this.queItems;
      let bigarr = this.source;

      if (arr.length == 0) {
        this.queFlage = true;
        return;
      }

      for (let item of arr) {
        if (item.title == "") {
          this.fromFlage = true;
          return;
        }
        if (item.questionType != 3 && item.questionType != 0) {
          if (item.voteItems == "") {
            this.voteFlage = true;
            return;
          }
          if (item.voteItems.length == 0) {
            this.voteItems = true;
            return;
          }
          let arr1 = item.voteItems;
          for (let item1 of arr1) {
            if (item1.title == "") {
              this.fromFlage = true;
              return;
            }
          }
        }
      }
      if (bigarr.topicType == undefined) {
        this.topicTypes = true;
        return;
      }
      // if (this.dateRange == "") {
      //   this.endTimes = true;
      //   return;
      // }
      if (bigarr.submitType == undefined) {
        this.submitTypes = true;
        return;
      }
      if (bigarr.submitType == 1) {
        if (bigarr.submitUrl == "") {
          this.regsubmitUrl = true;
        }
      } else if (bigarr.submitType == 2) {
        if (bigarr.submitText == "") {
          this.regsubmitText = true;
        }
      } else if (bigarr.submitType == 3) {
        if (
          bigarr.conditionJumpList == undefined &&
          bigarr.noMatchUrl == undefined
        ) {
          this.regnoMatchUrl = true;
        }
      }
    },
    update(state) {
      //如果有数据为空不让提交
      this.valiate();
      if (this.queFlage) {
        this.errorMessage("调查问卷至少添加一项题目，请确认!");
        return false;
      }
      if (this.submitTypes) {
        this.errorMessage("提交后处理至少添加一项题目，请确认!");
        return false;
      }
      if (this.source.submitText == "") {
        this.errorMessage("与第" + arrBox + "题绑定逻辑无法移动之后");
        return false;
      }
      if (this.topicTypes) {
        this.errorMessage("问卷类型少添加一项题目，请确认!");
        return false;
      }
      // if (this.endTimes) {
      //   this.errorMessage("有效日期至少添加一项题目，请确认!");
      //   return false;
      // }
      if (this.voteFlage) {
        this.errorMessage("单选题或多选题至少添加一项选项，请确认!");
        return false;
      }
      if (this.fromFlage) {
        this.errorMessage("题目或题目选项未填写，请确认!");
        return false;
      }
      if (this.regnoMatchUrl) {
        this.errorMessage("请选择一种条件跳转方式填写，请确认!");
        return false;
      }
      if (this.regsubmitUrl) {
        this.errorMessage("跳转跳转方式未填写，请确认!");
        return false;
      }
      if (this.regsubmitText) {
        this.errorMessage("显示自定义文案未填写，请确认!");
        return false;
      }

      this.getParam();
      if (this.errorPage()) {
        this.errorMessage("分页不能相连");
        return false;
      }

      this.updateDataInfo(this.$api.voteUpdate, this.source, "list");
    },
    add(state) {
      this.valiate();
      if (this.queFlage) {
        this.errorMessage("调查问卷至少添加一项题目，请确认!");
        return false;
      }
      if (this.endTimes) {
        this.errorMessage("有效日期至少添加一项题目，请确认!");
        return false;
      }
      if (this.submitTypes) {
        this.errorMessage("提交后处理至少添加一项题目，请确认!");
        return false;
      }
      if (this.voteFlage) {
        this.errorMessage("单选题或多选题至少添加一项选项，请确认!");
        return false;
      }
      if (this.fromFlage) {
        this.errorMessage("题目或题目选项未填写，请确认!");
        return false;
      }
      if (this.regnoMatchUrl) {
        this.errorMessage("请选择一种条件跳转方式填写，请确认!");
        return false;
      }
      if (this.regsubmitUrl) {
        this.errorMessage("跳转跳转方式未填写，请确认!");

        return false;
      }
      if (this.regsubmitText) {
        this.errorMessage("显示自定义文案未填写，请确认!");
        return false;
      }
      this.getParam();
      if (this.errorPage()) {
        this.errorMessage("分页不能相连");
        return false;
      }
      if (this.getdataAll[0].questionType == 0) {
        this.source.showFirstPage = 1;
      } else {
        this.source.showFirstPage = 0;
      }
      if (this.getdataAll[this.getdataAll.length - 1].questionType == 0) {
        this.errorMessage("最后分页下面必须有题");
        return false;
      }
      this.saveDataInfo(state, this.$api.voteSave, this.source, "list");
    },
    errorPage() {
      let flag = false;
      if (this.queItems.length > 0) {
        for (let i = 0; i < this.queItems.length - 1; i++) {
          if (this.queItems[i].questionType == 0) {
            if (
              this.queItems[i].questionType == this.queItems[i + 1].questionType
            ) {
              flag = true;
            }
          }
        }
      }
      return flag;
    },
    handle(data) {
      this.queItems[data.index].showTableBox = data.ishow;
      if (data.tableInfo == undefined) {
        return false;
      }
      this.$nextTick(() => {
        if (this.gets !== "") {
          let oldDatas = this.queItems[data.index].showLogicList;
          for (let i = 0; i < oldDatas.length; i++) {
            if (
              oldDatas[i][0].id == data.tableInfo[0].id &&
              oldDatas[i][0].conditionType == data.tableInfo[0].conditionType &&
              oldDatas[i][0].itemPriority == data.tableInfo[0].itemPriority &&
              oldDatas[i][0].questionPriority ==
                data.tableInfo[0].questionPriority
            ) {
              this.errorMessage("不能添加重复数据");
              return false;
            }
          }
          this.queItems[data.index].showLogicList[this.gets] = data.tableInfo; //编辑状态
        } else {
          //table数据不能重复
          let oldDatas = this.queItems[data.index].showLogicList;
          for (let i = 0; i < oldDatas.length; i++) {
            if (
              oldDatas[i][0].id == data.tableInfo[0].id &&
              oldDatas[i][0].conditionType == data.tableInfo[0].conditionType &&
              oldDatas[i][0].itemPriority == data.tableInfo[0].itemPriority &&
              oldDatas[i][0].questionPriority ==
                data.tableInfo[0].questionPriority
            ) {
              this.errorMessage("不能添加重复数据");
              return false;
            }
          }
          this.queItems[data.index].showLogicList.push(data.tableInfo); //新值保存
        }
        this.$store.dispatch("setChildindexs", "");
      });
    }
  },
  created() {
    //初始获取数据
    this.getDataInfo(this.id);
    this.$root.$on("clearTable", data => {
      this.queItems[data.index].showTableBox = data.ishow;
    });
  },
  mounted() {
    this.$root.$on("showTitleBox", data => {
      let j = sessionStorage.getItem("num");
      this.queItems[j].showTableBox = !this.queItems[j].showTableBox;
    });
    this.$root.$on("delBox", data => {
      let num = sessionStorage.getItem("num");
      this.$nextTick(() => {
        this.queItems[num].showLogicList.splice(data, 1);
      });
    });
  }
};
</script>
<style >
.que-conent,
.btn-add-group {
  padding: 10px;
  box-sizing: border-box;
  background-color: #fbfdff;
  border: 1px dashed #e8eff4;
  margin-top: 10px;
}
.el-row .el-col .cms-upload .cms-upload-box,
.el-row .el-col .cms-upload .avatar-uploader-icon,
.el-row .el-col .cms-upload .cms-upload-box .cms-progress,
.el-row .el-col .cms-upload .cms-upload-box .el-progress-circle {
  width: 60px !important;
  height: 60px !important;
  line-height: 60px;
}
.el-row .el-col .cms-upload .cms-upload-box .cms-zoom-icon {
  width: 50px;
  left: 50%;
  margin-left: -20px;
  margin-top: -20px;
  font-size: 13px;
}
.el-row .el-col .cms-upload .cms-upload-box .cms-zoom-font {
  font-size: 10px;
}
.el-row .el-col .cms-upload .cms-upload-box .cms-img-bottom {
  height: 20px;
  line-height: 20px;
}
.que-item-title {
  height: 20px;
  line-height: 20px;
}
.que-item {
  height: 70px;
  line-height: 70px;
}
.c_w80 {
  width: 80%;
}
.que-item .el-button {
  padding: 0px 0px;
  min-width: 0px;
  border: 0px solid #dcdfe6;
  color: #9dbed7;
}
.que-item .el-button:hover,
.que-item-btn .el-button:hover {
  background-color: #ffffff;
}
.que-item .el-button:focus,
.que-item-btn .el-button:focus {
  background-color: #ffffff;
}
.que-item .el-button:active,
.que-item-btn .el-button:active {
  background-color: #ffffff;
}
.que-item .el-button .iconfont {
  font-size: 30px;
}
.que-item-btn .el-button {
  margin: 20px 0px;
  padding: 7px 10px;
  min-width: 0px;
  border: 1px solid #ffcba1;
  color: #ffcba1;
}
.que-item-btn .el-button .iconfont {
  font-size: 12px;
  font-weight: 100;
}
.que-item .el-form-item {
  border: 0px;
}
.el-form-item__error {
  left: 84%;
}
.c_boxp {
  position: absolute;
  left: 50%;
  top: -10px;
}
.c_pos {
  position: relatvie;
}
.c_pol {
  position: absolute;
  left: 55%;
}
.c_polt {
  position: absolute;
  left: 58%;
  top: 20px;
}
.c_boxHiehg {
  line-height: 40px;
}
.c_widthsize .el-popover {
  width: 96%;
  position: relative;
}
.cms_pab {
  position: absolute;
  right: 10px;
  top: 10px;
}
.closeBox:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
.closeBox {
  line-height: 40px;
}
.closeBox .cms_title {
  font-size: 16px;
  float: left;
  padding-left: 10px;
}
.closeBox .cms_close {
  font-size: 20px;
  float: right;
  margin-right: 10px;
}
.showTableBoxSize {
  position: absolute;
  border: 1px solid #ebeef5;
  z-index: 999;
  background: #fff;
  width: 110%;
  left: -5%;
  top: 10px;
  padding: 20px;
}
.titleSize {
  position: relative;
  width: 80%;
  padding: 0;
  margin: 0;
  border: none !important;
}

.titleSize .el-form-item__label {
  padding-right: 20px !important;
}
.titleSize .el-form-item__content {
  margin-left: 17% !important;
}
.titleSize {
  padding: 0 !important;
  top: 10px;
}
.titleSize .el-form-item__label {
  width: 17% !important;
}
.titleBox {
  position: absolute;
  right: 10%;
  top: -17px;
  width: 60%;
  border: none !important;
}
.titleBox .el-form-item__content {
  margin-left: 50% !important;
}
.titleBox .el-form-item__label {
  width: 50% !important;
}
</style>
