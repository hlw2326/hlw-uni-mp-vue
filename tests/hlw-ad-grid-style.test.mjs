import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/hlw-ad/index.vue", "utf-8");
const gridStyle = source.match(/\.hlw-ad--grid\s*\{([\s\S]*?)\}/)?.[1] ?? "";
const rightMiddleStyle = source.match(/"right-middle":\s*`([^`]+)`/)?.[1] ?? "";

assert.match(gridStyle, /position:\s*fixed;/);
assert.match(source, /placement:\s*"right-middle"/);
assert.match(rightMiddleStyle, /top:50%;/);
assert.match(rightMiddleStyle, /right:\$\{safe\};/);
assert.match(rightMiddleStyle, /transform:translateY\(-50%\);/);
assert.doesNotMatch(gridStyle, /bottom:\s*200rpx;/);
assert.doesNotMatch(gridStyle, /right:\s*20rpx;/);
