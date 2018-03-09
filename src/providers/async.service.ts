import {Injectable, Pipe, PipeTransform} from "@angular/core";

@Injectable()
export class AsyncJob {

	taskClosure : Function;

	successCallback : Function;
	errorCallback : Function;

	results = [];
	errors = [];

	constructor(taskClosure:Function, successCallback:Function = null, errorCallback:Function = null) {
		this.taskClosure = taskClosure;
		this.successCallback = successCallback;
		this.errorCallback = errorCallback;

		console.log("[async_job] Start async job, closure: ", taskClosure);

		this.deferTick();
	}

	deferTick() {
		setTimeout(() => {
			this.tick()
		}, 0);
	}

	onTaskComplete(result) {

	}

	onTaskError(result) {

	}

	onJobComplete(results) {
		if(this.errorCallback && this.errorCallback.call) {
			this.successCallback(results);
		}

		if(this.errors.length > 0 && this.errorCallback && this.errorCallback.call) {
			this.errorCallback(this.errors);
		}
	}

	tick() {

		console.log("[async_job] Job tick! ", this);

		let promise = this.taskClosure.call(this, []);

		console.log("\t[async_job] Job tick promise: ", promise);

		if(!promise || !promise.then) {

			console.log("\t[async_job] Promise returned null, job is completed! ");

			this.onJobComplete(this.results);
			return false;
		}

		promise.then(
			(res) => {

				console.log("\t[async_job] Promise then: ", res);

				if(!res) {
					console.log("\t[async_job] Result is false, job is completed!");
					this.onJobComplete(this.results);
					return false;
				}

				this.onTaskComplete(res);
				this.results.push(res);

				this.deferTick();

				return res;

			},

			(err) => {
				console.log("\t[async_job] Got promise error: ", err);
				this.onTaskError(err);
				this.deferTick();
				return err;
			}
		)

	}


}