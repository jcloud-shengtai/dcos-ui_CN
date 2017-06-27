import moment from "moment";

moment.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s 前",
    s: "%d 秒",
    m: "a minute",
    mm: "%d 分",
    h: "an hour",
    hh: "%d 小时",
    d: "a day",
    dd: "%d 天",
    M: "a month",
    MM: "%d 月",
    y: "a year",
    yy: "%d 年"
  }
});
