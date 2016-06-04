module ui {
	/**
	 *
	 * @author 
	 *
	 */
    export class ToolsField extends egret.DisplayObjectContainer {
        public static defaultItemCount1 = 1;
        public static defaultItemCount2 = 1;

        private _itemCount1: number = 0;
        private _itemCount2: number = 0;

        private _itemCountFromPay1: number = 0;
        private _itemCountFromPay2: number = 0;
        private gameMode: string;


        private txtItemCount1: egret.TextField = null;
        private txtItemCount2: egret.TextField = null;

        public get itemCount1(): number {
            return this._itemCount1 + this._itemCountFromPay1;
        }
        public get itemCount2(): number {
            return this._itemCount2 + this._itemCountFromPay2;
        }

        public constructor(gameMode: string) {
            super();
            this.gameMode = gameMode;
            this._itemCount1 = 0;
            this._itemCount2 = 0;
            this._itemCountFromPay1 = 0;
            this._itemCountFromPay2 = 0;
            this.txtItemCount1 = new egret.TextField();
            this.addTool("refresh",this.txtItemCount1);
            this.txtItemCount2 = new egret.TextField();
            this.addTool("transform",this.txtItemCount2)
            var xSet: number = 0;
            for(var i: number = 0;i < this.numChildren;i++) {
                var btn = this.getChildAt(i);
                btn.x = xSet;
                xSet += btn.width + 30;
            }

            this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTool,this);
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouchBegin,this);
            this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.onTouchEnd,this);
            this.cacheAsBitmap = true;


        }

        public tween() {
            for(var i: number = 0;i < this.numChildren;i++) {
                var btn: egret.DisplayObject = this.getChildAt(i);
                btn.scaleX = 1;
                btn.scaleY = 1;
                egret.Tween.get(btn,{ loop: true }).to({ scaleX: 1.2,scaleY: 1.2 },600).to({ scaleX: 1,scaleY: 1 },300);
            }
        }
        public stoptween() {
            for(var i: number = 0;i < this.numChildren;i++) {
                var btn: egret.DisplayObject = this.getChildAt(i);
                egret.Tween.removeTweens(btn);
                btn.scaleX = 1;
                btn.scaleY = 1;
            }
        }

        private addTool(res: string,txtItemCount: egret.TextField): void {
            var tag: egret.Bitmap = new egret.Bitmap(RES.getRes("clsNumber_bg"));
            var btWidth: number = this.width * 0.1;
            var btHeight: number = this.height * 0.04;
            var btSpace: number = this.width * 0.02;
            var fontSize: number = this.height * 0.018;
            var btn: egret.Sprite = new egret.Sprite();
            var img: egret.Bitmap = new egret.Bitmap(RES.getRes(res));
            btn.name = res;
            btn.addChild(img);
            tag.anchorOffsetX = tag.width / 2;
            tag.anchorOffsetY = tag.height / 2;
            tag.x = 80;
            tag.y = 12;
            btn.addChild(tag);
            txtItemCount.text = "0";
            txtItemCount.size = 24;
            txtItemCount.x = tag.x;
            txtItemCount.y = tag.y;
            txtItemCount.anchorOffsetX = txtItemCount.width / 2;
            txtItemCount.anchorOffsetY = txtItemCount.height / 2;
            btn.addChild(txtItemCount);
            btn.touchEnabled = true;
            btn.anchorOffsetX = btn.width / 2;
            btn.anchorOffsetY = btn.height / 2;
            this.addChild(btn);
        }
        private onTouchBegin(e: egret.TouchEvent): void {
            this.stoptween();
            var btn: egret.DisplayObject = <egret.DisplayObject>e.target;
            btn.scaleX = 1.2;
        }
        private onTouchEnd(e: egret.TouchEvent): void {
            this.stoptween();
            var btn: egret.DisplayObject = <egret.DisplayObject>e.target;
            btn.scaleX = 1;
        }
        private onTool(e: egret.TouchEvent): void {
            var btn: egret.DisplayObject = <egret.DisplayObject>e.target;
            btn.scaleX = 1;
            switch(e.target.name) {
                case "refresh":

                    if(this.itemCount1 <= 0) {
                        this.dispatchEvent(new GameEvent(GameEvent.ON_TOOL_EMPTY));
                    } else {
                        this.onTool1();
                    }
                    break;
                case "transform":
                    if(this.itemCount2 <= 0) {
                        this.dispatchEvent(new GameEvent(GameEvent.ON_TOOL_EMPTY));
                    } else {
                        this.onTool2();
                    }
                    break;
            }

        }
        private onTool1(): void {
            if(this.itemCount1 <= 0) {
                return;
            }
            this.reduceTool1Count();
            this.updateItemCount();
            var e: GameEvent = new GameEvent(GameEvent.USE_TOOL);
            e.data = "refresh";
            this.dispatchEvent(e);
        }
        private onTool2(): void {
            if(this.itemCount2 <= 0) {
                return;
            }
            this.reduceTool2Count();
            this.updateItemCount();
            var e: GameEvent = new GameEvent(GameEvent.USE_TOOL);
            e.data = "transform";
            this.dispatchEvent(e);
        }
        public updateItemCount(): void {
//            if (this._itemCount1 <=0) {
//                this.txtItemCount1.text = this.itemCount1.toString();
//            } else {
//                this.txtItemCount1.text = this._itemCount1.toString() + "+"+this._itemCountFromPay1.toString();
//            }
//            if (this._itemCount2 <=0) {
//                this.txtItemCount2.text = this.itemCount2.toString();
//            } else {
//                this.txtItemCount2.text = this._itemCount2.toString() + "+"+this._itemCountFromPay2.toString();
//            }
            this.txtItemCount1.text = this.itemCount1.toString();
            this.txtItemCount2.text = this.itemCount2.toString();
            //this.getChildAt(0).touchEnabled = this.itemCount1 > 0;
            //this.getChildAt(1).touchEnabled = this.itemCount2 > 0;
        }
        public loadStorage(frist:boolean, mode:string): void {
            
            this._itemCount1 = toNumber(egret.localStorage.getItem(mode+"_itemCount1"));
            this._itemCount2 = toNumber(egret.localStorage.getItem(mode+"_itemCount2"));
            this._itemCountFromPay1 = toNumber(egret.localStorage.getItem("_itemCountFromPay1"));
            this._itemCountFromPay2 = toNumber(egret.localStorage.getItem("_itemCountFromPay2"));
            
            if(frist) {
                this.setDefault(mode);
            }
            this.updateItemCount();
        }
        public saveStorage(mode:string): void {
            egret.localStorage.setItem(mode+"_itemCount1",this._itemCount1.toString());
            egret.localStorage.setItem(mode+"_itemCount2",this._itemCount2.toString());
            egret.localStorage.setItem("_itemCountFromPay1",this._itemCountFromPay1.toString());
            egret.localStorage.setItem("_itemCountFromPay2",this._itemCountFromPay2.toString());                        
        }
        
        public setDefault(mode:string):void {
            switch(mode) {
                case "normal":
                this._itemCount1 = ToolsField.defaultItemCount1;
                this._itemCount2 = ToolsField.defaultItemCount2;
                break;
                case "level":
                this._itemCount1 = 0;
                this._itemCount2 = 0;
                break;
            }
        }
        
        public reduceTool1Count():void {
            if (this._itemCount1 > 0 ) {
                this._itemCount1--;
            } else {
                this._itemCountFromPay1--;
            }
        }
        public reduceTool2Count():void {
            if (this._itemCount2 > 0 ) {
                this._itemCount2--;
            } else {
                this._itemCountFromPay2--;
            }
        }
        public addTool1Count(): void {
            this._itemCount1++;
            this.updateItemCount();
        }
        public addTool2Count(): void {
            this._itemCount2++;
            this.updateItemCount();
        }
        
        public addTool1CountFromPay(): void {
            this._itemCountFromPay1+=5;
            this.updateItemCount();
        }
        public addTool2CountFromPay(): void {
            this._itemCountFromPay2+=5;
            this.updateItemCount();
        }
        
        public getTool1GlobalPoint():egret.Point {
            return this.txtItemCount1.parent.localToGlobal(this.txtItemCount1.x,this.txtItemCount1.y);
        }
        public getTool2GlobalPoint():egret.Point {
            return this.txtItemCount2.parent.localToGlobal(this.txtItemCount2.x,this.txtItemCount2.y);
        }
        
        public onPaySuccess() {

            this.addTool1CountFromPay();
            this.addTool2CountFromPay();
            this.saveStorage(this.gameMode);

        }
	}
}
