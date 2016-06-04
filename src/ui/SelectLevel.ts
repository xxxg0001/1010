module ui {
	/**
	 *
	 * @author 
	 *
	 */
	export class SelectLevel extends Base{
        private game: Game;
        private btnLvls: egret.Sprite;
        private curSection:number;
        private btnField: egret.Sprite;
		public constructor(game:Game, section:number = 0) {
            super();
            this.game = game;
            var bg:egret.Bitmap = new egret.Bitmap(RES.getRes("selectpoint_bg_png"));
            bg.name = "bg";
            this.addChild(bg);
            
            this.btnLvls = new egret.Sprite();
            this.addChild(this.btnLvls);
            this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClick,this);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onMove,this);
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onMove,this);
            this.curSection = section;
            bg.touchEnabled = true;
            this.reset(this.curSection);
            this.cacheAsBitmap = true;
            
		}
		private reset(section:number) :void {
            if(section < 0 || section * 12 + 1 >= Common.levelsData.length) {
                return;
            }
            this.btnLvls.removeChildren();
            var gaps:number, yStart:number, xStart:number;
            var itemWidth:number, itemHeight:number;
            var nLvls:number = section * 12 + 1;
            var count:number = 0;
            var nUnlockTo: number = toNumber(egret.localStorage.getItem("level_unlockto"));
            if(nUnlockTo <= 0) {
                nUnlockTo = 1;
            }
            var txeBtnPoint:egret.Texture = RES.getRes("button_point_png");
            var txeBtnLock:egret.Texture = RES.getRes("button_lock_png");
            itemWidth = txeBtnPoint.textureWidth, itemHeight = txeBtnPoint.textureHeight;
            xStart = Common.WIDTH * 0.11;
            yStart = Common.HEIGHT * 0.06;
            gaps = (this.width - itemWidth * 3 - xStart * 2) / 2;
            
            for(;nLvls < Common.levelsData.length;nLvls++) {
                var item: egret.Sprite = new egret.Sprite;
                if(nLvls <= nUnlockTo) {
                    var imgbt: egret.Bitmap = new egret.Bitmap(txeBtnPoint);
                    imgbt.name = "activelvl";
                    item.addChild(imgbt);
                    imgbt.touchEnabled = true;
                    var txt: egret.TextField = new egret.TextField();
                    txt.text = nLvls.toString();
                    txt.size = itemHeight/2;
                    txt.textColor = 0xffffffff;
                    txt.x = itemWidth / 2 ;
                    txt.y = itemHeight / 2 - 10;
                    txt.anchorOffsetX = txt.width / 2;
                    txt.anchorOffsetY = txt.height / 2;
                    item.addChild(txt);
                } else {
                    item.addChild(new egret.Bitmap(txeBtnLock));
                }
               
                item.x = xStart + count % 3 * (itemWidth + gaps);
                item.y = yStart + Math.floor((count / 3)) * (itemHeight + gaps * 0.45);
                this.btnLvls.addChild(item);
                item.name = nLvls.toString();
                if(++count >= 12) {
                    break;
                }
            }
            if(this.btnField == null) {
                this.btnField = new egret.Sprite();
                var nSectionCount:number = Math.ceil((Common.levelsData.length - 1) / 12);
                var gapsSection:number = Common.WIDTH * 0.08;
                for(var i: number = 0;i < nSectionCount;i++) {
                    var btn: egret.Sprite = new egret.Sprite();
                    var img: egret.Bitmap = new egret.Bitmap(RES.getRes("clsSection1"));
                    var bg = new egret.Shape();
                    bg.graphics.beginFill(0xff0000,0);
                    bg.graphics.drawRect(0, 0, gapsSection, gapsSection);
                    bg.graphics.endFill();
                    btn.addChild(bg);
                    btn.addChild(img);
                    bg.anchorOffsetX = bg.width / 2;
                    bg.anchorOffsetY = bg.height / 2;
                    img.anchorOffsetX = img.width / 2;
                    img.anchorOffsetY = img.height / 2;
                    btn.name = "btnSection";
                    btn.touchEnabled = true;
                    this.btnField.addChild(btn);
                    btn.x = gapsSection * i;
                    if(i == section) {
                        btn.alpha = 1;
                    } else {
                        btn.alpha = 0.5;
                    }                    
                }
                this.btnField.x = this.width / 2 - this.btnField.width / 2;
                this.btnField.y = this.height - Common.HEIGHT * 0.06;
                this.addChild(this.btnField);
            } else {
                this.btnField.getChildAt(this.curSection).alpha = 0.5;
                this.btnField.getChildAt(section).alpha = 1;
            }
            this.curSection = section;
		}
        private touchX: number;
        //private touchY: number;

        private onMove(e: egret.TouchEvent): void {
            var total: number = Math.ceil((Common.levelsData.length - 1) / 12);
            switch(e.type) {
                case "touchBegin":
                    
                    this.touchX = e.stageX;
                    break;
                case "touchMove":
                    var offset: number = Math.round((e.stageX - this.touchX)/(this.width*0.2));
                    if(offset > 0) {
                        this.reset(this.curSection - offset);
                        this.touchX = e.stageX;

                    } else if(offset < 0) {
                        this.reset(this.curSection - offset);
                        this.touchX = e.stageX;
                    }
                    break;
            }
        }
        private onClick(e: egret.TouchEvent): void {
            if(this.btnLvls.x != 0) {
                this.btnLvls.x = 0;
                return;
            }
            
            switch(e.target.name) {
                case "btnSection":
                    var nSection: number = e.target.parent.getChildIndex(e.target);
                    if(nSection != this.curSection) {
                        this.reset(nSection);
                    }
                    break;
                case "bg":
                    
                    var pt: egret.Point = (<egret.DisplayObject>e.target).globalToLocal(e.stageX,e.stageY);
                    // 点到X
                    if(e.localX > this.width - Common.WIDTH * 0.09 && e.localY < Common.HEIGHT * 0.045) {
                        this.close();
                    }
                    break;
                case "activelvl":
                    var btn: egret.Sprite = <egret.Sprite>e.target.parent;
                    var lvl: number = toNumber(btn.name);
                    this.close();
                    this.game.selLvl(lvl);
                    break;
            }
        }
	}
}
