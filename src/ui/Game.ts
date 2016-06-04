module ui {

    /**
    *
    * @author 
    *
    */
    
    export class Game extends egret.DisplayObjectContainer {

        //private MAX_VIEW_BLOCK_ID: number = 6;
        private bTestMode: boolean;
        public bGuide: boolean;
        private scoreField: ui.ScoreField;
        public boardMap: BoardMap;
        public shapesField: ShapesField;
        public toolsField: ui.ToolsField;
        private shop: ui.Shop;
        //private txtScore: egret.TextField;
        //private txtHighScore: egret.TextField;
        private moves: number;
        private txtMoves: egret.TextField;
//        private txtScore: egret.BitmapText;
//        private txtHighScore: egret.BitmapText
        //private imgAchievement: egret.Bitmap;
        private txtMission: egret.TextField;

        private ptPickUp: egret.Point = new egret.Point();
        private pickUpShape: Shape = null;
        

        private curSel: Shape = null;
        public levels: any[];
        private curLevel: number;
        private gameMode: string;

        private uiGiftBar: ui.GiftBar;
        
     
        private txtTargetCount: egret.TextField;
     
        private bDead: boolean = false;
        private highScoreTimer: egret.Timer;
        private shapesRate: ShapesRate;

        private score: number = 0;
        //private hightScore: number = 100;

        
        
        
        private countdown: effect.CountDown;
        


        public constructor(activeLvl: number = 1,gameMode: string = "normal",bTestMode: boolean = false) {
            super();
            this.width = Common.WIDTH;
            this.height = Common.HEIGHT;

            this.bTestMode = bTestMode;
            this.curLevel = activeLvl;
            this.gameMode = gameMode;
            this.bGuide = false;
            
            this.moves = 0;
            this.countdown = new effect.CountDown(this.onTimerComplete, this);
        }

        public init(): void {

            var imgBg: egret.Bitmap = new egret.Bitmap(RES.getRes("bgImage"));
            this.addChild(imgBg);
            imgBg.width = this.width;
            imgBg.height = this.height;

            this.boardMap = new BoardMap(10,10);
            this.boardMap.x = (this.width - this.boardMap.width) / 2;
            this.boardMap.y = this.height * 0.2;

            var imgWbg: egret.Bitmap = new egret.Bitmap(RES.getRes("white_bg"));
            imgWbg.x = this.boardMap.x + (this.boardMap.width - imgWbg.width) / 2;
            imgWbg.y = this.boardMap.y + (this.boardMap.height - imgWbg.height) / 2;
            this.addChild(imgWbg);
            this.addChild(this.boardMap);


            var btnMenu:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
            var btnImg:egret.Bitmap = new egret.Bitmap(RES.getRes("clsBtnMenu"));
            var btnMask: egret.Shape = new egret.Shape();            
            
            btnMask.graphics.beginFill(0xff0000,0);
            btnMask.graphics.drawRect(0, 0, btnImg.width * 2, btnImg.height);
            btnMask.graphics.endFill();
            btnMenu.addChild(btnMask);
            btnMenu.addChild(btnImg);
            
            
            btnMenu.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtnMenu,this);
            btnMenu.touchEnabled = true;
            this.addChild(btnMenu);
            btnMenu.x = this.width - btnMenu.width/2 - this.width * 0.04;
            btnMenu.y = this.height * 0.036;

            this.shapesField = new ShapesField();
            this.addChild(this.shapesField);
            this.shapesField.y = this.height - Shape.SHAPE_MAX_HEIGHT * this.shapesField.shapesScale - this.height * 0.05;
            this.shapesField.orgShapesFieldY = this.shapesField.y;

            this.shapesField.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchShape,this);
            this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.moveShape,this);
            this.stage.addEventListener(egret.TouchEvent.TOUCH_END,this.dropShape,this);

            //this.hightScore = 0;
            
            this.shapesRate = new ShapesRate();

            switch(this.gameMode) {
                case "normal":
                    this.initNormalMode();
                    break;
                case "level":
                    this.initLevelMode();
                    break;
            }
            this.initToolField();
            this.countdown.x = this.boardMap.x + this.boardMap.width / 2;
            this.countdown.y = this.boardMap.y + this.boardMap.height / 2;

            this.reset();
            
            var isGuide = egret.localStorage.getItem(this.gameMode + "_guide") == null;
            if(isGuide) {
                var guide: Guide = new Guide(this);
                switch(this.gameMode) {
                    case "normal":
                        guide.loadNormalMode();
                        break;
                    case "level":
                        guide.loadLevelMode();
                        break;
                }
                egret.localStorage.setItem(this.gameMode + "_guide","1");
            } else {
                this.loadState();
            }
        }

        public initNormalMode(): void {
            this.initScoreField();
            this.uiGiftBar = new ui.GiftBar();
            this.addChild(this.uiGiftBar);
            this.uiGiftBar.anchorOffsetX = this.uiGiftBar.width / 2;
            this.uiGiftBar.anchorOffsetY = this.uiGiftBar.height / 2;
            this.uiGiftBar.x = this.width / 2;
            this.uiGiftBar.y = this.height * 0.15;
            this.uiGiftBar.addEventListener(GameEvent.ON_GET_GIFT,this.onGetGift,this);
        }

        public initLevelMode(): void {
            this.txtMission = new egret.TextField();
            this.txtMission.textColor = 0xf0ff32;
            this.txtMission.size = this.height * 0.03;
            this.txtMission.x = this.width / 2;
            this.txtMission.y = this.height * 0.057;
            
            this.updateMissionText();
            this.addChild(this.txtMission);
            
            
            this.txtMoves = new egret.TextField();
            this.txtMoves.size = this.height * 0.03;
            this.txtMoves.x = this.width / 2;
            this.txtMoves.y = this.txtMission.y + this.txtMission.height / 2 + this.height * 0.057;
            
            this.addChild(this.txtMoves);
            
            
            var target: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
            var targetImg: egret.Bitmap = new egret.Bitmap(RES.getRes("clsGrid1001"));
            targetImg.scaleX = targetImg.scaleY = 0.5;
            
            this.txtTargetCount = new egret.TextField();
            this.txtTargetCount.size = targetImg.width * targetImg.scaleX;
            this.txtTargetCount.x = targetImg.x + targetImg.width * targetImg.scaleX + this.width * 0.03;
            this.txtTargetCount.text = "0/0";
            
            target.addChild(targetImg);
            target.addChild(this.txtTargetCount);
            
            target.x = this.width * 0.02
            target.y = this.txtMission.y + this.txtMission.height / 2 + this.height * 0.057 
            this.addChild(target);
            var btnSelLvl:egret.Bitmap = new egret.Bitmap(RES.getRes("cls_btnSelectLvl"));
            btnSelLvl.x = this.width * 0.8;
            btnSelLvl.y = this.height * 0.036;
            this.addChild(btnSelLvl);
            btnSelLvl.touchEnabled = true;
            btnSelLvl.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtnSelLvl,this);
            
        }
        
        private updateMoves(): void {
            this.txtMoves.text = "moves: " + this.moves;
            this.txtMoves.anchorOffsetX = this.txtMoves.width / 2;
            this.txtMoves.anchorOffsetY = this.txtMoves.height / 2;
        }
        public selLvl(level:number):void {
            this.curLevel = level;
            if (this.curLevel >= Common.levelsData.length) {
                this.curLevel = 0;
            }
            this.reset();
            
        }
        private onBtnSelLvl(e:egret.TouchEvent):void {
            var uiSelectLvl:ui.SelectLevel = new ui.SelectLevel(this);
            uiSelectLvl.open(this);
        }
        private updateMissionText(): void {
            this.txtMission.text = "Level." + this.curLevel.toString();
            this.txtMission.anchorOffsetX = this.txtMission.width / 2;
            this.txtMission.anchorOffsetY = this.txtMission.height / 2;
        }
        private initToolField() {
            this.toolsField = new ui.ToolsField(this.gameMode);
            this.addChild(this.toolsField);
            this.toolsField.x = this.width - this.toolsField.width / 2 - this.width * 0.1;
            this.toolsField.y = this.boardMap.y + this.boardMap.height + this.toolsField.height;
            this.toolsField.addEventListener(GameEvent.USE_TOOL,this.onTool,this);
            this.toolsField.addEventListener(GameEvent.ON_TOOL_EMPTY,this.showShop,this);

            this.shop = new Shop(this.toolsField, this.countdown);
        }
        private showShop(e:GameEvent):void {
            this.shop.open(this);
        }
        private onTool(e: GameEvent): void {
            switch(e.data) {
                case "refresh":
                    this.onTool1();
                    break;
                case "transform":
                    this.onTool2();
                    break;
            }
            this.saveState()
        }

        private onTool1(): void {
            this.pickUpShape = null;
            this.shapesField.removeChildren();
            this.addRandShapes();
            DCAgent.onEvent("use tool 1",1,JSON.parse(JSON.stringify({ mode:this.gameMode})));
            this.checkGame(true);

        }
        private onTool2(): void {
            this.pickUpShape = null;
            DCAgent.onEvent("use tool 2",1,JSON.parse(JSON.stringify({ mode:this.gameMode})));
            var uiSel: ui.Base = new ui.Base();
            var xOffset: number = 0;
            for(var i: number = 0;i < this.shapesField.numChildren;i++) {
                var shape: Shape = <Shape>this.shapesField.getChildAt(i);
                var newShape: Shape = new Shape(GridTexture.inst,shape.blockId,shape.groupId);
                newShape.fromData(shape.toData());
                newShape.name = i.toString();
                newShape.updateShape(true);
                newShape.x = xOffset;
                xOffset += Shape.SHAPE_MAX_WIDTH + 20;
                uiSel.addChild(newShape);
            }
            var bg: egret.Bitmap = new egret.Bitmap(RES.getRes("clsTransFormBg"));
            bg.width = 1000;//uiSel.width + 4;
            bg.height = 376;//uiSel.height + 4;
            bg.x = -2
            bg.y = -2;
            uiSel.addChildAt(bg,0);
            uiSel.addEventListener(egret.TouchEvent.TOUCH_TAP,this.reForm,this);
            uiSel.scaleX = uiSel.scaleY = 0.6;
            uiSel.x = (this.width - uiSel.width * uiSel.scaleX) / 2;
            uiSel.y = this.shapesField.y - uiSel.height * uiSel.scaleY;
            uiSel.openWithEffect(this);
        }

        private onBtnMenu(e: egret.TouchEvent): void {
            var uiMenu: ui.PauseMenu = new ui.PauseMenu();
            uiMenu.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onMenu,this);
            uiMenu.open(this);
            

        }
        private onMenu(e: egret.TouchEvent): void {
            e.stopPropagation();
            switch(e.target.name) {
                case "btn_continue":
                    break;
                case "btn_again":
                    this.reset();
                    this.saveState();
                    break;
                case "btn_home":
                    if (this.bDead) {
                        this.reset();
                        this.saveState();
                    }
                    var game: ui.Begin = new ui.Begin();
                    this.parent.addChild(game);
                    this.parent.removeChild(this);
                    break;
                default:
                    return;
            }
            e.target.parent.close();
        }
        private selShape(e: egret.TouchEvent): void {
            var shape: Shape = <Shape>e.target;            
            this.curSel.reform(shape);
            (<ui.Base>shape.parent).close();
            this.checkGame(true);
            
        }
        private reForm(e: egret.TouchEvent): void {
            var shape: Shape = <Shape>e.target;
            (<ui.Base>shape.parent).close();
            var uiSel: ui.Base = new ui.Base();
            var dstShape: Shape = shape;
            var xOffset: number = 0;
            
            for(var i: number = 0;i < this.shapesField.numChildren;i++) {
                var _shape: Shape = <Shape>this.shapesField.getChildAt(i);
                _shape.scaleX = _shape.scaleY = this.shapesField.shapesScale;
            }
            for(var nSpin: number = 0;nSpin < 3;nSpin++) {
                var newShape: Shape = new Shape(GridTexture.inst,shape.blockId,shape.groupId);
                for(var i: number = 0;i < Shape.SHAPE_MAX_COLS;i++) {
                    for(var j: number = 0;j < Shape.SHAPE_MAX_ROWS;j++) {
                        if(dstShape.check(i,j) == true) {
                            newShape.setGrid(Shape.SHAPE_MAX_ROWS - j - 1,i,true);
                        }
                    }
                }
                newShape.updateShape(true);
                newShape.x = xOffset;
                xOffset += Shape.SHAPE_MAX_WIDTH + 20;
                uiSel.addChild(newShape);
                dstShape = newShape;
            }
            
            this.curSel = <Shape>this.shapesField.getChildAt(toNumber(shape.name));
            var bg: egret.Bitmap = new egret.Bitmap(RES.getRes("clsTransFormBg"));
            bg.width = 1000;//uiSel.width + 4;
            bg.height = 376;//uiSel.height + 4;
            bg.x = -2
            bg.y = -2;
            uiSel.addChildAt(bg,0);
            uiSel.addEventListener(egret.TouchEvent.TOUCH_TAP,this.selShape,this);
            uiSel.scaleX = uiSel.scaleY = 0.6;
            uiSel.x = (this.width - uiSel.width * uiSel.scaleX) / 2;
            uiSel.y = this.shapesField.y - uiSel.height * uiSel.scaleY;
            uiSel.openWithEffect(this);
        }

        
        private initScoreField() {
            this.scoreField = new ui.ScoreField();
            this.addChild(this.scoreField);
            this.scoreField.x = (this.width - this.scoreField.width) / 2;
            this.scoreField.y = this.height * 0.02;

        }

        private onEffectComplete(e: egret.Event): void {
            e.target.parent.removeChild(e.target);

        }
        public reset(): void {
            this.bDead = false;
            
            this.countdown.stop();
            this.toolsField.stoptween();

            
            this.shapesField.removeChildren();
            this.toolsField.setDefault(this.gameMode);
            switch (this.gameMode) {
                case "normal":
                    this.score = 0;
                    this.uiGiftBar.clearStep();
                    this.scoreField.score = this.score;
                    this.boardMap.setAllEmpty();
                    break;
                case "level":
                    this.moves = 0;
                    this.updateMoves();
                    this.updateMissionText();
                    this.boardMap.fromData(<string>Common.levelsData[this.curLevel].boardmap);
                    this.upateTarget();
                    break;
                    
            }
           
            if(this.shapesField.numChildren == 0) {
                this.addRandShapes();
            }
        }
        
        private upateTarget() :void {
            var total:number = BoardMap.getTarget(<string>Common.levelsData[this.curLevel].boardmap);
            var cur: number = total - this.boardMap.getCurTarget();
            this.txtTargetCount.text = cur + "/" + total;
        }
       
        public saveState(): void {
            if (this.bTestMode || this.bGuide) {
                return;
            }
            for(var iShape: number = 0;iShape < 3;iShape++) {
                var shape: Shape = null;
                if(iShape < this.shapesField.numChildren)
                    shape = <Shape>this.shapesField.getChildAt(iShape);
                if(shape) {
                    egret.localStorage.setItem(this.gameMode + "_shape" + iShape,shape.toData());
                } else {
                    egret.localStorage.setItem(this.gameMode + "_shape" + iShape,"");
                }
            }

            egret.localStorage.setItem(this.gameMode + "_boardMap",this.boardMap.toData());
            egret.localStorage.setItem(this.gameMode + "_score",this.score.toString());
            switch(this.gameMode) {
                case "normal":
                    this.uiGiftBar.saveStorage();                 
                    this.scoreField.saveStorage();
                    this.toolsField.updateItemCount();
                    break;
                case "level":
                    egret.localStorage.setItem("level", this.curLevel.toString());
                    egret.localStorage.setItem("moves",this.moves.toString());
                    break;
            }
            this.toolsField.saveStorage(this.gameMode);
        }
        public loadState(): void {
            if (this.bTestMode || this.bGuide) {
                return;
            }
            this.boardMap.fromData(egret.localStorage.getItem(this.gameMode + "_boardMap"));
            var dataShapes: string[] = [];
            for(var iShape: number = 0;iShape < 3;iShape++) {
                var data: string = egret.localStorage.getItem(this.gameMode + "_shape" + iShape);
                if(data != "" && data != null && data != "000000000000000000000000000") {
                    dataShapes.push(data);
                }
            }
            if(dataShapes.length > 0) {
                this.shapesField.removeChildren();
                this.shapesField.addShapes(dataShapes);
            }
            var frist: boolean = (egret.localStorage.getItem(this.gameMode + "_frist") == null);
            if (frist) {
                egret.localStorage.setItem(this.gameMode + "_frist","1");
            }
            this.score = toNumber(egret.localStorage.getItem(this.gameMode + "_score"));
            this.toolsField.loadStorage(frist, this.gameMode);
            switch(this.gameMode) {
                case "normal":
                    this.scoreField.loadStorage();
                    this.uiGiftBar.loadStorage();
                    break;
                case "level":
                    this.curLevel = toNumber(egret.localStorage.getItem("level"));
                    if (this.curLevel <= 0) {
                        this.curLevel = 1;
                    }                    
                    this.moves = toNumber(egret.localStorage.getItem("moves"));

                    this.updateMissionText();
                    this.updateMoves();
                    this.upateTarget();
                    break;
            }
            this.checkGame();
        }
        
        private touchShape(e: egret.TouchEvent): void {
            if(this.pickUpShape == null) {
                this.pickUpShape = <Shape>(e.target);
                this.ptPickUp.x = this.pickUpShape.x;
                this.ptPickUp.y = this.pickUpShape.y;
                this.pickUpShape.scaleY = 1;
                this.pickUpShape.scaleX = 1;
            }
            var rt = this.pickUpShape.getBounds();
            var pt = this.pickUpShape.globalToLocal(e.stageX,e.stageY);
            this.pickUpShape.x += pt.x - (rt.x + rt.width / 2);
            this.pickUpShape.y += pt.y - (rt.y + rt.height * 2 / 3) - this.stage.height * 0.08;
        }

        private moveShape(e: egret.TouchEvent): void {
            if (this.pickUpShape == null) {
                return;
            }
            var rt = this.pickUpShape.getBounds();
            var pt = this.pickUpShape.globalToLocal(e.stageX,e.stageY);
            this.pickUpShape.x += pt.x - (rt.x + rt.width / 2);
            this.pickUpShape.y += pt.y - (rt.y + rt.height * 2 / 3) - this.stage.height * 0.08;
            

            
            this.boardMap.restoreShapeMask();
            if (this.checkDrop(this.pickUpShape)) {
                this.boardMap.setShapeMask(this.pickUpShape);
            }
            
        }
        
        private dropShape(e: egret.TouchEvent): void {
            if(this.pickUpShape != null) {
                if(!this.checkDrop(this.pickUpShape)) {
                    this.pickUpShape.scaleX = this.shapesField.shapesScale;
                    this.pickUpShape.scaleY = this.shapesField.shapesScale;
                    this.pickUpShape.x = this.ptPickUp.x;
                    this.pickUpShape.y = this.ptPickUp.y;
                    this.pickUpShape = null;
                } else {
                    this.drop(this.pickUpShape);
                    this.shapesField.removeChild(this.pickUpShape);
                    this.pickUpShape = null;
                    this.checkGame();
                }
            }
        }

        private checkWin(): boolean {
            var i: number,j: number;
            for(i = 0;i < 10;i++) {
                for(j = 0;j < 10;j++) {
                    var grid: Grid = this.boardMap.getGrid(i,j);
                    if(grid.getState() == GridState.STATE_FILL && grid.getBlockId() >= Grid.OBSBLOCK_1) {
                        return false;
                    }
                }
            }
            return true;
        }
        private onWin(e: egret.TouchEvent): void { 
            
            DCAgent.onEvent("win",1,JSON.parse(JSON.stringify({ level: this.curLevel, moves:this.moves })));
            <ui.Base>e.target.parent.close();
            
            if(this.bTestMode) {
                this.bTestMode = false;
                this.selLvl(1);
            } else {
                this.curLevel++;
                if(this.curLevel >= Common.levelsData.length) {
                    this.curLevel = 0;
                }
                var nUnlockTo: number = toNumber(egret.localStorage.getItem("level_unlockto"));
                if(this.curLevel > nUnlockTo) {
                    egret.localStorage.setItem("level_unlockto",this.curLevel.toString());
                    var urlloader: egret.URLLoader = new egret.URLLoader();
                    var urlreq: egret.URLRequest = new egret.URLRequest();
                    urlreq.url =  Common.SERVER_URL + "/set_achievement.php";
                    urlreq.method = egret.URLRequestMethod.POST;
                    var urlvar: egret.URLVariables = new egret.URLVariables("");
                    urlvar.variables["openid"] = egret.getOption("openid");
                    urlvar.variables["openkey"] = egret.getOption("openkey");
                    urlvar.variables["user_attr"] = JSON.stringify({ "key1": this.curLevel });
                    urlreq.data = urlvar;
                    urlloader.load(urlreq);
                }
            }
            this.reset();
            this.saveState();
            
        }
        
        public checkGame(bSave:boolean=true): void {
            this.checkXiao();
            if (this.gameMode == "level" && this.bGuide == false) {
                if(this.checkWin()) {
                    var uiWin:ui.Base = new ui.Base();
                    uiWin.x = this.width / 2
                    uiWin.y = this.height / 2;
                    
                    var light: effect.Light = new effect.Light();
                    light.scaleX = light.scaleY = 2;
                    uiWin.addChild(light);
                    var img:egret.Bitmap = new egret.Bitmap(RES.getRes("cls_congratulations"));
                    img.anchorOffsetX = img.width / 2;
                    img.anchorOffsetY = img.height / 2;
                    uiWin.addChild(img);
                    var btnNextLvl:egret.Bitmap = new egret.Bitmap(RES.getRes("cls_BtnNextLevel"));
                    btnNextLvl.x = -btnNextLvl.width / 2
                    btnNextLvl.y = img.height / 2 + this.height * 0.02;
                    btnNextLvl.touchEnabled = true;
                    btnNextLvl.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onWin, this);
                    
                    uiWin.addChild(btnNextLvl);
                    uiWin.openWithEffect(this);                    
                    uiWin.alpha = 0;
                    uiWin.modalMask.alpha = 0;
                    egret.Tween.get(uiWin.modalMask).to({ alpha: 0.5 },600).call(function() { uiWin.alpha =1})
                }
            }
            
            
            if(this.shapesField.numChildren == 0) {
                this.addRandShapes();
            }
            if(bSave) {
                this.saveState();
            }

            if (this.checkDie()) {
                this.countdown.start(this.stage);
                this.toolsField.tween();
                if(this.toolsField.itemCount1 <= 0 && this.toolsField.itemCount2 <= 0) {
                    this.shop.open(this);
                }
                
            } else {
                this.countdown.stop();
                this.toolsField.stoptween();
            }
        }
        
        private onTimerComplete(e: egret.TimerEvent) {
            if(this.checkDie()) {
                this.bDead = true;                       
                this.onGameOverMenu();
            }
            this.countdown.stop();
        }
        
        
        private checkDie(): boolean {
            for(var i: number = 0;i < this.shapesField.numChildren;i++) {

                var shape: Shape = <Shape>this.shapesField.getChildAt(i);
                if(shape && this.checkCanDrop(shape)) {
                    return false;
                }
            }
            return true;
        }

        private checkXiao(): number {
            var xiaoGrid: Grid;
            var HXiaoNum: number = 0;
            var VXiaoNum: number = 0;
            var i: number;
            var j: number;
            var HNotXiao: number[] = [];
            var VNotXiao: number[] = [];
            var needUpdateTarget: boolean = false;
            var needPlaySound: boolean = false;
            for(var i: number = 0;i < 10;i++) {
                for(var j: number = 0;j < 10;j++) {
                    if(this.boardMap.getGrid(i,j).getState() == GridState.STATE_EMPTY) {
                        HNotXiao[i] = 1;
                        VNotXiao[j] = 1;
                    }
                }
            }
            for(i = 0;i < 10;i++) {
                if(HNotXiao[i] != 1) {
                    xiaoGrid = null;
                    for(j = 0;j < 10;j++) {
                        if(this.boardMap.getGrid(i,j).getState() == GridState.STATE_FILL) {
                            var blockId: number = this.boardMap.getGrid(i,j).getBlockId();
                            switch(blockId) {
                                case Grid.OBSBLOCK_3:
                                    this.boardMap.getGrid(i,j).setBlockId(Grid.OBSBLOCK_2);
                                    break;
                                case Grid.OBSBLOCK_2:
                                    this.boardMap.getGrid(i,j).setBlockId(Grid.OBSBLOCK_1);
                                    break;
                                case Grid.OBSBLOCK_1:
                                    needUpdateTarget = true;
                                default:
                                    xiaoGrid = this.boardMap.getGrid(i,j);
                                    xiaoGrid.setState(GridState.STATE_EMPTY);
                                    break;

                            }
                        }
                    }
                    HXiaoNum++;
                    if(xiaoGrid) {
                        var y: number = this.boardMap.y + this.boardMap.width / 2;
                        var x: number = this.boardMap.x + xiaoGrid.x + xiaoGrid.width / 2;
                        this.effectXiao(x,y,90);
                        needPlaySound = true;
                    }
                }
            }
            for(j = 0;j < 10;j++) {
                if(VNotXiao[j] != 1) {
                    xiaoGrid = null;
                    for(i = 0;i < 10;i++) {
                        if(this.boardMap.getGrid(i,j).getState() == GridState.STATE_FILL) {
                            
                            var blockId = this.boardMap.getGrid(i,j).getBlockId();
                            switch(blockId) {
                                case Grid.OBSBLOCK_3:
                                    this.boardMap.getGrid(i,j).setBlockId(Grid.OBSBLOCK_2);
                                    break;
                                case Grid.OBSBLOCK_2:
                                    this.boardMap.getGrid(i,j).setBlockId(Grid.OBSBLOCK_1);
                                    break;
                                case Grid.OBSBLOCK_1:
                                    needUpdateTarget = true;
                                default:
                                    xiaoGrid = this.boardMap.getGrid(i,j);
                                    xiaoGrid.setState(GridState.STATE_EMPTY);
                                    break;
                            }
                        }
                    }

                    VXiaoNum++;
                    if(xiaoGrid) {
                        var x: number = this.boardMap.x + this.boardMap.width / 2;
                        var y: number = this.boardMap.y + xiaoGrid.y + xiaoGrid.height / 2;
                        this.effectXiao(x,y,0);
                        needPlaySound = true;
                    }
                }
            }
            if(needPlaySound && Common.sound_del != null) {
                Common.sound_del.play(0, 1);
                
            }
            if (needUpdateTarget && this.gameMode == "level") {
                this.upateTarget();
            }
            var n: number = HXiaoNum + VXiaoNum;
            if(n > 1) {
                this.addScore(10 * (n * n - 3 * n + 5));
            } else {
                this.addScore(10 * n);
            }
            return n;
        }
        
        
        private effectXiao(x: number,y: number,rotation: number) {
            var mc = new egret.MovieClip(Common.clsEffectData);
            mc.blendMode = egret.BlendMode.ADD;
            mc.scaleX = 2;
            mc.scaleY = 2;
            mc.anchorOffsetX = 1;
            mc.anchorOffsetY = 1;
            mc.x = x;
            mc.y = y;
            mc.rotation = rotation;
            this.addChild(mc);
            mc.play(1);
            mc.addEventListener(egret.Event.COMPLETE,this.onEffectComplete,this);

        }
        
        
        public drop(shape: Shape): void {
            var blockAdd: number = 0;
            var rt: egret.Rectangle = shape.getGridBound();
            var ptCheck: egret.Point = new egret.Point;
            var ptShape: egret.Point = new egret.Point;
            var ptBoard: egret.Point = new egret.Point;
            var ptOffset: egret.Point = shape.getGridOffset();

            for(ptCheck.x = rt.x + Grid.GRID_WIDTH / 2;ptCheck.x < rt.right;ptCheck.x += Grid.GRID_WIDTH + Grid.GRID_GAP) {
                for(ptCheck.y = rt.y + Grid.GRID_HEIGHT / 2;ptCheck.y < rt.bottom;ptCheck.y += Grid.GRID_HEIGHT + Grid.GRID_GAP) {
                    shape.localToGlobal(ptCheck.x + ptOffset.x,ptCheck.y + ptOffset.y,ptShape);
                    if(shape.checkWithPos(ptCheck.x,ptCheck.y)) {
                        this.boardMap.globalToLocal(ptShape.x,ptShape.y,ptBoard);
                        var grid: Grid = this.boardMap.getGridFromPoint(ptBoard);
                        if(!grid) {
                            throw Error("");
                        }
                        grid.setBlockId(shape.blockId);
                        grid.setState(GridState.STATE_FILL);
                        blockAdd++;
                    }
                }
            }
            if(blockAdd > 0) {
                this.addScore(blockAdd);
                if(Common.sound_set != null) {
                    Common.sound_set.play(0, 1);
                }
            }
            switch(this.gameMode) {
                case "normal":
                    this.uiGiftBar.addStep(1);
                    break;
                case "level":
                    this.moves++;
                    this.updateMoves();
                    break;
            }
        }

        private checkDrop(shape: Shape): boolean {
            var rt = shape.getGridBound();
            var ptCheck: egret.Point = new egret.Point();
            var ptShape: egret.Point = new egret.Point();
            var ptBoard: egret.Point = new egret.Point();
            var ptOffset: egret.Point = shape.getGridOffset();
            for(ptCheck.x = rt.x + Grid.GRID_WIDTH / 2;ptCheck.x < rt.right;ptCheck.x += Grid.GRID_WIDTH + Grid.GRID_GAP) {
                for(ptCheck.y = rt.y + Grid.GRID_HEIGHT / 2;ptCheck.y < rt.bottom;ptCheck.y += Grid.GRID_HEIGHT + Grid.GRID_GAP) {
                    shape.localToGlobal(ptCheck.x + ptOffset.x,ptCheck.y + ptOffset.y,ptShape);
                    if(shape.checkWithPos(ptCheck.x,ptCheck.y)) {
                        this.boardMap.globalToLocal(ptShape.x,ptShape.y,ptBoard);
                        var grid: Grid = this.boardMap.getGridFromPoint(ptBoard);
                        if(!grid || grid.getState() != GridState.STATE_EMPTY) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }

        private addRandShapes(): void {
            var data: string[] = [];
            if(this.gameMode == "normal") {
                data.push(this.shapesRate.GenShapeData(this.score));
                data.push(this.shapesRate.GenShapeData(this.score));
                data.push(this.shapesRate.GenShapeData(this.score));
            }
            else if(this.gameMode == "level") {
                data.push(this.shapesRate.GenShapeData(this.score,this.curLevel));
                data.push(this.shapesRate.GenShapeData(this.score,this.curLevel));
                data.push(this.shapesRate.GenShapeData(this.score,this.curLevel));
            }
            else {
                throw Error;
            }
            this.shapesField.addShapes(data);
        }
        
        
        private checkCanDrop(shape: Shape): boolean {
            var xOrg: number = shape.x
            var yOrg: number = shape.y;
            var orgScaleX: number = shape.scaleX,orgScaleY: number = shape.scaleY;
            shape.scaleX = shape.scaleY = 1;
            var rt: egret.Rectangle = this.boardMap.getBounds();
            var pt: egret.Point = new egret.Point();
            var ptShape: egret.Point = new egret.Point();
            var ptboarMap: egret.Point = new egret.Point();
            var gridBound: egret.Rectangle = shape.getGridBound();
            for(pt.x = rt.left;pt.x < rt.right;pt.x += Grid.GRID_WIDTH + Grid.GRID_GAP) {
                for(pt.y = rt.top;pt.y < rt.bottom;pt.y += Grid.GRID_HEIGHT + Grid.GRID_GAP) {
                    this.boardMap.localToGlobal(pt.x,pt.y,ptboarMap);
                    shape.parent.globalToLocal(ptboarMap.x,ptboarMap.y,ptShape);
                    shape.x = ptShape.x - gridBound.x - shape.getGridOffset().x;
                    shape.y = ptShape.y - gridBound.y - shape.getGridOffset().y;
                    if(this.checkDrop(shape)) {
                        shape.x = xOrg;
                        shape.y = yOrg;
                        shape.scaleX = orgScaleX;
                        shape.scaleY = orgScaleY;
                        return true;
                    }
                }
            }
            shape.x = xOrg;
            shape.y = yOrg;
            shape.scaleX = orgScaleX;
            shape.scaleY = orgScaleY;
            return false;
        }
        
        private onGameOverMenu(): void {
            var uiMenu: ui.Base = new ui.Base();
            var xSet: number = 0,ySet: number = 0;
            var btn: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
            var bg: egret.Bitmap = new egret.Bitmap(RES.getRes("clsBtnGameOver"));
            var txt: egret.TextField = new egret.TextField();
            btn.name = "btn_gameover";
            ySet += bg.height + this.height * 0.01;
            if(this.gameMode == "level") {
                txt.text = "Level." + this.curLevel;
            } else {
                txt.text = this.score.toString();
            }
            txt.size = this.height * 0.038
            txt.textColor = 0xffffffff;
            txt.anchorOffsetX = txt.width / 2;
            txt.anchorOffsetY = txt.height / 2;
            txt.x = bg.width / 2;
            txt.y = bg.height - txt.height + this.height * 0.01;
            btn.addChild(bg);
            btn.addChild(txt);
            uiMenu.addChild(btn);


            bg = new egret.Bitmap(RES.getRes("clsBtnHome"));
            bg.name = "btn_home";
            bg.touchEnabled = true;
            bg.x = xSet,bg.y = ySet;
            uiMenu.addChild(bg);
            xSet += bg.width + this.width * 0.01;

            bg = new egret.Bitmap(RES.getRes("clsBtnAgain"));
            bg.name = "btn_again";
            bg.touchEnabled = true;
            bg.x = xSet,bg.y = ySet;
            uiMenu.addChild(bg);

            uiMenu.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onMenu,this);
            uiMenu.anchorOffsetX =uiMenu.width / 2;
            uiMenu.anchorOffsetY = uiMenu.height / 2;
            uiMenu.x = this.width / 2;
            uiMenu.y = this.height / 2;
            uiMenu.open(this);
            
            this.saveState();
        }
        
        public addScore(score: number) :void {
            this.score += score;
            if(this.gameMode == "normal") {
                this.scoreField.score = this.score;
            }
        }
        
        private onGetGift(): void {
            var mask: egret.Shape = new egret.Shape();
            mask.width = this.width;
            mask.height = this.height;

            mask.graphics.beginFill(0x000000,0.5);
            mask.graphics.drawRect(0,0,this.width,this.height);
            mask.graphics.endFill();
            this.addChild(mask);

            var offsetY: number = -100;
            var light: effect.Light = new effect.Light();
            this.addChild(light);
            light.x = this.width / 2;
            light.y = this.height / 2 + offsetY;


            var img: egret.Bitmap;
            var giveIndex: number = Math.floor(Math.random() * 72768 % 2);
            var pt: egret.Point;
            if(giveIndex == 0) {
                img = new egret.Bitmap(RES.getRes("refresh"));
                pt = this.toolsField.getTool1GlobalPoint();
            } else {
                img = new egret.Bitmap(RES.getRes("transform"));
                pt = this.toolsField.getTool2GlobalPoint();
            }
            img.anchorOffsetX = img.width / 2;
            img.anchorOffsetY = img.height / 2;
            img.x = this.width / 2;
            img.y = this.height / 2 + offsetY;
            this.addChild(img);

            var complete: Function = function() {
                if(giveIndex == 0) {
                    this.toolsField.addTool1Count();
                } else {
                    this.toolsField.addTool2Count();
                }
                this.saveState();
                this.removeChild(img);
            }

            egret.setTimeout(function(index: number) {
                this.removeChild(mask);
                this.removeChild(light);
                egret.Tween.get(img).to({ x: pt.x,y: pt.y,scaleX: 0.2,scaleY: 0.2 },800).call(complete,this);
            },this,1500);
        }
        
    }
}