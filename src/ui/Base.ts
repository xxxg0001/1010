module ui {
	/**
	 *
	 * @author 
	 *
	 */
	export class Base extends egret.DisplayObjectContainer{
        public modalMask: egret.Shape;
		public constructor() {
            super();
            this.modalMask = new egret.Shape();
            this.modalMask.graphics.beginFill(0x000000,0.5);
            this.modalMask.graphics.drawRect(0, 0, Common.WIDTH, Common.HEIGHT);
            this.modalMask.graphics.endFill();
		}
		
		public open(parent:egret.DisplayObjectContainer) {
            parent.addChild(this.modalMask);
            parent.addChild(this);
            this.modalMask.touchEnabled = true;
            
            this.x = Common.WIDTH / 2;
            this.y = Common.HEIGHT / 2;
            this.anchorOffsetX = this.width / 2;
            this.anchorOffsetY = this.height / 2;
            this.scaleX = 0;
            this.scaleY = 0;
            egret.Tween.get(this).to({ scaleX: 1,scaleY: 1 },200);
            
		}
        public openWithEffect(parent:egret.DisplayObjectContainer) {
            parent.addChild(this.modalMask);
            parent.addChild(this);
            this.modalMask.touchEnabled = true;                
        }
		public close() :void {
            this.parent.removeChild(this.modalMask);
            this.parent.removeChild(this);
		}
	}
}
