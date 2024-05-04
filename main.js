import {argv} from 'node:process';
import {crawlPage} from './crawl.js';

function main() {
    if (process.argv.length!=3){
	console.error(`Provide exactly one argument: the url.\nYour arguments: ${process.argv}`);
    }
    else {
	const u_arg=process.argv[2];
	try {
	    let url = new URL(u_arg).href;
	    console.log(`Scraping ${url}...`);
	    crawlPage(url);
	}
	catch {
	    console.error(`Your argument was not a valid URL: ${u_arg}`);
	}
    }
}

main();
