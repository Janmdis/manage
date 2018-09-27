<template>
  <el-table
     v-if="tableShow"
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      type="index"
      label="序号"
      width='160px'>
    </el-table-column>
    <el-table-column
      label="显示条件"
      style="width: 60%">
      <template slot-scope="scope">
        <span>{{getbox(scope.row)}}</span>
      </template>
    </el-table-column>
    
    <el-table-column
      label="操作"
     width='200px'>
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row,scope.$index)" type="text" size="small">删除</el-button>
        <el-button @click="handleUpdata(scope.row,scope.$index)" type="text" size="small">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: ["showTabele", "items"],
  computed: {
    getUserIcons() {
      return this.$store.state.ques.querData.filter(ele => {
        return ele.questionType != 0;
      });
    }
  },
  methods: {
    handleClick(row, index) {
      this.$root.$emit("delBox", index);
    },
    handleUpdata(data, index) {
      this.$root.$emit("showTitleBox", { data: data, index: index });
      this.$store.dispatch("setTableDates", { data: data, index: index });
      this.$store.dispatch("setChildindexs", index);
    },
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
        return {title:"kong"};
      },
    getbox(row) {
      let titile = "";
      if (row) {
        row.forEach((element, index) => {
          let datas = this.binarySearch(this.getUserIcons,element.id)
          titile +=
            (index == 0 ? "当" : "并且") +
            '"' +
            datas.title +
            (element.conditionType == 1 ? "是" : "不是") +
            (datas.voteItems?datas.voteItems[0].title:"空") +
            "时" +
            '"';
        });
      }
      return titile;
    }
  },
  created() {
    let _this = this;
    this.tableShow = this.showTabele;
    this.$root.$on("isShowTabel", data => {
      this.tableShow = data;
    });

    this.$root.$on("tableBox", data => {
      this.tableData = [];
      if (data.showLogicList.length > 0) {
        this.tableData = data.showLogicList;
      }
    });
  },
  watch: {
    items: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        this.tableData = oldVal.showLogicList;
      },
      deep: true
    }
  },
  data() {
    return {
      tableShow: false,
      tableData: []
    };
  }
  //   beforeDestroy(){
  //     this.$root.$off('tableBox')
  //     this.$root.$off("isShowTabel")
  //     this.$root.$off("saveTable")
  // }
};
</script>