// miniprogram/pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    menu_list:[],
    goods_list:[],
    search_goods:[],
    currentIndex:0
  },
  TimeId:-1,
  handleInput(e){
    const {value} =e.detail;
    if(!value.trim()){
      this.setData({
        search_goods:[]
      })
      return;
    }
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(()=>{
      this.qsearch(value);
    },700);
  },
  async qsearch(query){
    var that = this
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('goods').where(_.or([{
      good_name:db.RegExp({
        regexp:'.*'+query,
        options:'i',
      })
    }])).get({
      success:res => {
        console.log(res)
        that.setData({
          search_goods:res.data
        })
      }
    })
    },
  handleItemTap(e){
    const {index} = e.currentTarget.dataset;
    this.setData({
      currentIndex:index
    })
    if(index==0){
      const GoodList = wx.getStorageSync('goodlist');
      if(new Date().getTime()-GoodList.time >1000*300){
        this.getList()
      }else{
        this.setData({
          goods_list:GoodList.data
        })
        return;
      }
    }
    var that = this
    const db = wx.cloud.database()
    db.collection('goods').where({
      menu_id:this.data.menu_list[index]._id
    }).count().then(data=>{
      const batchTimes = Math.ceil(data.total / 20)
      let arraypro = []
      let x = 0
      for(let i = 0;i < batchTimes;i++){
        db.collection('goods').where({
          menu_id:this.data.menu_list[index]._id
        }).get({
          success:res=>{
            x += 1 
            for(let j = 0 ;j <res.data.length;j++){
              arraypro.push(res.data[j])
            }
            if(x == batchTimes){
              this.setData({goods_list:arraypro})
            }
          }
        })
      }
    })
  },
  getList(){
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function(){
      wx.hideLoading()
    },1000)
    const db = wx.cloud.database()
    db.collection('left_menu').count().then(data_menu=>{
      db.collection('goods').count().then(data_goods=>{
        const batchTimes_menu = Math.ceil(data_menu.total/20)
        const batchTimes_goods = Math.ceil(data_goods.total /20)
        let arraypro =[]
        let x =0
        for(let i =0;i < batchTimes_menu;i++){
          db.collection('left_menu').skip(i*20).get({
            success:res=>{
              x += 1
              for(let j = 0;j < res.data.length;j++){
                arraypro.push(res.data[j])
              }
              if(x == batchTimes_menu){
                that.setData({menu_list:arraypro})
                wx.setStorageSync('menulist', {time:new Date().getTime(),data:res.data})
              }
            }
          })
        }
        let arraymax = []
        let y =0
        for(let i = 0;i < batchTimes_goods;i++){
          db.collection('goods').skip(i*20).get({
            success:res=>{
              y += 1
              for(let j = 0; j < res.data.length; j++){
                arraymax.push(res.data[j])
              }
              if(y == batchTimes_goods){
                that.setData({goods_list:arraymax})
                wx.setStorageSync('goodlist', {time:new Date().getTime(),data:res.data})
              }
            }
          })
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const GoodList = wx.getStorageSync('goodlist');
    const MenuList = wx.getStorageSync('menulist');
    if(!GoodList || !MenuList){
      this.getList()
    }
    else{
      if(new Date().getTime()-GoodList.time >1000*300){
        this.getList()
      }else{
        this.setData({
          menu_list:MenuList.data,
          goods_list:GoodList.data
        })
      }
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