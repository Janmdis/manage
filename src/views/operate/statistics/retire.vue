<template>
    <section v-loading="loading" class="cms-body">
         <div class="cms-list-header flex-between">
             
             <div>
                      <span class="demonstration cms-label">日期:</span>
                      <el-date-picker
                        v-model="value4"
                        type="datetimerange"
                        :editable="false"
                        :picker-options="pickerOptions2"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right"
                        value-format="yyyy-MM-dd HH:mm:ss"  
                        @change='getTime()'
                        >
                      </el-date-picker>
                       
                  <el-button @click="query">查询</el-button>        
                 
             </div>
             
         </div>
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column width="20"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="topicTitle" label="问卷名称" ></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="createTime" label="日期" ></el-table-column>
             <el-table-column prop="chargeAmount" label="申请退租人数" ></el-table-column>
             <el-table-column prop="finishCount" label="回答问卷人数" ></el-table-column>
             <el-table-column prop="cancelCount" label="取消填写人数" ></el-table-column>
             <el-table-column prop="cancelRefundCount" label="取消退租人数" ></el-table-column>
             <el-table-column prop="finishRefundCount" label="实际退租人数"></el-table-column>

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
        // contentTitle:'', 
        // author:'',
        pageNo:'1',
        pageSize:'10',
        startDate:'',
        endDate:'',
        topicType:2,
        // orderBy:'',
      },
    };
  },
  methods:{
      getTime(){
          if(this.value4===null){
            this.params.startDate='';
            this.params.endDate='';
          }else{
            this.params.startDate=this.value4[0];
            this.params.endDate=this.value4[1];
          }  
      }

  },
  created(){
     this.initTableData(this.$api.activitystatistics,this.params);   


  }
};
</script>

<style>

</style>
