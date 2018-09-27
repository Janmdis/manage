<template>
    <el-row v-show='isShows'>
            <el-row class='c_p4' >
                <div class='c_p1' v-for="(item,indexs) in showConditionList " :key="indexs">
                <span>
                    <span v-if="indexs==0"  style='width:12%;display: inline-block; text-align: right;' class='c_p5' >题目：</span>
                    <!-- <el-select v-model="item.or" v-if="indexs!=0"  style='width:12%;' class='c_p5'>
                        <el-option label="或者" value="1"></el-option>
                        <el-option label="并且" value="2"></el-option>
                    </el-select> -->
                    <span v-if="indexs!=0"   style='width:12%;display: inline-block; text-align: right;' class='c_p5' >并且</span>
                </span>
                 <el-select v-model="item.questionPriority" style='width:25%;' class='c_p5'>
                    <el-option v-for="(items,index) in getUserIcons" v-if="items.title!=''&&(index<indexShow-1)" :key='index' :label="items.title" :value="items.id" @click.native="changeVal(items.id,indexs,items)"></el-option>
                </el-select>
                 <el-select v-model="item.conditionType" style='width:12%;' class='c_p5' >
                    <el-option label="是" :value=1></el-option>
                    <el-option label="不是" :value=2></el-option>
                </el-select>
                 <el-select v-model="item.itemPriority" style='width:25%;' class='c_p5'>
                     <el-option v-for="(items,index) in getchildDate(item.questionPriority)" :key='index' v-if="items.title!=''"  :label="items.title" :value="index" ></el-option>
                </el-select>
                <span class='delconditions' @click='delconditions(indexs)'  v-if="indexs!=0" >删除条件</span>
                </div>
            </el-row>
            <el-row >
                <span class="c_addconditions" @click='addconditions' >添加条件</span>
                <div class='c_line' v-show="isFalse"></div>
                <div class="c_center" v-show="isFalse">
                    <el-button @click="saveTable" >保存</el-button>   
                    <el-button @click="clearTable">取消</el-button>   
                 </div>
            </el-row>
             </el-row>   
</template>
<script>
export default {
  props: ["isShows", "isFalse", "tableIndex", "dataInfo", "isOr", "isCheck"],
  data() {
    return {
      indexShow: "",
      showConditionList: [
        {
          id: "",
          questionPriority: "",
          conditionType: 1,
          itemPriority: ""
          // arrAll: [],
          // arrbox: ""
        }
      ]
    };
  },
  computed: {
    getUserIcons() { //获取不是分页的数据
      return this.$store.state.ques.querData.filter(ele => {
        return ele.questionType != 0;
      });
    },
    getLen() {// 获取不是分页的数据的长度
      return this.$store.state.ques.querData.filter(ele => {
        return ele.questionType != 0;
      }).length;
    },
    gets() {
      return this.$store.state.ques.setDate;
    }
  },
  created() {
   this.getdate(); //获取下拉框的数据
  },
  methods: {
    getdate(){
    this.indexShow = sessionStorage.getItem("sortNum");
    console.log(this.gets)
      if (this.gets.length != 0&&this.gets.data!=undefined) {
        let newArr = [];
        for (let i = 0; i < this.gets.data.length; i++) {
          let data = this.gets.data[i];
          newArr.push(data);
        }
        this.showConditionList = newArr;
      }
    },
    binarySearch(data, item) { //二分查找法查找数据
      var h = data.length - 1,
        l = 0;
      while (l <= h) {
        var m = Math.floor((h + l) / 2);
        if (data[m].id == item) {
          return data[m].voteItems;
        }
        if (item > data[m].id) {
          l = m + 1;
        } else {
          h = m - 1;
        }
      }
      return false;
    },
    getchildDate(id) { //返回查找到的数据
      return this.binarySearch(this.getUserIcons, id)
        ? this.binarySearch(this.getUserIcons, id)
        : [{ title: "空" }];
    },
    updatedfn() {  //更新数据
      console.log(this.gets)
      if (this.gets.length != 0) {
        let newArr = [];
       
        for (let i = 0; i < this.gets.length; i++) {
          let data = this.gets[i].data;
          newArr.push(...data);
        }
       
       
        this.showConditionList = newArr;
        console.log(this.showConditionList)
      }
    },
    saveOne() { //保存不是重复的数据
      function relateArr(collection) {
        let flag = "";
        for (var i = 0, len = collection.length; i < len; i++) {
          var count = 0;
          for (var j = 0; j < len; j++) {
            if (
              collection[i].id === collection[j].id &&
              (collection[i].itemPriority === collection[j].itemPriority &&
                collection[i].conditionType === collection[j].conditionType &&
                collection[i].questionPriority ===
                  collection[j].questionPriority)
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
        if (
          !(this.showConditionList[i].itemPriority !== "") ||
          !(this.showConditionList[i].questionPriority !== "")
        ) {
          this.errorMessage("不能添加空数据");
          return false;
        }
      }
      let newArr = [...this.showConditionList];
      return newArr;
    },
    clearInput() {  //清空数据
      this.showConditionList = [
        {
          id: "",
          questionPriority: "",
          conditionType: 1,
          itemPriority: ""
          // arrAll: [],
          // arrbox: ""
        }
      ];
    },
    //保存数据源
    saveTable() {
      function relateArr(collection) {
        let flag = false;
        for (var i = 0, len = collection.length; i < len; i++) {
          var count = 0;
          for (var j = 0; j < len; j++) {
            if (
              collection[i].id === collection[j].id &&
              (collection[i].itemPriority === collection[j].itemPriority &&
                collection[i].conditionType === collection[j].conditionType &&
                collection[i].questionPriority ===
                  collection[j].questionPriority)
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
        if (
          !(this.showConditionList[i].itemPriority !== "") ||
          !(this.showConditionList[i].questionPriority !== "")
        ) {
          this.errorMessage("不能添加空数据");
          return false;
        }
      }
      this.$emit("saveTable", {
        ishow: false,
        index: this.tableIndex,
        tableInfo: this.showConditionList
      });
      this.gets.data = [
        {
          id: "",
          questionPriority: "",
          conditionType: 1,
          itemPriority: ""
          // arrAll: [],
          // arrbox: []
        }
      ];
    },

    //添加条件
    addconditions() {
      this.showConditionList.push({
        id: "",
        questionPriority: "",
        conditionType: 1,
        itemPriority: ""
        // arrAll: [],
        // arrbox: []
      });
    },
    //显示隐藏
    isShow() {
      this.$root.$emit("isShows", false);
    },
    //删除
    delconditions(index) {
      this.showConditionList.splice(index, 1);
    },
    changeVal(id, index, data, i) {
      if (data.voteItems != undefined) {
        this.showConditionList[index]["id"] = id; //复制id
        // this.showConditionList[index].arrAll = data; //存储父级的数据
        // this.showConditionList[index].arrbox = id; //存储子集的数据
      } else {
        this.showConditionList[index]["id"] = id; //复制id
        // this.showConditionList[index].arrAll = data; //存储父级的数据
        // this.showConditionList[index].arrbox = id; //存储子集的数据
      }
    },
    //关闭
    clearTable() {
      this.$root.$emit("clearTable", { ishow: false, index: this.tableIndex });
    }
  }
};
</script>
<style>
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
.delconditions {
  width: 12%;
  display: inline-block;
  cursor: pointer;
  font-size: 16px;
  color: #1160b2;
}
</style>

