import { test, expect } from "@jest/globals";
import { normalizeURL } from "./crawl.js";

const u1=normalizeURL("http://blog.boot.dev/posts/")
const u2=normalizeURL("https://blog.boot.dev/posts")
const u3=normalizeURL("https://blog.boot.dev/posts/post1")

test('url1 should be url2', () => {
  expect(u1==u2).toBe(true);
});

test('url1 should not be url3', () => {
  expect(u1==u2).toBe(true);
});

test('strip paths', () => {
  expect(normalizeURL("http://github.com")=="github.com").toBe(true);
});

test('no trailing slash', () => {
  expect(normalizeURL("http://github.com/")=="github.com").toBe(true);
});
test('no trailing slash v2', () => {
  expect(normalizeURL("http://github.com/")=="github.com/").toBe(false);
});

test('strip most parameters', () => {
  expect(normalizeURL("rsync://user:password@github.com:2222/path?repo=test")=="github.com/path").toBe(true);
});
