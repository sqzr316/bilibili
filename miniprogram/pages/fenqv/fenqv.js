//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')
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
    soutext: '',
    videoArr: [],
    channeldistance: 0,
    channelname: {}

    
     
  },
  onLoad(options) {
    this.channelPage()
    console.log(this.data.height)
  },

  channelPage: function () {
    var stagewidth = util.stagePoint().stageWidth;
    var distance = (stagewidth / 4);
    var titlename = [
        // { name: "直播", icon: "../../resources/images/直播.png" },  
    //   { name: "番剧", icon: "../../resources/images/番剧.png" },   
      { name: "美食", icon: "../../images/fenqv/美食.png" },   
      { name: "动画", icon: "../../resources/images/动画.png" },   
    { name: "综合", icon: "../../resources/images/国创.png" },    
    { name: "音乐", icon: "../../resources/images/音乐.png" }, 
    { name: "舞蹈", icon: "../../resources/images/舞蹈.png" },  
    { name: "游戏", icon: "../../resources/images/游戏.png" },   
    { name: "科学", icon: "../../resources/images/科技.png" },    
    { name: "生活", icon: "../../resources/images/生活.png" },    
    { name: "鬼畜", icon: "../../resources/images/鬼畜.png" },   
    { name: "时尚", icon: "../../resources/images/时尚.png" },       
    { name: "广告", icon: "../../resources/images/广告.png" },
    { name: "娱乐", icon: "../../resources/images/娱乐.png" },
    // { name: "电影", icon: "../../resources/images/电影.png" },
    // { name: "电视剧", icon: "../../resources/images/电视剧.png" },
    // { name: "游戏中心", icon: "../../resources/images/游戏中心.png" },
    ]
    this.setData({
      channeldistance: distance,       //每个标签的间距
      channelname: titlename
    })

  },

  search: function(e) {
      console.log("分区搜素")
    //   console.log(e.currentTarget.dataset.name)
    var searchtext = e.currentTarget.dataset.name; 
    var that = this;
    // console.log(searchtext)
    if (searchtext !== "") {
      //模糊查询
      var tem = 'data.tname'
      db.collection('video').where({
        [tem]: {
          $regex: '.*' + searchtext,
          $options: 'i'
        }
      }).get().then(res => {
          // console.log("模糊查询结果：")
        // console.log(res.data) 
        // console.log("分区搜索页面：")
        if (res.data.length == 0 || res.data === undefined) {
            wx.showToast({
              title: '暂未收录该类型视频~',
              icon: 'error'
            })
            return
        }
        that.setData({
          videoArr: res.data
        })
        var param = JSON.stringify(this.data.videoArr);
        wx.navigateTo({
            url: '../../pages/fenqvvideo/fenqvvideo?videoArr=' + encodeURIComponent(param) + '&titleName=' + searchtext,
          })
      })
    } 
  },


  
  
//   isfocus() {
//       console.log(123)
//   }
})
