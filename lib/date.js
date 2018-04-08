var localOffset = (new Date().getTimezoneOffset() + 8 * 60) * 60000;// 与北京时间偏移量

function formatToTime(value) {
	var date = new Date(value + localOffset);
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	var h = date.getHours();
	h = h < 10 ? ('0' + h) : h;
	var minute = date.getMinutes();
	var second = date.getSeconds();
	minute = minute < 10 ? ('0' + minute) : minute;
	second = second < 10 ? ('0' + second) : second;
	return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};

function formatToDate(value) {
	var date = new Date(value + localOffset);
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	return y + '-' + m + '-' + d;
};

function getDate(value) {
	var timestamp = new Date($.ajax({
		async : false
	}).getResponseHeader("Date")).getTime();
	console.log(new Date(timestamp + localOffset + 24 * 60 * 60000 * value));
	return new Date(timestamp + localOffset + 24 * 60 * 60000 * value);
}
