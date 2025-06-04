// Copied from packages/node_modules/@node-red/editor-client/src/js/ui/utils.js
// in the node-red repository. The getMessageProperty function is unchanged
// since 2017-05-11. The normalisePropertyExpression function has some updates
// done in 2021-01-27.

/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

    function createError(code, message) {
        var e = new Error(message);
        e.code = code;
        return e;
    }

    function normalisePropertyExpression(str,msg) {
        // This must be kept in sync with validatePropertyExpression
        // in editor/js/ui/utils.js

        var length = str.length;
        if (length === 0) {
            throw createError("INVALID_EXPR","Invalid property expression: zero-length");
        }
        var parts = [];
        var start = 0;
        var inString = false;
        var inBox = false;
        var boxExpression = false;
        var quoteChar;
        var v;
        for (var i=0;i<length;i++) {
            var c = str[i];
            if (!inString) {
                if (c === "'" || c === '"') {
                    if (i != start) {
                        throw createError("INVALID_EXPR","Invalid property expression: unexpected "+c+" at position "+i);
                    }
                    inString = true;
                    quoteChar = c;
                    start = i+1;
                } else if (c === '.') {
                    if (i===0) {
                        throw createError("INVALID_EXPR","Invalid property expression: unexpected . at position 0");
                    }
                    if (start != i) {
                        v = str.substring(start,i);
                        if (/^\d+$/.test(v)) {
                            parts.push(parseInt(v));
                        } else {
                            parts.push(v);
                        }
                    }
                    if (i===length-1) {
                        throw createError("INVALID_EXPR","Invalid property expression: unterminated expression");
                    }
                    // Next char is first char of an identifier: a-z 0-9 $ _
                    if (!/[a-z0-9\$\_]/i.test(str[i+1])) {
                        throw createError("INVALID_EXPR","Invalid property expression: unexpected "+str[i+1]+" at position "+(i+1));
                    }
                    start = i+1;
                } else if (c === '[') {
                    if (i === 0) {
                        throw createError("INVALID_EXPR","Invalid property expression: unexpected "+c+" at position "+i);
                    }
                    if (start != i) {
                        parts.push(str.substring(start,i));
                    }
                    if (i===length-1) {
                        throw createError("INVALID_EXPR","Invalid property expression: unterminated expression");
                    }
                    // Start of a new expression. If it starts with msg it is a nested expression
                    // Need to scan ahead to find the closing bracket
                    if (/^msg[.\[]/.test(str.substring(i+1))) {
                        var depth = 1;
                        var inLocalString = false;
                        var localStringQuote;
                        for (var j=i+1;j<length;j++) {
                            if (/["']/.test(str[j])) {
                                if (inLocalString) {
                                    if (str[j] === localStringQuote) {
                                        inLocalString = false
                                    }
                                } else {
                                    inLocalString = true;
                                    localStringQuote = str[j]
                                }
                            }
                            if (str[j] === '[') {
                                depth++;
                            } else if (str[j] === ']') {
                                depth--;
                            }
                            if (depth === 0) {
                                try {
                                    if (msg) {
                                        parts.push(getMessageProperty(msg, str.substring(i+1,j)))
                                    } else {
                                        parts.push(normalisePropertyExpression(str.substring(i+1,j), msg));
                                    }
                                    inBox = false;
                                    i = j;
                                    start = j+1;
                                    break;
                                } catch(err) {
                                    throw createError("INVALID_EXPR","Invalid expression started at position "+(i+1))
                                }
                            }
                        }
                        if (depth > 0) {
                            throw createError("INVALID_EXPR","Invalid property expression: unmatched '[' at position "+i);
                        }
                        continue;
                    } else if (!/["'\d]/.test(str[i+1])) {
                        // Next char is either a quote or a number
                        throw createError("INVALID_EXPR","Invalid property expression: unexpected "+str[i+1]+" at position "+(i+1));
                    }
                    start = i+1;
                    inBox = true;
                } else if (c === ']') {
                    if (!inBox) {
                        throw createError("INVALID_EXPR","Invalid property expression: unexpected "+c+" at position "+i);
                    }
                    if (start != i) {
                        v = str.substring(start,i);
                        if (/^\d+$/.test(v)) {
                            parts.push(parseInt(v));
                        } else {
                            throw createError("INVALID_EXPR","Invalid property expression: unexpected array expression at position "+start);
                        }
                    }
                    start = i+1;
                    inBox = false;
                } else if (c === ' ') {
                    throw createError("INVALID_EXPR","Invalid property expression: unexpected ' ' at position "+i);
                }
            } else {
                if (c === quoteChar) {
                    if (i-start === 0) {
                        throw createError("INVALID_EXPR","Invalid property expression: zero-length string at position "+start);
                    }
                    parts.push(str.substring(start,i));
                    // If inBox, next char must be a ]. Otherwise it may be [ or .
                    if (inBox && !/\]/.test(str[i+1])) {
                        throw createError("INVALID_EXPR","Invalid property expression: unexpected array expression at position "+start);
                    } else if (!inBox && i+1!==length && !/[\[\.]/.test(str[i+1])) {
                        throw createError("INVALID_EXPR","Invalid property expression: unexpected "+str[i+1]+" expression at position "+(i+1));
                    }
                    start = i+1;
                    inString = false;
                }
            }

        }
        if (inBox || inString) {
            throw new createError("INVALID_EXPR","Invalid property expression: unterminated expression");
        }
        if (start < length) {
            parts.push(str.substring(start));
        }
        return parts;
    }

    export function getMessageProperty(msg,expr) {
        var result = null;
        var msgPropParts;

        if (typeof expr === 'string') {
            if (expr.indexOf('msg.')===0) {
                expr = expr.substring(4);
            }
            msgPropParts = normalisePropertyExpression(expr);
        } else {
            msgPropParts = expr;
        }
        var m;
        msgPropParts.reduce(function(obj, key) {
            result = (typeof obj[key] !== "undefined" ? obj[key] : undefined);
            if (result === undefined && obj.hasOwnProperty('type') && obj.hasOwnProperty('data')&& obj.hasOwnProperty('length')) {
                result = (typeof obj.data[key] !== "undefined" ? obj.data[key] : undefined);
            }
            return result;
        }, msg);
        return result;
    }
