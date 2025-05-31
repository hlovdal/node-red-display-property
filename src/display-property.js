/**
 * @param {number} value
 * @returns {string}
 */
function zeroPad(value) {
	let result = value < 10 ? "0" : "";
	result += value.toString();
	return result;
}

/**
 * @param {Date} date
 * @returns {string}
 */
function getDateString(date) {
	let day = date.getDate();
	let month = date.getMonth() + 1; // month as a number 0-11, so add 1
	let year = date.getFullYear();
	return year + "-" + zeroPad(month) + "-" + zeroPad(day);
}

/**
 * @param {Date} date
 * @returns {string}
 */
function getTimeString(date) {
	let hour = date.getHours();
	let minute = date.getMinutes();
	let second = date.getSeconds();
	return zeroPad(hour) + ":" + zeroPad(minute) + ":" + zeroPad(second);
}

/**
 * @param {boolean} showDate
 * @param {boolean} showTime
 * @returns {string}
 */
function getDateAndTimeString(showDate, showTime) {
	const date = new Date();
	let dateTime = "";
	if (showDate) {
		dateTime = getDateString(date);
	}
	if (showTime) {
		const prefix = dateTime != "" ? " " : "";
		dateTime += prefix + getTimeString(date);
	}
	if (dateTime != "") {
		dateTime += ": ";
	}
	return dateTime;
}

/**
 * @typedef {Object} Config
 * @property {string} name
 * @property {string} property
 * @property {boolean} showDate
 * @property {boolean} showTime
 */

module.exports = function (RED) {
	/**
	 * @param {Config} config
	 */
	function DisplayPropertyNode(config) {
		RED.nodes.createNode(this, config);
		const node = this;
		let property = config.property;
		const showDate = config.showDate;
		const showTime = config.showTime;
		node.on("input", function (msg) {
			if (
				property === "" ||
				property === undefined ||
				property === null
			) {
				property = "msg.payload";
			}
			if (msg.hasOwnProperty("property")) {
				if (
					msg.property !== "" ||
					msg.property === undefined ||
					msg.property === null
				) {
					property = msg.property;
				}
			}

			let status;
			try {
				status = RED.util.getMessageProperty(
					msg,
					property
				);
			} catch (error) {
				status = error?.message ?? error;
			}

			const dateTime = getDateAndTimeString(
				showDate,
				showTime
			);
			node.status({
				shape: "dot",
				fill: "grey",
				text: dateTime + JSON.stringify(status),
			});
			node.send(msg);
		});
	}
	RED.nodes.registerType("display property", DisplayPropertyNode);
};
