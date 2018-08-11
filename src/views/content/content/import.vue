<template>
  <section class="cms-body flex">
    <!-- 返回组件 -->
    <a class="cms-back" href="javascript:void(0)" @click="back"></a>
    <!-- 树组件 -->
    <!-- <cms-tree @change="getChannelId"></cms-tree> -->
    <div class="">
      <!-- 栏目 -->
      <div class="cms-list-header clearfix flex">
        <div class="bread-box cms-left">
          <label class="">当前栏目:</label>
          <ul class="type-bread">
            <li class="bread-items" v-for="(item,index) in breadItems" :key="index">
              <a href="javascript:void(0)" @click="clickBread(item.id,index)">{{item.name}}</a>
            </li>
          </ul>
        </div>

      </div>
      <el-form class="cms-form" label-width="162px">
        <!-- 动态表单 -->
        <!-- 选择栏目 -->
        <el-form-item label="选择栏目" class="flex-50" :class="{isRed : isChannelId}" prop="parentId">
          <el-cascader class="cms-width" :props="{'value':'id','label':'name','children':'child'}" v-model="info.parentId" :options="channelList" filterable  @change="handleChange">
          </el-cascader>
          <span class="gray">只能选择最后一层</span>
        </el-form-item>
        <!--关联副栏目  -->
        <el-form-item label="关联副栏目" class="flex-50 border-bottom">
          <el-button @click="channelVisble=true">关联副栏目</el-button>
          <span class="gray">关联后本条内容将会出现在所选的栏目页，需要结合标签使用</span>
        </el-form-item>
        <!--模型-->
        <el-form-item label="栏目模型" class="flex-50 border-bottom" >
          <el-select  class="cms-width" v-model="info.modelId" @change="templetName">
              <el-option v-for="(modelIdItem,index) in modelList"
                :key="index"
                :label="modelIdItem.name"
                :value="modelIdItem.id"
              ></el-option>
          </el-select>
        </el-form-item>
        <!--指定pc模版-->
        <el-form-item label="指定模版" class="flex-50 border-bottom">
          <!-- 栏目模版 -->
          <el-select  class="cms-width" v-model="info.pcTempletName">
              <el-option label="默认" value=""></el-option>
              <el-option v-for="(item,index) in pcTempletNameArr" :key="index"
                  :label="item"
                  :value="item">
              </el-option>
          </el-select>
      </el-form-item>
        <!--指定手机模版-->
        <el-form-item label="指定手机模版" class="flex-50 border-bottom">
          <el-select  class="cms-width" v-model="info.mobileTempletName">
              <el-option label="默认" value=""></el-option>
              <el-option v-for="(item,index) in mobileTempletNameArr " :key="index"
                  :label="item"
                  :value="item">
              </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="cms-import-btn flex">
        <div class="cms-left marginRight">
          <el-button  size="small" type="primary" @click="importAll" >
            <i class="el-icon-plus "></i> 批量导入
          </el-button>
        </div>
        <div class="cms-left channel-group file_input">
          <el-upload style="display:block;"
            class="upload-demo"
            :action ="importBaseUrl"
            :data = "info"
            :on-success="unloadSuccess"
            :on-error="unloadError"
            :on-preview="handlePreview"
            :on-progress="handleProgress"
                     :show-file-list="false"
                     multiple
            :limit="3"
            :on-exceed="handleExceed"
            :before-upload="beforeAvatarUpload"
            :file-list="fileList">
            <el-button size="small" type="primary" @click="upload">点击上传</el-button>
          </el-upload>
        </div>
      </div>
      <el-table class="table" :data="newsList" stripe  v-loading="loading" element-loading-body="true"  tooltip-effect="dark"  @selection-change="selectRow">
        <el-table-column type="selection"  align="right"></el-table-column>
        <el-table-column prop="id" label="id"  align="center" max-width="100"></el-table-column>
        <!-- 标题 -->
        <el-table-column prop="title" label="标题" align="left" show-overflow-tooltip>
          <div slot-scope="scope">{{scope.row.title}}</div>
        </el-table-column>
        <!-- 简短标题 -->
        <el-table-column prop="shortTitle" label="简短标题" align="center" show-overflow-tooltip> </el-table-column>
        <!--tag标签 -->
        <el-table-column label="关键字" prop="tagStr" align="center" show-overflow-tooltip></el-table-column>
        <!--摘要 -->
       <!-- <el-table-column label="摘要" prop="description" align="center" show-overflow-tooltip></el-table-column> -->
        <!--内容 -->
        <!-- <el-table-column label="内容" prop="txt" align="center" show-overflow-tooltip></el-table-column>  -->
        <!--栏目 -->
        <el-table-column label="导入失败原因" prop="failureReason" align="center" show-overflow-tooltip></el-table-column>
       <!--栏目 -->
        <el-table-column label="栏目" prop="channelName" align="center" show-overflow-tooltip></el-table-column>
        <!--是否包含敏感词 -->
        <el-table-column label="是否包含敏感词" prop="sensitivity" align="center">
          <template slot-scope="scope">
              <template v-if="scope.row.sensitivity">
              <el-popover trigger="hover" placement="top">
                <p>{{ scope.row.sensitivity }}</p>
                <div slot="reference" class="name-wrapper">
                  <span class='data_icon'  :class='{red_color : scope.row.sensitivity}' >{{ scope.row.sensitivityFlag }}</span>
                </div>
              </el-popover>
              </template>
            <template v-else>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">否</el-tag>
                </div>
            </template>
          </template>

        </el-table-column>
        <!--操作 -->
        <el-table-column label="操作" align="center">
          <div slot-scope="scope">
            <cms-button type="edit" @click.native="routerLink('/content/importEdit','importEdit',scope.row.id)"></cms-button>
            <cms-button type="delete" @click.native="deleteBatch(scope.row.id)"></cms-button>
          </div>
        </el-table-column>
      </el-table>
      <!-- 表格底部 -->
      <div class="cms-list-footer" style="padding-bottom:100px;">
        <div class="cms-left"></div>
        <!-- cms分页组件 -->
        <cms-pagination :pageSize="page.pageSize" :total="allTotal" @change="getPages"></cms-pagination>
      </div>
      <!-- 批量导入弹窗 -->
      <el-dialog class="dialog dialog_main" :title="labelDialogTitle" :visible.sync="importVisble" width="25%" >
        <span>导入文章中存在敏感词，是否继续导入？</span>
        <div class="importBtn">
          <el-button type="primary" class="ignore_import"  @click="importType(0)">忽略导入</el-button>
          <el-button type="primary" class="replace_import"  @click="importType(1)">替换导入</el-button>
          <el-button type="primary" class="no_import" @click="importType(2)">不导入</el-button>
        </div>
      </el-dialog>
      <!-- 关联副栏目弹窗 -->
      <el-dialog class="dialog" :title="labelDialogTitle" :visible.sync="channelVisble" width="25%">
        <div class="tree-layout">
          <div class="tree">
            <el-tree :load="ansyTree" lazy ref="channelTree" :props="props"
                     @check-change="checkChange" :default-expanded-keys="['']" :default-checked-keys="info.channelIds" show-checkbox :indent="16" node-key="id">
            </el-tree>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
              <el-button @click="channelVisble = false">取消</el-button>
              <el-button type="primary" @click="confirm">选择</el-button>
            </span>
      </el-dialog>
    </div>
  </section>
</template>
<!--<script type="text/javascript" src="~/js/jquery.min.js"></script>-->
<script>
import listMixins from "@/mixins/list";
import axios from "axios";
import qs from "qs";
import { setBaseUrl } from "@/config.js";
export default {
  mixins: [listMixins],
  data() {
    return {
      params: {
        //请求参数
      },
      channelList: [], //栏目列表
      tplAll: [], //所有模型
      restState: false,
      breadItems: [
        {
          name: "根目录",
          id: ""
        }
      ], //面包屑
      tplList: [], //模版列表
      modelList: [], //模型列表
      typeList: [], //内容类型接口
      newsList: [], //文章列表
      siteVisble: false,
      importVisble: false, //批量导入弹窗
      channelVisble: false, //选择栏目弹窗,
      labelDialogTitle: "",
      currentCheckChannelId: 0, //当前选中栏目
      pushSites: [],
      allTotal: 0, //分页总数
      props: {
        label: "name",
        children: "zones",
        isLeaf: "isChild",
        id: "id"
      },
      //上传必要参数对象
      importBaseUrl: "",
      info: {
        appId: "",
        sessionKey: "",
        channelId: "", //栏目id
        channelName: "", //栏目name
        modelId: 1, //模型id，必选
        file: [], //上传文件
        channelIds: [],  //副栏目id
        pcTempletName: "",  //PC模版选择
        mobileTempletName:"", //手机模版选择
      },
      isChannelId:false,
      // 栏目id
      lanmu: [],
      infos: {
        id: "",
        name: ""
      },
      // 分页
      page:{
        pageSize:20,
        curPage: 1,
      },
      // 敏感词导入方式
      hasSensitivity: "",
      //上传文件列表
      fileList: [],
      //选择行
      multipleSelection: [],
      isHaveSensitive: false,
      newsIds: [], //文章id数组
      pcTempletNameArr: [], //pc模版
      mobileTempletNameArr: [],//手机模版
    };
  },
  watch: {
    infos() {
      console.log(this.info);
    }
  },
  mounted() {
    // this.getChannelInfo();
    // this.gettplList();
    // console.log(this.modelList);
    this.templetName();  //模版获取
  },
  methods: {
    getPages(curPage, pageSize) {
      this.loading = true;
      //获取翻页数据
      this.page.curPage = curPage;
      this.page.pageSize = pageSize;
      this.getAllNewList(this.page);
    },
//    getAllTotal() {
//      //获取分页
//      axios.post(this.$api.queryChooseNewsPage,{
//        pageSize : this.page.pageSize,
//        curPage : this.page.curPage,
//      })
//      .then(res => {
//        if (res.code == 200) {
//          this.allTotal = res.body.totalCount;
//          this.page.pageSize = res.body.pageSize;
//          this.page.curPage = res.body.curPage;
//        }
//      });
//    },
    // 模版接口
    templetName() {
      this.pcTempletNameSelect ='';
      this.mobileTempletNameSelect ='';
      axios.post(this.$api.tplModelList,{
        modelId: this.info.modelId
      })
      .then( res =>{
        if (res.code == 200) {
          this.pcTempletNameArr = res.body.channelTpl;
          this.mobileTempletNameArr = res.body.channelMobileTpl;
        }
      })
    },
    changeInfo() {
    },
    // 上传字段为空判断
    upload() {},
    // excel上传成功
    unloadSuccess(response) {
      var that = this;
      //console.log(response);
      if (response.code == "200") {
        // 请求成功
        // 请求列表接口
        that.$message.success(response.message);
        localStorage.setItem("isHaveImportList", true);
        that.getAllNewList();

      } else {
        //请求不成功
        that.$message.warning(response.message);
      }
      this.$loading().close();
    },
    // 表格checkbox选择一行
    selectRow(row) {
      this.multipleSelection = row;
    },
    // 有敏感词导入
    importType(type) {
      var that = this;
      if (type == 2) {
        //不导入关闭弹窗
        that.importVisble = false;
        return;
      } else {
        that.importVisble = false;
        that.$loading({fullscreen:true,lock:true,text:"数据导入中..."})
       axios
          .post(that.$api.hasSensitivity, {
            newsIds: that.newsIds.toString(), //文章id 多个,隔开
            importType: type //导入类型
          })
          .then(function(response) {
            that.$loading().close();
            // 请求成功
            if (response.code == 200) {
              that.$message.success(response.message);
              that.getAllNewList();
            }
          })
          .catch(function(error) {
            that.loading = false;
            console.log(error);
          });
      }
    },
    // 批量导入(无敏感词)
    importAll() {
      var that = this;
      that.newsIds = [];
      if (this.multipleSelection.length < 1) {
        this.$message.warning("请选择要导入的文章");
        return;
      }
      this.multipleSelection.forEach(item => {
        that.newsIds.push(item.id);
      });
      this.isHaveSensitive = this.multipleSelection.some(element => {
        return element.sensitivityTxt != "";
      });
      if (this.isHaveSensitive) {
        this.importVisble = true;
      } else {
        that.$loading({fullscreen:true,lock:true,text:"数据导入中..."});
        axios
          .post(that.$api.importNews, {
            newsIds: that.newsIds.toString() //文章id 多个,隔开

          })
          .then(function(response) {
            that.$loading().close()
            // 请求成功
            //console.log(response);
            if (response.code == 200) {
              that.$message.success(response.message);
              that.getAllNewList();
            }
          })
          .catch(function(error) {
            that.loading = false;
            //console.log(error);
          });
      }
    },

    //栏目框下拉点击触发事件
    handleChange(val) {
      let channelId = val.slice(-1).toString(); //存储最后一个选择的id
      this.info.channelId = channelId;
      this.isChannelId = this.info.channelId == "";
      // console.log( this.info.channelId)
      // console.log(this.channelList);
      this.channelList.forEach(item => {
        // 有子元素
        if (item.hasChild) {
          item.child.forEach(item => {
            if (this.info.channelId == item.id) {
              this.info.channelName = item.name;
            }
          });
        } else {
          if (this.info.channelId == item.id) {
            this.info.channelName = item.name;
          }
        }
      });
    },
    //下拉列表
    getAllList() {
      let api = this.$api; //API地址
      axios
        .post(api.fullTextSearchChannelList, { hasContentOnly: true })
        .then(res => {
          if (res.code == 200) {
            this.channelList = res.body;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    unloadError() {
      this.$message.warning("上传失败");
      this.loading=false
    },

    handlePreview(file) {
    },
    handleProgress(event, file, fileList){
      this.$loading({
        fullscreen: true,
        lock:true,
        text:"数据加载中..."
      })
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    //上传文件格式限制
    beforeAvatarUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "xls";
      const extension2 = testmsg === "xlsx";
      this.isChannelId = this.info.channelId == "";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!extension && !extension2) {
        this.$message({
          message: "上传文件只能是 xls、xlsx格式!",
          type: "warning"
        });
      }
      if (!isLt2M) {
        this.$message({
          message: "上传文件大小不能超过 10MB!",
          type: "warning"
        });
      }

      if (this.isChannelId) {

        this.$message({
          message: "请选择上传栏目!",
          type: "warning"
        })
      }
      return !this.isChannelId && (extension || (extension2 && isLt2M));
    },
    back() {
      this.routerLink("/content/list", "list", this.params.parentId);
    },
    addChannel(command) {
      //添加内容，获取栏目id 模型id
      this.params.parentId = this.params.cid;
      this.params.modelId = command;
      this.routerLink("/content/save", "save", 0, this.params);
    },

    // 删除一行数据
    deleteBatch(ids) {
      var that = this;
      //删除
      this.$confirm("是否确认删除?", "警告", { type: "error" })
        .then(mes => {
          this.loading = true;
          this.$http
            .post(that.$api.deleteChooseNews, {
              // this.$http.post(that.urls.deleteChooseNewsUrl, {
              newsId: ids
            })
            .then(res => {
              this.loading = false;
              if (res.code == "200") {
                // this.getTableData(this.params);
                this.successMessage("删除成功");
                this.getAllNewList();
                // this.unloadSuccess(this.params);  //删除成功重新渲染表格
              }
            });
        })
        .catch(error => {
          this.loading = false;
        });
    },
    // 获取所有未导入的文章列表
    getAllNewList() {
      this.loading  = true;
      axios
        .post(this.$api.queryChooseNewsPage, {
          pageSize: this.page.pageSize,
          curPage: this.page.curPage,
        })
        .then(res => {
          //console.log(res.body.data[1])
          this.loading = false;
          this.newsList = res.body.data ;
          this.allTotal = res.body.totalCount;
          this.page.pageSize = res.body.pageSize;
          this.page.curPage = res.body.curPage;
          // for (let i in this.newsList) {
          //   if (this.newsList[i].sensitivity == "") {
          //     this.newsList[i].sensitivityValue = "否";
          //   } else {
          //     this.newsList[i].sensitivityValue = "是";
          //   }
          // }

        })
        .catch(error => {
          this.loading = false;
          console.log("错误出口");
        });
    },

    /* 获取模版列表 */
    gettplList() {
      axios
        .post(this.$api.tplModelList, {
          modelId: this.infos.id
        })
        .then(res => {
          //console.log(res);
          if (res.code == "200") {
            this.tplList = res.body;
          }
        });
    },
    //栏目dialog节点选中事件
    checkChange(node, checkStatus, childStatus) {
      if (checkStatus) {
        this.currentCheckChannelId = node.id;
        // this.$refs["channelTree"].setCheckedKeys([node.id], true);
        this.info.channelIds = this.$refs["channelTree"].getCheckedKeys(); //获取副栏目
        console.log(this.info.channelIds);

      }
    },
    ansyTree(node, resolve) {
      //异步加载栏目树形结构
      if (node.level === 0) {
        return resolve([
          {
            name: "根目录",
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
    }, //栏目dialog确认按钮操作
    confirm() {
      this.channelVisble = false;
      console.log(this.info.channelIds);
    },
    handleClose() {},
    // getChannelId(data, node) {
    //   //获取栏目树点击
    //   this.creatBread(node, []);
    //   this.params.cid = data.id; //传递栏目id
    //   this.getChannelInfo(data.id); //获取栏目信息
    //   this.getTableData(this.params); //获取内容信息
    // },
    getChannelInfo(channelId) {
      //获取模型信息
      let modelList = [];
      axios
        .post(this.$api.modelList, { containDisabled: false, hasContent: true })
        .then(res => {
          if (res.code == "200") {
            modelList = res.body; //获取模型
          }
          if (channelId != "" && channelId != undefined) {
            axios
              .post(this.$api.channelGet, {
                id: channelId,
                showTxt: false
              })
              .then(res => {
                if (res.body.selfModels.length > 0) {
                  this.modelList = res.body.models; //获取模型
                } else {
                  this.modelList = modelList;
                }
              });
          } else {
            this.modelList = modelList;
          }
        });
    },
    clickBread(id, index) {
      //面包屑
    },
    creatBread(node, arr) {
      if (node.parent != null) {
        let params = {
          name: node.data.name,
          id: node.data.id
        };
        arr.push(params);
        this.creatBread(node.parent, arr);
      } else {
        this.breadItems = arr.reverse();
        return false;
      }
    },
    query() {
      //查询
      // this.getTableData(this.params);
    }
  },
  created() {
    this.loading = false;
   // if (localStorage.getItem("isHaveImportList" || window.localStorage.getItem("isHaveImportList"))) {
     // this.getAllNewList();
   //   this.getAllTotal(); //分页
    //}
//    this.getAllTotal();
    this.getAllNewList();
    this.importBaseUrl = setBaseUrl() + this.$api.chooseNews;
    this.info.appId = process.env.appId;
    // TODO:
    this.info.sessionKey = localStorage.getItem("sessionKey"); //获取sessionKey
    if (this.$route.query.type == "list") {
      if (this.$route.query.id == 0) {
        this.params.cid = "";
      } else {
        this.params.cid = this.$route.query.id;
      }
    }
    this.getChannelInfo(); //模型列表
    this.getAllList(); //下拉列表

    axios.post(this.$api.contentShareTree).then(res => {});
  },
  filters: {
    rowStatus(value) {
      if (value == -1) {
        return "退回";
      } else if (value == 0) {
        return "草稿";
      } else if (value == 1) {
        return "审核中";
      } else if (value == 2) {
        return "审核通过";
      } else if (value == 3) {
        return "回收站";
      } else if (value == 4) {
        return "投稿";
      } else if (value == 5) {
        return "归档";
      }
    }
  }
};
</script>

<style>
.bread-box {
  display: flex;
  display: -ms-flexbox;
  align-items: center;
}

.bread-box label {
  color: #5a5e66;
  font-size: 14px;
}

.type-bread {
  margin-right: 12px;
}

.bread-items {
  display: inline-block;
}

.bread-items a {
  color: #1276c3;
  font-size: 14px;
}

.bread-items a::after {
  content: "/";
  padding: 0 5px;
  color: #1276c3;
}

.bread-items:last-child a::after {
  content: "";
  padding: 0 5px;
  color: #1276c3;
}

.tree-left {
  width: 200px;
  float: left;
}

.tree-right {
  margin-left: 200px;
}

.font-bold {
  font-weight: bold;
}

/* .iconfont{
      color: #409EFF;
    } */

.red_color {
  color: red !important ;
}

.marginRight {
  margin-right: 20px;
}

.cms-inline-label {
  font-size: 14px;
  color: #5a5e66;
}

.cms-form {
  margin: 0;
}

.cms-import-btn {
  padding-left: 75px;
  padding-bottom: 5px;
}

.border-bottom {
  border-bottom: 1px dashed #eee;
}
/*对话框高度*/
.dialog.dialog_main > .el-dialog > .el-dialog__body {
  min-height: 160px;
  text-align: center;
  font-size: 16px;
}
.dialog.dialog_main > .el-dialog > .el-dialog__body > .importBtn {
  margin-top: 40px;
}
/* 表格 */
.table {
  margin-bottom: 10px;
}
.upload-demo .el-upload-list{
  display: block !important;
}
.isRed .el-input__inner{
  border-color: red;
}
.data_icon {
   background-color: rgba(64,158,255,.1);
    display: inline-block;
    padding: 0 10px;
    height: 32px;
    line-height: 30px;
    font-size: 12px;
    color: #409eff;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid rgba(64,158,255,.2);
    white-space: nowrap;
}
</style>
