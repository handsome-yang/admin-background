(() => {
  /**
       * 时间格式化
       *  年 yyyy
       *  月 M 前面不补0；MM  前面补0
       *  日 d 前面不补0；dd  前面补0
       *  时 H 前面补补0；HH  前面补0
       *  分 m 前面不补0；mm  前面补0
       *  秒 s 前面不补0；ss  前面补0
       *  季度
       *  毫秒
       * @param fmt
       * @returns {string}
       */
  Date.prototype.formatToString = function (fmt) {
    //author: meizz
    let o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "H+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      S: this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    for (let k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
    return fmt;
  };
})()