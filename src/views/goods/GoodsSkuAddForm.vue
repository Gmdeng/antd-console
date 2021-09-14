<template>
  <a-row :gutter="24">
    <a-col :sm="24" :md="24" :xl="24">
      <a-form
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 14 }"
        :scrollToFirstError="true"
      >
        <a-form-item label="商品" v-bind="validateInfos.goodsId">
          <a-select
            v-model:value="frmModel.goodsId"
            size="large"
            show-search
            placeholder="选择商品"
            :default-active-first-option="false"
            :show-arrow="true"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            :options="goodsList"
            @search="handleSearch"
            @change="handleChange"
          >
            <template #suffixIcon>
              <BarsOutlined @click="rebuildSku" />
            </template>
          </a-select>
        </a-form-item>
        <a-form-item label="所属分类" v-bind="validateInfos.code">
          == {{ currentSpu.catalogName }}
          <a-input v-model:value="frmModel.code" placeholder="请输入商品编码" />
        </a-form-item>
        <a-form-item label="商品条码" v-bind="validateInfos.barCode">
          <a-input
            v-model:value="frmModel.barCode"
            placeholder="请输入商品条码"
          />
        </a-form-item>
        <a-form-item label="商品销售规格">
          <a-row :gutter="[16, 16]" v-for="(it, idx) in specs" :key="idx">
            <a-col :span="6">
              {{ it.name }}
            </a-col>
            <a-col :span="18">
              <a-badge
                :count="item"
                :number-style="{ backgroundColor: '#52c41a' }"
                v-for="(item, i) in it.options"
                :key="i"
              >
              </a-badge>
              <a-checkbox-group v-model="stateSkus" :options="it.options">
                <template #label="{ value }">
                  <span style="color: red">{{ value }} - DDD</span>
                </template>
              </a-checkbox-group>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="商品销售规格">
          <a-row :gutter="[16, 16]">
            <a-col :span="18">
              项
            </a-col>
            <a-col :span="6">价格</a-col>
          </a-row>
          <hr />
          <a-row
            :gutter="[16, 16]"
            v-for="(it, idx) in frmModel.skus"
            :key="idx"
          >
            <a-col :span="16">
              <a-badge
                :count="item"
                :number-style="{ backgroundColor: '#52c41a' }"
                v-for="(item, i) in it.values"
                :key="i"
              >
              </a-badge>
              {{ it.name }}
            </a-col>
            <a-col :span="6"
              ><a-input v-model:value="it.price" placeholder="请输入商品价格" />
            </a-col>
            <a-col :span="1">
              <MinusCircleOutlined
                v-if="frmModel.skus.length > 1"
                class="dynamic-delete-button"
                @click="removeSku(it)"
              />
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>
<script>
import {
  defineComponent,
  reactive,
  inject,
  onMounted,
  toRaw,
  toRefs,
  computed
} from "vue";
import goodsSpuApi from "@/api/goodsSpuApi";
import { useForm } from "@ant-design-vue/use";
import { MinusCircleOutlined, BarsOutlined } from "@ant-design/icons-vue";
import { limitNumber, cartesianSku } from "@/library/utils/Functions";
export default defineComponent({
  name: "GoodsSkuAddForm",
  components: {
    MinusCircleOutlined,
    BarsOutlined
  },
  setup() {
    /*** 上层接口==============================================*/
    const interEvtSubmit = inject("interEvtSubmit");
    const interEvtReset = inject("interEvtReset");
    const interEvtCloseLoad = inject("interEvtCloseLoad");
    /*** 接口============================================== end */
    // 定义变量名称
    const state = reactive({
      fetching: false,
      currentSpu: null,
      spuList: [],
      goodsList: [],
      specs: [
        {
          name: "彩色",
          code: "Color",
          options: ["红色", "黄色", "绿色", "蓝色"]
        },
        {
          name: "大小",
          code: "size",
          options: ["10cm", "15cm", "20cm", "30cm"]
        }
      ]
    });
    const specList = computed(() => {
      return cartesianSku(...state.specs);
    });

    // 表单绑定数据
    const frmModel = reactive({
      goodsId: "", // 商品ID
      skus: [], // Sku
      stateSkus: []
    });

    // 表单验证
    const rulesRef = reactive({
      goodsId: [
        {
          required: true,
          message: "请选择商品"
        }
      ]
    });

    const { resetFields, validate, validateInfos } = useForm(
      frmModel,
      rulesRef
    );

    // 调用上级接口--提交表单
    interEvtSubmit(() => {
      return validate().then(data => {
        //state.demoData = data;
        console.info("提交数据：", toRaw(frmModel));
        console.info("提交数据：", data);
        return Promise.reject("无论怎么样都返回这个");

        // return goodsSpuApi.saveData(toRaw(frmModel)).then(ret => {
        //   return handleHttpResut(ret);
        // });
      });
    });

    // 重置表单事件
    interEvtReset(async () => {
      resetFields();
    });

    // 初始化表单
    const fetchData = () => {
      goodsSpuApi
        .getDataList({})
        .then(res => {
          if (res.code == 0) {
            //interEvtCloseLoad();
            state.goodsList = [];
            state.spuList = res.dataList;
            res.dataList.forEach(r => {
              state.goodsList.push({
                value: r.id,
                label: r.name
              });
            });
          }
        })
        .catch(err => {
          alert("9333" + err);
        });
    };
    // 获取SKU列表
    const fetchSkuData = val => {
      goodsSpuApi.getSkusOptions({ name: val }).then(res => {
        if (res.code == 0) {
          res.dataList.forEach(s => {
            console.info(JSON.stringify(s));
          });
        }
      });
      // return val;
    };
    // 查找SPU
    const filterSpu = val => {
      console.info(state.spuList);
      let spus = state.spuList.filter(key => {
        return key.id == val;
      });
      return spus.length > 0 ? spus[0] : {};
    };
    // 下拉选项查询
    const handleSearch = val => {
      console.log("handleSearch...", val);
      fetchData(val);
    };
    // 下拉选项选中
    const handleChange = val => {
      console.log("handleChange.ID.." + JSON.stringify(val));
      // fetchData(val);
      state.currentSpu = filterSpu(val);
      rebuildSku();
      fetchSkuData(state.currentSpu.id);
    };
    const removeSku = item => {
      let index = frmModel.skus.indexOf(item);
      if (index !== -1) {
        frmModel.skus.splice(index, 1);
      }
    };
    const rebuildSku = () => {
      frmModel.skus = [];
      specList.value.forEach(el => {
        frmModel.skus.push({
          name: el[0],
          price: state.currentSpu.price,
          values: el
        });
      });
    };
    // 加载初始化数据
    onMounted(() => {
      interEvtCloseLoad();
    });
    return {
      ...toRefs(state),
      limitNumber,
      frmModel,
      validateInfos,
      handleSearch,
      handleChange,
      removeSku,
      rebuildSku
    };
  }
});
</script>
