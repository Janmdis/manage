<template>
  <section class="cms-body" v-loading="loading">
    <!-- 返回组件 -->
    <cms-back></cms-back>          
    <el-row>
        <el-col :span="15" class='C_pingSize'>
        <div class="grid-content bg-purple-dark">
            <h2>投票结果</h2><span>》</span>网络调查
        </div>
        </el-col>
        <el-col :span="18"><div class="grid-content bg-purple c_textConent">
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
            <cms-modelinput :isShows="isShows" :isFalse='true'></cms-modelinput>
            </div>
            <div v-if="showCheck">
            <el-row v-for="(item,index) in options" :key="index" >
             <el-col :span="24" class='c_height5'>
                <span>{{index+1+"、"+item.optiontitle}}房间装修质量问题后续引导题</span>
             </el-col>   
             <el-col :span="24" class='c_height5'>
                <el-radio  v-for="(items,index) in item.optionlist" :key='index'   v-model="item.radio"  :label="items.val">{{index+1+"、"+items.condition}}</el-radio>
                </el-col>   
            </el-row>
             <div class="c_center">
                    <el-button >&nbsp;&nbsp;查询&nbsp;&nbsp;</el-button>   
                    <span class='c_size' @click="showVoteList">查看投票结果</span>   
                 </div>
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
        <el-col :span="6">
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
        </el-col>
    </el-row>
</section>
</template>
<script>
import axios from "axios";
import va from "@/rules";
import formMixns from "@/mixins/form";
export default {
  mixins: [formMixns], //普通表单变量
  data() {
    // let required = va.required('此项必填');
    // let number = va.number('请输入数字');
    return {
      // region: '区域一',
      isShow: false,
      isShows: false,
      vals: 0,
      showVote: false,
      showCheck: true,
      graphs: [
        {
          optiontitle: "的方式来距离圣诞节饭上了飞机",
          optionlist: [
            { condition: "上海", val: 50, min: 0 },
            { condition: "北京", val: 30, min: 0 },
            { condition: "杭州", val: 40, min: 0 }
          ]
        },
        {
          optiontitle: "的方式来距离圣诞节饭上了飞机",
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
          radio: 1,
          optionlist: [
            { condition: "圣诞节饭店烧烤", val: 1 },
            { condition: "圣诞节饭店烧烤", val: 2 },
            { condition: "圣诞节饭店烧烤", val: 3 },
            { condition: "圣诞节饭店烧烤", val: 4 }
          ]
        }
      ]
    };
  },
  methods: {
    getDataInfo(id) {
      //重写获取表单数据
      this.loading = false;
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
</style>
