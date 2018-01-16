<template>
  <div class="app-container calendar-list-container">
    <!-- 导出文件 -->
    <el-button style='margin-bottom:20px' type="primary" icon="document" @click="handleDownload">导出选中内容</el-button>
    <!-- 批量删除 -->
    <el-button style='margin-bottom:20px' type="primary" icon="document" @click="handleDelete">批量删除</el-button>
    <el-table :data="tableData3" border highlight-current-row style="width: 100%" v-loading="tableLoading" @selection-change="handleSelectionChange"
      ref="multipleTable" max-height="300">
      <el-table-column fixed="left" type="selection" width="50">

      </el-table-column>

      <el-table-column fixed="left" prop="id" label="id" width="120">
      </el-table-column>
      <el-table-column prop="date" label="日期" width="150">
      </el-table-column>

      <el-table-column prop="name" label="姓名" width="120">
      </el-table-column>
      <el-table-column prop="province" label="省份" width="120">
      </el-table-column>

      <el-table-column prop="city" label="市区" width="120">
      </el-table-column>
      <el-table-column prop="address" label="地址" width="300">
      </el-table-column>
      <el-table-column prop="zip" label="邮编" width="120">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button @click.native.prevent="deleteRow(scope.$index, tableData4)" type="danger" icon="delete" size="small">
            移除
          </el-button>
          <!-- @click.native.prevent="handleUpdate(scope.$index, tableData4,scope.row)" -->
          <el-button @click.native.prevent="handleUpdate(scope)" type="text" size="small">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="'type'" prop="name">
          <el-input v-model="temp.name"></el-input>
          <!-- <el-select class="filter-item" v-model="temp.type" placeholder="Please select">
            <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item :label="'date'" prop="date">
          <el-date-picker v-model="temp.date" type="date" placeholder="Please pick a date">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="'title'" prop="city">
          <el-input v-model="temp.city"></el-input>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <!-- <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button> -->
        <el-button type="primary" @click="updateData">提交</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  export default {
    
    methods: {
      // 删除一项
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      // 批量删除
      handleDelete() {
        if (this.multipleSelection.length) {
          this.tableData3 = this.tableData3.filter(v => {
            return  !this.multipleSelection.some(j => {
             console.log(j.id)
             return j.id==v.id
            })
          })
          this.$refs.multipleTable.clearSelection()
        } else {
          this.$message({
            message: '请选择要删除的数据项',
            type: 'warning'
          })
        }
      },
      //监听选择事件
      handleSelectionChange(val) {
        this.multipleSelection = val
        console.log('val', val);
        console.log('multipleSelection', this.multipleSelection);
      },
      //编辑弹窗
      handleUpdate(scope) {

        console.log(scope);
        this.temp = Object.assign({}, scope.row) // copy obj
        // this.temp.timestamp = new Date(this.temp.timestamp)
        //this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      // 提交编辑数据
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.date = +new Date(tempData.date) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            // updateArticle(tempData).then(() => {
            //   for (const v of this.list) {
            //     if (v.id === this.temp.id) {
            //       const index = this.list.indexOf(v)
            //       this.list.splice(index, 1, this.temp)
            //       break
            //     }
            //   }
            //   this.dialogFormVisible = false
            //   this.$notify({
            //     title: '成功',
            //     message: '更新成功',
            //     type: 'success',
            //     duration: 2000
            //   })
            // })
          }
          alert()
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      // 点击下载excle
      handleDownload() {

        if (this.multipleSelection.length) {
          //this.downloadLoading = true
          import ('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['Id', 'Title', '作者', '阅读量', '时间']
            const filterVal = ['id', 'date', 'name', 'province', 'city']
            const list = this.multipleSelection

            const data = this.formatJson(filterVal, list)
            console.log('data', data);
            excel.export_json_to_excel(tHeader, data, '文件名001')
            this.$refs.multipleTable.clearSelection()
            //this.downloadLoading = false
          })
        } else {
          this.$message({
            message: '请选择要导出的数据项',
            type: 'warning'
          })
        }
      },
      // 格式化 数据
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      }
    },
    // 钩子 DOM渲染完毕调用
    mounted() {
      var that = this;
      console.log('this.data', this.tableData3);
      setTimeout(function () {
        console.log('1000', that.tableData3);
        that.tableData3 = that.tableData4;
      }, 1000)

      // let timer=setTimeout(function(){
      //   that.tableData5=that.tableData4;
      // },2*1000);
      // timer();
    },
    // 
    computed: {
      tableLoading() {
        return !this.tableData3.length > 0;
      }
    },
    // 
    data() {
      return {
        // 编辑对象 容器
        temp: {
          id: undefined,
          date: new Date(),
          name: '',
          province: new Date(),
          city: '',
          address: '',
          zip: ''
        },
        // 编辑痰喘的填写规则
        rules: {
          name: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          date: [{
            type: 'date',
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          city: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }]
        },
        //弹框是否显示
        dialogFormVisible: false,
        multipleSelection: [], //被选择的值
        tableData3: [], //表格渲染数据
        //数据源
        tableData4: [{
            id: 1,
            date: '2016-05-01',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }, {
            id: 2,
            date: '2016-05-02',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          },
          {
            id: 3,
            date: '2016-05-03',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }, {
            id: 4,
            date: '2016-05-04',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }
        ]
      }
    }
  }
</script>