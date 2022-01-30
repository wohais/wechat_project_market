// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartlist:[],
    al_py:[],
    allchecked:false,
    checked:"",
    i:0,
    sum:0,
    openid:"",
    num:1
  },
  TimeId:-1,
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
    var that = this
    wx.cloud.callFunction({
      name:'openid',
      success:res=>{
        that.setData({
          openid:res.result.openid
        })
        console.log(this.data.openid)
        const db = wx.cloud.database()
        db.collection('carts').where({
          _openid:this.data.openid
        }).get({
          success:res=>{
            that.setData({
              cartlist:res.data
            })
            console.log(res.data)
            that.setData({
              allchecked:this.data.cartlist.every(v=>v.checked)
            })
            console.log(this.data.allchecked)
            console.log(res.data)
            console.log(res.data.length)
            for(var i = res.data.length-1;i >= 0 ;i--){
              if(res.data[i].checked == false){
                res.data.splice(i,1)
              }
            }
            console.log(res.data)
            this.data.sum = 0;
            for(var i = res.data.length-1; i >= 0;i--){
              this.data.sum += res.data[i].good_price*res.data[i].good_num;
            }
            console.log(this.data.sum)
            that.setData({
              sum:this.data.sum
            })
          }
        })
      }
    })
  },
  handItemchange(e){
    const good_id = e.currentTarget.dataset.id
    console.log(good_id)
    console.log(this.data.openid)
    var that = this
    const db = wx.cloud.database()
    db.collection('carts').where({
      good_id:good_id
    }).get({
      success:res=>{
        that.setData({
          checked:res.data[0].checked
        })
        this.data.checked=!this.data.checked
        db.collection('carts').where({
          good_id:good_id
        }).update({
          data:{
            checked:this.data.checked
          },
          success:res=>{
            console.log(res.data)
            console.log(this.data.checked)
            db.collection('carts').where({
              _openid:this.data.openid
            }).get({
              success:res => {
                that.setData({
                  cartlist:res.data,
                })
                that.setData({
                  allchecked:this.data.cartlist.every(v=>v.checked)
                })
                console.log(this.data.allchecked)
                console.log(res.data)
                console.log(res.data.length)
                for(var i = res.data.length-1;i >= 0 ;i--){
                  if(res.data[i].checked == false){
                    res.data.splice(i,1)
                  }
                }
                console.log(res.data)
                this.data.sum = 0;
                for(var i = res.data.length-1; i >= 0;i--){
                  this.data.sum += res.data[i].good_price*res.data[i].good_num;
                }
                console.log(this.data.sum)
                that.setData({
                  sum:this.data.sum
                })
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
    db.collection('carts').where({
      checked : !this.data.allchecked
    }).update({
      data:{
        checked:this.data.allchecked
      },
      success:res =>{
        console.log(res.data)
        db.collection('carts').where({
          _openid:this.data.openid
        }).get({
          success:res => {
            that.setData({
              cartlist:res.data,
            })
            that.setData({
              allchecked:this.data.cartlist.every(v=>v.checked)
            })
            console.log(this.data.allchecked)
            console.log(res.data)
            console.log(res.data.length)
            for(var i = res.data.length-1;i >= 0 ;i--){
              if(res.data[i].checked == false){
                res.data.splice(i,1)
              }
            }
            console.log(res.data)
            this.data.sum = 0;
            for(var i = res.data.length-1; i >= 0;i--){
              this.data.sum += res.data[i].good_price*res.data[i].good_num;
            }
            console.log(this.data.sum)
            that.setData({
              sum:this.data.sum
            })
          }
        })
      }
    })
  },

      /* 点击减号 */
      bindMinus: function (e) {
        var num = e.currentTarget.dataset.num
        this.data.openid = e.currentTarget.dataset.openid
        var good_id  = e.currentTarget.dataset.id
        const db = wx.cloud.database()
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
        clearTimeout(this.TimeId);
        this.TimeId = setTimeout(()=>{
          db.collection('carts').where({
            good_id:good_id,
            _openid:this.data.openid
        }).update({
          data:{
            good_num:this.data.num
          },
          success:res=>(
            console.log(res.data)
          )
        })
        this.onShow()
        },700);
      },
      /* 点击加号 */
      bindPlus: function (e) {
        var num = e.currentTarget.dataset.num
        this.data.openid = e.currentTarget.dataset.openid
        var good_id  = e.currentTarget.dataset.id
        const db = wx.cloud.database()
        // 不作过多考虑自增1  
        num++;
        // 只有大于一件的时候，才能normal状态，否则disable状态  
        var minusStatus = num < 1 ? 'disabled' : 'normal';
        // 将数值与状态写回  
        this.setData({
          num: num,
          minusStatus: minusStatus
        });
        clearTimeout(this.TimeId);
        this.TimeId = setTimeout(()=>{
          db.collection('carts').where({
              good_id:good_id,
              _openid:this.data.openid
          }).update({
            data:{
              good_num:this.data.num
            },
            success:res=>(
              console.log(res.data)
            )
          })
          this.onShow()
        },700);
      },    

  delete_good(){
    var that = this
    const db = wx.cloud.database()
    db.collection('carts').where({
      checked:true,
      _openid:this.data.openid
    }).get({
      success:res=>{
        for(var i = 0;i < res.data.length;i++){
          db.collection('carts').where({
            checked:true,
            _openid:this.data.openid
          }).remove()
        }
      }
    })
    this.onShow()
  },

  buy_now(){
    console.log(this.data.cartlist)
    console.log(this.data.sum)
    let data = JSON.stringify(this.data.cartlist)
    wx.navigateTo({
      url: '/pages/pay_money/pay_money?good_detail='+ data + '&sum=' + this.data.sum,
    })
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