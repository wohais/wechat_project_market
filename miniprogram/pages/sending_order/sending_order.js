// pages/sending_order/sending_order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sending_orderlist:[],
    i:0,
    openid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    const userinfo = wx.getStorageSync('userinfo')
    if(!userinfo){
      wx.showToast({
        title: '请先登录',
        icon:'error',
        mask:true,
      })
      return;
    }
    else{
      var that = this
      wx.cloud.callFunction({
        name:'openid',
        success:res=>{
          that.setData({
            openid:res.result.openid
          })
          console.log(this.data.openid)
          const db = wx.cloud.database()
          db.collection('order').where({
            _openid:this.data.openid,
            status:1
          }).get({
            success:res=>{
              that.setData({
                sending_orderlist:res.data.reverse()
              })
              console.log(this.data.sending_orderlist)
            }
          })
        }
      })
    }
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