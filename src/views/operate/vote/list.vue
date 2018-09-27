<template>
  <section v-loading="loading" class="cms-body">
    <div class="cms-list-header flex-between">
        <el-button type="primary"  icon="el-icon-plus" @click="routerLink('/vote/save','save',0)" v-perms="'/vote/save'"
        >添加</el-button>   
        <el-radio-group v-model="params.voteStatus" @change="query" size="small">
          <el-radio-button label="">所有</el-radio-button>
          <el-radio-button :label="1">未开始</el-radio-button>
          <el-radio-button :label="2">进行中</el-radio-button>
          <el-radio-button :label="3">已结束</el-radio-button>
        </el-radio-group>
    </div>
    <!-- 数据表格显示区域 -->
    <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
        <el-table-column type="selection" width="65" align="right"></el-table-column>
        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
        <el-table-column prop="title" label="标题"  align="center"></el-table-column>
        <el-table-column width="100" label="默认" align="center">
            <div slot-scope="scope">
               <el-radio name="radio" v-model="defaultId" :label="scope.row.id">&nbsp;</el-radio>    
            </div>        
        </el-table-column>
        <el-table-column width="100" label="状态" align="center">
            <div slot-scope="scope">
                <span v-if="scope.row.voteStatus == 1 ">未开始</span>
                <span v-if="scope.row.voteStatus == 2 ">进行中</span>
                <span v-if="scope.row.voteStatus == 3 ">已结束</span>
            </div>        
        </el-table-column>
        <el-table-column width="100" label="暂停" align="center">
            <div slot-scope="scope">
               <el-checkbox v-if="scope.row.voteStatus == 2 " v-model="scope.row.disabled"></el-checkbox>
            </div>        
        </el-table-column>
        <el-table-column prop="totalCount" label="总投票数"  align="center"></el-table-column>
        <el-table-column width="100" label="结果" align="center">
            <div  slot-scope="scope">
               <cms-button  type="view" @click.native="routerLink('/vote/result','view',scope.row.id)">查看</cms-button>
            </div>        
        </el-table-column>
        <el-table-column width="300" label="操作"   align="center">
          <div slot-scope="scope">
              <cms-button type="edit" @click.native="routerLink('/vote/update','update',scope.row.id)" v-perms="'/vote/get'">
              </cms-button>
              <cms-button type="delete" @click.native="deleteBatch($api.voteDelete,scope.row.id)" v-perms="'/vote/save'">
              </cms-button>
               <!-- <button type="copy" @click.native="routerLink('/vote/update','update',scope.row.id)" >
               复制文件
              </button> -->
              <el-button type="text" @click="copy(scope.row)">复制问卷</el-button>
              <span></span>
              <el-button type="text" @click="showDate(scope.row)">修改结束日期</el-button>
          </div>
        </el-table-column>
    </el-table>
    <el-dialog
    class="diaLogBox"
  title="修改结束日期"
  :visible.sync="dialogVisible"
  width="30%">
  <div class="block" style="padding-bottom: 20px;">
    <span class="demonstration">开始时间：</span>
    <el-date-picker
      disabled
      v-model="value1"
      type="date"
      value-format="yyyy-MM-dd HH:mm:ss"  
      placeholder="选择日期">
    </el-date-picker>
  </div>
  <div class="block">
    <span class="demonstration">结束时间：</span>
    <el-date-picker
      v-model="endTime"
      type="date"
      value-format="yyyy-MM-dd HH:mm:ss"  
      @change='getTimes()'
      placeholder="选择日期">
    </el-date-picker>
  </div>
  <span slot="footer" class="dialog-footer centerfooter">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="update">确 定</el-button>
  </span>
</el-dialog>
    <!-- 表格底部 -->
    <div class="cms-list-footer">
      <div class="cms-left">
        <el-button :disabled="disabled" @click="deleteBatch($api.voteDelete,ids)" v-perms="'/vote/delete'"
        >批量删除</el-button>
        <el-button  @click="saveContent()" v-perms="'/vote/saveContent'"
        >保存内容</el-button>
      </div>    
      <!-- cms分页组件 -->
      <cms-pagination :total="total" @change="getPages"></cms-pagination>
    </div> 
  </section>
</template>
<script>
import listMixins from '@/mixins/list'
import axios from "axios";
export default {
  mixins:[listMixins],
  data(){
    return {
      params:{
        pageNo: 1,
        pageSize:10,
        voteStatus:'',
      },
      value1:"",
      endTime:"",
      defaultId:'',
      newData:"",
      id:"",
      dialogVisible:false,
    }
  },
  methods:{
    copy(el){
      this.routerLink('/vote/update','copy',el.id);
      console.log(el)
    },
    getTimes(){
      return this.value1
    },
    showDate(data){//显示时间
    this.dialogVisible = true;
    this.id = data.id;
    this.value1 = data.startTime
    this.endTime = data.endTime
    this.newData = data
    },
    update(){ //修改日期
      if(new Date(this.value1).getTime()>new Date(this.endTime).getTime()){
         this.errorMessage('不能小于初始时间');
        return false
      }
      let obj = {id:this.id,endTime:this.endTime}
      axios.post(this.$api.updateTime,obj).then(res=>{
        this.dialogVisible = false;
        if(res.code == '200'){
          this.successMessage('保存成功');
        }
      }).catch(err=>{
        this.dialogVisible = false;
      })
      
    },
    saveContent(){
      console.log(this.defaultId);
      let disabled = [];
      let ids = [];
      for(let item of this.tableData){
        disabled.push(item.disabled);
        ids.push(item.id);
      }
      let obj = {ids:ids.join(','),disableds:disabled.join(','),defId:this.defaultId};
      this.loading = true;
      axios.post(this.$api.voteSaveContent,obj).then(res=>{
        this.loading = false;
        if(res.code == '200'){
          this.successMessage('保存成功');
        }
      }).catch(err=>{
        this.loading = false;
      })
    },
    getTableData(params) {//获取表格数据   
      this.loading = true;
      axios.post(this.listUrl, params).then(res => {
        this.loading = false;
        if(res.code=='200'){
          this.total = res.totalCount;
          this.tableData = res.body;
          for(let item of this.tableData){
            if(item.def){
              this.defaultId =  item.id;
              break;
            }
          }
        }       
      }).catch(error => {
        this.loading = false;
      });
    },
  },
  created(){
    this.initTableData(this.$api.voteList,this.params);
  }
};
</script>
<style type="text/css">
  .voteview{
    color: #4687B8;
  }

.diaLogBox .el-dialog__footer{
      text-align: center !important;
  }
.diaLogBox .el-dialog__body{
  min-height: 150px;

}
</style>
