/**
 * @param {Date} date
 * @returns {string}
 */
function getDateString(date) {
	let day = date.getDate();
	let month = date.getMonth() + 1; // month as a number 0-11, so add 1
	let year = date.getFullYear();
	if (day < 10) { day = '0' + day; };
	if (month < 10) { month = '0' + month; };
	return year + '-' + month + '-' + day;
}

/**
 * @param {Date} date
 * @returns {string}
 */
function getTimeString(date) {
	let hour = date.getHours();
	let minute = date.getMinutes();
	let second = date.getSeconds();
	if (hour < 10) { hour = '0' + hour; };
	if (minute < 10) { minute = '0' + minute; }
	if (second < 10) { second = '0' + second; }
	return hour + ':' + minute + ':' + second;
}

/**
 * @param {boolean} showDate
 * @param {boolean} showTime
 * @returns {string}
 */
function getDateAndTimeString(showDate, showTime) {
	const date = new Date();
	let dateTime = '';
	if (showDate) {
		dateTime = getDateString(date);
	}
	if (showTime) {
		const prefix = dateTime != '' ? ' ' : '';
		dateTime += prefix + getTimeString(date);
	}
	if (dateTime != '') { dateTime += ': '; };
	return dateTime;
}

module.exports = function (RED) {
	function DisplayPropertyNode(config) {
		RED.nodes.createNode(this, config);
		const node = this;
		let property = config.property;
		const showDate = config.showDate;
		const showTime = config.showTime;
		node.on("input", function (msg) {

			// function start ---------------------------

			let status = 'property does not exist';
			if (property === '' || property === undefined || property === null) {
				property = "msg.payload";
			}
			if (msg.hasOwnProperty('property')) {
				if (msg.property !== '' || msg.property === undefined || msg.property === null) {
					property = msg.property
				}
			}
			if (msg.hasOwnProperty(property.slice(property.indexOf(".") + 1))) {
				status = RED.util.getMessageProperty(msg, property);
			}

			const dateTime = getDateAndTimeString(showDate, showTime);
			node.status({ shape: "dot", fill: "grey", text: dateTime + JSON.stringify(status) })
			node.send(msg);

			// function end ---------------------------

		});
	}
	RED.nodes.registerType("display property", DisplayPropertyNode);
};
