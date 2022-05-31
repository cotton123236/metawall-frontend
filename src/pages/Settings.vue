<script setup>
import { useUserStore } from "../stores/userStore";
import { storeToRefs } from "pinia";
import { reactive, ref, onMounted } from "@vue/runtime-core";
import { watch } from "vue";
import {
  updatePassword,
  uploadAvatar,
  getMyProfile,
  updateProfile,
} from "../api/fetch";
import validator from "validator";

// let userStore = "";
// onMounted(() => {
const userStore = useUserStore();
const { patchUser } = userStore;
let { name, gender, image, _id, follows } = storeToRefs(userStore);
// console.log("userStore", name.value);
// });
// 錯誤訊息
const errorMessage = ref({
  name: "",
  gender: 0,
  image: "",
  old_password: "",
  password: "",
  confirm_password: "",
});

const apiErrorMessagePassword = ref(null);
const apiSuccessMessagePassword = ref(null);
const apiErrorMessageAvatar = ref(null);
const apiErrorMessageProfile = ref(null);
const apiSuccessMessageProfile = ref(null);

/* 修改個人資料 */
const profileForm = ref({
  image: "",
  nickName: "",
  gender: "",
});

// 取得個人資料
const getProfile = async () => {
  const { data } = await getMyProfile();

  if (data.status === "success") {
    profileForm.value.nickName = data.data.nickName;
    profileForm.value.gender = data.data.gender;
    profileForm.value.image = data.data.avatar;
  }
};

getProfile();

// 上傳圖片
const fileInput = ref();
const uploadFile = async () => {
  console.log("upload");
  const uploadedFile = fileInput.value.files[0];
  console.dir(uploadedFile);

  const formData = new FormData();
  formData.append("file-to-upload", uploadedFile);

  const { data } = await uploadAvatar(formData);

  if (data.status === "success") {
    profileForm.value.image = data.data.upload;
  } else {
    apiErrorMessageProfile.value = data.message;
  }
};

// 監看 nickName 格式
watch(
  () => profileForm.value.nickName,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      apiSuccessMessageProfile.value = "";
    }

    errorMessage.value.nickName = !newVal ? "請填寫內容" : "";
  }
);

// 監看 gender 格式
watch(
  () => profileForm.value.gender,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      apiSuccessMessageProfile.value = "";
    }

    errorMessage.value.gender = !newVal ? "請選擇內容" : "";
  }
);

// 更新個人資料
const changeProfile = async () => {
  // 驗證：內容不可為空
  if (!profileForm.value.nickName.trim()) {
    errorMessage.value.nickName = "請填寫內容";
    return;
  }

  const param = {
    id: _id.value,
    data: {
      nickName: profileForm.value.nickName.trim(),
      gender: profileForm.value.gender,
    },
  };

  if (profileForm.value.image) param.data.avatar = profileForm.value.image;

  const { data } = await updateProfile(param);

  if (data.status === "success") {
    apiSuccessMessageProfile.value = "修改成功";
    apiErrorMessageProfile.value = "";
    patchUser({
      name: data.data.nickName,
      gender: data.data.gender,
      image: data.data.avatar,
    });
  } else {
    apiErrorMessageProfile.value = data.message;
  }
};

const passwordForm = ref({
  old_password: "",
  password: "",
  confirm_password: "",
});

// 監看 old_password 格式
watch(
  () => passwordForm.value.old_password,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      apiSuccessMessagePassword.value = "";
    }

    errorMessage.value.old_password = !newVal.trim() ? "請填寫內容" : "";
  }
);

// 監看 password 格式
watch(
  () => passwordForm.value.password,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      apiSuccessMessagePassword.value = "";
    }
    errorMessage.value.password = !validator.isLength(newVal.trim(), { min: 8 })
      ? "密碼少於8個字元"
      : "";
  }
);

// 監看 confirm_password 格式
watch(
  () => passwordForm.value.confirm_password,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      apiSuccessMessagePassword.value = "";
    }
    errorMessage.value.confirm_password =
      passwordForm.value.password.trim() !== newVal.trim() ? "密碼不一致" : "";
  }
);
const changePassword = async () => {
  // 驗證：內容不可為空
  if (
    !passwordForm.value.old_password.trim() ||
    !passwordForm.value.password.trim() ||
    !passwordForm.value.confirm_password.trim()
  ) {
    errorMessage.value.old_password = "請填寫內容";
    errorMessage.value.password = "請填寫內容";
    errorMessage.value.confirm_password = "請填寫內容";
    return;
  }

  // 驗證： 密碼不一致
  if (
    passwordForm.value.password.trim() !==
    passwordForm.value.confirm_password.trim()
  ) {
    errorMessage.value.confirm_password = "密碼不一致";
    return;
  }

  // 驗證： 密碼少於8個字元
  if (!validator.isLength(passwordForm.value.password.trim(), { min: 8 })) {
    errorMessage.value.confirm_password = "密碼少於8個字元";
    return;
  }

  const { data } = await updatePassword(passwordForm.value);

  if (data.status === "success") {
    apiSuccessMessagePassword.value = data.message;
    apiErrorMessagePassword.value = "";
  } else {
    console.log("data", data);
    apiErrorMessagePassword.value = data.message;
  }
};
</script>

<template>
  <section>
    <div class="headshot-wrap">
      <label class="headshot">
        <input type="file" @change="uploadFile" ref="fileInput" />
        <img v-if="profileForm.image" :src="profileForm.image" alt="" />
      </label>
      <i class="icon-plus"></i>
      <div class="api-error">{{ apiErrorMessageAvatar }}</div>
    </div>
    <div class="content">
      <div class="inner">
        <h2>編輯個人資料</h2>
        <form>
          <!-- 使用者名稱 -->
          <label class="form-row" :data-warning="errorMessage.nickName">
            <input
              id="name"
              type="text"
              required
              v-model="profileForm.nickName"
            />
            <span>使用者名稱</span>
          </label>
          <!-- 使用者性別 -->
          <div class="form-row form-radio">
            <p>使用者性別</p>
            <label for="male">
              <input
                name="gender"
                id="male"
                value="0"
                type="radio"
                v-model="profileForm.gender"
              />
              <div class="fake-radio"></div>
              <span>男性</span>
            </label>
            <label for="female">
              <input
                name="gender"
                id="female"
                value="1"
                type="radio"
                v-model="profileForm.gender"
              />
              <div class="fake-radio"></div>
              <span>女性</span>
            </label>
            <label for="unknown">
              <input
                name="gender"
                id="unknown"
                value="2"
                type="radio"
                v-model="profileForm.gender"
              />
              <div class="fake-radio"></div>
              <span>未知宇宙生物</span>
            </label>
          </div>
          <div class="api-error">{{ apiErrorMessageProfile }}</div>
          <div class="api-success">{{ apiSuccessMessageProfile }}</div>
          <div class="rect-btn fill submit-btn" @click="changeProfile">
            修改個人資料
          </div>
        </form>
        <h2>重新設定密碼</h2>
        <form>
          <label class="form-row" :data-warning="errorMessage.old_password">
            <input
              id="password"
              type="password"
              required
              v-model="passwordForm.old_password"
            />
            <span>原密碼</span>
          </label>
          <label class="form-row" :data-warning="errorMessage.password">
            <input
              id="password"
              type="password"
              required
              v-model="passwordForm.password"
            />
            <span>使用者密碼</span>
          </label>
          <label class="form-row" :data-warning="errorMessage.confirm_password">
            <input
              id="confirm-password"
              type="password"
              required
              v-model="passwordForm.confirm_password"
            />
            <span>確認使用者密碼</span>
          </label>
          <div class="api-error">{{ apiErrorMessagePassword }}</div>
          <div class="api-success">{{ apiSuccessMessagePassword }}</div>
        </form>
        <div class="rect-btn fill submit-btn" @click="changePassword">
          修改密碼
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="sass" scoped>
@import ./../assets/sass/base/mixin

section
  padding-bottom: 40px

.headshot-wrap
  position: relative
  z-index: 2
  width: 140px
  height: 140px
  margin: 0 auto -70px
  border-radius: 50%
  border: 10px solid var(--background)
  background-color: var(--background)
  +rwdmax(767)
    width: 120px
    height: 120px
    margin: 0 auto -60px
  .headshot
    position: relative
    box-shadow: 0 0 10px rgba(0, 0, 0, .3)
    width: 100%
    height: 100%
    cursor: pointer
    &:hover
      & + i
        opacity: .9
      &::before
        opacity: 1
    &::before
      background-color: rgba(0, 0, 0, .3)
      opacity: 0
      transition: opacity var(--trans-s)
      +posFill
      +pseudo
    input
      display: none
  i
    display: flex
    justify-content: center
    align-items: center
    position: absolute
    bottom: 7px
    right: 7px
    width: 20px
    height: 20px
    border-radius: 50%
    color: var(--white)
    background-color: var(--primary-pink)
    opacity: 0
    transition: opacity var(--trans-s)

.content
  position: relative
  z-index: 1
  padding: 100px 40px
  background-color: var(--white)
  border-radius: 20px
  box-shadow: 0 0 10px rgba(0, 0, 0, .1)
  +rwdmax(767)
    padding: 100px 30px
  .inner
    max-width: 500px
    margin: auto
  h2
    font-size: px(16)
    line-height: 1.5
    font-weight: 500
    text-align: center
    & + form
      margin-top: 40px
  form
    & + h2
      margin-top: 100px
      +rwdmax(767)
        margin-top: 60px
    .form-row
      & + .form-row
        margin-top: 40px
      & + .form-radio
        margin-top: 30px
      input[type="text"], input[type="password"]
        background-color: transparent
        border: none
        border-bottom: 1px solid var(--dark-white)
        border-radius: 0
        font-size: px(16)
        padding: 10px 5px
        &:focus, &:valid
          box-shadow: none
        &:focus + span, &:valid + span
          color: var(--primary-blue)
          transform: translate(2px, -30px) scale(.8)
        & + span
          left: 0
      > label
        display: flex
        align-items: center
  .submit-btn
    margin: 80px auto 0
    +rwdmax(767)
      margin: 60px auto 0
  .rect-btn
    margin-top: 40px
  .api-error
    display: flex
    justify-content: center
    margin-top: 20px
    color: var(--warning)
    font-size: 0.875rem
  .api-success
    display: flex
    justify-content: center
    margin-top: 20px
    color: var(--primary-blue-light)
    font-size: 0.875rem
</style>