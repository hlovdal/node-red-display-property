import { describe, expect, test } from "@jest/globals";
import { NodeMessageInFlow, NodeRedApp } from "node-red";

import { getValue } from "./display-property-functions";
import { getMessageProperty } from "./node-red-utils";

function fakeRed(): NodeRedApp {
	return {
		util: {
			getMessageProperty: getMessageProperty,
		},
	} as NodeRedApp;
}

interface TestData {
	property: string | undefined | null;
	msg: NodeMessageInFlow;
	expectedValue: string;
}

function runTest(testData: TestData[]) {
	// Arrange
	const RED = fakeRed();

	testData.forEach(d => {
		// Act
		const value = getValue(RED, d.msg, d.property);

		// Assert
		expect(value).toEqual(d.expectedValue);
	});
}

describe("getValue", () => {
	test("should return expected value when property is present", () => {
		const testData: TestData[] = [
			{
				property: "msg.payload",
				msg: {
					_msgid: "12345678",
					payload: "abc",
				},
				expectedValue: "\"abc\"",
			},
			{
				property: "msg.a.b.c",
				msg: {
					_msgid: "12345678",
					a: {
						b: {
							c: 123,
						},
					},
				},
				expectedValue: "123",
			},
		];
		runTest(testData);
	});
	test("should return undefined when property is not present", () => {
		const testData: TestData[] = [
			{
				property: "msg.payload",
				msg: {
					_msgid: "12345678",
				},
				expectedValue: "undefined",
			},
			{
				property: "msg.payload",
				msg: {
					_msgid: "12345678",
					payload: "abc",
					property: "data",
				},
				expectedValue: "undefined",
			},
			{
				property: "msg.data",
				msg: {
					_msgid: "12345678",
					payload: "abc",
				},
				expectedValue: "undefined",
			},
		];
		runTest(testData);
	});
	test("should give priority to msg.property over property", () => {
		const testData: TestData[] = [
			{
				property: "msg.payload",
				msg: {
					_msgid: "12345678",
					payload: "abc",
					data: 123,
					property: "data",
				},
				expectedValue: "123",
			},
		];
		runTest(testData);
	});
	test("should fall back to msg.payload if property is blank", () => {
		const testData: TestData[] = [
			{
				property: "",
				msg: {
					_msgid: "12345678",
					payload: "abc",
				},
				expectedValue: "\"abc\"",
			},
			{
				property: undefined,
				msg: {
					_msgid: "12345678",
					payload: "abc",
				},
				expectedValue: "\"abc\"",
			},
			{
				property: null,
				msg: {
					_msgid: "12345678",
					payload: "abc",
				},
				expectedValue: "\"abc\"",
			},
		];
		runTest(testData);
	});
	test("should return error messages when msg.property is invalid", () => {
		const testData: TestData[] = [
			{
				property: "msg.payload",
				msg: {
					_msgid: "12345678",
					property: null,
				},
				expectedValue: "msg.property is not a non-empty string: null",
			},
			{
				property: "msg.payload",
				msg: {
					_msgid: "12345678",
					property: [1, 2, 3],
				},
				expectedValue: "msg.property is not a non-empty string: [1,2,3]",
			},
		];
		runTest(testData);
	});
	test("return error if nester property is invalid", () => {
		const testData: TestData[] = [
			{
				property: "msg.a.b.c",
				msg: {
					_msgid: "12345678",
					a: {
					},
				},
				expectedValue: "Cannot read properties of undefined (reading 'c')",
			},
		];
		runTest(testData);
	});
});
