module effect {
	/**
	 *
	 * @author 
	 *
	 */
	export class CountDown {
        private txtCountdown: egret.BitmapText;
        private countdown: number;
        private static TIMEOUT: number = 15;
        private timer: egret.Timer = null;
		public constructor(onTimerComplete:Function, thisObject:any) {
            this.countdown = CountDown.TIMEOUT;
            this.timer = new egret.Timer(1000, CountDown.TIMEOUT + 1);
            this.timer.addEventListener(egret.TimerEvent.TIMER,this.onTimer,this);
            this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,onTimerComplete,thisObject);
            this.txtCountdown = new egret.BitmapText();
            this.txtCountdown.font = RES.getRes("bf1_fnt");
            this.txtCountdown.alpha = 0;
            this.txtCountdown.scaleX = this.txtCountdown.scaleY = 1;
            this.txtCountdown.text = this.countdown.toString();
            this.txtCountdown.anchorOffsetX = this.txtCountdown.width / 2;
            this.txtCountdown.anchorOffsetY= this.txtCountdown.height / 2;
            
		}
		
		public set x(n:number) {
            this.txtCountdown.x = n;
		}
        public set y(n:number) {
            this.txtCountdown.y = n;
        }
        private onTimer(e: egret.TimerEvent):void {

            this.txtCountdown.text = this.countdown.toString();
            this.countdown--;
            this.txtCountdown.alpha = 1;
            egret.Tween.get(this.txtCountdown).to({ alpha: 0 },990,egret.Ease.circIn);
        }
        public start(objContainer:egret.DisplayObjectContainer):void {
            this.timer.reset();
            this.countdown = CountDown.TIMEOUT;
            this.timer.start();
            objContainer.addChild(this.txtCountdown);
        }
        
        public resume() {
            if(this.timer.running) {
                return;
            }
            this.timer.start();
        }
        public pause(): void {
            if(this.timer.running) {
                this.timer.stop();
            }
        }
        public stop():void {
            if(this.timer.running) {
                this.timer.stop();
            }
            if(this.txtCountdown.parent != null) {
                this.txtCountdown.parent.removeChild(this.txtCountdown);
            }
        }
	}
}
