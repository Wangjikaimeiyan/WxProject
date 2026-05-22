// pages/order/order.js
// index.js
import {
  BASE_URL
} from "../../utils/util.js";
import request from "../../utils/request.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    // 定义订单列表
    orderList: [],
    // 定义单个订单
    order: {
      // 订单id
      orderId: 0,
      // 下单时间
      orderTime: "",
      // 支付时间
      payTime: "",
      // 支付状态
      Status: 0,
      // 备注
      remark: "",
      // 总价格
      totalPrice: 0,
      // 子菜品集合
      dishesDtos: []
    },
    // 定义单个子菜品
    dishesDto: {
      DishName: "",
      Price: 0,
      DishNum: 0,
      Url: ""
    },
  },

  switchTab(e) {
    // 根据传入的index切换当前选中的tab
    this.setData({
      currentTab: parseInt(e.currentTarget.dataset.index)
    })
    switch (this.data.currentTab) {
      // 未支付
      case 0:
        this.getUnPayOrder()
        console.log("未支付")
        break;
        // 未接单
      case 1:

        break;
        // 进行中
      case 2:

        break;
        // 已完成
      case 3:

        break;
    }
    console.log(this.data.currentTab)
  },

  // ================================订单业务===============================
  // 获取未支付订单，根据用户id
  getUnPayOrder() {
    request({
      url: "/WxUser/getUnPayOrder",
      method: "GET",
      data: {
        userId: getApp().globalData.openId
      }
    }).then(res => {
      this.setData({
        orderList: res.data
      })
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})