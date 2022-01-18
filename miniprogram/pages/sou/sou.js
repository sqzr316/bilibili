//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
  // 组件所需的参数
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '哔哩哔哩', //导航栏 中间的标题
    },

    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20 ,   
    
    soutext: "", //搜索框的值
    history: false, //显示历史记录
    noneview: false, //显示未找到提示
    videolist: false, //搜索的视频列表是否显示
    historyArray: [], //历史记录数组,
    newArray: [], //添加历史记录数组
    videoArr: []
   
  },
  onLoad() {
    // console.log(this.data.height)
  },

  //清除历史记录
  cleanhistory: function(e) {
    this.setData({
      history: false, //隐藏历史记录
      historyArray: [], //清空历史记录数组
      newArray: [],
      soutext: "" //清空搜索框
    })
  },
  //搜索
  search: function(e) {
    var searchtext = this.data.soutext; //搜索框的值
    var sss = false;// true 显示，false 不显示
    var that = this;
    if (searchtext !== "") {
      //将搜索框的值赋给历史数组
      this.data.historyArray.push(searchtext);
      //模糊查询
      var tem = 'data.title'
      db.collection('video').where({
        [tem]: {
          $regex: '.*' + searchtext,
          $options: 'i'
        }
      }).get().then(res => {
        // console.log(res.data)
        that.setData({
          videoArr: res.data
        })
        // console.log(that.data.videoArr)
        if (that.data.videoArr.length === 0) {
          sss = true;
        }
      })
      this.setData({
        history: false, //隐藏历史记录
        noneview: sss, //未找到提示
        videolist: true, //显示视频列表
        newArray: this.data.historyArray //给新历史记录数组赋值
      })
      // console.log(this.data.videoArr)
    } else {
      this.setData({
        noneview: true, //显示未找到提示
        videolist: false, //隐藏商品列表
        history: false, //隐藏历史记录
      })
    }
  },
   //搜索框的值
   souinput: function(e) {
    //当删除input的值为空时
    if (e.detail.value == "") {
      this.setData({
        history: true, //显示历史记录
        videolist: false //隐藏视频列表
      });
      // 状态改为0
    }
    this.setData({
      soutext: e.detail.value
    })
  },
  //点击历史记录赋值给搜索框
  textfz: function(e) {
    this.setData({
      soutext: e.target.dataset.text
    })
  },
  /**
   * 跳转video页面
   */
  getVideo(e) {
    console.log(e)
    var index = e.currentTarget.dataset.idx;
    var curVideoDetail = JSON.stringify(this.data.videoArr[index])
    // console.log(index)

    // temp index
    // var index = 1;
    console.log(this.data.videoArr[index])
    console.log(curVideoDetail)
    wx.navigateTo({
      url: '../../pages/video/video?curVideoDetail=' + encodeURIComponent(curVideoDetail),
    })
  },
//   isfocus() {
//       console.log(123)
//   }
})
