// pages/pay_money_b/pay_money_b.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:"",
    good_detail:[],
    sum:0,
    freight:0,
    num:0,
    tips:"",
    address:[],
    show_tip:true,
    max:50
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      good_detail:JSON.parse(options.good_detail),
      sum:JSON.parse(options.sum)
    })
  },

  inputs: function (e) {
    // 获取输入框的内容
    this.data.value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(this.data.value.length);
    //最多字数限制
    if (len > this.data.max)
    return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
     tips : this.data.value //当前字数
    });
  },

  handleAddress(){
    wx.chooseAddress({
      success: (result) => {
        console.log(result)
        this.setData({
          address:result,
          show_tip:false
        })
      },
    })
  },

  pay_now(){
    if(this.data.address.length==0 || this.data.good_detail.length==0){
      wx.showToast({
        title: '缺少地址/商品',
        icon:'error',
      })
    }
    else{
      this.setData({num:this.data.good_detail.good_num})
      this.data.good_detail = JSON.stringify(this.data.good_detail)
      this.data.address = JSON.stringify(this.data.address)
      console.log(this.data.good_detail)
      console.log(this.data.address)
      const db = wx.cloud.database()
      db.collection('order').add({
        data:{
          good_detail:this.data.good_detail,
          user_address:this.data.address,
          order_sum:this.data.sum,
          order_time:new Date().toLocaleString(),
          order_areas:this.data.value,
          order_num:this.data.num,
          status:0
        }
      }).then(res=>{
        wx.navigateBack()
      })
    }
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