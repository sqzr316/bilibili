//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
  // 组件所需的参数
  userInfo: {},
  userdb: {},
  hasUserInfo: false,
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '哔哩哔哩', //导航栏 中间的标题
    },

    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20 ,   
    
     
  },
  onLoad(options) {
    // console.log(this.data.height)
        if (app.globalData.userInfo) {
          this.setData({
            userInfo: app.globalData.userInfo,
            hasUserInfo: true
          })
        } else {
          app.userInfoReadyCallback = res =>{
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        }
  },

 /**
   * 用户登陆
   */

  getUserProfile: function(e) {
    //   console.log("用户登录方法")
    var that = this
    wx.getUserProfile({
      desc: '获取用户资料',
      success: (res) => {
        // console.log(res.userInfo)
        // console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        app.globalData.hasUserInfo = true;
        this.getHistory()
        // wx.setStorageSync({
        //     key: 'hasUserInfo',
        //     data: this.data.hasUserInfo
        // })

        wx.getStorageSync({
            key: "openid",
            success: res => {
                this.setData({
                    ['userdb.openid']: res.data,
                })
                app.globalData.openid = res.data
                console.log("openid:")
                console.log(app.globalData.openid )
                // console.log(this.data.userdb)
            }
            
        })
        /**
         * 向数据库中查询用户信息，有则查询，无则添加一条记录
         */
        db.collection("user").where({
            openid: this.data.userdb.openid
        }).get().then(res => {
            if (res.data.length == 0) {
                // 插入该用户数据
                var param =  {
                  openid: this.data.userdb.openid,
                  coins: 10,
                  isLogin: true,
                  favor: [],
                  zan: [],
                  guanzhu: [],
                  history: []
              };
                db.collection("user").add({
                    data: param
                })
                that.setData({
                  userdb: param
              })
            } else {
              // 获取用户数据
              that.setData({
                  userdb: res.data[0]
              })
              // console.log(that.data.userdb)
            }
            app.globalData.userdb = this.data.userdb;
            // console.log("app data:")
            // console.log(app.globalData.userdb)
        })
      }
    })
  }, 

  /**
   *  跳转意见反馈页面
   * @param {*} e 
   */
  toFeedback(e) {
    wx.navigateTo({
      url: '../../pages/feedback/feedback',
    })
  },

  /**
   * 获取唯一的openid
   * @param {*} e 
   */

//    getOpenid(e) {
//        wx.request({
//          url: 'http://127.0.0.1:3000/getOpenid',
//          success: res => {
//             console.log(res)
//          }
//        })
//    },
  

  bindGetUserInfo: function(e) {
    // console.log(e)
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
  },

  /**
   * 获取历史记录
   */
  getHistory(e) {
    //   if (app.globalData.history.length == 0) {
    //       wx.showToast({
    //         title: '您还没有观看记录~',
    //         icon: 'none'
    //       })
    //       return
    //   }
    // wx.getStorage({
    //     key: 'hasUserInfo',
    //     success: res => {
    //         console.log("查询hasUserInfo" + res.data)
    var hasUserInfo = app.globalData.hasUserInfo;
    var that = this;
            if (hasUserInfo) {
                // 用户登录
                // 将本地数据导入到数据库中 从数据库中 插入数据
                // console.log("")
                db.collection('user').where({
                    openid: this.data.userdb.openid
                }).get().then(res => {
                    // console.log(res) 合并本地 数据库 历史记录
                    // console.log("user界面点击历史记录：")
                    // console.log(res)
                    var historydb = res.data[0].history;
                    // console.log(historydb)
                    var localHistory = app.globalData.history;
                    // console.log(localHistory)
                    // var myHistory = []
                    historydb.forEach(element => {
                        localHistory.push(element);
                    });
                    // console.log(localHistory)
                    localHistory = app.quchong(localHistory)
                    app.globalData.history = localHistory;
                    // 更新数据库中数据
                    db.collection("user").where({
                        openid: that.data.userdb.openid
                    }).update({
                        data: {
                            history: localHistory
                        },
                        // success: res => {
                        //      console.log("更新成功")
                        // }
                    })
                    
                    // wx.getStorageSync({
                    //     key: 'history',
                    //     success: res => {
                    //       var history = res.data;
                    //       history.concat(historydb);
                    //       wx.setStorageSync({
                    //         key: 'history',
                    //         data: history
                    //       })
                    //     },
                    //     fail: res => {
                    //       wx.setStorageSync({
                    //         key: 'history',
                    //         data: historydb
                    //       })
                    //     }
                    //   })
                })
                // 已经获取历史记录 存放到了本地缓存中 key: history
            // } else {
                // 用户未登录
                // 直接显示已经存好的数据就行
            // }
        }
    // })

    
  },

  /**
   * 跳转历史记录页面
   */
  toHistory(e) {
    wx.navigateTo({
      url: '../../pages/history/history',
    })
  },
  /**
   * 退出
   */
  logout() {
    app.globalData.hasUserInfo = false;
      this.setData({
          hasUserInfo: false,
          userInfo: {},
          userdb: {}
      })
      // console.log("退出：" + app.globalData.history)
  }
//   isfocus() {
//       console.log(123)
//   }
})
