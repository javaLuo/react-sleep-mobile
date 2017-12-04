const allobj = {
    // 将标准格式字符串进行日期格式化
    dateformart(str) {
        if (!str) { return ''; }
        let date = str;
        if (!(str instanceof Date)) {
            date = new Date(str);
        }
        let m = date.getMonth() + 1;
        let d = date.getDate();
        if (m < 10) { m = `0${m}`; }
        if (d < 10) { d = `0${d}`; }
        return `${date.getFullYear()}-${m}-${d}`;
    },
    /**
     * 标准日期转字符串年月日，时分秒
     * */
    dateToStr(date) {
        if (!date) { return ''; }
        const m = `${date.getMonth() + 1}`.padStart(2,'0');
        const d = date.getDate().toString().padStart(2,'0');
        const h = date.getHours().toString().padStart(2,'0');
        const min = date.getMinutes().toString().padStart(2,'0');
        const s = date.getSeconds().toString().padStart(2,'0');
        return `${date.getFullYear()}-${m}-${d} ${h}:${min}:${s}`;
    },
    /**
     * 标准日期转字符串年月日，时分
     * */
    dateToStrMin(date) {
        if (!date) { return ''; }
        const m = `${date.getMonth() + 1}`.padStart(2,'0');
        const d = date.getDate().toString().padStart(2,'0');
        const h = date.getHours().toString().padStart(2,'0');
        const min = date.getMinutes().toString().padStart(2,'0');
        return `${date.getFullYear()}-${m}-${d} ${h}:${min}:00`;
    },
    // 将数字或字符串*100，保留两位小数点返回,非法返回''
    percent(str) {
        if (!str && str !== 0) { return ''; }
        const temp = window.parseFloat(str);
        return (temp * 100).toFixed(2);
    },
    // 将数字或字符串/100，保留两位小数点返回,非法返回''
    noPercent(str) {
        if (!str && str !== 0) { return ''; }
        const temp = window.parseFloat(str);
        return (temp / 100).toFixed(2);
    },
    // 保留4位小数点返回，非法返回''
    point4(str) {
        if (!str && str !== 0) { return ''; }
        const temp = window.parseFloat(str);
        return temp.toFixed(4) || '';
    },
    // 保留N位小数
    pointX(str, x = 0) {
        if (!str && str !== 0) { return '--'; }
        const temp = window.parseFloat(str);
        if (temp === 0) {
            return temp.toFixed(x);
        }
        return temp ? temp.toFixed(x) : '--';
    },
    // 去掉字符串两端空格
    trim(str) {
        if (!str) return '';
        const reg = /^\s*|\s*$/g;
        return str.replace(reg, '');
    },

    // 验证是否是正确的手机号
    checkPhone(str) {
        const reg = /^[1][3578][0-9]{9}$/g;
        return reg.test(str);
    },
    // 正则 邮箱验证
    checkEmail(str) {
        const rex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        return rex.test(str);
    },
    // 给字符串打马赛克
    addMosaic(str) {
        if (!str && str !== 0) {
            return '';
        }
        const s = `${str}`;
        const lenth = s.length;
        const howmuch = (() => {
            if (s.length <= 2) {
                return s.length;
            }
            const l = s.length - 2;
            if (l <= 6) { return l; }
            return 6;
        })();
        const start = Math.floor((lenth - howmuch) / 2);
        const ret = s.split('').map((v, i) => {
            if (i >= start && i < start + howmuch) {
                return '*';
            }
            return v;
        });
        console.log('组装：', ret);
        return ret.join('');
    },
    /* 字符串加密 */
    compile(code) {
        let c = String.fromCharCode(code.charCodeAt(0) + code.length);
        for (let i = 1; i < code.length; i++) {
            c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
        }
        console.log('加谜：', code, c);
        return c;
    },
    /* 字符串解谜 */
    uncompile(code) {
        let c = String.fromCharCode(code.charCodeAt(0) - code.length);
        for (let i = 1; i < code.length; i++) {
            c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
        }
        console.log('解谜：', code, c);
        return c;
    },
};

export default allobj;
