module effect {
	/**
	 *
	 * @author 
	 *
	 */
	export class Light extends egret.DisplayObjectContainer{
		public constructor() {
            super();
            var img3 = new egret.Bitmap(RES.getRes("glow_03_png"));
            img3.anchorOffsetX = img3.width / 2;
            img3.anchorOffsetY = img3.height / 2;
            img3.blendMode = egret.BlendMode.ADD;
            this.addChild(img3);
            var rotate:Rotate = new Rotate(img3,1,0,-1.8);
            rotate.start();
            

            var img2 = new egret.Bitmap(RES.getRes("glow_02_png"));
            img2.anchorOffsetX = img2.width / 2;
            img2.anchorOffsetY = img2.height / 2;
            img2.blendMode = egret.BlendMode.ADD;
            this.addChild(img2);
            rotate = new Rotate(img2,1,0, 1.8);
            rotate.start();
            
            var img1 = new egret.Bitmap(RES.getRes("glow_01_png"));
            img1.anchorOffsetX = img1.width / 2;
            img1.anchorOffsetY = img1.height / 2;
            img1.blendMode = egret.BlendMode.ADD;
            this.addChild(img1);
		}
	}
}
