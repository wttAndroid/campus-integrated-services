

Date.prototype.Format=function(){
	var o={
		'Y':this.getYear()+1900,
		'M':this.getMonth()+1,
		'd':this.getDate(),
		'H':this.getHours(),
		'm':this.getMinutes(),
		's':this.getSeconds(),
	}
		return o.Y+'-'+o.M+'-'+o.d
}
Date.prototype.FormatDate=function(){
	var o={
		'Y':this.getYear()+1900,
		'M':this.getMonth()+1,
		'd':this.getDate(),
		'H':this.getHours(),
		'm':this.getMinutes(),
		's':this.getSeconds(),
	}
		return o.Y+'-'+o.M+'-'+o.d+' '+o.H+':'+o.m+':'+o.s
}

Date.prototype.Formatfiffer=function(){
	let timestamp=this.getTime();
	var formats = {
			'year': '%n%年前',
			'month': '%n%月前',
			'day': '%n%天前',
			'hour': '%n%小时前',
			'minute': '%n%分钟前',
			'second': '%n%秒前',
	};
	var now = Date.now();
		var seconds = Math.floor((now - timestamp) / 1000);
		var minutes = Math.floor(seconds / 60);
		var hours = Math.floor(minutes / 60);
		var days = Math.floor(hours / 24);
		var months = Math.floor(days / 30);
		var years = Math.floor(months / 12);
	var diffType = '';
		var diffValue = 0;
		if (years > 0) {
			diffType = 'year';
			diffValue = years;
		} else {
			if (months > 0) {
				diffType = 'month';
				diffValue = months;
			} else {
				if (days > 0) {
					diffType = 'day';
					diffValue = days;
				} else {
					if (hours > 0) {
						diffType = 'hour';
						diffValue = hours;
					} else {
						if (minutes > 0) {
							diffType = 'minute';
							diffValue = minutes;
						} else {
							diffType = 'second';
							diffValue = seconds === 0 ? (seconds = 1) : seconds;
						}
					}
				}
			}
		}
	return formats[diffType].replace('%n%', diffValue);
}

function checkTime(i){
	if(i < 10){
		i = "0" + i;
	}
   return i;
}
			

Date.prototype.countdown=function(){
	let start_date=this.getTime();
	let leftTime =start_date-new Date()//计算剩余毫秒数

	if(leftTime<0)return 0 + '天' + 0 + '小时' + 0+'分'
	
	var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10);//计算剩余天数
	var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10);//计算剩余小时数
	var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩分钟数
	// var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余秒数
	
				
	 days = checkTime(days).toString();
	 hours = checkTime(hours).toString();
	 minutes = checkTime(minutes).toString();
	 // seconds = checkTime(seconds).toString();
	 
	 
	 return days + '天' + hours + '小时' + minutes+'分'
}


Date.prototype.countdownObj=function(){
	let start_date=this.getTime();
	let leftTime =start_date-new Date()//计算剩余毫秒数
	
	var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10);//计算剩余天数
	var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10);//计算剩余小时数
	var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩分钟数
	// var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余秒数
	
				
	 days = checkTime(days).toString();
	 hours = checkTime(hours).toString();
	 minutes = checkTime(minutes).toString();
	 // seconds = checkTime(seconds).toString();
	 // days + '天' + hours + '小时' + minutes+'分'
	 return {
		 day:days,
		 hour:hours,
		 minute:minutes
	 }
}


let current=new Date().getTime()
module.exports.formatDate=function(tag=0){
	if(!tag) return new Date().Format()
	current=current+(24*60*60*1000)*tag;
	return new Date(current).Format()
}



