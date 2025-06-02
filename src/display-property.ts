import { NodeMessageInFlow, NodeRedApp } from "node-red";
import { Node } from "node-red-contrib-typescript-node";

import {
	getDateAndTimeString,
	isNonEmptyString,
} from "./utils";

// NB! Keep this in sync with the "defaults" object in the call to RED.nodes.registerType in display-property.html.
interface NodeProperties {
	name: string;
	property?: string;
	showDate: boolean;
	showTime: boolean;
}

function getValue(RED: NodeRedApp, msg: NodeMessageInFlow, property?: string): string {
	if (property === "" || property === undefined || property === null) {
		property = "msg.payload";
	}
	if (Object.prototype.hasOwnProperty.call(msg, "property")) {
		if (!isNonEmptyString(msg.property)) {
			return `msg.property is not a non-empty string: ${JSON.stringify(msg.property)}`;
		}
		property = msg.property;
	}

	let value: string;
	try {
		const prop = RED.util.getMessageProperty(msg, property);
		value = JSON.stringify(prop);
	} catch (error: unknown) {
		value = error instanceof Error ? error.message : JSON.stringify(error);
	}
	return value;
}

module.exports = function (RED: NodeRedApp) {
	class DisplayPropertyNode extends Node {
		constructor(config: NodeProperties) {
			super(RED);
			this.createNode(config);

			const property = config.property;
			const showDate = config.showDate;
			const showTime = config.showTime;
			this.on("input", (msg) => {
				const value = getValue(RED, msg, property);
				const dateTime = getDateAndTimeString(
					showDate,
					showTime,
				);
				this.status({
					shape: "dot",
					fill: "grey",
					text: dateTime + value,
				});
				this.send(msg);
			});
		}
	}
	DisplayPropertyNode.registerType(RED, "display property");
};
