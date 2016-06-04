module effect {
	/**
	 *
	 * @author 
	 *
	 */
	export class Shake {
        protected shakeTimer: egret.Timer;
        protected range: number;
        protected orgX: number;
        protected orgY: number;
        protected rotation: number;
        protected target: egret.DisplayObject;

		public constructor(target:egret.DisplayObject, delay:number, repeatCount:number, range:number) {
            this.shakeTimer = new egret.Timer(delay,repeatCount);
            this.range = range;
            this.target = target;
            this.orgX = target.x;
            this.orgY = target.y;
            this.shakeTimer.addEventListener(egret.TimerEvent.TIMER,this.onTimer,this);
            this.shakeTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,this.onTimerComplete,this);
		}
		private onTimer(e:egret.TimerEvent):void {
            var rangeX:number = this.range * Math.random();
            var rangeY:number = this.range * Math.random();
            
            this.target.x = this.orgX + (2 * Math.random() - 1) * rangeX;
            this.target.y = this.orgY + (2 * Math.random() - 1) * rangeY;
		}
		private onTimerComplete(e:egret.TimerEvent):void {
            this.target.x = this.orgX;
            this.target.y = this.orgY;
		}
        public start():void {
            if (this.shakeTimer.running) {
                return;
            }
            this.shakeTimer.start();
        }
        public stop():void {
            this.target.x = this.orgX;
            this.target.y = this.orgY;
            this.shakeTimer.stop();
            this.shakeTimer.reset();
        }
	}
}
