// utils/request.js
import {
  BASE_URL
} from "./util.js";

// 防止多个请求同时触发 401 重复跳转
let isRedirecting = false;

// 通用请求封装 代理
const request = (options) => {
  // 1. 从本地缓存拿token
  const token = wx.getStorageSync("token");

  // 2. 组装请求头
  let header = {
    "Content-Type": "application/json"
  };

  // 有token就自动带上
  if (token) {
    header["token"] = token; // 强制小写
  }

  // 3. 返回Promise 方便调用
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + options.url,
      method: options.method || "GET",
      header: header,
      data: options.data || {},
      success: (res) => {
        // 统一简单校验
        if (res.statusCode === 401) {
          // 只跳转一次，避免多个请求重复跳转
          if (!isRedirecting) {
            isRedirecting = true;
            wx.showToast({
              title: "登录已过期，请重新登录",
              icon: "none"
            });
            wx.removeStorageSync("token");
            wx.reLaunch({
              url: '/pages/login/login'
            });
          }
          // 必须 reject，否则调用方 promise 会一直 pending
          reject({ statusCode: 401, message: "登录已过期" });
          return;
        }
        resolve(res.data);
      },
      fail: (err) => {
        wx.showToast({
          title: "网络请求失败",
          icon: "none"
        });
        reject(err);
      }
    })
  })
};

export default request;