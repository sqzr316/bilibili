//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {

    swiperArr: [],
    videoArr: [],
    page: 1,
    totalCount: 0, //数据总数

    // 组件所需的参数
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '哔哩哔哩', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20 ,   
  },

  onLoad() {
    // console.log(this.data.height)
    // 暂时关闭 请求信息
    this.getSwiper() 
    this.getVideoList()
  },

  /**
   * 获取云端轮播图图片
   */
  getSwiper() {
      db.collection("swiper").get().then(res => {
        //   console.log(res.data)
        this.setData({
            swiperArr: res.data
        })
      })
  },
  /**
   * 获取轮播图视频
   * @param {}} e 
   */
  getLunboVideo(e) {
    // console.log(e) e.currentTarget.dataset.vid
    // 根据vid查找视频
    db.collection("video").doc(e.currentTarget.dataset.vid).get().then(res => {
      // console.log(res.data)
      var curVideoDetail = res.data;
      curVideoDetail = JSON.stringify(curVideoDetail);
      wx.navigateTo({
        url: '../../pages/video/video?curVideoDetail=' + encodeURIComponent(curVideoDetail),
      })
    })
  },
/**
 * 跳转视频播放页面
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
   * 获取video列表，通过接口获取详细信息
   */
  getVideoList() {
    db.collection("video").orderBy('_id', 'desc').skip(0).limit(10).get().then(res => {
      // console.log(res)
      // console.log(res.data)
      app.globalData.videoArr = res.data
      // console.log("主页获取videoList：")
      // console.log(app.globalData.videoArr)
      this.setData({
        videoArr: res.data
      })

    })
  },

  /**
   *  得到了 videoUrl - 接口获取各种信息 imgUrl显示
   *  接口地址：https://api.bilibili.com/x/web-interface/view?aid=号
   *  字符串操作 
   *  此方法未使用
   */
  getVideoDetail() {
    var arr = []
    console.log(this.data.videoArr)
    for (var i = 0; i < this.data.videoArr.length; i++) {
      var videoUrl = this.data.videoArr[i].videoUrl;
      var index = videoUrl.lastIndexOf('v') + 1;
      // console.log(videoUrl.substring(index));
      var num = videoUrl.substring(index);
      // console.log(num)
      
      wx.request({
        url: 'https://api.bilibili.com/x/web-interface/view?aid=' + num,
        // 拿到返回详细数据
        success: res => {
          // console.log(res)
          if (res.data.code === 0) {
            arr.push(res.data.data)
            // this.data.videoObjectArr.push(res.data.data)
            // console.log(arr[i])
          }
        }
      });
    }
    var idx = 0;
    arr.forEach(element => {
      console.log(123)
      arr[idx++] = element;
    });
    console.log(arr)
    this.setData({
      videoObjectArr: arr
    })
    console.log(this.data.videoObjectArr)
    console.log(this.data.videoObjectArr.length)
    // this.test()
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
            app.globalData.videoArr = videoArr
          },
          fail: err => {
            console.log('[数据库] [查询记录] 失败：');
          }
        })

    // } else if (this.data.showMoreInfo) {
    //   this.setData({
    //     showMoreInfo: false
    //   })
    //   wx.showToast({
    //     title: '没有更多数据了',
    //   })
    // }

  },

  // test() {
  //   console.log(this.data.videoObjectArr)
  // }
})
