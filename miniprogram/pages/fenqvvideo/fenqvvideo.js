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
        title: '视频分区', //导航栏 中间的标题
        },
      // 此页面 页面内容距最顶部的距离
      height: app.globalData.height * 2 + 20 ,
      videoArr: [],   
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       // 获取分区页面传过来的videoArr
    //    console.log("视频分区页面接收数据：")
       var param = []
       param = JSON.parse(decodeURIComponent(options.videoArr))
       var titleName = options.titleName;
    //    console.log(param)
       this.setData({
           videoArr: param,
           ['navbarData.title']: titleName
       })
    //    console.log(this.data.videoArr)
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