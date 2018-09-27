<template>
  <section class="cms-body" v-loading="loading">
    <!-- 返回组件 -->
    <cms-back></cms-back>          
    <el-row class="result">
        <el-col :span="15" class='C_pingSize'>
        <div class="grid-content bg-purple-dark">
            <h2>投票结果</h2><span>》</span>网络调查
        </div>
        </el-col>
        <el-col :span="24"><div class="grid-content bg-purple c_textConent">
            <div >
            <el-row>
                <el-col :span="8"><div class="grid-content bg-purple"></div>
                <h2 class="c_titlemark">投票主题：<span>退租问卷</span></h2>
                </el-col>
                <el-col :span="8"><div class="grid-content bg-purple-light">
                <h2 class="c_titlemark">参与人数：<span>0人</span></h2>
                </div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple">
                    <span class='c_addcursor' @click='isShowfn'>答案筛选</span>
                </div></el-col>
            </el-row>
            <!-- 筛选组件 -->
            <!-- <cms-modelinput  ref="c1" :isFalse='false' :isCheck='true' :isOr='false'></cms-modelinput>
             -->
             <div v-if="isShows" >
              <el-row class='c_p4' >
                <div class='c_p1' v-for="(item,indexs) in showConditionList " :key="indexs">
                <span>
                    <span v-if="indexs==0"  style='width:12%;display: inline-block; text-align: right;' class='c_p5' >题目：</span>
                    <el-select v-model="item.or" v-if="indexs!=0"  style='width:12%;' class='c_p5'>
                        <el-option label="或者" value="1"></el-option>
                        <el-option label="并且" value="2"></el-option>
                    </el-select>
                    <!-- <span v-if="indexs!=0"   style='width:12%;display: inline-block; text-align: right;' class='c_p5' >并且</span> -->
                </span>
                 <el-select v-model="item.questionPriority" style='width:25%;' class='c_p5' >
                    <el-option v-for="(items,index) in ResultOne"   :key='index' :label="items.title" :value="items.questionId" @click.native="changeVal(items.questionId,indexs,item)"></el-option>
                </el-select>
                 <el-select v-model="item.conditionType" style='width:12%;' class='c_p5' >
                    <el-option label="是" :value=1></el-option>
                    <el-option label="不是" :value=2></el-option>
                </el-select>
                 <el-select v-model="item.itemPriority" style='width:25%;' class='c_p5'>
                     <el-option v-for="(items,index) in item.arrbox" :key='index' v-if="items.title!=''"  :label="items.title" :value="items.itemId" ></el-option>
                </el-select>
                <span class='delconditions' @click='delconditions(indexs)'  v-if="indexs!=0" >删除条件</span>
                </div>
            </el-row>
            <el-row >
                <span class="c_addconditions" @click='addconditions' >添加条件</span>
                <div class='c_line' v-show="isShowfn"></div>
                <div class="c_center " v-show="isShowfn">
                    <el-button @click="baocun" >筛选</el-button>   
                    <el-button @click="isShowfn">取消</el-button>   
                 </div>
            </el-row>
             </div>
            <!-- <div class="screenBox" v-if="isShows">
              <button @click='clickShow'>查询</button>
              <button @click='isShowfn'>取消筛选</button>
            </div> -->
            </div>
            <div v-if="showCheck" style="margin-top:20px;">
            <el-row v-for="(item,index) in options" :key="index" >
             <el-col :span="24" class='c_height5'>
                <span>{{index+1+"、"+item.optiontitle}}房间装修质量问题后续引导题</span>
             </el-col>   
             <div v-if="item.type==1"> 
              <el-col :span="24" class='c_height5'>
                <el-radio  style="color:#353535; width:20%;"  disabled  v-for="(items,index) in item.optionlist" :key='index'   v-model="item.radio"  :label="items.val">{{index+1+"、"+items.condition}}</el-radio>
              </el-col> 
             </div>
             <div v-if="item.type==2">
             <el-checkbox-group v-model="item.checkboxGroup6">
                <el-checkbox style="color:#353535;width:20%;"  disabled  v-for="(items,index) in item.optionlist" :key='index' :label="items.condition" ></el-checkbox>
              </el-checkbox-group>
             </div>
             <div v-if="item.type==3">
               <el-input
                  disabled
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                  class="showtextarea"
                  v-model="item.textarea">
                </el-input>
             </div>
               
            </el-row>
             <div class="c_center cmsMtop">
                    <!-- <el-button >&nbsp;&nbsp;投票&nbsp;&nbsp;</el-button>    -->
                    
                    <span class='c_size' @click="showVoteList">查看投票结果</span>  

                 </div>
              <el-pagination small  layout="prev, pager, next"  @current-change="getPages" :total="50">
              </el-pagination>
            </div>
            <div v-if="showVote">
                <div v-for="(items,index) in graphs" :key="index">
                <span>{{items.optiontitle}}</span>
                <p v-for="(item,indexs) in items.optionlist" :key="indexs">
                     {{item.condition}}
                    <el-progress :text-inside="true" :stroke-width="18" style="width:50%;" :percentage="item.min" status="success"></el-progress>
                </p>
                </div>
            </div>
        </div></el-col>

        <!-- <el-col :span="6">
            <div class="grid-content bg-purple-light C_voteStlye">
                <div class="c_bottom">
                <h2 class="c_text">进行调查中</h2>
                    <div class="c_bottom">
                        <ul class='c_ul'>
                            <li>dsfsfsf</li>
                            <li>dsfsfsf</li>
                            <li>dsfsfsf</li>
                        </ul>
                    </div>
                </div>
                <div class="c_bottom">
                 <h2 class="c_text">过往调查中</h2>
                    <div class="c_bottom">
                        <ul class='c_ul'>
                            <li>dsfsfsf</li>
                            <li>dsfsfsf</li>
                            <li>dsfsfsf</li>
                        </ul>
                    </div>
                </div>
            </div>
        </el-col> -->
    </el-row>
</section>
</template>
<script>
import axios from "axios";
import va from "@/rules";
import formMixns from "@/mixins/form";
export default {
  mixins: [formMixns], //普通表单变量
  computed: {
    ResultOne() {
      return this.$store.state.ques.ResultOne;
    },
    ResultTwo() {
      return this.$store.state.ques.ResultTwo;
    }
  },
  data() {
    // let required = va.required('此项必填');
    // let number = va.number('请输入数字');
    return {
      total: 10,
      pages:1,
      showConditionList: [
        {
          optionlist: [],
          arrbox: []
        }
      ],
      // region: '区域一',
      isShow: false,
      isShows: false,
      vals: 0,
      showVote: false,
      showCheck: true,
      graphs: [
        {
          optiontitle: "的方式来距离圣诞节饭上了飞机",
          type: 1,
          optionlist: [
            { condition: "上海", val: 50, min: 0 },
            { condition: "北京", val: 30, min: 0 },
            { condition: "杭州", val: 40, min: 0 }
          ]
        },
        {
          optiontitle: "的方式来距离圣诞节饭上了飞机",
          type: 1,
          optionlist: [
            { condition: "上海", val: 50, min: 0 },
            { condition: "北京", val: 30, min: 0 },
            { condition: "杭州", val: 40, min: 0 }
          ]
        }
      ],
      options: [
        {
          optiontitle: "的方式来距离圣诞节饭上了飞机",
          type: 1,
          radio: 1,
          optionlist: [
            { condition: "圣诞节饭店烧烤", val: 1 },
            { condition: "圣诞节饭店烧烤", val: 2 },
            { condition: "圣诞节饭店烧烤", val: 3 },
            { condition: "圣诞节饭店烧烤", val: 4 }
          ]
        },
        {
          optiontitle: "的方式来距离圣诞节饭上了飞机",
          type: 1,
          radio: 1,
          optionlist: [
            { condition: "圣诞节饭店烧烤", val: 1 },
            { condition: "圣诞节饭店烧烤", val: 2 },
            { condition: "圣诞节饭店烧烤", val: 3 },
            { condition: "圣诞节饭店烧烤", val: 4 }
          ]
        },
        {
          optiontitle: "的方式来距离圣诞节饭上了飞机",
          type: 3,
          textarea: "sdsdfsfsfsfsf"
        },
        {
          optiontitle: "的方式来距离圣诞节饭上了飞机",
          type: 2,
          checkboxGroup6: [],
          optionlist: [
            { condition: "圣诞节饭店烧烤1", val: 1 },
            { condition: "圣诞节饭店烧烤2", val: 2 },
            { condition: "圣诞节饭店烧烤3", val: 3 },
            { condition: "圣诞节饭店烧烤4", val: 4 }
          ]
        },
        {
          optiontitle: "的方式来距离圣诞节饭上了飞机",
          type: 2,
          checkboxGroup6: [],
          optionlist: [
            { condition: "圣诞节饭店烧烤1", val: 1 },
            { condition: "圣诞节饭店烧烤2", val: 2 },
            { condition: "圣诞节饭店烧烤3", val: 3 },
            { condition: "圣诞节饭店烧烤4", val: 4 }
          ]
        },
        {
          optiontitle: "的方式来距离圣诞节饭上了飞机",
          type: 3,
          textarea: "sdsdfsfsfsfsf"
        }
      ]
    };
  },
  methods: {
    getPages(val) {
      this.pages  = val
    },
    changeVal(titleId, faIndex, data) {
      //第二下拉框的筛选
      let _this = this;
      // axios.post(this.$api.screenList, { id: id })//查询对应的菜单
      //   .then(res => {
      //     this.loading = false;
      //     console.log(res)
      //   })
      //   .catch(err => {
      //     this.loading = false;
      //   });
      let WHATEVER = {
        time: function(callback) {
          setTimeout(function() {
            callback({
              body: [
                {
                  itemId: 242,
                  title:
                    "请问，除了滴滴之外，最近一个月您还使用过哪些叫车软件么",
                  priority: 1
                },
                {
                  itemId: 111,
                  title:
                    "请问，除了滴滴之外，最近一个月您还使用过哪些叫车软件么",
                  priority: 1
                },
                {
                  itemId: 555,
                  title:
                    "请问，除了滴滴之外，最近一个月您还使用过哪些叫车软件么",
                  priority: 1
                }
              ],
              message: "成功!",
              code: "200"
            });
          }, 1000);
        }
      };

      WHATEVER.time(function(timestamp) {
        //测试数据成功请求
        if (timestamp.code == 200) {
          console.log(timestamp.body);
          _this.showConditionList[faIndex].arrbox = timestamp.body;
        }
      });
    },
    delconditions(index) {
      //删除条件
      this.showConditionList.splice(index, 1);
    },
    addconditions() {
      //添加条件
      this.showConditionList.push({
        optionlist: [],
        arrbox: []
      });
    },
    getDataInfo(id) {
      //初始化获取第一个下拉框数据
      let _this = this;
      //重写获取表单数据
      this.loading = false;
      // axios.post(this.$api.screen, { id: id })
      //   .then(res => {
      //     this.loading = false;
      //     console.log(res)
      //   })
      //   .catch(err => {
      //     this.loading = false;
      //   });

      let WHATEVER = {
        time: function(callback) {
          setTimeout(function() {
            callback({
              body: [
                {
                  questionId: 242,
                  title: "月您还使用过哪些叫车软件么",
                  priority: 1
                },
                {
                  questionId: 12,
                  title: "请问，除了滴滴之外，车软件么",
                  priority: 2
                },
                {
                  questionId: 24,
                  title: "请问，除了滴用过哪些叫车软件么",
                  priority: 4
                },
                {
                  questionId: 16,
                  title: "请车软件么",
                  priority: 5
                }
              ],
              message: "成功!",
              code: "200"
            });
          }, 1000);
        }
      };
      WHATEVER.time(function(timestamp) {
        if (timestamp.code == 200) {
          _this.$store.dispatch("getResultOnes", timestamp.body);
        }
      });
      console.log();
    },
    baocun() {
      //筛选
      function relateArr(collection) {
        let flag = "";
        for (var i = 0, len = collection.length; i < len; i++) {
          var count = 0;
          for (var j = 0; j < len; j++) {
            if (
              collection[i].conditionType === collection[j].conditionType &&
              collection[i].itemPriority === collection[j].itemPriority &&
              collection[i].questionPriority === collection[j].questionPriority
            ) {
              count = count + 1;
            }
          }
          if (count > 1) {
            flag = true;
          } else {
            flag = false;
          }
        }
        return flag;
      }
      if (relateArr(this.showConditionList)) {
        this.errorMessage("无法添加重复项");
        return false;
      }
      for (let i = 0; i < this.showConditionList.length; i++) {
        console.log(this.showConditionList[i]);
        if (
          !(this.showConditionList[i].itemPriority !== undefined) ||
          !(this.showConditionList[i].questionPriority !== undefined)
        ) {
          this.errorMessage("不能添加空数据");
          return false;
        }
      }
      let answerConditionList = [];
      this.showConditionList.forEach(element => {
        //查询结果的筛选
        let obj = {};
        obj.questionId = element.questionPriority;
        obj.conditionType = element.conditionType;
        obj.itemId = element.itemPriority;
        answerConditionList.push(obj);
      });
      console.log(answerConditionList);

      // axios.post(this.$api.viewResult, { answerConditionList: answerConditionList })//筛选的答案
      //   .then(res => {
      //     this.loading = false;
      //     console.log(res)
      //   })
      //   .catch(err => {
      //     this.loading = false;
      //   });
    },
    isShowfn() {
      this.isShows = !this.isShows;
    },
    showVoteList() {
      //显示结果
      this.showVote = true;
      this.showCheck = false;
      let _that = this;
      for (let nums in this.graphs) {
        //数字加载的过程
        let data = this.graphs[nums].optionlist;
        for (let i in data) {
          let items = setInterval(function(e) {
            if (data[i].min != data[i].val) {
              return data[i].min++;
            }
            if (data[i].min == data[i].val) {
              clearInterval(items);
            }
          }, 100);
        }
      }
    }
  },
  created() {
    //初始获取数据
    this.getDataInfo(this.id);
    this.$root.$on("isShows", data => {
      this.isShows = data;
    });
  }
};
</script>
<style>
.result .el-checkbox__input.is-disabled + span.el-checkbox__label {
  color: #606266;
}
.result .el-radio__input.is-disabled + span.el-radio__label {
  color: #606266;
}
.result .el-textarea.is-disabled .el-textarea__inner {
  color: #606266;
}
.result .showtextarea {
  width: 78%;
}
</style>

<style scoped >
.C_pingSize {
  padding: 20px;
  color: #353535;
}
.C_pingSize h2 {
  display: inline-block;
  font-weight: 300;
}
.c_height5 {
  line-height: 40px;
}

.c_size {
  padding: 10px;
  cursor: pointer;
}
.C_pingSize span {
  color: red;
  padding: 0 10px;
}
.C_voteStlye {
  margin-top: -40px;
}
.C_voteStlye .c_bottom {
  margin-bottom: 50px;
}
.C_voteStlye .c_text {
  margin-bottom: 20px;
  font-weight: 100;
  font-size: 15px;
}
.C_voteStlye .c_ul {
  border: 1px solid #ddd;
  width: 80%;
  min-height: 15px;
  border-radius: 5px;
}
.c_textConent {
  padding: 20px;
  margin: 0 50px 0 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
  min-height: 200px;
}
.C_voteStlye .c_ul li {
  padding: 10px 10px 10px 0;
}
.C_voteStlye .c_ul li::before {
  content: "";
  width: 2px;
  height: 12px;
  background: #7f8186;
  display: inline-block;
  margin-right: 6px;
}
.c_titlemark {
  font-weight: 100;
  font-size: 18px;
}
.c_titlemark span {
  color: #1160b2;
}

.c_addcursor {
  cursor: pointer;
  color: #1160b2;
}
.screenBox {
  width: 100%;
  line-height: 50px;
  height: 50px;
  text-align: center;
  margin-bottom: 20px;
}
.screenBox button {
  width: 100px;
  height: 30px;
  border: none;
  background: #fff;
  border-radius: 20px;
  border: 1px solid #ddd;
  margin-left: -20px;
  margin-right: 80px;
}
.c_p5 {
  margin-right: 2%;
}
.c_p1 {
  padding: 5px 5px 5px 0;
}

.c_p4 {
  padding: 30px 30px 20px 0;
}
.c_addconditions {
  width: 12%;
  text-align: right;
  display: inline-block;
  cursor: pointer;
  font-size: 16px;
  color: #1160b2;
}
.c_line {
  border-bottom: 1px solid #ddd;
  margin: 10px;
}
.c_center {
  display: table;
  margin: 0 auto;
}
.cmsMtop {
  margin-top: 20px;
}
.delconditions {
  width: 12%;
  display: inline-block;
  cursor: pointer;
  font-size: 16px;
  color: #1160b2;
}
</style>
