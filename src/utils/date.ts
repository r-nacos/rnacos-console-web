function fnum(v: number): string {
  if (v < 10) {
    return '0' + v;
  }
  return v.toString();
}

export const toDatetime = function (date: Date): string {
  var y = date.getFullYear(),
    M = date.getMonth() + 1,
    d = date.getDate(),
    h = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds();
  return (
    '' +
    y +
    '-' +
    fnum(M) +
    '-' +
    fnum(d) +
    ' ' +
    fnum(h) +
    ':' +
    fnum(m) +
    ':' +
    fnum(s)
  );
};

export const toTime = function (date: Date): string {
  var h = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds();
  return fnum(h) + ':' + fnum(m) + ':' + fnum(s);
};

export const toDate = function (date: Date): string {
  var y = date.getFullYear(),
    M = date.getMonth(),
    d = date.getDate();
  return '' + y + '-' + fnum(M) + '-' + fnum(d);
};

export const toShortHourTime = function (date: Date): string {
  var M = date.getMonth() + 1,
    d = date.getDate(),
    h = date.getHours(),
    m = date.getMinutes();
  return '' + fnum(M) + '-' + fnum(d) + ' ' + fnum(h) + ':' + fnum(m);
};
