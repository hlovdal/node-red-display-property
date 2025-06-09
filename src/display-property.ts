import { NodeRedApp } from "node-red";
import { Node } from "node-red-contrib-typescript-node";

import { getDateAndTimeString } from "./utils";
import { getValue } from "./display-property-functions.js";

// NB! Keep this in sync with the "defaults" object in the call to RED.nodes.registerType in display-property.html.
interface NodeProperties {
	name: string;
	property?: string;
	showDate: boolean;
	showTime: boolean;
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
				const date = new Date();
				const dateTime = getDateAndTimeString(
					showDate,
					showTime,
					date,
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
