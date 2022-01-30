// pages/collection/collection.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectionlist:[],
    allchecked:false,
    checked:"",
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
          db.collection('collections').where({
            _openid:this.data.openid
          }).get({
            success:res=>{
              that.setData({
                collectionlist:res.data
              })
              console.log(res.data)
              that.setData({
                allchecked:this.data.collectionlist.every(v=>v.checked)
              })
              console.log(this.data.allchecked)
              console.log(res.data)
              console.log(res.data.length)
              for(var i = res.data.length-1;i >= 0 ;i--){
                if(res.data[i].checked == false){
                  res.data.splice(i,1)
                }
              }
            }
          })
        }
      })
    }
  },
  handItemchange(e){
    const good_id = e.currentTarget.dataset.id
    console.log(good_id)
    console.log(this.data.openid)
    var that = this
    const db = wx.cloud.database()
    db.collection('collections').where({
      good_id:good_id
    }).get({
      success:res=>{
        that.setData({
          checked:res.data[0].checked
        })
        this.data.checked=!this.data.checked
        db.collection('collections').where({
          good_id:good_id
        }).update({
          data:{
            checked:this.data.checked
          },
          success:res=>{
            console.log(res.data)
            console.log(this.data.checked)
            db.collection('collections').where({
              _openid:this.data.openid
            }).get({
              success:res => {
                that.setData({
                  collectionlist:res.data,
                })
                that.setData({
                  allchecked:this.data.collectionlist.every(v=>v.checked)
                })
                console.log(this.data.allchecked)
                console.log(res.data)
                console.log(res.data.length)
                for(var i = res.data.length-1;i >= 0 ;i--){
                  if(res.data[i].checked == false){
                    res.data.splice(i,1)
                  }
                }
              }
            })
          }
        })
      }
    })
  },
  handleItemAllCheck(){
    var that = this
    this.data.allchecked = !this.data.allchecked;
    console.log(this.data.allchecked)
    const db = wx.cloud.database()
    db.collection('collections').where({
      checked : !this.data.allchecked
    }).update({
      data:{
        checked:this.data.allchecked
      },
      success:res =>{
        console.log(res.data)
        db.collection('collections').where({
          _openid:this.data.openid
        }).get({
          success:res => {
            that.setData({
              collectionlist:res.data,
            })
            that.setData({
              allchecked:this.data.collectionlist.every(v=>v.checked)
            })
            console.log(this.data.allchecked)
            console.log(res.data)
            console.log(res.data.length)
            for(var i = res.data.length-1;i >= 0 ;i--){
              if(res.data[i].checked == false){
                res.data.splice(i,1)
              }
            }
          }
        })
      }
    })
  },
  delete_good(){
    var that = this
    const db = wx.cloud.database()
    db.collection('collections').where({
      checked:true,
      _openid:this.data.openid
    }).get({
      success:res=>{
        for(var i = 0;i < res.data.length;i++){
          db.collection('collections').where({
            checked:true,
            _openid:this.data.openid
          }).remove()
        }
      }
    })
    this.onShow()
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