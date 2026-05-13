// index.js
import {
  BASE_URL
} from "../../utils/util.js";
import request from "../../utils/request.js";
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    shopStatus: 0, // 默认值，等接口返回,0:营业中，1:打烊
    // 左侧菜单栏分类列表
    categoryList: [{
        id: 1,
        name: '🔥\n川菜'
      },
      {
        id: 2,
        name: '🌶️\n湘菜'
      },
      {
        id: 3,
        name: '🍲\n鲁菜'
      },
      {
        id: 4,
        name: '🍚\n主食'
      }
    ],
    // 2. 记录当前选中的分类 id，默认选中第一个（热销）
    activeCateId: 1,
    // 定义所有的菜品集合
    AllDishes: [],
    // 定义集合当作购物车，包括总价格,单个菜品
    cart: [],
    dish: {
      id: null,
      name: null,
      price: null,
      detail: null,
      image: null,
      category: null
    },
    cart_total_price: 0,
    /*单位:分 */
    // 定义购物车菜品数量集合，键值对 id:count
    dishid_counts: {},
    // 定义购物车详情，是否展开
    showCartDetail: false,
  },
  // 切换购物车详情
  toggleCartDetail() {
    this.setData({
      showCartDetail: !this.data.showCartDetail
    })
  },


  // 左侧分类表的处理逻辑
  selectCate(e) {
    // 从点击的元素里拿到 data-id
    const cateId = e.currentTarget.dataset.id;
    // 更新 data 里的 activeCateId
    this.setData({
      activeCateId: cateId
    });
    // 这里可以加你点击后要做的事，比如过滤菜品列表
    // TODO
    console.log('当前选中分类id:', cateId);
  },
  // 获取所有菜品集合
  async GetAllDishes() {
    console.log("查询全部菜品")
    let res = await request({
      url: "/WxUser/All/dishes",
      method: "GET"
    });
    console.log(res.data);
    this.setData({
      AllDishes: res.data
    })
  },
  // 获取店铺营业状态
  async getShopStatus() {
    console.log("查询店铺状态")
    const res = await request({
      url: "/Statue/query",
      method: "GET"
    })
    // 后端返回 data 是 0 或 1
    this.setData({
      shopStatus: res.data
    })
  },
  // 点击加入购物车
  onAddCart(e) {
    console.log("加入购物车");
    // 取出菜品对象
    const dish = e.currentTarget.dataset.dish;

    // 新建菜品对象
    const newDish = {
      id: dish.id,
      name: dish.name,
      price: dish.price,
      detail: dish.detail,
      image: dish.image,
      category: dish.category
    };
    //push兼容写法
    let cart = this.data.cart;
    cart.push(newDish);
    this.setData({
      cart: cart,
      // 也可用 toFixed，但会返回字符串，需要转回数字（若不介意后续做字符串拼接也可以）
      cart_total_price: parseFloat((this.data.cart_total_price + dish.price).toFixed(2))
    });
    // 更新购物车菜品数量集合
    this.updateDishCounts(dish.id, 1);
    console.log(this.data.dishid_counts);
    console.log(this.data.cart);
  },
  // 更新数量 delta=1加 / -1减
  updateDishCounts(dishId, delta) {
    let obj = this.data.dishid_counts;

    // 已有就累加，没有就初始1
    if (obj[dishId]) {
      obj[dishId] += delta;
      // 数量为0直接删掉key
      if (obj[dishId] <= 0) {
        delete obj[dishId];
      }
    } else {
      if (delta > 0) {
        obj[dishId] = 1;
      }
    }
    this.setData({
      dishid_counts: obj
    });
  },
  // 减少购物车数量
  onMinCart(e) {
    // 首先判断数量如果是0,直接返回
    if (this.getDishCount(e.currentTarget.dataset.dish.id) === 0) {
      return;
    }
    console.log("减少购物车");
    const dish = e.currentTarget.dataset.dish;

    // 1. 从购物车明细cart中，删掉同id第一条
    let cart = this.data.cart;
    // 找到第一个相同id的下标
    let index = cart.findIndex(item => item.id === dish.id);
    if (index !== -1) {
      cart.splice(index, 1);
    }

    // 2. 扣总价
    this.setData({
      cart: cart,
      // 也可用 toFixed，但会返回字符串，需要转回数字（若不介意后续做字符串拼接也可以）
      cart_total_price: parseFloat((this.data.cart_total_price - dish.price).toFixed(2))
    });

    // 3. 更新数量集合 减1
    this.updateDishCounts(dish.id, -1);
    console.log(this.data.dishid_counts);
    console.log(this.data.cart);
  },





  // 根据菜品id 获取数量，没有返回0
  getDishCount(dishId) {
    let obj = this.data.dishid_counts;
    // 有值就返回，没有返回0
    let num = obj[dishId] || 0;
    console.log("当前菜品数量：", num);
    return num;
  },



















  onLoad() {
    // 查询所有菜品
    this.GetAllDishes()
    this.getShopStatus()
  },

  // 刷新
  onPullDownRefresh() {
    this.GetAllDishes()
    this.getShopStatus()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1500)
  }
})