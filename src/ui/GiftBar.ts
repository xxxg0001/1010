module ui {
	/**
	 *
	 * @author 
	 *
	 */
    export class GiftBar extends egret.DisplayObjectContainer {
        private barFill: egret.Bitmap;
        private barEmpty: egret.Bitmap;
        private bg: egret.Bitmap;
        private gift: egret.Bitmap;
        
        public static TOTAL_STEP: number = 100;
        private shake: effect.Shake;
        private event: GameEvent = new GameEvent(GameEvent.ON_GET_GIFT);
        public constructor() {
            super();
            this.barFill = new egret.Bitmap(RES.getRes("cls_bar_fill"));
            this.barEmpty = new egret.Bitmap(RES.getRes("cls_bar_empty"));
            this.bg = new egret.Bitmap(RES.getRes("cls_bar_leaf"));
            this.gift = new egret.Bitmap(RES.getRes("cls_gift"));
            this.bg.x = -10;
            this.bg.y = -10;

            this.addChild(this.barEmpty);
            this.gift.anchorOffsetX = this.gift.width / 2;
            this.gift.anchorOffsetY = this.gift.height / 2;
            this.gift.x = 300;
            this.gift.y = 10;
            this.gift.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGetGift,this);
            
            this.addChild(this.barFill);
            this.addChild(this.bg);
            this.addChild(this.gift);
            this.width = this.width + 10;
            this.height = this.height + 10;

            this.shake = new effect.Shake(this.gift,100,0,7);
            this.currentStep = 0;
        }


        private _currentStep: number = 0;
        set currentStep(value: number) {
            this._currentStep = value;

            this._currentStep = Math.min(this._currentStep,GiftBar.TOTAL_STEP);

            this.barFill.scaleX = this._currentStep / GiftBar.TOTAL_STEP;
            if(this._currentStep == GiftBar.TOTAL_STEP) {
                this.onGetGift();
                //this.shake.start();
                //this.gift.touchEnabled = true;
            }
        }
        private onGetGift(/*e: egret.TouchEvent*/): void {
            if(this._currentStep < GiftBar.TOTAL_STEP) {
                return;
            }
            this.dispatchEvent(this.event);
            this.clearStep();
            //this.gift.touchEnabled = false;

        }
        get currentStep(): number {
            return this._currentStep;
        }

        public addStep(step: number): void {
            this.currentStep += step;
        }

        public clearStep(): void {
            this.currentStep = 0;
            //this.shake.stop();
        }
        public loadStorage(): void {
            var currentStep: number = toNumber(egret.localStorage.getItem("giftStep"));
            this.currentStep = currentStep;
        }
        public saveStorage(): void {
            egret.localStorage.setItem("giftStep",this.currentStep.toString());
        }

    }
}

