//app.js
App({
  onLaunch: function (options) {

    wx.cloud.init({
      traceUser: true,
  })
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.height = res.statusBarHeight
      }
    })

    wx.getSetting({
      fail: res => {
        console.log('failed')
      },
      success: res => {
        console.log('success')
        if (res.authSetting['scope.userInfo']) {
          // 执行到次数表示用户已经授权,可以直接获取到用户信息
          wx.getUserProfile({
            success: res => {
              console.log(res)
              this.globalData.userInfo = res.userInfo
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }   
    }),

    wx.setStorageSync({
      key: 'hasUserInfo',
      data: false
  })


    this.checkLogin(res => {
      // console.log('is_login:', res.is_login)
      if (!res.is_login) {
        this.login()
      }
    })
  },

  login: function() {
    wx.login({
      success: res => {
        // console.log('login code:' + res.code)
        wx.request({
          url: 'http://127.0.0.1:3000/login',
          method: 'post',
          data: {code: res.code},
          success: res => {
            // console.log('token:' + res.data.token)
            // console.log('openid:' + res.data.openid)
            wx.setStorage({
              key: "openid",
              data: res.data.openid
          })
            // 将token保存为公共数据(用在多页面访问)
            this.globalData.token = res.data.token
            this.globalData.openid = res.data.openid
            // 将token保存到数据缓存(下次打开小程序无需重新获取token)
            wx.setStorage({key: 'token', data: res.data.token})
            // this.globalData.hasUserInfo = true
          }
        })
      }
    })

   
  },
  checkLogin: function(callback) {
    var token = this.globalData.token
    if (!token) {
      // test
      // 从数据缓存中获取token
      token = wx.getStorageSync('token')
      if (token) {
        this.globalData.token = token
        // this.globalData.hasUserInfo = true
      } else {
        callback({is_login: false})
        return
      }
    }
    wx.request({
      url: 'http://127.0.0.1:3000/checklogin',
      data: {token: token},
      success: res => {
        callback({is_login: res.data.is_login})
      }
    })
  },

  quchong(arr){
    // console.log(arr)
    var tempArr = []; //返回的值
    var indexArr= []; //返回的索引
      for (var i = 0; i < arr.length; i++) {
        if (tempArr.indexOf(arr[i]) == -1) {
          tempArr.push(arr[i]);
          indexArr.push(i)
        } else if (tempArr.indexOf(arr[i])>=0){
          for(var j = 0;j<tempArr.length;j++){
          if (tempArr[j] == arr[i]) {
            tempArr.splice(j, 1, tempArr[j]);
            indexArr.splice(j, 1, i);
          }
        }
      }
    }
    return tempArr
  },




  globalData: {
    height: 0,
    token : null,
    openid: '',
    userInfo: null,
    hasUserInfo: false,
    videoArr: [],
    history: [],
    user: {}
  }
  
})