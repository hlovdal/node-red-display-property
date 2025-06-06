import { NodeMessageInFlow, NodeRedApp } from "node-red";

import { isNonEmptyString } from "./utils";

export function getValue(RED: NodeRedApp, msg: NodeMessageInFlow, property?: string): string {
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
