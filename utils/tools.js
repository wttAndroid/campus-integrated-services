
 function TodayInfo(start,current) { //距离开学时间  当前的时间是第几周
	// let start="2022-7-4"//开学时间
	var WEEKLEN = 7, // 一周7天为常量
        WEEKDAYS = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
		WEEKdays = [7, 1,2, 3,4, 5, 6],
        weekInfo = {"week": null, "day": null}, // 初始化返回信息，默认第null周，星期null
            oneDay = 24 * 60 * 60 * 1000, // 一天的毫秒时长
            weekLeave, // 开学当天所在周剩余天数
            weekStart, // 开学当天start是星期几
            today, // 今天
            dateDiff, // 今天与开学当天日期差
            sDate; //开学之日，日期对象
        var rDateStr = /\d{4}[\/-]\d{1,2}[\/-]\d{1,2}/g; // 简单的日期格式校验：2013/12/19
        if (!rDateStr.test(start)) {
            alert("请使用合法的开学日期！！！");
            return weekInfo;
        }
        sDate = new Date(start.replace("-", "/"));
        weekStart = sDate.getDay();
        weekStart = weekStart === 0 ? 7 : weekStart; // JS中周日的索引为0，这里转换为7，方便计算
        
        weekLeave = WEEKLEN - weekStart;
        today = new Date(current.replace("-", "/"));
        weekInfo.day = WEEKDAYS[today.getDay()];
		weekInfo.weekday = WEEKdays[today.getDay()];
        today = new Date(today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate());
        dateDiff = today - sDate;
        if (dateDiff < 0) {
			console.log('别开玩笑了，你还没开学呢！！！')
            return weekInfo;
        }
        dateDiff = parseInt(dateDiff / oneDay);
        weekInfo.week = Math.ceil((dateDiff - weekLeave) / WEEKLEN) + 1;
		
        return weekInfo;
}

function groupBydesc(arr){
	if (!String.prototype.localeCompare) return null
	  let letters = 'ABCDEFGHJKLMNOPQRSTWXYZ'.split('')
	  let zh = '阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀'.split('')
	  let segs = []
	  letters.forEach((item1, i) => {
	    let cur = { letter: item1, data: [] }
	    arr.forEach((item2) => {
	      let item = item2.username.toString();
	        if (item.localeCompare(zh[i]) >= 0 && item.localeCompare(zh[i + 1]) < 0) {
	        cur.data.push(item2)
	      }
	    })
	    if (cur.data.length) {
	      cur.data.sort(function (a, b) {
	        return a['username'].localeCompare(b['username'], 'zh')
	      })
	      segs.push(cur)
	    }
	  })
	  // segs.sort(function(a, b) {
	  //     return a['letter'].localeCompare(b['letter'], 'zh')
	  // })
	  return segs
}



function groupBykey(dataarr,key){   //key:grade keyname
		
		let tempArr = []; //所有的grade：21 22 31
	    let endData = [];
		// {id: 4, classid: 10002, classname: "虚拟与现实", hover: "1", grade: 21}
		
	    for (let i = 0; i < dataarr.length; i++) {  //dataarr[i]: grade
			let item={...dataarr[i],text:dataarr[i]['classname']+dataarr[i]['hover']+"班",value:dataarr[i]['classid']}
			
	        if (tempArr.indexOf(item[key]) === -1) {//不存在则存储
	            endData.push({
	                ['text']: item[key]+"级",
					['value']: item[key],
	                children: [item]
	            });
	            tempArr.push(item[key]);
	        } else {//存在
	            for (let j = 0; j < endData.length; j++) {
	                if (endData[j]['value'] == item[key]) {
	                    endData[j].children.push(item);
	                    break;
	                }
	            }
	        }
	    }
	    return endData // 最终输出
}


module.exports={
	TodayInfo,
	groupBydesc,
	groupBykey
}