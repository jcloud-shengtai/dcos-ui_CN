import moment from "moment";

moment.updateLocale("en", {
  relativeTime: {
    future: "%s内",
    past: "%s前",
    s: "%d 秒",
    m: "一分钟",
    mm: "%d 分钟",
    h: "一小时",
    hh: "%d 小时",
    d: "一天",
    dd: "%d 天",
    M: "一个月",
    MM: "%d 月",
    y: "一年",
    yy: "%d 年"
  }
});
