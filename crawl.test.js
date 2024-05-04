import { test, expect } from "@jest/globals";
import { normalizeURL, getURLsFromHTML } from "./crawl.js";

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

test('sub path', () => {
  expect(normalizeURL("http://github.com/user/repo/")=="github.com/user/repo").toBe(true);
});

test('strip most parameters', () => {
  expect(normalizeURL("rsync://user:password@github.com:2222/path?repo=test")=="github.com/path").toBe(true);
});


const hbody="<html><body><a href='http://blog.boot.dev/post/'><span>post!</span></a><a href='https://blog.boot.dev'><span>Go to Boot.dev</span></a><a href='http://adamthiede.com'>my site</a><a href='https://adamthiede.com/resume.html'>my resume</a><a href='post/good_post.html'>good post</a></body></html>";

test('extract url 1', () => {
    const operation = getURLsFromHTML(hbody, "https://blog.boot.dev");
    const result = [
        'http://blog.boot.dev/post/',
        'https://blog.boot.dev/',
        'http://adamthiede.com/',
        'https://adamthiede.com/resume.html',
        'https://blog.boot.dev/post/good_post.html'
    ];
    expect(operation[0]).toBe(result[0]);
    expect(operation.length).toBe(result.length);
    expect(operation[4]).toBe(result[4]);
});
