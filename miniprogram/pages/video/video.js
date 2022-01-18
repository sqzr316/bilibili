//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()

function getRandomColor () {
  const rgb = []
  for (let i = 0 ; i < 3; ++i){
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

Page({
  data: {
  // 组件所需的参数
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '哔哩哔哩', //导航栏 中间的标题
    },
    curVideoDetail: null,

    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20 ,   

    guanzhu: false,
    zan: false,
    videoArr: [],
    page: 1,
    totalCount: 0, //数据总数

    danmuList: [{
      text: '测试弹幕',
      color: getRandomColor()
    }],
    inputValue: '',
    curVideoTime: 0,

    favor: false, // 收藏
    openid: '',
    userdb: {}
    
     
  },
  /**
   * 发送弹幕用的方法
   * @param {*} res 
   */
  videoContext: null,
  videoTimeUpdate(e) {
    this.setData({
      curVideoTime: e.detail.currentTime
    })
  },
  bindSendDanmu: function (e) {
    // console.log(this.data.inputValue)
    this.videoContext.sendDanmu({
      text: this.data.inputValue,
      color: getRandomColor(),
    })
    // 与数据库的交互
    var vid = e.currentTarget.dataset.vid;
    db.collection("danmu").add({
      data: {
        text: this.data.inputValue,
        color: getRandomColor(),
        time: parseInt(this.data.curVideoTime),
        vid: vid,
      }
    })
    /**
     * 更新对应的视频数据
     */
    var param = this.data.curVideoDetail.data;
    param.stat.danmaku = Number(this.data.curVideoDetail.data.stat.danmaku) + 1;
    // console.log(param)
    db.collection("video").doc(this.data.curVideoDetail._id).update({
      data: {
        ['data.stat']: param.stat
      },
      success: res => {
        // console.log("更新成功")
      }
    })
    this.setData({
      inputValue: ''
    })
    // console.log(this.data.danmuList)
  },
  bindPlay: function() {
    this.videoContext.play()
  },
  bindPause: function() {
    this.videoContext.pause()
  },
  videoErrorCallback: function(e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
  },
  onLoad(options) {
    // console.log("options" + options)
    // let paramsData = decodeURIComponent(option.data);

    var curVideoDetail= JSON.parse(decodeURIComponent(options.curVideoDetail));
    this.setData({
      curVideoDetail: curVideoDetail
    })
    this.getVideoList()

    this.getDanmuList()

    this.updateView()

    this.getOpenid()

    this.getUserdb()

  },

  /**
   * 根据hasUserInfo 设置初始状态
   */
  checkHasUserInfo() {
    // console.log()
    if (app.globalData.hasUserInfo == false) {
      this.setData({
        zan: false,
        guanzhu: false,
        favor: false
      })
    }
  },

  /**
   *  根据userdb获取当前视频的收藏 点赞 关注状态
   * @param {*} e 
   */
  getStatus(e) {
     // 根据userdb内容 指定收藏点赞关注状态
     var userdb = this.data.userdb;
    //  console.log(this.data.userdb)
     var favorList = userdb.favor;
     var zanList = userdb.zan;
     var guanzhuList = userdb.guanzhu;
    //  console.log(guanzhuList)
     for (var i = 0; i < favorList.length; i++) {
       if (favorList[i] === this.data.curVideoDetail._id) {
         this.setData({
           favor: true
         })
         break;
       }
     }
     for (var i = 0; i < favorList.length; i++) {
      if (zanList[i] === this.data.curVideoDetail._id) {
        this.setData({
          zan: true
        })
        break;
      }
    }
    for (var i = 0; i < guanzhuList.length; i++) {
      if (guanzhuList[i] === this.data.curVideoDetail.data.owner.name) {
        this.setData({
          guanzhu: true
        })
        break;
      }
    }

    this.checkHasUserInfo()
  },

  /**
   * 获取openid
   * @param {}} e 
   */
  getOpenid(e) {
    if (this.data.openid === '') {
      var openid = wx.getStorageSync('openid')
      this.setData({
        openid: openid
      })
    }
  },

  /**
   * 获取用户数据
   * @param {*} e 
   */
  getUserdb(e) {
    db.collection("user").where({
      openid: this.data.openid
    }).get({
      success: res => {
        // console.log(res)
        this.setData({
          userdb: res.data[0]
        })
        // console.log("getUserdb")
        // console.log(this.data.userdb)
        this.getStatus()
      }
    })
  },

  onReady: function(e) {
    this.videoContext = wx.createVideoContext('myVideo')
  },

  /**
   *  获取弹幕列表
   * @param {*} e 
   */
  getDanmuList(e) {
    db.collection("danmu").where({
      vid: this.data.curVideoDetail._id
    }).get().then(res => {
      // console.log(res.data)
      this.setData({
        danmuList: res.data
      })
      // console.log(this.data.danmuList)
    })
  },

   /**
   * 获取video列表，通过接口获取详细信息
   */
  getVideoList() {
    db.collection("video").orderBy('_id', 'desc').skip(0).limit(10).get().then(res => {
      // console.log(res)
      // console.log(res.data)
      // app.globalData.videoArr = res.data
      this.setData({
        videoArr: res.data
      })
    })
  },

  /**
   * 修改关注状态
   * @param {*} e 
   */
  guanzhu: function(e) {
    var hasUserInfo = app.globalData.hasUserInfo;
    // console.log(hasUserInfo)
    if (!hasUserInfo) {
      wx.showToast({
        title: '您还未登录~',
        icon: 'error'
      })
      return;
    }
    var that = this;
    var userdb = this.data.userdb;
    var guanzhuList = userdb.guanzhu;
    if (!this.data.guanzhu) {
      this.setData({
        guanzhu: !this.data.guanzhu
      })
      /**
       * 更新关注列表
       */
      guanzhuList.push(this.data.curVideoDetail.data.owner.name);
      db.collection("user").where({
        openid: this.data.openid
      }).update({
        data: {
          guanzhu: guanzhuList
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '确定要取消关注吗？',
        success: function (e) {
          if (e.confirm) {
            that.setData({
              guanzhu: !that.data.guanzhu
            })
            /**
             * 更新关注列表
             */
              var delIndex = 0;
              for (var i = 0; i < guanzhuList.length; i++) {
                // console.log(guanzhuList[i])
                if (guanzhuList[i] === that.data.curVideoDetail.data.owner.name) {
                  delIndex = i;
                  break;
                }
              }
              guanzhuList.splice(delIndex, 1);
              // console.log(guanzhuList)
              db.collection("user").where({
                openid: that.data.openid
              }).update({
                data: {
                  guanzhu: guanzhuList
                }
              })
            } else if (e.cancel) {
              console.log('用户点击取消')
            }
          }
        })
    }
    
  },

  /**
   * 修改赞状态
   * @param {*} e 
   */
  zan(e) {
    var hasUserInfo = app.globalData.hasUserInfo;
    // console.log(hasUserInfo)
    if (!hasUserInfo) {
      wx.showToast({
        title: '您还未登录~',
        icon: 'error'
      })
      return;
    }
    this.setData({
      zan: !this.data.zan
    })
    
    var userdb = this.data.userdb;
    var zanList = userdb.zan;
    if (this.data.zan) {
      /**
       * 更新user表 添加favor记录
       */
      zanList.push(this.data.curVideoDetail._id)
    }
    if (!this.data.zan) {
      wx.showToast({
        title: '已取消点赞~',
        icon: 'none'
      })
      /**
       * 更新user表 删除favor记录
       */
      // 遍历 查找 删除 更新
      var delIndex = 0;
      for (var i = 0; i < zanList.length; i++) {
        if (zanList[i] === this.data.curVideoDetail._id) {
          delIndex = i;
          break;
        }
      }
      zanList.splice(delIndex, 1);
      // 更新
    }
    db.collection("user").where({
      openid: this.data.openid
    }).update({
      data: {
        zan: zanList
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let page = this.data.page;
    // if (this.data.feeds.length < this.data.totalCount) {
      db.collection('video').orderBy('_id', 'desc').skip(page * 10)
        .limit(10)
        .get({
          success: res => {
            let videoArr = this.data.videoArr;
            for (let i = 0; i < res.data.length; i++) {
              videoArr.push(res.data[i]);
            }
            this.setData({
              videoArr: videoArr,
              page: page + 1
            })
          },
          fail: err => {
            console.log('[数据库] [查询记录] 失败：');
          }
        })
  },

  /**
   * 发送弹幕 插入数据库
   * @param {*} e 
   */
  powerDrawer(e) {
    // console.log(e.currentTarget.dataset.vid)
    // console.log(e)
    
  },

  /**
   * 获取input内容
   * @param {} e 
   */
  getInputValue(e) {
    // console.log(e.detail.value)
    this.data.inputValue = e.detail.value
  },

  /**
   * 跳转播放视频
   * @param {*} e 
   */
  getVideo(e) {
    // console.log(e)
    var index = e.currentTarget.dataset.idx;
    // 存放index到历史记录列表中， 从global中通过index查询数据。
    var his = app.globalData.history;
    his.push(index)
    his = app.quchong(his)
    app.globalData.history = his
    // console.log("主页：")
    // console.log(app.globalData.history)
    var curVideoDetail = JSON.stringify(this.data.videoArr[index])
    // console.log(index)

    // temp index
    // var index = 1;
    // console.log(this.data.videoArr[index])

    // wx.getStorageSync({
    //   key: 'history',
    //   success: res => {
    //     console.log('获取缓存历史记录')
    //     // console.log(res)
    //     var history = res.data;
    //     history.push(curVideoDetail);
    //     console.log(history)
    //     wx.setStorageSync({
    //       key: 'history',
    //       data: history
    //     })
    //     wx.getStorageSync({
    //       key: 'history',
    //       success: res => {
    //         console.log("主页点击视频后，set进入历史记录，查看历史记录" + res)
    //       }
    //     })
    //   },
    //   fail: res => {
    //     console.log('获取缓存历史记录-失败')
    //     wx.setStorageSync({
    //       key: 'history',
    //       data: [curVideoDetail]
    //     })
    //   }
    // })


    wx.navigateTo({
      url: '../../pages/video/video?curVideoDetail=' + encodeURIComponent(curVideoDetail),
    })
  },

  /**
   * 更新播放量
   * @param {*} e 
   */
  updateView(e) {
    var param = this.data.curVideoDetail.data;
    param.stat.view = Number(this.data.curVideoDetail.data.stat.view) + 1;
    // console.log(param)
  db.collection('video')
  .doc(this.data.curVideoDetail._id)
  .update({
    data: {
      ['data.stat']: param.stat
    },
    // success: res => {
    //   console.log("播放量更新成功")
    // }
  })
},

  /**
   * 更新收藏
   * @param {*} e 
   */
  favor(e) {
    var hasUserInfo = app.globalData.hasUserInfo;
    // console.log(hasUserInfo)
    if (!hasUserInfo) {
      wx.showToast({
        title: '您还未登录~',
        icon: 'error'
      })
      return;
    }
    this.setData({
      favor: !this.data.favor
    })
    
    var userdb = this.data.userdb;
    var favorList = userdb.favor;
    if (this.data.favor) {
      /**
       * 更新user表 添加favor记录
       */
      favorList.push(this.data.curVideoDetail._id)
    }
    if (!this.data.favor) {
      wx.showToast({
        title: '已取消收藏~',
        icon: 'none'
      })
      /**
       * 更新user表 删除favor记录
       */
      // 遍历 查找 删除 更新
      var delIndex = 0;
      for (var i = 0; i < favorList.length; i++) {
        if (favorList[i] === this.data.curVideoDetail._id) {
          delIndex = i;
          break;
        }
      }
      favorList.splice(delIndex, 1);
      // 更新
    }
    db.collection("user").where({
      openid: this.data.openid
    }).update({
      data: {
        favor: favorList
      }
    })
  }
  // }


//   isfocus() {
//       console.log(123)
//   }
})
