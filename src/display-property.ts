import { NodeRedApp } from "node-red";
import { Node } from "node-red-contrib-typescript-node";

import { getDateAndTimeString } from "./utils";

// NB! Keep this in sync with the "defaults" object in the call to RED.nodes.registerType in display-property.html.
interface NodeProperties {
	name: string;
	property?: string;
	showDate: boolean;
	showTime: boolean;
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
function getStatus(RED: NodeRedApp, msg: any, property?: string) {
	if (property === "" ||
		property === undefined ||
		property === null) {
		property = "msg.payload";
	}
	if (Object.prototype.hasOwnProperty.call(msg, "property")) {
		if (msg.property !== "" ||
			msg.property === undefined ||
			msg.property === null) {
			property = msg.property;
		}
	}

	let status;
	try {
		status = RED.util.getMessageProperty(msg, property!);
	} catch (error: unknown) {
		status = error instanceof Error ? error.message : error;
	}
	return status;
}

module.exports = function (RED: NodeRedApp) {
	class DisplayPropertyNode extends Node {
		constructor(config: NodeProperties) {
			super(RED);
			this.createNode(config);

			const property = config.property;
			const showDate = config.showDate;
			const showTime = config.showTime;
			// eslint-disable-next-line  @typescript-eslint/no-explicit-any
			this.on("input", (msg: any) => {
				const status = getStatus(RED, msg, property);
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
