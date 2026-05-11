// pages/list/list.js
import { BASE_URL } from "../../utils/util.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: "sasa",
    a: 121,
    b: 221,
    url: '/static/ima/www.png',
    randon: Math.random() * 100,
    adddata: 0,
    inputValue: null,
    array: ["A", "B", "C"],
    clazz: [{
        id: 0,
        name: "小明"
      }, {
        id: 1,
        name: "流萤"
      },
      {
        id: 2,
        name: "方虎庞"
      }
    ],
    Alldishes:null,
  },

  // 127.0.0.1:8080/Xiang/dishes
  // 查询所有湘菜
  searchAllZiang() {
    wx.request({
      url: BASE_URL+"/Xiang/dishes",
      method: "GET",
      success: (res) => {
        console.log(res.data.data);
        this.setData({
          Alldishes: res.data.data
        })
      }
    })
  },
  add1() {
    this.setData({
      adddata: this.data.adddata + 1
    })
  },
  inputChange(e) {
    console.log(e.detail.value);
    this.setData({
      inputValue: e.detail.value
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