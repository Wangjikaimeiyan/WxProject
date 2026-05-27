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
    this.setData({
      currentTab: tabIndex
    }); // 只切换标签，不清空数据
    if (tabIndex === 0) {
      this.getUnPayOrder();
    } else if (tabIndex === 1) {
      this.getPayOrder();
    } else if (tabIndex === 2) {
      this.getProcessingOrder();
    } else if (tabIndex === 3) {
      this.getFinishOrder();
    }
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
  // 获取已支付订单，根据用户id
  getPayOrder() {
    request({
      url: "/WxUser/getPayOrder",
      method: "GET",
    }).then(res => {
      this.setData({
        orderList: res.data
      })
    })
  },
  // 获取进行中订单，根据用户id
  getProcessingOrder() {
    request({
      url: "/WxUser/getProcessingOrder",
      method: "GET",
    }).then(res => {
      this.setData({
        orderList: res.data
      })
    })
  },
  // 已完成
  getFinishOrder() {
    request({
      url: "/WxUser/getFinishOrder",
      method: "GET",
    }).then(res => {
      this.setData({
        orderList: res.data
      })
    })
  },
  // toPay去支付
  toPay(e) {
    const orderId = e.currentTarget.dataset.orderid;  // 全小写 i
    request({
      url: "/WxUser/toPay",
      method: "POST",
      data: orderId
    }).then(res => {
      if (res.code == 1) {
        // 重新查询
        this._switchToTab(0)
        wx.showToast({
           // 弹出toast提示支付成功
          title: '支付成功',
          icon: 'success',
          duration: 2000
        }) 
      } else{
        wx.showToast({
          title: '支付失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // toPayAndOrder去支付并下单
  toPayAndOrder(e) {
    // 弹出弹窗是否支付，如果点击确定，调用toPay，显示支付成功，点击取消，显示取消支付
    wx.showModal({
      title: '提示',
      content: '是否支付',
      success: (res) => {   // 箭头函数，this 和外层一致
        if (res.confirm) {
          this.toPay(e)     // ✅ 正确
        } else if (res.cancel) {
          wx.showToast({ title: '取消支付', icon: 'none' })
        }
      }
    })
  },
  // cancelOrder取消订单，首先弹出弹窗，是否取消订单，点击确定之后发送请求
  cancelOrder(e) {
    wx.showModal({
      title: '提示',
      content: '是否取消订单',
      success: (res) => {   // 箭头函数，this 和外层一致
        if (res.confirm) {
            const orderId = e.currentTarget.dataset.orderid;  
            request({
              url: "/WxUser/cancelOrder",
              method: "POST",
              data: orderId
            }).then(res => {
              if (res.code === 1) {
                this._switchToTab(0)
                wx.showToast({title: '取消成功', icon: 'none',duration: 2000})
              } else if(res.code === 0) {
                wx.showToast({title: '取消失败', icon: 'none',duration: 2000})
              }
            })
        } else if (res.cancel) {
          wx.showToast({ title: '取消成功', icon: 'none',duration: 2000})
        }
      }
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