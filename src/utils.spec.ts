import { describe, expect, test } from "@jest/globals";

import {
	getDateAndTimeString,
	getStringValue,
	isNonEmptyString,
} from "./utils";

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

	test("getStringValue", () => {
		// Arrange
		const testData = [
			{ input: undefined, output: "undefined" },
			{ input: null, output: "null" },
			{ input: 0, output: "0" },
			{ input: 123, output: "123" },
			{ input: "", output: "\"\"" },
			{ input: "abc", output: "\"abc\"" },
			{ input: [1, 2, 3], output: "[1,2,3]" },
			{ input: ["a", "b", "c"], output: "[\"a\",\"b\",\"c\"]" },
			{ input: { a: "A", n: 1 }, output: "{\"a\":\"A\",\"n\":1}" },
		];

		testData.forEach(d => {
			// Act
			const value = getStringValue(d.input);

			// Assert
			expect(value).toEqual(d.output);
		});

	});
});
