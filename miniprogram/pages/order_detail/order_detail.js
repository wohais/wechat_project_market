// pages/order_detail/order_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id:"",
    good_detail:[],
    user_address:[],
    order_detail:[],
    show_item:false,
    freight:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.order_id = options.order_id
    const db = wx.cloud.database()
    db.collection('order').doc(this.data.order_id).get({
      success:res=>{
        this.setData({
          order_detail:res.data,
          good_detail:JSON.parse(res.data.good_detail),
          user_address:JSON.parse(res.data.user_address)
        })
        if(!this.data.good_detail.length){
          return
        }
        else{
          this.setData({show_item:true})
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})