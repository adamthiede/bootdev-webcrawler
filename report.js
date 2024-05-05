function printReport(pages){
    console.log("Printing report");
    console.log(pages);
    for (const [page, hits] of pages) {
	console.log(`Found ${hits} internal links to ${page}`);
    }
}
export { printReport };
