export enum UPDATE_PRIORITY {
	INTERACTION = 50,
	HIGH = 25,
	NORMAL = 0,
	LOW = -25,
	UTILITY = -50,
}

export const SETTINGS: any = {
	TARGET_FPMS: 0.06,
	ROUND_PIXELS: false,
};

export type TickerCallback<T> = (this: T, dt: number) => any;

export class TickerListener<T = any> {
	public priority: number;
	public next: TickerListener | null = null;
	public previous: TickerListener | null = null;
	private fn: TickerCallback<T>;
	private context: T | null;
	private once: boolean;
	private _destroyed = false;

	constructor(
		fn: TickerCallback<T>, // The listener function to be added for one update
		context: T | null = null, //The listener context
		priority = 0, //The priority for emitting
		once = false // If the handler should fire once
	) {
		this.fn = fn;
		this.context = context;
		this.priority = priority;
		this.once = once;
	}

	match(fn: TickerCallback<T>, context: any = null): boolean {
		return this.fn === fn && this.context === context;
	}

	emit(deltaTime: number): TickerListener | null {
		if (this.fn) {
			if (this.context) {
				this.fn.call(this.context, deltaTime);
			} else {
				(this as TickerListener<any>).fn(deltaTime);
			}
		}

		const redirect = this.next;

		if (this.once) {
			this.destroy(true);
		}

		if (this._destroyed) {
			this.next = null;
		}

		return redirect;
	}

	connect(previous: TickerListener): void {
		this.previous = previous;
		if (previous.next) {
			previous.next.previous = this;
		}
		this.next = previous.next;
		previous.next = this;
	}

	destroy(hard = false): TickerListener | null {
		this._destroyed = true;
		this.fn = () => null;
		this.context = null;

		if (this.previous) {
			this.previous.next = this.next;
		}

		if (this.next) {
			this.next.previous = this.previous;
		}

		const redirect = this.next;

		this.next = hard ? null : redirect;
		this.previous = null;

		return redirect;
	}
}
