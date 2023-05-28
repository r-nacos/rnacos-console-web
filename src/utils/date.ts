function fnum(v:number) :string {
  if(v<10){
    return "0"+v;
  }
  return v.toString();
}

export const toDatetime=function(date:Date) :string {
  var y = date.getFullYear(),
      M=date.getMonth(),
      d=date.getDate(),
      h=date.getHours(),
      m=date.getMonth(),
      s=date.getSeconds();
  return ""+y+"-"+fnum(M)+"-"+fnum(d)+" "+fnum(h)+":"+fnum(m)+":"+fnum(s);
}

export const toDate=function(date:Date) :string {
  var y = date.getFullYear(),
      M=date.getMonth(),
      d=date.getDate()
  ;
  return ""+y+"-"+fnum(M)+"-"+fnum(d);
}

