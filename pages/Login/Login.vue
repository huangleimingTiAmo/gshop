<template>
  <div class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;" @click="setLoginWay(true)" :class="{on: loginWay}">短信登录</a>
          <a href="javascript:;" @click="setLoginWay(false)" :class="{on: !loginWay}">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form @submit.prevent="login">
          <div :class="{on:loginWay}">
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
              <button 
                class="get_verification"
                v-if="!computedTime"
                :class="{right_phone_number: rightPhone}"
                @click.prevent="getCode"
              >
                获取验证码
              </button>
              <button 
                disabled="disabled" 
                class="get_verification" 
                :class="{right_phone_number:computedTime }"
                v-else
                >
                  {{computedTime}}s
                </button>
            </section>
            <section class="login_verification">
              <input type="text" maxlength="8" placeholder="验证码" v-model="code">
            </section>
            <section class="login_hint">
              温馨提示：未注册帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{on:!loginWay}">
            <section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
              </section>
              <section class="login_verification">
                <input type="password" placeholder="密码" v-model="pwd" v-if="!showPassword">
                <input type="text" placeholder="密码" v-model="pwd" v-else >

                <div class="switch_button" @click="showPassword=!showPassword" :class="showPassword?'on':'off'">
                  <div class="switch_circle" :class="{right:showPassword}"></div>
                  <span class="switch_text">{{showPassword?'abc':''}}</span>
                </div>

              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                <img ref="captcha" class="get_verification" src="" alt="captcha">
              </section>
            </section>
          </div>
          <input type="submit" value="登录" class="login_submit"></input>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <span href="javascript:" class="go_back" @click="$router.back()">
        <i class="iconfont icon-jiantou2"></i>
      </span>
    </div>
    <alert-tip v-show="showAlert"
               @closeTip="closeTip"
               :alertText="alertText"/>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import {reqCaptchas, sendCode, smsLogin, pwdLogin} from '../../api'
  import AlertTip from '../../components/AlertTip/AlertTip.vue'

  export default {
    data() {
      return {
        loginWay: false, //登录方式，false代表密码登录, true代表短信登陆
        showPassword: false, // 是否显示密码
        computedTime: 0, //倒数记时
        phone: '', //电话号码
        code: '', //短信验证码
        name: '', //用户名
        pwd: '', //密码
        captcha: '', // 验证码
        captchaImg: null, //验证码图片
        showAlert: false, //显示提示组件
        alertText: '', //提示的内容
      }
    },
    computed:{
      rightPhone(){
        return /^1\d{10}$/.test(this.phone)
      }
    },
    methods:{
      //设置登陆方式
      setLoginWay(x){
        this.loginWay = x
      },
      //获取验证码
      async getCode(){
        if(!this.computedTime){
          this.computedTime = 30
          this.intrevalId = setInterval(()=>{
            this.computedTime--
            if(this.computedTime<=0){
              clearInterval(this.intrevalId)
            }
          },1000)
          const result = await sendCode(this.phone)
          if(result.code === 1){
            this.tanmitAlert(result.msg)
            if(this.computedTime){
              this.computedTime = 0
              clearInterval(this.intrevalId)

            }
          }
        }
      },
      closeTip(){
        this.showAlert = false 
        this.alertText = ''
      },
      tanmitAlert(text){
        this.showAlert = true
        this.alertText = text
      },
      async login(){
        let result
        if(this.loginWay){
          const {phone,code,rightPhone} =  this
          if(!rightPhone){
            this.tanmitAlert('手机号码不争确')
            return
          } else if(!/^\d{6}$/.test(code)){
            this.tanmitAlert('验证码不争确')
            return
          }
        result = await smsLogin(phone,code)
        }else{
          const {name,pwd,captcha} = this
          if(!name){
            this.tanmitAlert('用户名不争确')
            return
          }else if(!pwd){
            this.tanmitAlert('密码不正确')
            return
          }else if(!captcha){
            this.tanmitAlert('yanzhengma')
            return
          }
          result = await pwdLogin(name,pwd,captcha)
        }
        if(this.computedTime){
          this.computedTime = 0
          clearInterval(this.intrevalId)
        }
        if(result.code===0){
          const user = result.data
          this.$store.dispatch('recordUserInfo', user)
          this.$router.replace('/profile')
        }else{
          const msg = result.msg
          this.tanmitAlert(msg)
        }
      }
    },
    components:{
      AlertTip
    }
    
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          > a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        > form
          > div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.right_phone_number
                  color #000
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s, border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                > .switch_circle
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0, 0, 0, .1)
                  transition transform .3s
                  &.right
                    transform translateX(27px)

            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              > a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        > .iconfont
          font-size 20px
          color #999
</style>