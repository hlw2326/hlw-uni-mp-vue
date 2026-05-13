import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/hlw-ad/index.vue", "utf-8");
const gridStyle = source.match(/\.hlw-ad--grid\s*\{([\s\S]*?)\}/)?.[1] ?? "";

assert.match(gridStyle, /position:\s*fixed;/);
assert.match(gridStyle, /top:\s*50%;/);
assert.match(gridStyle, /right:\s*0;/);
assert.match(gridStyle, /transform:\s*translateY\(-50%\);/);
assert.doesNotMatch(gridStyle, /bottom:\s*200rpx;/);
assert.doesNotMatch(gridStyle, /right:\s*20rpx;/);
