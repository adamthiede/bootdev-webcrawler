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

async function fetchParse(baseURL, currentURL) {
    let url_list=[];
    try {
	const crawled=await fetch(currentURL);
	if (crawled.status >= 400) {
	    console.error(`Error fetching ${currentURL}: ${crawled.status}`);
	}
	else if (! crawled.headers.get("content-type").startsWith("text/html")) {
	    console.error(`Error fetching ${currentURL}: wrong content-type ${crawled.headers.get("content-type")}`);
	}
	else {
	    const text=await crawled.text();
	    url_list=getURLsFromHTML(text, baseURL);
	    return url_list;
	}
    }
    catch(err) {
	console.log(`${err.message}`);
    }
    return url_list;
}

async function crawlPage(baseURL, currentURL=baseURL, pages=new Map()){
    if (new URL(baseURL).host != new URL(currentURL).host) {
	return pages;
    }
    else {

	const nURL=normalizeURL(baseURL);
	if ( pages.get(nURL) > 0 ){
	    pages.set(nURL,pages.get(nURL)+1);
	}
	else {
	    pages.set(nURL,1);
	}

	const links=await fetchParse(baseURL, currentURL);
	if (links.length>0) {

	    for (const link of links) {
		if ( pages.get(link) > 0 ){
		    pages.set(link,pages.get(nURL)+1);
		}
		else {
		    pages.set(link, 1);
		    pages = await crawlPage(baseURL,link,pages);
		}
	    }
	}
	return pages;
    }
}

export { normalizeURL, getURLsFromHTML, crawlPage };
