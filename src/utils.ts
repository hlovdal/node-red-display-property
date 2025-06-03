
function zeroPad(value: number) {
	let result = value < 10 ? "0" : "";
	result += value.toString();
	return result;
}

function getDateString(date: Date): string {
	const day = date.getDate();
	const month = date.getMonth() + 1; // month as a number 0-11, so add 1
	const year = date.getFullYear();
	return year + "-" + zeroPad(month) + "-" + zeroPad(day);
}

function getTimeString(date: Date): string {
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();
	return zeroPad(hour) + ":" + zeroPad(minute) + ":" + zeroPad(second);
}

export function getDateAndTimeString(showDate: boolean, showTime: boolean, date: Date): string {
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

export function isNonEmptyString(s: unknown): s is string {
	if (s === null || s === undefined) {
		return false;
	}
	if (typeof s !== "string") {
		return false;
	}
	return s.length > 0;
}
