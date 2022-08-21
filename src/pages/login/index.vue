<template>
  <div class="login">
    <div class="main-block">
      <div class="option-pane">
        <h1>后台管理系统</h1>
        <div class="login-form">
          <input class="text-input" type="text" v-model="form.username" placeholder="请输入账号">
          <div class="input-error-info">{{errors.username ? errors.username.join(';') : null}}</div>
          <input class="text-input" type="password" v-model="form.password" placeholder="请输入密码">
          <div class="input-error-info">{{errors.password ? errors.password.join(';') : null}}</div>
          <div>
            <BaseCheckbox v-model="form.isRemember">记住密码</BaseCheckbox>
          </div>
          <BaseButton class="login-button" type="primary" @click="loginHandler">登录</BaseButton>
          <div class="login-error-info">{{loginError}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BaseCheckbox from '@/components/base/checkbox/index.vue'
import { QUERY_USER_INFO } from '@/store/action-types.js'

export default {
  name: 'Login',
  components: {
    BaseCheckbox
  },
  data () {
    return {
      form: {
        username: 'admin', // 账号
        password: '111111', // 密码
        isRemember: false // 是否记住密码
      },
      // 表单错误提示信息
      errors: {},
      // 登录错误提示信息
      loginError: ''
    }
  },
  created () {},
  mounted () {},
  methods: {
    // 表单校验
    validate () {
      const rules = {
        username: [
          { rule: 'required', label: '账号' },
          { rule: 'length', option: { max: 30 }, label: '账号' }
        ],
        password: [
          { rule: 'required', label: '密码' },
          { rule: 'length', option: { max: 30 }, label: '密码' }
        ]
      }
      this.errors = this.$validator.validate(this.form, rules)
      return this.errors.__isValid
    },
    // 登录
    loginHandler () {
      this.loginError = ''
      if (this.validate()) {
        this.$apiPost({
          url: `/api/sys/login`,
          data: this.form,
          toastError: false
        }).then(() => {
          // 下面注释勿动，当不需要创建前获取用户信息时，会自动注释掉该行代码
          /* [auto single-line command {getUserInfoBeforeCreate=false}] */ this.$store.dispatch(QUERY_USER_INFO, { vm: this }).then(() => {
            if (this.$route.params.fromPath) {
              this.$router.replace(this.$route.params.fromPath)
            } else {
              this.$router.replace('/layout/home')
            }
          // 下面注释勿动，当不需要创建前获取用户信息时，会自动注释掉该行代码
          /* [auto single-line command {getUserInfoBeforeCreate=false}] */ })
        }, (err) => {
          this.loginError = err.message
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
$main-block-width: 916px;
$main-block-height: 572px;
.login {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  min-width: $main-block-width + 20px;
  min-height: $main-block-height + 20px;
  background-color: #FFF;
  .main-block {
    color: #fff;
    width: $main-block-width;
    height: $main-block-height;
    padding: 0 1px 0 474px;
    background: url('img/login_bg.jpg') no-repeat;
    transform: translate(-50%,-50%);
    position: absolute;
    left: 50%;
    top: 50%;
    .option-pane {
      border: 1px solid #999;
      border-left: 0;
      height: 572px;
      margin: 0 auto;
      h1 {
        margin: 111px auto 50px;
        color: #333;
        font-size: 30px;
        height: 30px;
        text-align: center;
      }
      .login-form {
        width: 320px;
        margin: 30px auto 0;
        .text-input {
          margin: 10px 0 0 0;
          padding: 0 10px;
          width: 100%;
          height: 50px;
          line-height: 50px;
          font-size: 14px;
          border: 1px solid $border-color-base;
          border-radius: 2px;
          outline: none;
          &:focus {
            border-color: $color-primary;
          }
        }
        .input-error-info, .login-error-info {
          min-height: 24px;
          color: $color-danger;
          font-size: 14px;
          line-height: 1.4;
        }
        .input-error-info {
          margin-top: 3px;
          text-align: right;
        }
        .login-error-info {
          margin-top: 3px;
          margin-bottom: 5px;
          text-align: center;
        }
        .login-button {
          margin-top: 27px;
          box-sizing: border-box;
          width: 100%;
          height: 50px;
          font-size: 18px;
        }
      }
    }
  }
}
</style>
