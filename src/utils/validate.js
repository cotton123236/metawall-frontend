import validator from "validator";

/**
 * 欄位不可為空
 * @param {String} val 
 * @returns {String}
 */
export function isNotEmpty(val) {
  return validator.isEmpty(val.toString())
    ? '欄位未填寫'
    : ''
}

/**
 * 驗證密碼格式，至少 8 個字元以上
 * @param {String} pw 密碼
 * @returns {String}
 */
export function isValidPassword(pw) {
  return validator.isLength(pw, { min: 8 })
    ? ''
    : "密碼需大於8個字元"
}

/**
 * 驗證密碼是否一致
 * @param {String} pw 新密碼
 * @param {String} checkPw 確認密碼
 * @returns {String}
 */
export function isSamePassword(pw, checkPw) {
  return pw === checkPw
    ? ''
    : '密碼不一致'
}

/**
 * 驗證新舊密碼不可相同
 * @param {String} pw 新密碼
 * @param {String} oldPw 舊密碼
 * @returns {String}
 */
export function isRepeatPassword(pw, oldPw) {
  return pw === oldPw
    ? "不可與原密碼相同"
    : ''
}