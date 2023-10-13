// pages/my/newMarket/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canUseBtn: false,
    timeCount: 5,
    html: `<div class="WordSection1" style="layout-grid:15.6pt;text-align:justify">

<p class="MsoNormal" align="center" style="text-align:center"><b><span style="font-size:14.0pt;color:#4D4D4D">缴费服务协议</span></b></p>

<p class="MsoNormal"><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;
color:#4D4D4D">&nbsp;</span></p>

<p class="MsoNormal"><span style="color:#4D4D4D">本协议是泰安市泰山城建集团有限公司（以下简称</span><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D">“</span><span style="color:#4D4D4D">城建集团</span><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;
color:#4D4D4D">”</span><span style="color:#4D4D4D">）与您就“泰山智慧城建”自助缴费服务的使用等相关事项所订立的有效合约。请您仔细阅读本协议，您通过“泰山智慧城建”相关页面点击确认或以其他方式选择接受本协议，即表示您同意接受本协议的全部内容。如对本协议有异议，请不要进行后续操作。</span><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"><br>
</span><strong><span style="font-family:等线;color:#4D4D4D">一、您的权利与义务</span></strong><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> <br>
1.</span><span style="color:#4D4D4D">您自愿申请使用泰山智慧城建自助缴费服务。如对本服务有任何疑问、意见，可通过泰山智慧城建交流平台或有关渠道进行咨询和投诉。</span><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> <br>
2.</span><span style="color:#4D4D4D">您使用本服务时实施的所有行为均应当遵守国家法律、法规和各种社会公共利益或公共道德，并且遵守包括但不限于本协议和相关的规则、附件以及各家银行和有关第三方支付机构的相关业务条款。</span><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> <br>
3.</span><span style="color:#4D4D4D">您使用本服务应当通过泰山智慧城建网站、客户端，以及泰山智慧城建告知特定方式链接登录。</span><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> <br>
4.</span><span style="color:#4D4D4D">您保证使用本服务过程中提供的资料真实、准确、完整、有效。泰山智慧城建按照您设置的相关信息为您提供相应服务，对于因您提供信息不真实或不完整所造成的损失由您自行承担。</span><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> <br>
</span><span style="color:#4D4D4D">您确保正确填写账单信息，并且妥善保管预留信息，除使用本服务外，不要向任何其他人、其他网站、电话或短信的问询提供预留的信息内容。如您对账单信息内容有疑问的，请自行联系相关机构单位。一旦您使用本协议约定服务，且通过系统发送相应指令的，不论本协议是否终止，基于该指令所涉及的款项和费用不予退回</span></p>

<p class="MsoNormal"><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;
color:#4D4D4D">5.&nbsp; </span><span style="color:#4D4D4D">您保证使用本服务过程中使用的银行卡为您本人所有或者已经得到持卡人有效授权，否则因此导致的责任均由您自行承担。一旦您点击确认支付，亦不得要求变更或撤销该指令。</span><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> <br>
6.</span><span style="color:#4D4D4D">您理解并同意，您不得以与第三方发生纠纷为理由拒绝支付使用本服务的应付款项。</span><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> <br>
<br>
</span><strong><span style="font-family:等线;color:#4D4D4D">二、</span></strong><span style="color:#4D4D4D">城建集团<strong><span style="font-family:等线">的权利与义务</span></strong></span><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> <br>
1</span><span style="color:#4D4D4D">、城建集团有权根据您资信情况或交易记录，决定是否受理您的服务申请，并且可以根据注册信息等相关要素对您从事交易的权限和身份进行核实。</span><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> <br>
2</span><span style="color:#4D4D4D">、城建集团有权根据自身业务的发展，增加、减少或撤销缴费服务项目，调整缴费服务的内容，并且有权对本服务进行升级、改造。</span><span style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> </span><span style="color:#4D4D4D">因您提供的账单逾期或您账户资金不足等任何原因导致账单支付不成功的，泰山智慧城建将向您返回失败信息，因此导致您逾期时间增长或任何其他损失的，该损失应由您自行完全承担。即便如此，泰山智慧城建向您返回的信息为缴费成功，但因对应的服务银行及机构单位的系统或操作导致该账单最终还是需要支付滞纳金的，您同意完全承担该等滞纳金，若您对滞纳金有异议的，应当直接与对应的银行及机构单位协商解决。</span><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> <br>
3</span><span style="color:#4D4D4D">、城建集团应当在技术上确保整个网络交易平台的安全、有效、正常运行，保证您能够顺利使用本协议约定服务，并向您提供交易记录、交易资金状态、账户状态等查询的服务。但不承担因通讯、停电故障、黑客攻击、银行问题、相关机构单位出账问题、不可抗力等非城建集团原因所引起交易中断、交易错误引起的责任。</span><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> <br>
4</span><span style="color:#4D4D4D">、城建集团承诺不会以任何形式挪用您使用本服务的资金。</span><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> <br>
5</span><span style="color:#4D4D4D">、城建集团可根据业务发展对提供本服务向您收取服务费进行调整，但应当明示交易费用及其变更，如您不接受相关费用标准及其变更，则不应继续使用本服务。一旦您继续使用，即视为您同意接受包括费用条款在内的所有约定。</span><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> <br>
6</span><span style="color:#4D4D4D">、城建集团对您在使用本服务过程中填写的相关信息及历史使用记录负有保密义务，但您理解并同意，城建集团可以基于向您提供更优质服务的目的或其他泰山智慧城建产品而保留并使用您前述信息，或者向其他第三方披露该等信息。</span><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> <br>
<br>
</span><strong><span style="font-family:等线;color:#4D4D4D">三、差错处理</span></strong><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> <br>
</span><span style="color:#4D4D4D">由于您未按规定操作，或者您自身其他原因造成缴费指令未执行、未适当执行、延迟执行的，应及时反映给泰山智慧城建客服</span>。<span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"><br>
<br>
</span><strong><span style="font-family:等线;color:#4D4D4D">四、协议的中止和终止</span></strong><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> <br>
1</span><span style="color:#4D4D4D">、如您在泰山智慧城建平台上存在违法行为或违反本协议的行为，或因您此前使用本服务的行为引发争议的，城建集团仍可行使追究的权利。</span><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> <br>
2</span><span style="color:#4D4D4D">、您理解并同意，城建集团不对因下述任一情况而发生的服务中断或终止而承担任何赔偿责任：</span><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> <br>
</span><span style="color:#4D4D4D">（</span><span lang="EN-US" style="font-family:
&quot;Arial&quot;,sans-serif;color:#4D4D4D">1</span><span style="color:#4D4D4D">）城建集团基于单方判断，认为您已经违反本服务条款的规定，将中断或终止向您提供部分或全部服务功能，并将您用户资料加以删除。</span><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> <br>
</span><span style="color:#4D4D4D">（</span><span lang="EN-US" style="font-family:
&quot;Arial&quot;,sans-serif;color:#4D4D4D">2</span><span style="color:#4D4D4D">）发现您注册资料虚假、异常交易或有疑义或有违法嫌疑时，城建集团不经通知有权先行中断或终止您泰山智慧城建账户、密码，并拒绝您使用部分或全部服务功能。</span><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> <br>
<br>
</span><strong><span style="font-family:等线;color:#4D4D4D">五、违约责任</span></strong><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> <br>
</span><span style="color:#4D4D4D">本协议任何一方违反本协议规定的内容，给另一方造成损害的，应当承担违约责任，赔偿另一方因此而造成的直接损失。</span><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> <br>
<br>
</span><strong><span style="font-family:等线;color:#4D4D4D">六、免责条款</span></strong><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> <br>
</span><span style="color:#4D4D4D">若您向自助缴费系统提交的账单为逾期账单，导致其缴费的结果为销账失败。由此产生的违约金或赔偿金，需由您自行承担。若您对此存在疑义，可与相应各机构单位进行协商，城建集团将尽可能协助。</span><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> <br>
<br>
</span><strong><span style="font-family:等线;color:#4D4D4D">七、法律适用及争议解决</span></strong><span lang="EN-US" style="font-family:&quot;Arial&quot;,sans-serif;color:#4D4D4D"> <br>
</span><span style="color:#4D4D4D">本协议适用中华人民共和国大陆地区法律。就本协议的确认、履行或解释发生争议，双方友好协商解决。如协商不成，双方同意由被告所在地法院管辖审理双方的纠纷或争议。</span></p>

</div>`
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) { },
  handleClickOpen() {
    if(!this.data.canUseBtn) return
    let pages = getCurrentPages() // 当前页的数据，
    let prevPage = pages[pages.length - 2] // 上一页的数据
    console.log(prevPage)
    prevPage.handleChangeHoldState(true)
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      timeCount: 5
    })
    const timer = setInterval(() => { 
      this.setData({
        timeCount: this.data.timeCount - 1
      })
      if (this.data.timeCount === 0) { 
        clearInterval(timer)
        this.setData({
          canUseBtn: true
        })
        return
      }
      
    },1000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
})
