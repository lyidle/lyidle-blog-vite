<template>
  <teleport to="body">
    <el-dialog
      class="primary-dialog report-dialog"
      v-model="isShow"
      width="580"
      align-center
      draggable
      @close="handlerClose"
      lock-scroll
    >
      <template #header>
        <div class="color-[var(--primary-color)] text-20px text-center">
          我要举报
        </div>
      </template>
      <el-form
        :model="createData"
        :rules="createRules"
        label-position="right"
        label-width="0"
        ref="formInstance"
        @submit.prevent="handlerConfirm"
      >
        <el-form-item prop="content">
          <div class="context w-100%">
            <div class="content-item">
              <div class="label">违反法律法规</div>
              <el-radio-group v-model="type">
                <el-radio value="违法违规">违法违规</el-radio>
                <el-radio value="色情">色情</el-radio>
                <el-radio value="低俗">低俗</el-radio>
                <el-radio value="赌博诈骗">赌博诈骗</el-radio>
                <el-radio value="违法信息外链">违法信息外链</el-radio>
              </el-radio-group>
            </div>
            <div class="content-item">
              <div class="label">谣言及不实信息</div>
              <el-radio-group v-model="type">
                <el-radio value="涉政谣言">涉政谣言</el-radio>
                <el-radio value="虚假不实信息">虚假不实信息</el-radio>
                <el-radio value="涉社会事件谣言">涉社会事件谣言</el-radio>
              </el-radio-group>
            </div>
            <div class="content-item">
              <div class="label">不友善行为</div>
              <el-radio-group v-model="type">
                <el-radio value="人身攻击">人身攻击</el-radio>
                <el-radio value="侵犯隐私">侵犯隐私</el-radio>
              </el-radio-group>
            </div>
            <div class="content-item">
              <div class="label">有害社区环境</div>
              <el-radio-group v-model="type">
                <el-radio value="垃圾广告">垃圾广告</el-radio>
                <el-radio value="引战">引战</el-radio>
                <el-radio value="刷屏">刷屏</el-radio>
                <el-radio value="其他">其他</el-radio>
              </el-radio-group>
            </div>
            <div class="content-item">
              <div class="label">详细情况 (必填)</div>
              <my-input
                type="textarea"
                placeholder="慎写具体违规内容出现时间点和详细描述，更容易举报成功哦~~"
                v-model.trim="createData.content"
              ></my-input>
            </div>
          </div>
        </el-form-item>
        <div class="flex justify-end mt-20px">
          <my-button class="w-unset" type="default" @click="isShow = false"
            >取消</my-button
          >
          <my-button class="w-unset" type="primary" native-type="submit">
            确认
          </my-button>
        </div>
      </el-form>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts" name="GlobalReport">
// 引入类型
import { AddReportBody } from "@/api/user/report/types/addReportBody"
// 引入请求处理函数
import { handlerReqErr } from "@/utils/request/error/successError"

const createData = reactive({
  content: "",
})
const createRules = reactive({
  content: [
    { required: true, trigger: "change", message: "详细情况是必填项" },
    {
      required: true,
      trigger: "change",
      min: 1,
      max: 255,
      message: "详细情况长度必须在1-255之间哦",
    },
  ],
})

// 表单实例
const formInstance = ref()

// 是否显示
const isShow = defineModel<boolean>()
// 注入父组件提供的方法
const reportConfirm = inject<(data: AddReportBody) => any>("reportConfirm")
// 单选框 举报类型
const type = ref<string>()
const handlerConfirm = async () => {
  try {
    // 表单校验
    await formInstance.value.validate()
    if (!type.value) return ElMessage.warning("请选择举报类型")
    if (!createData.content) return ElMessage.warning("请填写详细情况")
    const updateData: AddReportBody = {
      desc: createData.content,
      type: "",
      targetUserId: 0,
      name: type.value,
    }
    await reportConfirm?.(updateData)
    isShow.value = false
    ElMessage.success("举报成功，请等待处理结果")
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("举报失败")
  }
}
const handlerClose = () => {
  isShow.value = false
  type.value = undefined
  formInstance.value?.resetFields()
}
</script>

<style lang="scss">
.report-dialog {
  .context {
    display: flex;
    flex-direction: column;
    gap: 10px;
    > .content-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
      color: var(--primary-color);
      > .label {
        font-size: 16px;
        cursor: var(--cursor-text);
        user-select: text;
      }
      .el-radio {
        cursor: var(--cursor-pointer);
        span {
          font-size: 15px;
          color: var(--primary-color);
        }
        .el-radio__inner {
          cursor: var(--cursor-pointer);
        }
      }
    }
  }
}
</style>
