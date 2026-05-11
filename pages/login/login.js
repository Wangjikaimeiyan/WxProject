import { BASE_URL } from "../../utils/util.js";

Page({
  data: {
    nickName: '',
    url: ''
  },

  // 点击按钮触发授权
  getUserInfo() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        this.setData({
          nickName: res.userInfo.nickName,
          url: res.userInfo.avatarUrl
        })
        // 授权成功 执行登录请求
        this.wxLogin()
      }
    })
  },

  // 微信登录拿code + 传后端
  wxLogin() {
    wx.login({
      success: (res) => {
        let code = res.code;
        wx.request({
          url: BASE_URL + "/WxUser/Login",
          method: "POST",
          header: {
            "Content-Type": "application/json"
          },
          data: {
            code: code,
            nickName: this.data.nickName,
            url: this.data.url
          },
          success: (res) => {
            if (res.data.code !== 1) {
              wx.showToast({ title: "登录失败", icon: "none" })
              return;
            }
            // 保存token
            wx.setStorageSync("token", res.data.data)
            // 关键：登录成功 跳转到首页
            wx.switchTab({
              url: "/pages/index/index"
            })
          },
          fail() {
            wx.showToast({ title: "请求失败", icon: "none" })
          }
        })
      }
    })
  },

  onShow() {
    // 如果已经有token，直接跳过登录，进首页
    let token = wx.getStorageSync("token")
    if (token) {
      wx.switchTab({
        url: "/pages/index/index"
      })
    }
  }
})
