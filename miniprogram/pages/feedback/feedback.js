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
        title: '意见反馈', //导航栏 中间的标题
      },
      // 此页面 页面内容距最顶部的距离
      height: app.globalData.height * 2 + 20 ,
      loading: false,
      contact: '',
      content: '' 
    },

    formSubmit: function (e) {
        let _that = this;
        let content = e.detail.value.opinion;
        let contact = e.detail.value.contact;
        let regPhone = /^1[3578]\d{9}$/;
        let regEmail = /^[a-z\d_\-\.]+@[a-z\d_\-]+\.[a-z\d_\-]+$/i;
        if (content == "") {
          wx.showModal({
            title: '提示',
            content: '反馈内容不能为空!',
          })
          return false
        }
        if (contact == "") {
          wx.showModal({
            title: '提示',
            content: '手机号或者邮箱不能为空!',
          })
          return false
        }
        if (contact == "" && content == "") {
          wx.showModal({
            title: '提示',
            content: '反馈内容,手机号或者邮箱不能为空!',
          })
          return false
        }
        if ((!regPhone.test(contact) && !regEmail.test(contact)) || (regPhone.test(contact) && regEmail.test(contact))) { //验证手机号或者邮箱的其中一个对
          wx.showModal({
            title: '提示',
            content: '您输入的手机号或者邮箱有误!',
          })
          return false
        } else {
          this.setData({
            loading: true
          })
          let model, system, platform;
          wx.getSystemInfo({
            success: function (res) {
              model = res.model;
              system = res.system;
              platform = res.platform;
            }
          })
          /**
           * 提交到数据库
           */
          db.collection("feedback").add({
              data: {
                content: content,
                contact: contact
              },
              success: res => {
                wx.showToast({
                    title: '反馈成功~',
                    icon: 'success',
                    duration: 1500
                  })
                  
              }
          })
          wx.navigateBack({
            delta: 0,
          })
        }
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