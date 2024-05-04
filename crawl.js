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

async function crawlPage(baseURL, currentURL=baseURL, pages={}){
    // try to fetch the html
    if (new URL(baseURL).host != new URL(currentURL).host) {
	console.log("Different hosts");
	return pages;
    }

    const nURL=normalizeURL(baseURL);
    if ( pages[nURL] > 0 ){
	pages[nURL]=pages[nURL]+1;
    }
    else {
	pages[nURL]=1;
    }

    const links=await fetchParse(baseURL, currentURL);
    //console.log(links);
    if (links.length>0) {

	for (const link of links) {
	    if ( pages[link] > 0 ){
		pages[link]=pages[nURL]+1;
	    }
	    else {
		pages[link]=1;
		pages = await crawlPage(baseURL,link,pages);
	    }
	    console.log(pages);
	}
    }


    return pages;
}

export { normalizeURL, getURLsFromHTML, crawlPage };
