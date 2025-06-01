import { NodeRedApp } from "node-red";
import { Node } from "node-red-contrib-typescript-node";

// NB! Keep this in sync with the "defaults" object in the call to RED.nodes.registerType in display-property.html.
interface NodeProperties {
	name: string;
	property?: string;
	showDate: boolean;
	showTime: boolean;
}

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

function getDateAndTimeString(showDate: boolean, showTime: boolean): string {
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

module.exports = function (RED: NodeRedApp) {
	class DisplayPropertyNode extends Node {
		constructor(config: NodeProperties) {
			super(RED);
			this.createNode(config);

			let property = config.property;
			const showDate = config.showDate;
			const showTime = config.showTime;
			// eslint-disable-next-line  @typescript-eslint/no-explicit-any
			this.on("input", (msg: any) => {
				if (
					property === "" ||
					property === undefined ||
					property === null
				) {
					property = "msg.payload";
				}
				if (Object.prototype.hasOwnProperty.call(msg, "property")) {
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
						property!
					);
				} catch (error: unknown) {
					status = error instanceof Error ? error.message : error;
				}

				const dateTime = getDateAndTimeString(
					showDate,
					showTime,
				);
				this.status({
					shape: "dot",
					fill: "grey",
					text: dateTime + JSON.stringify(status),
				});
				this.send(msg);
			});
		}
	}
	DisplayPropertyNode.registerType(RED, "display property");
};
