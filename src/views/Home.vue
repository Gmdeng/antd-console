<template>
  <div class="gm-container-none">
    <a-page-header>
      <a-row type="flex">
        <a-col flex="auto">
          <div class="account-avatar">
            <a-avatar :size="72" :src="user?.avatar" />
          </div>
          <div class="account-content">
            <h2>Account</h2>
            <span>
              无部门 | 无角色
            </span>
          </div>
        </a-col>
        <a-col flex="300px">
          <a-row :gutter="24">
            <a-col :span="12">
              <a-statistic title="我的任务" :value="0" suffix="个" />
            </a-col>
            <a-col :span="12">
              <a-statistic title="我的审批" :value="0" suffix="个" />
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-page-header>

    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      title="Title"
      sub-title="This is a subtitle"
      @back="() => $router.go(-1)"
    >
      <template #extra>
        <a-button key="3" @click="onTestGo">
          Operation 3
        </a-button>
        <a-button key="2">
          Operation 4
        </a-button>
        <a-button key="1" type="primary">
          Primary 6
        </a-button>
      </template>
      <a-descriptions size="small" :column="3">
        <a-descriptions-item label="Created">
          Lili Qu - <DropboxOutlined />
        </a-descriptions-item>
        <a-descriptions-item label="Association">
          <a>421421</a>
        </a-descriptions-item>
        <a-descriptions-item label="Creation Time">
          2017-01-10
        </a-descriptions-item>
        <a-descriptions-item label="Effective Time">
          2017-10-10
        </a-descriptions-item>
        <a-descriptions-item label="Remarks">
          Gonghu Road, Xihu District, Hangzhou, Zhejiang, China
        </a-descriptions-item>
      </a-descriptions>
    </a-page-header>
    <br />
    <a-page-header title="Title" sub-title="This is a subtitle">
      <template #avatar>
        <a-avatar :size="72" :src="user?.avatar" />
      </template>
      <template #tags>
        <a-tag color="blue">
          Running
        </a-tag>
      </template>
      <template v-slot:extra>
        <a-button key="3">
          Operation
        </a-button>
        <a-button key="2">
          Operation
        </a-button>
        <a-button key="1" type="primary">
          Primary
        </a-button>
      </template>
      <a-row type="flex">
        <a-statistic title="Status" value="Pending" />
        <a-statistic
          title="Price"
          prefix="$"
          :value="568.08"
          :style="{
            margin: '0 32px'
          }"
        />
        <a-statistic title="Balance" prefix="$" :value="3345.08" />
      </a-row>
    </a-page-header>
    <a-row :gutter="[8, 8]">
      <a-col :span="16">
        <a-card title="Card title" :bordered="true">
          <p>
            <a-statistic-countdown
              title="Day Level"
              :value="deadline"
              format="D 天 H 时 m 分 s 秒"
            />
          </p>
          <p>Card content = {{ deadline }}</p>
          <p>
            <a-statistic-countdown
              :value="deadline"
              format="倒计 s 秒"
              @finish="onFinish"
            />
          </p>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="Card title" :bordered="true">
          <p>Card content</p>
          <p>Card <a-button @click="onHelloEvent">Hello Client</a-button></p>
          <p>Card content</p>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="[8, 8]">
      <a-col :span="24">
        <a-alert
          message="Success Tips"
          type="success"
          show-icon
          style="width: 100%"
        /><br />
        <a-alert message="Informational Notes" type="info" show-icon />
        <br />
        <a-alert message="Warning" type="warning" show-icon />
        <br />
        <a-alert message="Error" type="error" show-icon />
        <br />
        <a-alert
          message="Success Tips"
          description="Detailed description and advices about successful copywriting."
          type="success"
          show-icon
        />
        <br />
        <a-alert
          message="Informational Notes"
          description="Additional description and informations about copywriting."
          type="info"
          show-icon
        />
        <br />
        <a-alert
          message="Warning"
          description="This is a warning notice about copywriting."
          type="warning"
          show-icon
        />
        <br />
        <a-alert
          message="Error"
          description="This is an error message about copywriting."
          type="error"
          show-icon
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import {
  // computed,
  // defineComponent,
  // reactive,
  // toRefs,
  ref,
  // watch,
  getCurrentInstance
} from "vue";
import { DropboxOutlined } from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
export default {
  name: "Home",
  components: {
    DropboxOutlined
  },
  setup() {
    const { ctx } = getCurrentInstance();
    const router = useRouter();
    const onHelloEvent = () => {
      ctx.$confirm({
        title: "Hello 您确认要退出系统吗?",
        content:
          "When clicked the OK button, this dialog will be closed after 1 second",
        okText: " 确认退出 ",
        onOk() {
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          }).catch(() => console.log("Oops errors!"));
        },
        cancelText: " 取消 ",
        onCancel() {
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          }).catch(() => console.log("Oops errors!"));
        }
      });
    };
    const user = {
      avatar:
        "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    };
    // const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30;
    const deadline = ref(Date.now() + 1000 * 10);
    const onFinish = () => {
      ctx.$message.success("finished!");
      deadline.value = Date.now() + 1000 * 120;
    };
    const onTestGo = () => {
      router.push("/from");
    };
    return {
      user,
      onHelloEvent,
      onFinish,
      onTestGo,
      deadline
    };
  }
};
</script>
<style lang="scss"></style>
