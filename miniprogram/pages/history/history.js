// pages/history/history.js
const app = getApp()
const db = wx.cloud.database()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 组件所需的参数
        navbarData: {
        showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
        title: '历史记录', //导航栏 中间的标题
      },
      // 此页面 页面内容距最顶部的距离
      height: app.globalData.height * 2 + 20 ,
      videoArr: [],   
    },

/**
   * 获取历史记录列表
   */

//   getVideoList() {
//     db.collection("video").orderBy('_id', 'desc').skip(0).limit(10).get().then(res => {
//       // console.log(res)
//       // console.log(res.data)
//       // app.globalData.videoArr = res.data
//       this.setData({
//         videoArr: res.data
//       })
//     })
//   },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // wx.getStorageSync({
        //     key: 'history',
        //     success: res => {
        //         // console.log("获取本地缓存中的历史记录列表" + res.data)
        //         var history = [];
        //         var data = res.data
        //         data.forEach(element => {
        //             // console.log(element)
        //             history.push(element)
        //         });
        //         // console.log(history)
        //         this.setData({
        //             videoArr: history
        //         })
        //         console.log(this.data.videoArr)
        //     }
        // })
        var history = app.globalData.history;
        var videoArr = [];
        var temArr = app.globalData.videoArr; 
        history.forEach(element => {
            console.log(element)
            if (temArr[element] != undefined)
                videoArr.push(temArr[element])
        });
        this.setData({
            videoArr: videoArr
        })
        console.log("历史记录页面：")
        console.log(this.data.videoArr)
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