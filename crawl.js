import {JSDOM} from 'jsdom';

function normalizeURL(urlString){
    const url = new URL(urlString);
    const h=url.hostname;
    let p=url.pathname;
    if (p.endsWith("/")) {
	p=p.substring(0,p.length-1);
    }
    const u=`${h}${p}`;
    return u;
}

function getURLsFromHTML(htmlBody, baseURL){
    const the_dom=new JSDOM(htmlBody);
    const anchor_array=the_dom.window.document.querySelectorAll('a')
    let ret_arr=[];
    anchor_array.forEach(element => {
	if (element.hasAttribute('href')) {
	    let href = element.getAttribute('href');
	    try {
		href = new URL(href, baseURL).href;
		ret_arr.push(href);
	    }
	    catch(err){
		console.log(`${err.message}: ${href}`)
	    }
	}
    });
    return ret_arr;
}

async function crawlPage(currentURL){
    try {
	const crawled=await fetch(currentURL);
	if (crawled.status >= 400) {
	    console.error(`Error fetching ${currentURL}: ${crawled.status}`);
	    return;
	}
	else if (! crawled.headers.get("content-type").startsWith("text/html")) {
	    console.error(`Error fetching ${currentURL}: wrong content-type ${crawled.headers.get("content-type")}`);
	    return;
	}
	else {
	    const text=await crawled.text();
	    console.log(text);
	}
    }
    catch(err) {
	console.log(`${err.message}`);
    }
}

export { normalizeURL, getURLsFromHTML, crawlPage };
