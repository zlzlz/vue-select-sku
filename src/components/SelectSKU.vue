<template>
<div>
  <el-form ref="form" :model="form"  label-width="95px" >
    <el-form-item>
      <el-row>
        <el-col :span='24'>
          <el-input type="textarea" rows=8 :value="JSON.stringify(attrs)"></el-input>
        </el-col>
      </el-row>
    </el-form-item>
    <el-row>
      <!-- 属性规格 -->
      <el-col :span="24" >
        <el-form ref="formAttr" :model="formAttr"  label-width="95px">
          <el-form-item label="规格名称">
            <el-row :gutter="10">
              <el-col
                v-for="(item, index) in items"
                :key="index"
                :span="4"
                style="position: relative;margin-right: 2px"
              >
                <el-input v-model="item.value" style="width: 120px;" placeholder="设置名称" @keyup.native.enter="attrHiddenBool(item,items)"/>
                <el-button v-show="item.attrHidden == true"  type="text" style="position: absolute;top:-6px;right:17px;margin-top:1px;border: none;font-size: 14px;font-weight:bold;line-height: 1.8" icon="el-icon-close" @click="handleRemove(index)" />
                <el-button v-show="item.attrHidden == false" type="text" style="position: absolute;top:-6px;right:17px;margin-top:1px;border: none;font-size: 14px;font-weight:bold;line-height: 1.8" icon="el-icon-check" @click="attrHiddenBool(item,items)" />
              </el-col>
              <el-col :span="5"><el-button type="primary" @click="handleAddAttr">添加新规格</el-button></el-col>
            </el-row>
          </el-form-item>
          <el-form-item
            v-for="(item, index) in items"
            v-show="item.attrHidden == true"
            :key="index"
            :label="''+item.value+':'"
          >
            <el-row :gutter="13">
              <el-col
                v-for="(attr,k) in item.detail"
                :key="k"
                :span="2.5"
                :name="attr"
              >
                <el-button size="mini"  :type="specsSelect.includes(attr) ? 'success' : ''" 
              @click="tapSpec(attr, index)"><el-tag closable @close="attrRemove(item,k,attr)" size="mini" effect="plain">{{ attr }}</el-tag></el-button>
              </el-col>
              <el-col :span="4">
                <el-input size="small" v-model="item.detailValue" placeholder="多个以空格隔开" @keyup.native.enter="attrAdd(item)" >
                <el-button slot="append" icon="el-icon-plus" @click="attrAdd(item)"></el-button></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-button type="primary" @click="addGoodsAttr(true)">全部生成</el-button>
                <el-button type="danger" @click="clear">清空所有</el-button>
              </el-col>
              <el-col :span="12" v-if="isSetListShow">
                <el-tag type="warning" @click="openBatch('marketPrice')">批量设置市场价</el-tag>
                <el-tag type="warning" @click="openBatch('cost')">批量设置进价</el-tag>
                <el-tag type="warning" @click="openBatch('salePrice')">批量设置售价</el-tag>
                <el-tag type="warning" @click="openBatch('stockPattern')">批量设置库存比</el-tag>
              </el-col>
              <div  v-else>
                <el-col :span="4">
                  <el-input size="mini" v-model.number="batchValue" placeholder="输入要设置的数量" @keyup.native.enter="setBatch">
                  </el-input>
                </el-col>
                  <el-col :span="2">
                  <i class="set-btn blue el-icon-check" @click="setBatch"></i>
                  <i class="set-btn red el-icon-close" @click="cancelBatch"></i>
                </el-col>
              </div>
            </el-row>
          </el-form-item>
          <div id="arrtinfo" v-if="items[0].value!='' && items[0].detail.length>0 && attrs.length">
            <el-form-item>
              <el-table :data="attrs" style="width: 100%" :height="attrs.length < 5 ? attrs.length * 50 + 60 : 400" size="mini">
                  <el-table-column v-for="(item, index) in itemsTable" :key="index" :label="item.value">
                    <template slot-scope="scope">
                      <span>{{ scope.row.detail[item.value] }}</span>
                    </template>
                  </el-table-column>
                <el-table-column  >
                  <template slot="header">
                    <span><b style="color: red">*</b>市场价(分)</span>
                  </template>
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.marketPrice" placeholder="市场价" :disabled="scope.row.delFlg == 1 ? true : false" :number="true" />
                  </template>
                </el-table-column>
                <el-table-column>
                  <template slot="header">
                    <span><b style="color: red">*</b>进价(分)</span>
                  </template>
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.cost"  placeholder="进价" :disabled="scope.row.delFlg == 1 ? true : false" :number="true" />
                  </template>
                </el-table-column>
                <el-table-column >
                  <template slot="header">
                    <span><b style="color: red">*</b>售价(分)</span>
                  </template>
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.salePrice"  placeholder="售价" :disabled="scope.row.delFlg == 1 ? true : false" :number="true" />
                  </template>
                </el-table-column>
                <el-table-column label="库存" >
                  <template slot-scope="scope">
                    <span>{{scope.row.stock}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="是否使用" prop="delFlg">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.delFlg" active-value="0" inactive-value="1"  @change="removeGoods(scope.row)"></el-switch>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </div>
        </el-form>
      </el-col>
    </el-row>
  </el-form>
</div>
</template>
<script>
import { Message } from 'element-ui'

export default {
  data() {
    return {
      specsSelect: ["山楂","果丹皮","20g","50g","100g"], // 已选规格
      items: [{"attrHidden":true,"detailValue":"","value":"品种","detail":["果丹皮","山楂"]},{"attrHidden":true,"detailValue":"","value":"重量","detail":["20g","50g","100g"]},{"value":"大小","detailValue":"","attrHidden":true,"detail":["大"]}],      
      attrs: [{"stock":30,"stockPattern":1,"marketPrice":100,"cost":100,"salePrice":100,"delFlg":"0","detail":{"重量":"20g","品种":"果丹皮"}},{"stock":19,"stockPattern":1,"marketPrice":100,"cost":100,"salePrice":100,"delFlg":"0","detail":{"重量":"50g","品种":"果丹皮"}},{"stock":29,"stockPattern":1,"marketPrice":100,"cost":100,"salePrice":100,"delFlg":"1","detail":{"重量":"100g","品种":"果丹皮"}},{"stock":40,"stockPattern":1,"marketPrice":100,"cost":100,"salePrice":100,"delFlg":"0","detail":{"重量":"20g","品种":"山楂"}},{"stock":50,"stockPattern":1,"marketPrice":100,"cost":100,"salePrice":100,"delFlg":"0","detail":{"重量":"50g","品种":"山楂"}},{"stock":1,"stockPattern":1,"marketPrice":100,"cost":100,"salePrice":100,"delFlg":"1","detail":{"重量":"100g","品种":"山楂"}}],
      itemsTable: [{"attrHidden":true,"detailValue":"","detail":["山楂","果丹皮"],"value":"品种"},{"attrHidden":true,"detailValue":"","detail":["100g","20g","50g"],"value":"重量"}],
      // 批量设置相关
      isSetListShow: true,
      batchValue: '', // 批量设置所绑定的值
      currentType: '', // 要批量设置的类型
      form: {},
      formAttr: {},
      attrHidden: false,
      submiting: false
    };
  },
  methods: {
    attrHiddenBool(item,items) {
      if (item.value == '') {
        Message({ message: '请填写规则名称', type: 'error' })
      } else {
        item.attrHidden = true
      }
    },
    handleAddAttr() {
      if (!this.checkAttr()) return
      this.items.push({
        value: '',
        detailValue: '',
        attrHidden: false,
        detail: []
      })
    },
    checkAttr() {
      var bool = true
      this.items.map(function(item) {
        if (!bool) return
        if (!item.value) {
          Message({ message: '请填写规则名称', type: 'error' })
          bool = false
        } else if (!item.detail.length) {
          Message({ message: '请设置规则属性', type: 'error' })
          bool = false
        }
      })
      return bool
    },
    attrAdd(item) {
      if (!item.detailValue) return false
      let str = item.detailValue || ''
      if (!str.trim()) return false// 判空
      str = str.trim()
      let arr = str.split(/\s+/) // 使用空格分割成数组

      let newArr = item.detail.concat(arr)
      newArr = Array.from(new Set(newArr)) // 去重
      this.$set(item, 'detail', newArr)      
      item.detailValue = ''
    },
    handleRemove(index) {
      if (this.items.length > 1) { this.items.splice(index, 1) } else { Message({ message: '请设置至少一个规则', type: 'error' }) }
    },
    attrRemove(item, k, name) {
      console.log('item:')
      if (item.detail.length == 1) {
        Message({ message: '请设置至少一个属性', type: 'error' })
        return false
      }
      item.detail.splice(k, 1)
      var idx = this.specsSelect.indexOf(name);
      if (idx > -1) {
        this.specsSelect.splice(idx, 1);
      }
    },
    removeGoods(row) {
      
    },
    checkGoods() {
      var bool = true
      this.attrs.map(function(attr) {
        if (!bool) return
        if (!Object.keys(attr.detail).length) {
          Message({ message: '请选择至少一个属性', type: 'error' })
          bool = false
        } else if (attr.cost != parseFloat(attr.cost) || attr.cost < 0) {
          Message({ message: '请输入正确的商品进价', type: 'error' })
          bool = false
        }else if (attr.marketPrice != parseInt(attr.marketPrice) || attr.marketPrice < 0) {
          Message({ message: '请输入正确的商品市场价', type: 'error' })
          bool = false
        }else if (attr.salePrice != parseFloat(attr.salePrice) || attr.salePrice < 0) {
          Message({ message: '请输入正确的商品售价', type: 'error' })
          bool = false
        } 
      })
      return bool
    },
    addGoodsAttr(type) {
      if (this.attrs.length) {
        if (!this.checkGoods()) return
      }
      this.$confirm('生成将导致sku信息重新填写，是否要重新生成?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var specsSelect = this.specsSelect;
        let itemsSelect =  [];
        let itemsArr = [];
        if(specsSelect.length > 0){
          itemsSelect = JSON.parse(JSON.stringify(this.items));
          for (var i=0; i < itemsSelect.length; i++){
            itemsSelect[i]['detail'] = itemsSelect[i]['detail'].filter(function(item) {
                return specsSelect.includes(item)
            });
            if(itemsSelect[i]['detail'].length > 0){
              itemsArr.push(itemsSelect[i])
            }
          }
        }else{
          let allSpecs = [];
          this.items.forEach(function(item){
            item['detail'].forEach(function(value){
              allSpecs.push(value)
            })
          })
          this.specsSelect = allSpecs
        }
        this.itemsTable = itemsArr.length == 0 ? this.items : itemsArr;
        var items = itemsArr.length == 0 ? this.items : itemsArr;
        var data = []
        if(items.length > 1){
          for (var i=0; i < items.length - 1; i++){
            if(i == 0) data = items[i]['detail'];//["红", "白"]
            var tmp = [];
            for (let v in  data) {
                for (let g in items[i+1]['detail']) {
                    var rep2 = "";
                    if(i == 0){
                        rep2 = items[i]['value'] + ":" + data[v] + ","
                                + items[i+1]['value'] + ":" + items[i+1]['detail'][g];
                    }else{
                        rep2 = data[v] + ","
                                + items[i+1]['value'] + ":" + items[i+1]['detail'][g];
                    }
                    tmp.push(rep2);
                }  
            }
            if(tmp.length > 0 ){
              data=tmp
            }
          }
        }else{
            var dataArr = [];
            for (let s in items) {
                for (let sa in items[s]['detail']) {
                    dataArr.push(items[s]['value']+":"+items[s]['detail'][sa]);
                }
            }
            data=dataArr
        }    
        this.isFormatAttr(data);
      }).catch(function() {});
    },
    isFormatAttr(data){
      var re =[];
      data.forEach(function (value, key) {
          var re1 = [];
          var re4 = {};
          var re2 = {};
          re1 =value.split(",");
          re1.forEach(function (vv, kk) {
            var re3 = [];
            re3 = vv.split(":");
            re4[re3[0]] = re3[1];
          })
          re2['detail'] = re4;
          re2['stockPattern'] = 1;
          re2['stock'] = 0;
          re2['marketPrice'] = 0;
          re2['cost'] = 0;
          re2['salePrice'] = 0;
          re2['delFlg'] = "0";
          re.push(re2);
      })
      this.attrs = re
    },
    clear() {
      this.$confirm(`确定要清空属性数据操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          this.attrs.splice(0)
          Message({ message: '操作成功', type: 'success' })
      }).catch(() => { })
    },
    change(val){
      console.log(val)
    },
    tapSpec(name, index) {
      if (this.specsSelect.includes(name)) {
        var idx = this.specsSelect.indexOf(name);
        if (idx > -1) {
          this.specsSelect.splice(idx, 1);
        }
      }else{
        this.specsSelect.push(name);
      }  
    },
    // 打开设置框
    openBatch (type) {
      this.currentType = type
      this.isSetListShow = false
    },
    // 批量设置
    setBatch () {
      if (typeof this.batchValue === 'string') {
        this.$message({
          type: 'warning',
          message: '请输入正确的值'
        })
        return
      }
      this.attrs.forEach(item => {
        if (item.delFlg == '0') {
          item[this.currentType] = this.batchValue
        }
      })
      this.cancelBatch();
    },
    // 取消批量设置
    cancelBatch () {
      this.batchValue = ''
      this.currentType = ''
      this.isSetListShow = true
    }
  }
};
</script>