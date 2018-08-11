<template>
    <section v-loading="loading" class="cms-body">
         <div class="cms-list-header flex-between">
             
             <div>
                      <span class="demonstration cms-label">日期:</span>
                      <el-date-picker
                        v-model="value4"
                        type="datetimerange"
                        :editable="false"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right"
                        value-format="yyyy-MM-dd HH:mm:ss"  
                        @change='getTime()'
                        >
                      </el-date-picker>
                      <span class="demonstration cms-label">问卷名称:</span>
                      <el-select v-model="params.orderBy" @change="query">
                      <el-option label="全部" :value="1"></el-option>
                      <el-option label="问卷1" :value="2"></el-option>
                      <el-option label="问卷2" :value="3"></el-option>
                  </el-select> 
                  <el-button @click="query">查询</el-button>        
                 
             </div>
             
         </div>
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column width="20"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="contentTitle" label="问卷名称" ></el-table-column>
             <el-table-column prop="chargeAmount" label="日期" ></el-table-column>
             <el-table-column prop="totalAmount" label="点击参与人数" ></el-table-column>
             <el-table-column prop="yearAmount" label="完成调查人数" ></el-table-column>
             <el-table-column prop="monthAmount" label="取消填写人数" ></el-table-column>
            </el-table-column>
         </el-table> 
          <!-- 表格底部 -->
        <div class="cms-list-footer ">
            <div class="cms-left">
            </div>
               <!-- cms分页组件 -->
              <cms-pagination :total="total" @change="getPages"></cms-pagination>
          </div>  
     </section>   
</template>

<script>
import listMixins from '@/mixins/list';
import axios from "axios";
export default {
    mixins:[listMixins],
  data() {
    return {
       pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value3: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
        value4: '',
      params: {//只需要业务参数   
        contentTitle:'', 
        author:'',
        pageNo:'1',
        pageSize:'10',
        buyTimeBegin:'',
        buyTimeEnd:'',
        orderBy:'',

      },
    };
  },
  methods:{
      getTime(){
          if(this.value4===null){
            this.params.buyTimeBegin='';
            this.params.buyTimeEnd='';
          }else{
            this.params.buyTimeBegin=this.value4[0];
            this.params.buyTimeEnd=this.value4[1];
          }  
      }

  },
  created(){
     this.initTableData(this.$api.logList,this.params);   


  }
};
</script>

<style>

</style>
