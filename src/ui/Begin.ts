module ui {
	/**
	 *
	 * @author 
	 *
	 */
	export class Begin extends egret.DisplayObjectContainer{
		public constructor() {
            super();
            this.width = Common.WIDTH;
            this.height = Common.HEIGHT;
            var btnWidth: number = Common.WIDTH * 0.5;
            var btnHeight: number = Common.HEIGHT * 0.06;
            var yGaps: number = Common.HEIGHT * 0.08;
            var xSet:number = Common.WIDTH / 2
            var ySet:number = Common.HEIGHT * 0.5;
            var bg1: egret.Bitmap = new egret.Bitmap(RES.getRes("bg_cover_up"));
            this.addChild(bg1);
            var bg2: egret.Bitmap = new egret.Bitmap(RES.getRes("bg_cover_down"));
            bg2.y = bg1.height;
            this.addChild(bg2);
            var btn: egret.Bitmap = new egret.Bitmap(RES.getRes("button_jdms"));
            btn.name = "button_jdms";
            btn.touchEnabled = true;
            this.addChild(btn);
            btn.anchorOffsetX = btn.width / 2;
            btn.anchorOffsetY = btn.height / 2;
            btn.x = this.width / 2;
            btn.y = this.height / 2 - btn.height/2 - 10;
            btn = new egret.Bitmap(RES.getRes("button_cgms"));
            btn.touchEnabled = true;
            btn.name = "button_cgms";
            this.addChild(btn);
            btn.anchorOffsetX = btn.width / 2;
            btn.anchorOffsetY = btn.height / 2;
            btn.x = this.width / 2;
            btn.y = this.height / 2 + btn.height/2 + 10;

            this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onStart,this);
		}
        
        
        private onStart(e: egret.TouchEvent): void {
            var game: Game;
            switch (e.target.name) {
                case "button_jdms":
                    game = new Game(0, "normal");
                    break;
                case "button_cgms":
                    game = new Game(1, "level");
                    break;
                default:
                    return;
                    
            }
            var parent = this.parent;
            parent.removeChild(this);
            parent.addChild(game);
            game.init();
        }
	}
}
