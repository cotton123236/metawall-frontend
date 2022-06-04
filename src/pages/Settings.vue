<script setup>
import { useUserStore } from "../stores/userStore";
import { storeToRefs } from "pinia";
import { reactive, ref, onMounted } from "@vue/runtime-core";
import { execThirdPartyLogout } from "../utils/auth-third-party";
import { watch } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
import {
  isNotEmpty,
  isValidPassword,
  isSamePassword,
  isRepeatPassword,
} from "../utils/validate";
import {
  updatePassword,
  uploadAvatar,
  getMyProfile,
  updateProfile,
} from "../api/fetch";

const userStore = useUserStore();
const { patchUser } = userStore;
let { name, gender, image, _id } = storeToRefs(userStore);

// 錯誤訊息
const errorMessage = reactive({
  name: "",
  gender: 0,
  image: "",
  oldPassword: "",
  password: "",
  confirmPassword: "",
});

// 來自 API 回傳訊息
const apiErrorMessagePassword = ref(null);
const apiSuccessMessagePassword = ref(null);
const apiErrorMessageProfile = ref(null);
const apiSuccessMessageProfile = ref(null);

/* 修改個人表單 */
const profileForm = reactive({
  image: image.value,
  nickName: name.value,
  gender: gender ? gender.value : 2,
});

// 取得個人資料
const getProfile = async () => {
  const { data } = await getMyProfile();

  if (data.status === "success") {
    profileForm.nickName = data.data.nickName;
    profileForm.gender = data.data.gender;
    profileForm.image = data.data.avatar;
  }
};

onMounted(() => {
  // 若來自 store 的 name 沒有資料，則重新打一次 API 取得
  if (!name) {
    getProfile();
  }
});

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
    profileForm.image = data.data.upload;
  } else {
    apiErrorMessageProfile.value = data.message;
  }
};

// 監看 profileForm 內容
watch(
  profileForm,
  (newVal, oldVal) => {
    if (newVal) apiSuccessMessageProfile.value = "";

    errorMessage.nickName = isNotEmpty(newVal.nickName);
    errorMessage.gender = isNotEmpty(newVal.gender);
  },
  { deep: true }
);

// 更新個人資料
const changeProfile = async () => {
  // 驗證：內容不可為空
  errorMessage.nickName = isNotEmpty(profileForm.nickName);
  if (errorMessage.nickName) return;

  // 送出的參數
  const param = {
    id: _id.value,
    data: {
      nickName: profileForm.nickName.trim(),
      gender: profileForm.gender,
    },
  };

  if (profileForm.image) param.data.avatar = profileForm.image;

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

// 修改密碼表單
const passwordForm = reactive({
  oldPassword: "",
  password: "",
  confirmPassword: "",
});

// 監看 passwordForm 內容
watch(
  passwordForm,
  (newVal) => {
    if (newVal) apiSuccessMessagePassword.value = "";

    // 內容不可為空
    errorMessage.oldPassword = isNotEmpty(newVal.oldPassword);

    // 密碼不一致
    errorMessage.confirmPassword = isSamePassword(
      newVal.password,
      newVal.confirmPassword
    );
  },
  { deep: true }
);

watch(
  () => passwordForm.password,
  (newVal) => {
    // 密碼需大於8個字元
    if (isValidPassword(newVal)) {
      return (errorMessage.password = isValidPassword(newVal));
    }
    // 不可與原密碼相同
    return (errorMessage.password = isRepeatPassword(
      newVal,
      passwordForm.oldPassword
    ));
  }
);

const changePassword = async () => {
  // 驗證：內容不可為空
  errorMessage.oldPassword = isNotEmpty(passwordForm.oldPassword);
  errorMessage.password = isNotEmpty(passwordForm.password);
  errorMessage.confirmPassword = isNotEmpty(passwordForm.confirmPassword);

  if (
    errorMessage.oldPassword ||
    errorMessage.password ||
    errorMessage.confirmPassword
  )
    return;

  // 驗證： 密碼不一致
  errorMessage.confirmPassword = isSamePassword(
    passwordForm.password,
    passwordForm.confirmPassword
  );
  if (errorMessage.confirmPassword) return;

  // 驗證： 密碼少於8個字元
  errorMessage.confirmPassword = isValidPassword(passwordForm.password);
  if (errorMessage.confirmPassword) return;

  // 驗證： 新密碼不可與原密碼相同
  errorMessage.password = isRepeatPassword(
    passwordForm.password,
    passwordForm.oldPassword
  );
  if (errorMessage.password) return;

  const { data } = await updatePassword(passwordForm);

  if (data.status === "success") {
    apiSuccessMessagePassword.value = data.message;
    apiErrorMessagePassword.value = "";

    countdown();
  } else {
    apiErrorMessagePassword.value = data.message;
  }
};

let timer = null;
let count = ref(3);

function countdown() {
  timer = setInterval(() => {
    count.value = count.value - 1;
    if (count.value <= 0) {
      clearInterval(timer);
      timer = null;
      execThirdPartyLogout();
      userStore.$reset();
      router.push({ path: "/login" });
    }
  }, 1000);
}
</script>

<template>
  <section>
    <div class="headshot-wrap">
      <label class="headshot">
        <input type="file" @change="uploadFile" ref="fileInput" />
        <img v-if="profileForm.image" :src="profileForm.image" alt="" />
      </label>
      <i class="icon-plus"></i>
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
          <label class="form-row" :data-warning="errorMessage.oldPassword">
            <input
              id="old-password"
              type="password"
              required
              v-model.trim="passwordForm.oldPassword"
            />
            <span>原密碼</span>
          </label>
          <label class="form-row" :data-warning="errorMessage.password">
            <input
              id="password"
              type="password"
              required
              v-model.trim="passwordForm.password"
            />
            <span>使用者密碼</span>
          </label>
          <label class="form-row" :data-warning="errorMessage.confirmPassword">
            <input
              id="confirm-password"
              type="password"
              required
              v-model.trim="passwordForm.confirmPassword"
            />
            <span>確認使用者密碼</span>
          </label>
          <div class="api-error">
            {{ apiErrorMessagePassword }}
          </div>
          <div class="api-success" v-if="apiSuccessMessagePassword">
            {{ apiSuccessMessagePassword }}，請重新登入
            {{ count }} 秒後將返回登入頁
          </div>
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