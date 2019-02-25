export default {
    /**
     * 获取最近len天日期
     */
    getRecentSomeDay(len){
        let date = new Date();
        let year = date.getFullYear().toString();
        let month = (date.getMonth() + 1).toString();
        let day = date.getDate().toString();
        date.setDate(day - len + 1);
        let _year = date.getFullYear().toString();
        let _month = (date.getMonth() + 1).toString();
        let _day = date.getDate().toString();
        let recentDay = {
            value: [[_year, _month, _day], [year, month, day]],
            display: _year + '-' + this.addZero(_month) + '-' + this.addZero(_day) + ' <em>至</em> ' + year + '-' + this.addZero(month) + '-' + this.addZero(day)
        };
        return recentDay
    },
    /**
     * 个位数补0
     */
    addZero(n){
        n = n.toString();
        return n.length == 1 ? '0' + n : n
    },
    /**
     * 时间戳转换
     */
    getLocalTime (config) {

        let { dateJoin = '-' } = config;        // 默认日期连接符：-
        let { timeJoin = ':' } = config;        // 默认时间连接符：:
        let { timeType = 'minutes' } = config;      // 默认精确到分钟（minutes：精确到分钟；seconds：精确到秒）
        let { dataType = 'all' } = config;          // 默认类型为日期+时间（all：日期+时间；date：日期；time：时间）

        if (config.data) {
            let d = new Date(parseInt(config.data) * 1000);
            let date = d.getFullYear() + dateJoin + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + dateJoin + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());
            let time;

            // 获取时间（精确到秒）
            if (timeType == 'seconds') {
                time = (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + timeJoin + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) + timeJoin + (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds())
            } else {
                time = (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + timeJoin + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes())
            }

            // 返回日期+时间
            if (dataType === 'all') {
                return date + ' ' + time
                // 返回日期
            } else if (dataType === 'date') {
                return date
                // 返回时间
            } else if (dataType === 'time') {
                return time
            }
        } else {
            return ''
        }
    },
    /**
     * 错误图片
     */
    getError(){
        return require('../assets/images/error.png')
    },
    /**
     * 设置cookie
     */
    setCookie(name, value, day) {
        let d = new Date();
        d.setDate(d.getDate() + day);
        document.cookie = name + "=" + value + ";expires=" + d;
    },
    /**
     * 获取cookie
     */
    getCookie() {
        //设置了cookie后，它的显示方式是name=value; expires=day;
        //先用; 来分割字符串(记住;后面有空格)
        //cookieArr = "name=value","expires=day"
        let cookieArr = document.cookie.split("; ");
        let info = {};//对象
        for (let i = 0; i < cookieArr.length; i++) {
            //cookieArr[1] = "name=value";
            //cookieArr[2] = "expires=day";
            //再用=来分割，c = cookieArr[1].split("=") = "name","value";
            //再循环，c = cookieArr[2].split("=") = "expires","day";
            let c = cookieArr[i].split("=");
            //那么info[c[0]] = "name"
            //c[1] = "value"
            //这样一一配对
            info[c[0]] = c[1];
        }
        return info;//最后返回给外部调用
    },
    /**
     * 通过Name 获取cookie对应的值
     */
    getCookieByName(name) {
        return this.getCookie()[name];
    },
    /**
     * 删除cookie
     */
    deleteCookie(name) {
        this.setCookie(name, '', -1);
    },
}
