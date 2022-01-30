// pages/all_order/all_order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    all_orderlist:[],
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
            _openid:this.data.openid
          }).count().then(data=>{
            const batchTimes = Math.ceil(data.total / 20)
            let arraypro = []
            let x = 0
            for(let i = 0 ; i < batchTimes ;i++){
              db.collection('order').where({
                _openid:this.data.openid
              }).get({
                success:res=>{
                  x += 1
                  for(let j = 0;j < res.data.length;j++){
                    arraypro.push(res.data[j])
                  }
                  if(x == batchTimes){
                    this.setData({all_orderlist:arraypro.reverse()})
                  }
                }
              })
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