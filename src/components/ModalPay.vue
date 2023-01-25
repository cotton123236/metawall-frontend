<script setup>
import { onUnmounted, ref, computed, reactive } from '@vue/runtime-core';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserStore } from './../stores/userStore';
import { useModalStore } from './../stores/modalStore';
import { usePostStore } from './../stores/postStore';
import {
  postCreateOrder,
  getOrderInfo
} from './../api/fetch';
import { postNewebpay } from './../api/helper/newebpay'
import { result } from 'lodash-es';
// components
// import Image from './../assets/image/login-bg.png'

const route = useRoute();
const userStore = useUserStore();
const modalStore = useModalStore();
const postStore = usePostStore();

const { closeModalPay, openModalLoader, closeModalLoader, openModalAlert } =
  modalStore;
const { patchPosts, patchProfilePosts, patchPostingData } = postStore;
const { postingData } = storeToRefs(postStore);
const { useModalPayPostId } = storeToRefs(modalStore)

// 貼文資料處理與發送
const isNewPost = postingData.value.content === '';
const isProfile =
  route.params.id && route.params.id === userStore._id ? true : false;



const submitPay = async () => {
  const requestData = {
    postId : useModalPayPostId.value,
    amt : amount.value,
    description: '贊助貼文'
  }

  const createOrderResult = await postCreateOrder(requestData)
  console.log(createOrderResult);
  if (createOrderResult.data.status !== 'success') {
    openModalAlert(createOrderResult.message)
    closeModalPay()
    return
  }
  console.log(createOrderResult.data?.tradeInfo?.TimeStamp);
  if(!createOrderResult?.data?.data || createOrderResult.data.data?.tradeInfo?.TimeStamp===undefined){
    openModalAlert("沒找到資料")
    closeModalPay()
    return
  }

  const orderId = createOrderResult.data.data?.tradeInfo?.TimeStamp
  const orderInfoResult = await getOrderInfo(orderId)
  
  if (orderInfoResult.data.status !== 'success') {
    openModalAlert(orderInfoResult.message)
    closeModalPay()
    return
  }

  console.log(orderInfoResult)

  const requestBody = {
    MerchantID: 'MS140625957',
    TradeSha: orderInfoResult.data.data.shaEncrypt,
    TradeInfo: orderInfoResult.data.data.aesEncrypt,
    TimeStamp: orderInfoResult.data.data.TimeStamp,
    MerchantOrderNo: orderInfoResult.data.data.order.MerchantOrderNo,
    Version: 1.5,
    Amt: orderInfoResult.data.data.order.Amt,
    Email: orderInfoResult.data.data.order.Email,
  }

  const form = document.createElement("form");
  form.method = "post";
  form.action = "https://ccore.spgateway.com/MPG/mpg_gateway";
  // form.target = "_blank";

  for(const key in requestBody){
    const hiddenField = document.createElement("input");
    hiddenField.type = "hidden";
    hiddenField.name = key;
    hiddenField.value = requestBody[key];

    form.appendChild(hiddenField);
  }

  document.body.appendChild(form);
  form.submit();
  form.remove();
};

// Rich editor
const editor = useEditor({
  content: postingData.value.content,
  extensions: [StarterKit, Image],
  onUpdate: ({ editor }) => {
    postingData.value.content = editor.getHTML();
  },
});

// 新增圖片
const imageFile = ref(null);
const addImage = async () => {
  openModalLoader('上傳中');
  const uploadedFile = imageFile.value.files[0];
  console.dir(uploadedFile);
  const formData = new FormData();
  formData.append('file-to-upload', uploadedFile);

  const { data } = await uploadPostImage(formData);

  if (data.status === 'success') {
    editor.value.chain().focus().setImage({ src: data.data.upload }).run();
  } else {
    openModalAlert(data.message);
  }
  closeModalLoader();
};

onUnmounted(() => {
  patchPostingData({ _id: '', content: '', image: [] });
});

const isSubmitDisable = ref(true);

const checkSubmitDisable = (value)=>{
  if(/^0$/.test(value) || value==="" || value === null){
    isSubmitDisable.value = true;
  } else if (/^[1-9][0-9]*$/.test(value)) {
    isSubmitDisable.value = false;
  } else if (/^[0-9]*$/.test(value)) {
    isSubmitDisable.value = false;
  } else {
    isSubmitDisable.value = true;
  }
}

const amount = ref(0);

const reactiveAmount = computed({
  get() {
    return amount.value;
  },
  set(payload) {
    let value = payload;
    let regex = /^0/.test(value) ? /^[1-9][0-9]*$/ : /^[0-9]*$/;
    if (regex.test(value)) {
      amount.value = value;
    } else {
      amount.value = null;
    }
    checkSubmitDisable(amount.value)
  },
});
</script>

<template>
  <div class="modal-wrapper modal-post">
    <div class="modal-bg" @click="closeModalPay"></div>
    <div class="modal-content">
      <div class="modal">
        <div class="close-btn" @click="closeModalPay"></div>
        <div class="modal-head">
          <span>贊助貼文</span>
        </div>
        <div class="modal-body">
          <div class="content">
            <div class="d-flex justify-center items-center payment-img-wrapper">
              <div class="payment-img"></div>
            </div>
            <div class="d-flex justify-center items-center">
              <div class="amount-input-wrapper">
                <input
                  class="amount-input"
                  type="text"
                  maxlength="9"
                  v-model="reactiveAmount"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="modal-foot">
          <div
            class="rect-btn fill"
            :class="{
              disable:
              isSubmitDisable,
            }"
            @click="submitPay"
          >
            贊助
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@import ./../assets/sass/base/variables
@import ./../assets/sass/base/mixin

// modal-post
.modal-content
  pointer-events: none
.modal
  position: relative
  width: 90%
  max-width: 600px
  border-radius: 10px
  background-color: var(--white)
  margin: auto
  pointer-events: auto
  .close-btn
    position: absolute
    z-index: 2
    top: 17px
    right: 20px
  .modal-head
    position: relative
    font-size: px(14)
    line-height: 1.5
    padding: 20px
    text-align: center
    +rwdmax(767)
      padding: 20px 10px
    &::after
      position: absolute
      content: ''
      display: block
      width: calc(100% - 40px)
      height: 1px
      left: 20px
      bottom: 0
      background-color: var(--dark-white)
      +rwdmax(767)
        width: calc(100% - 20px)
        left: 10px
  .modal-body
    padding: 20px 40px 0
    +rwdmax(767)
      padding: 20px 20px 0
    .info
      display: flex
      align-items: center
    .headshot
      width: 50px
      height: 50px
      margin-right: 15px
    .name
      font-family: $code-font
      line-height: 1.5
    .content
      padding: 20px 0 0
    // .picture
    //   width: 100%
    //   img
    //     width: 100%
  .modal-foot
    padding: 20px
    +rwdmax(767)
      padding: 10px

// editor
.editor-tools
  display: flex
  .editor-btn
    display: flex
    justify-content: center
    align-items: center
    width: 32px
    height: 32px
    cursor: pointer
    border-radius: 5px
    transition: var(--trans-s)
    & + .editor-btn
      margin-left: 5px
    &:hover
      background-color: var(--background)
    &.is-active
      background-color: var(--dark-gray)
      color: var(--white)
    input[type="file"]
      display: none
.editor-content
  width: 100%
  height: 30vh
  overflow: auto
  padding: 10px
  &::-webkit-scrollbar-track
    border-radius: 10px
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .2)
  &::-webkit-scrollbar
    width: 6px
    +rwdmax(768)
      display: none
  &::-webkit-scrollbar-thumb
    border-radius: 10px
    background-color: #ccc
.payment-img-wrapper
  margin-bottom: 32px
.payment-img
  width: 160px
  height: 160px
  background-color: #00c34d
  mask: url("@/assets/icons/svg/payments.svg") no-repeat center / contain
  -webkit-mask: url("@/assets/icons/svg/payments.svg") no-repeat center / contain
.amount-input
  text-align: center
  border-radius: 8px
  padding: 16px
  font-size: 32px
  width: 240px
.amount-input-wrapper
  position: relative
.amount-input-wrapper::after
  position: absolute
  right: 0
  top: 50%
  transform: translateY(-50%)
  width: 48px
  height: 48px
  content: "　"
  background: url("@/assets/icons/svg/dollar.svg") no-repeat center / contain
.paid-img
  width: 48px
  height: 48px
  background-color: black
  mask: url("@/assets/icons/svg/dollar.svg") no-repeat center / contain
  -webkit-mask: url("@/assets/icons/svg/dollar.svg") no-repeat center / contain
</style>
