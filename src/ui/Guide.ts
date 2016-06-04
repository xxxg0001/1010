module ui {
	/**
	 *
	 * @author 
	 *
	 */
	export class Guide {
        private boardMap: BoardMap;
        private shapesField: ShapesField;
        private game: Game;
        private txt: egret.TextField;
        private mask: egret.Shape;
		public constructor(game: Game) {
            this.boardMap = game.boardMap;
            this.shapesField = game.shapesField;
            this.game = game;
            
            this.mask = new egret.Shape();
            this.txt = new egret.TextField();
            this.mask.graphics.beginFill(0x000000,0);
            this.mask.graphics.drawRect(0, 0, game.width, game.height);
            this.mask.graphics.endFill();
            this.mask.touchEnabled = true;
            
            this.txt.text = "拖动方块到棋盘，填满行或者列消除";
            this.txt.x = this.game.width / 2;
            this.txt.y = this.game.height / 2;
            this.txt.anchorOffsetX = this.txt.width / 2;
            this.txt.anchorOffsetY = this.txt.height / 2;
            this.game.bGuide = true;
            this.game.addChild(this.mask);
            this.game.addChild(this.txt);
		}
		
		
        public loadNormalMode(): void {
            this.boardMap.fromData("0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
            var shapes: string[] = [
                "531111100000000000000000000",
                "531111100000000000000000000",
                "531111100000000000000000000",
            ]
            this.shapesField.addShapes(shapes);
            var shape: Shape = <Shape>this.shapesField.getChildAt(0);

            setTimeout(this.move.bind(this),600,shape,20,-655);
            setTimeout(this.move.bind(this),2500,<Shape>this.shapesField.getChildAt(1),385,-655);
            setTimeout(this.changetxt.bind(this),4000);
            setTimeout(this.finish.bind(this),5000);
        }
        public loadLevelMode(): void {
            this.boardMap.fromData("~00000000~~00000000~~00000000~~00000000~~00////00~~00////00~~00000000~~00000000~~00000000~~00000000~");
            var shapes: string[] = [
                "551100011000000000000000000",
                "551100011000000000000000000",
                "551100011000000000000000000",
            ]
            this.shapesField.addShapes(shapes);
            var shape: Shape = <Shape>this.shapesField.getChildAt(0);


            setTimeout(this.move.bind(this),600,shape,20,-655);
            setTimeout(this.move.bind(this),2500,<Shape>this.shapesField.getChildAt(1),385,-655);
            setTimeout(this.changetxt.bind(this),4000);
            setTimeout(this.finish.bind(this),5000);
        }
		private changetxt():void {
            this.txt.text = "现在， 你可以愉快的玩耍了";
		}
		public move(shape:Shape, x:number, y:number):void {
            
            var tw: egret.Tween = egret.Tween.get(shape);
            tw.to({ scaleX: 1,scaleY: 1 },200).wait(200).to({x:x,y:y}, 1000).call(this.drop, this, [shape]);
		}
		private drop(shape:Shape):void {
            this.game.drop(shape);
            this.shapesField.removeChild(shape);
            this.game.checkGame(false);
           
		}
		private finish(): void {
            
            this.game.removeChild(this.txt);
            this.game.removeChild(this.mask);
            this.game.bGuide = false;
            this.game.reset();
            this.game.loadState();
		}
	}
}
