module ui {
	/**
	 *
	 * @author 
	 *
	 */
	export class PauseMenu extends Base{
		public constructor() {
            super();
            this.init();
		}
		public init():void {
            var xSet:number = 0, ySet:number = 0;
            var btn: egret.Bitmap = new egret.Bitmap(RES.getRes("clsBtnContinue"));
            btn.name = "btn_continue";
            btn.touchEnabled = true;
            ySet += btn.height + btn.height * 0.02;
            this.addChild(btn);
                    
            btn = new egret.Bitmap(RES.getRes("clsBtnHome"));
            btn.name = "btn_home";
            btn.touchEnabled = true;
            btn.x = xSet, btn.y = ySet;
            this.addChild(btn);
            xSet += btn.width + this.width * 0.01;
                    
            btn = new egret.Bitmap(RES.getRes("clsBtnAgain"));
            btn.name = "btn_again";
            btn.touchEnabled = true;
            btn.x = xSet, btn.y = ySet;
            this.addChild(btn);
		}
	}
}
