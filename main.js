import {argv} from 'node:process';
import {crawlPage} from './crawl.js';
import {printReport} from './report.js';

async function main() {
    if (process.argv.length!=3){
	console.error(`Provide exactly one argument: the url.\nYour arguments: ${process.argv}`);
    }
    else {
	const u_arg=process.argv[2];
	let url='';
	try {
	    url = new URL(u_arg).href;
	    console.log(`Scraping ${url}...`);

	}
	catch {
	    console.error(`Your argument was not a valid URL: ${u_arg}`);
	}
	try {
	    const pages = await crawlPage(url);
	    console.log("Done crawling.");
	    printReport(pages);
	}
	catch(err) {
	    console.log(`Error: ${err}`); 
	}
    }
}

main();
