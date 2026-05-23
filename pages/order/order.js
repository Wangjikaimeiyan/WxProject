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
    const tabIndex = parseInt(e.currentTarget.dataset.index)
    this._switchToTab(tabIndex)
  },

  // 内部方法：根据 tab 索引切换并加载对应数据
  _switchToTab(tabIndex) {
    // 更新tab并清空订单列表
    this.setData({
      currentTab: tabIndex,
      orderList: []
    })
    // 未支付 tab 需加载未支付订单
    if (tabIndex === 0) {
      this.getUnPayOrder()
    }
    console.log(this.data.currentTab, tabIndex)
  },

  // ================================订单业务===============================
  // 获取未支付订单，根据用户id
  getUnPayOrder() {
    request({
      url: "/WxUser/getUnPayOrder",
      method: "GET",
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
    this.getUnPayOrder()
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
    console.log("下拉刷新")
    // 直接传入当前 tab 索引刷新
    this._switchToTab(this.data.currentTab)
    wx.stopPullDownRefresh()
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