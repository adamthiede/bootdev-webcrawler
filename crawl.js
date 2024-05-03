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

export { normalizeURL };
