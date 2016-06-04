module ui {
	/**
	 *
	 * @author 
	 *
	 */
	export class Popmessage {
        private txt: egret.TextField;
        public constructor(msg: string) {
            this.txt = new egret.TextField();
            var stage: egret.Stage = egret.MainContext.instance.stage;
            this.txt.text = msg;
            this.txt.background = true;
            this.txt.backgroundColor = 0x000000;
            this.txt.alpha = 0.9;
            this.txt.width += 10;
            this.txt.height += 10;
            this.txt.textAlign = egret.HorizontalAlign.CENTER;
            this.txt.verticalAlign = egret.VerticalAlign.MIDDLE;
            
            
            this.txt.x = Common.WIDTH / 2;
            this.txt.y = Common.HEIGHT / 2;
            this.txt.anchorOffsetX = this.txt.width / 2;
            this.txt.anchorOffsetY = this.txt.height / 2;
            stage.addChild(this.txt);
		}
		private Pop() {
            var stage: egret.Stage = egret.MainContext.instance.stage;
            egret.Tween.get(this.txt).to({ y: Common.HEIGHT / 2 - 50 },500).wait(500).to({ alpha: 0 }, 500).call(this.close,this);
		}
		public static show(msg:string) {
            var p:Popmessage =  new Popmessage(msg);
            p.Pop();
		}
		
        private close() {
            egret.MainContext.instance.stage.removeChild(this.txt);
        }
	}
}
