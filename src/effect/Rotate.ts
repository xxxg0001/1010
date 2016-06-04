module effect {
	/**
	 *
	 * @author 
	 *
	 */
	export class Rotate {
        protected timer: egret.Timer;
        protected speed: number;
        protected target: egret.DisplayObject;
		public constructor(target:egret.DisplayObject, delay:number, repeatCount:number, speed:number) {
            this.timer = new egret.Timer(delay,repeatCount);
            this.speed = speed;
            this.target = target;
            this.timer.addEventListener(egret.TimerEvent.TIMER,this.onTimer,this);
		}
        private onTimer(e: egret.TimerEvent): void {
            this.target.rotation += this.speed;
        }
        public start():void {
            if (this.timer.running) {
                return;
            }
            this.timer.start();
        }
        public stop():void {
            this.timer.stop();
            this.timer.reset();
        }
	}
}
