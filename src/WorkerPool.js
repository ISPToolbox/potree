
export class WorkerPool{
	constructor(){
		this.workers = {};
	}

	createWorker (workerUrl) {
		var worker = null;
		try {
			if(navigator.userAgent.indexOf('Firefox') > 0){
				throw('Firefox does not raise exception, just security error');
			}
			worker = new Worker(workerUrl);
		} catch (e) {
			try {
				var blob;
				try {
					blob = new Blob(["importScripts('" + workerUrl + "');"], { "type": 'application/javascript' });
				} catch (e1) {
					var blobBuilder = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder)();
					blobBuilder.append("importScripts('" + workerUrl + "');");
					blob = blobBuilder.getBlob('application/javascript');
				}
				var url = window.URL || window.webkitURL;
				var blobUrl = url.createObjectURL(blob);
				worker = new Worker(blobUrl);
			} catch (e2) {
			}
		}
		return worker;
	}

	getWorker(url){
		if (!this.workers[url]){
			this.workers[url] = [];
		}

		if (this.workers[url].length === 0){
			let worker = this.createWorker(url);
			this.workers[url].push(worker);
		}

		let worker = this.workers[url].pop();

		return worker;
	}

	returnWorker(url, worker){
		this.workers[url].push(worker);
	}
};

//Potree.workerPool = new Potree.WorkerPool();
