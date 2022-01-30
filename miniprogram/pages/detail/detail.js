// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    good_detail:[],
    openid:"",
    showModalStatus_cart: false,
    showModalStatus_buy: false,
    standard:'正常',
    num:1,
    sum:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    const {_id} = options
    console.log(_id);
    const db = wx.cloud.database()
    db.collection('goods').doc(_id).get({
      success:res=>{
        console.log(res.data)
        that.setData({
          good_detail:res.data
        })    
      }
    })  
    wx.cloud.callFunction({
      name:'openid',
      success:res=>{
        that.setData({
          openid:res.result.openid
        })
        console.log(res.result.openid)
      }
    }) 
  },
  handleAddcart(){
    var that = this
    const db = wx.cloud.database()
    db.collection('carts').where({
      good_id:this.data.good_detail._id,
      _openid:this.data.openid
    }).get({
      success:res=>{
        if(res.data.length == 0){
          console.log("不存在")
          db.collection('carts').add({
            data:{
              good_id:this.data.good_detail._id,
              good_name:this.data.good_detail.good_name,
              good_image:this.data.good_detail.good_image,
              good_price:this.data.good_detail.good_price,
              unit:this.data.good_detail.unit,
              good_num:this.data.num,
              checked:false
            }
          }).then(res=>{
            console.log(res.data)
          })
          wx.showToast({
            title: '添加成功',
            icon:'success',
            mask:true,
          })
        }
        else{
          console.log("已存在")
          wx.showToast({
            title: '已添加至购物车',
            icon:'success',
            mask:true,
          })
        }
      }
    })
        // 隐藏遮罩层
        var animation = wx.createAnimation({
          duration: 200,
          timingFunction: "linear",
          delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
          animationData: animation.export(),
        })
        setTimeout(function () {
          animation.translateY(0).step()
          this.setData({
            animationData: animation.export(),
            showModalStatus_cart: false
          })
        }.bind(this), 200)
  },
  handleCollection(){
    var that = this
    const db = wx.cloud.database()
    db.collection('collections').where({
      good_id:this.data.good_detail._id,
      _openid:this.data.openid
    }).get({
      success:res=>{
        if(res.data.length == 0){
          db.collection('collections').add({
            data:{
              good_id:this.data.good_detail._id,
              good_name:this.data.good_detail.good_name,
              good_image:this.data.good_detail.good_image,
              good_price:this.data.good_detail.good_price,
              unit:this.data.good_detail.unit,
              checked:false
            }
          }).then(res => {
          })
          wx.showToast({
            title: '添加成功',
            icon:'success',
            mask:true,
          })
        }
        else{
          wx.showToast({
            title: '已添加',
            icon:'error',
            mask:true,
          })
        }
      }
    })
  },
    /* 点击减号 */
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function () {
    var num = this.data.num;
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
 
  //显示对话框
  showModal_cart: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus_cart: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal_cart: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus_cart: false
      })
    }.bind(this), 200)
  },
    //显示对话框
    showModal_buy: function () {
      // 显示遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus_buy: true
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
    },
    //隐藏对话框
    hideModal_buy: function () {
      // 隐藏遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export(),
          showModalStatus_buy: false
        })
      }.bind(this), 200)
      this.data.sum = this.data.good_detail.good_price*this.data.num
      this.setData({
        "good_detail.good_num":this.data.num
      })
      let data = JSON.stringify(this.data.good_detail)
      console.log(data)
      wx.navigateTo({
        url: '/pages/pay_money_b/pay_money_b?good_detail='+data+'&sum='+this.data.sum,
      })
    },

    hideModal_buy_img: function () {
      // 隐藏遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export(),
          showModalStatus_buy: false
        })
      }.bind(this), 200)
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