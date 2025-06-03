import { describe, expect, test } from "@jest/globals";

import { getDateAndTimeString, isNonEmptyString } from "./utils";

describe("utils", () => {
	test("getDateAndTimeString", () => {
		// Arrange
		const date = new Date("1999-12-31T13:14:15.678");
		const testData = [
			{ showDate: false, showTime: false, result: "" },
			{ showDate: false, showTime: true, result: "13:14:15: " },
			{ showDate: true, showTime: false, result: "1999-12-31: " },
			{ showDate: true, showTime: true, result: "1999-12-31 13:14:15: " },
		];

		testData.forEach(d => {
			// Act
			const result = getDateAndTimeString(d.showDate, d.showTime, date);

			// Assert
			expect(result).toEqual(d.result);
		});
	});

	test("isNonEmptyString", () => {
		// Arrange
		const testData = [
			{ value: null, result: false },
			{ value: undefined, result: false },
			{ value: true, result: false },
			{ value: 123, result: false },
			{ value: BigInt(123), result: false },
			{ value: { one: 1 }, result: false },
			{ value: "", result: false },
			{ value: "abc", result: true },
			{ value: ["abc"], result: false },
			{ value: Symbol(), result: false },
		];

		testData.forEach(d => {
			// Act
			const result = isNonEmptyString(d.value);

			// Assert
			expect(result).toEqual(d.result);
		});
	});
});
