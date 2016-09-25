module.exports = {

  d2h: function (d) {
      return d.toString(16);
  },

  hex2str: function (hexx) {
      var hex = hexx.toString();//force conversion
      var str = '';
      for (var i = 0; i < hex.length; i += 2)
          str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      return str.replace(/\0/g, '');
  },

  str2hex: function (tmp) {
      var str = '',
          i = 0,
          tmp_len = tmp.length,
          c;

      for (; i < tmp_len; i += 1) {
          c = tmp.charCodeAt(i);
          str += this.d2h(c);
      }
      for (; 64-str.length>0;) {
        str=str+"0";
      }
      return str;
  }
}
