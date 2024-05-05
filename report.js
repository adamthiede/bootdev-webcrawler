import {writeFile} from 'node:fs';

function printReport(pages){
    console.log("Printing report");
    console.log(pages);
    for (const [page, hits] of pages) {
	console.log(`Found ${hits} internal links to ${page}`);
    }
    try {
	saveCSV(pages);
	console.log("Saved report to ./report.csv");
    }
    catch(err) {
	console.log("Could not save file.");
    }

}

function saveCSV(pages) {
    let content="";
    for (const [page, hits] of pages) {
	content+=`${page},${hits}\n`;
    }

    writeFile('./report.csv', content, err => {
	if (err) {
	    console.error(err);
	} else {
	    // file written successfully
	}
    });
}


export { printReport };
