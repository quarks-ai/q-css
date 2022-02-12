import {
	UPDATE_PRIORITY,
	SETTINGS,
	TickerCallback,
	TickerListener,
} from "./utils";

export class Ticker {
	private static _shared: Ticker;
	private static _system: Ticker;

	public autoStart = false;
	public deltaTime = 1;
	public deltaMS: number;
	public elapsedMS: number;
	public lastTime = -1;
	public speed = 1;
	public started = false;

	private _head: TickerListener | null;
	private _requestId: number | null = null;
	private _maxElapsedMS = 100;
	private _minElapsedMS = 0;
	private _protected = false;
	private _lastFrame = -1;
	private _tick: (time: number) => any;

	constructor() {
		this._head = new TickerListener(() => null, null, Infinity);
		this.deltaMS = 1 / SETTINGS.TARGET_FPMS;
		this.elapsedMS = 1 / SETTINGS.TARGET_FPMS;

		this._tick = (time: number): void => {
			this._requestId = null;

			if (this.started) {
				this.update(time); // Invoke listeners now

				// Listener side effects may have modified ticker state.
				if (this._requestId === null && this._head?.next) {
					this._requestId = requestAnimationFrame(this._tick);
				}
			}
		};
	}

	private _requestIfNeeded(): void {
		if (this._requestId === null && this._head?.next) {
			// ensure callbacks get correct delta
			this.lastTime = performance.now();
			this._lastFrame = this.lastTime;
			this._requestId = requestAnimationFrame(this._tick);
		}
	}

	private _cancelIfNeeded(): void {
		if (this._requestId !== null) {
			cancelAnimationFrame(this._requestId);
			this._requestId = null;
		}
	}

	private _startIfPossible(): void {
		if (this.started) {
			this._requestIfNeeded();
		} else if (this.autoStart) {
			this.start();
		}
	}

	add<T = any>(
		fn: TickerCallback<T>,
		context?: T,
		priority = UPDATE_PRIORITY.NORMAL
	): this {
		return this._addListener(new TickerListener(fn, context, priority));
	}

	addOnce<T = any>(
		fn: TickerCallback<T>,
		context?: T,
		priority = UPDATE_PRIORITY.NORMAL
	): this {
		return this._addListener(new TickerListener(fn, context, priority, true));
	}

	private _addListener(listener: TickerListener): this {
		// For attaching to head
		let current = this._head?.next;
		let previous = this._head;

		// Add the first item
		if (!current && previous) {
			listener.connect(previous);
		} else {
			// Go from highest to lowest priority
			while (current) {
				if (listener.priority > current.priority && previous) {
					listener.connect(previous);
					break;
				}
				previous = current;
				current = current.next;
			}

			// Not yet connected
			if (!listener.previous && previous) {
				listener.connect(previous);
			}
		}

		this._startIfPossible();

		return this;
	}

	remove<T = any>(fn: TickerCallback<T>, context?: T): this {
		let listener = this._head?.next;

		while (listener) {
			if (listener.match(fn, context)) {
				listener = listener.destroy();
			} else {
				listener = listener.next;
			}
		}

		if (!this._head?.next) {
			this._cancelIfNeeded();
		}

		return this;
	}

	get count(): number {
		if (!this._head) {
			return 0;
		}

		let count = 0;
		let current: TickerListener<any> | null = this._head;

		while ((current = current.next)) {
			count++;
		}

		return count;
	}

	start(): void {
		if (!this.started) {
			this.started = true;
			this._requestIfNeeded();
		}
	}

	stop(): void {
		if (this.started) {
			this.started = false;
			this._cancelIfNeeded();
		}
	}

	destroy(): void {
		if (!this._protected) {
			this.stop();

			let listener = this._head?.next;

			while (listener) {
				listener = listener.destroy(true);
			}

			this._head?.destroy();
			this._head = null;
		}
	}

	update(currentTime = performance.now()): void {
		let elapsedMS;

		if (currentTime > this.lastTime) {
			// Save uncapped elapsedMS for measurement
			elapsedMS = this.elapsedMS = currentTime - this.lastTime;

			// cap the milliseconds elapsed used for deltaTime
			if (elapsedMS > this._maxElapsedMS) {
				elapsedMS = this._maxElapsedMS;
			}

			elapsedMS *= this.speed;

			// If not enough time has passed, exit the function.
			// Get ready for next frame by setting _lastFrame, but based on _minElapsedMS
			// adjustment to ensure a relatively stable interval.
			if (this._minElapsedMS) {
				const delta = (currentTime - this._lastFrame) | 0;

				if (delta < this._minElapsedMS) {
					return;
				}

				this._lastFrame = currentTime - (delta % this._minElapsedMS);
			}

			this.deltaMS = elapsedMS;
			this.deltaTime = this.deltaMS * SETTINGS.TARGET_FPMS;

			// Cache a local reference, in-case ticker is destroyed
			// during the emit, we can still check for head.next
			const head = this._head;

			// Invoke listeners added to internal emitter
			let listener = head?.next;

			while (listener) {
				listener = listener.emit(this.deltaTime);
			}

			if (!head?.next) {
				this._cancelIfNeeded();
			}
		} else {
			this.deltaTime = this.deltaMS = this.elapsedMS = 0;
		}

		this.lastTime = currentTime;
	}

	get FPS(): number {
		return 1000 / this.elapsedMS;
	}

	get minFPS(): number {
		return 1000 / this._maxElapsedMS;
	}

	set minFPS(fps: number) {
		const minFPS = Math.min(this.maxFPS, fps);
		const minFPMS = Math.min(Math.max(0, minFPS) / 1000, SETTINGS.TARGET_FPMS);
		this._maxElapsedMS = 1 / minFPMS;
	}

	get maxFPS(): number {
		if (this._minElapsedMS) {
			return Math.round(1000 / this._minElapsedMS);
		}

		return 0;
	}

	set maxFPS(fps: number) {
		if (fps === 0) {
			this._minElapsedMS = 0;
		} else {
			const maxFPS = Math.max(this.minFPS, fps);
			this._minElapsedMS = 1 / (maxFPS / 1000);
		}
	}

	static get shared(): Ticker {
		if (!Ticker._shared) {
			const shared = (Ticker._shared = new Ticker());

			shared.autoStart = true;
			shared._protected = true;
		}

		return Ticker._shared;
	}

	static get system(): Ticker {
		if (!Ticker._system) {
			const system = (Ticker._system = new Ticker());

			system.autoStart = true;
			system._protected = true;
		}

		return Ticker._system;
	}
}
