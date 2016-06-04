/**
 *
 * @author 
 *
 */
class Shape extends egret.DisplayObjectContainer{
    public static SHAPE_MAX_COLS:number = 5;
    public static SHAPE_MAX_ROWS:number = 5;
    
    public static SHAPE_MAX_WIDTH:number = Shape.SHAPE_MAX_COLS * (Grid.GRID_WIDTH + Grid.GRID_GAP);
    public static SHAPE_MAX_HEIGHT:number = Shape.SHAPE_MAX_ROWS * (Grid.GRID_HEIGHT + Grid.GRID_GAP);
    
    protected gridTxTure:GridTexture;
    public vecGrid:Grid[];
    public gridBoard:egret.Sprite;
    public blockId:number;
    public groupId:number;
    public bg: egret.Shape;
    
	public constructor(gridTexture:GridTexture, _blockId:number, _groupId:number) {
        super();

        this.gridTxTure = gridTexture;
        this.groupId = _groupId;
        this.blockId = _blockId;
        this.vecGrid = [];
        this.gridBoard = new egret.Sprite();
        this.addChild(this.gridBoard);
        this.bg = new egret.Shape();
        this.bg.graphics.beginFill(0xff0000,0);
        this.bg.graphics.drawRect(0, 0, Shape.SHAPE_MAX_WIDTH, Shape.SHAPE_MAX_HEIGHT * 1.2);
        this.bg.graphics.endFill();
        this.addChildAt(this.bg, 0);
        this.touchEnabled = true;
        this.cacheAsBitmap = true;
	}
   
	
    public getGridBound():egret.Rectangle {
        return this.gridBoard.getBounds();
    }
    public getGridOffset(): egret.Point {
        return new egret.Point(this.gridBoard.x,this.gridBoard.y);
    }
    
    public setGrid(i:number, j:number, bFill:boolean):void
    {
        if(i >= Shape.SHAPE_MAX_COLS || j >= Shape.SHAPE_MAX_ROWS) {
            return;
        }
        if(bFill && this.vecGrid[j * Shape.SHAPE_MAX_COLS + i]) {
            return;
        }
        this.vecGrid[j*Shape.SHAPE_MAX_COLS + i] = bFill ? new Grid(i, j, this.gridTxTure, GridState.STATE_FILL, this.blockId) : null;
    }
    
  
    // 更新形状（SetGrid 后）
    public updateShape(bCenterlize:boolean = true):void
    {
        this.removeChild(this.gridBoard);
        this.gridBoard = new egret.Sprite();
        this.addChildAt(this.gridBoard, 1);
        for (var i: number = 0;i < this.vecGrid.length;i++)
        {
            var grid: Grid = this.vecGrid[i];
            if (grid)
            {
                grid.setBlockId(this.blockId);
                this.gridBoard.addChild(grid);
            }
        }
        if (bCenterlize)
        {
            var rt = this.gridBoard.getBounds();
            
            var xBoundMove:number = (this.bg.width - rt.width) /2;
            var yBoundMove:number = (this.bg.height - rt.height) /2;
            this.gridBoard.x  += xBoundMove - rt.x;
            this.gridBoard.y += yBoundMove - rt.y;
        }
        
    }
    
    public checkWithPos(xPos:number, yPos:number):boolean // 检查是否有填充
    {
        var i: number = Math.floor(xPos / (Grid.GRID_WIDTH + Grid.GRID_GAP));
        var j: number = Math.floor(yPos / (Grid.GRID_HEIGHT + Grid.GRID_GAP));
       
        return this.check(i, j);
    }
    public check(i: number,j: number): boolean // 检查是否有填充
    {
        if(i < 0 || i >= Shape.SHAPE_MAX_COLS || j < 0 || j >= Shape.SHAPE_MAX_ROWS) {
            throw Error;
        }
        return this.vecGrid[j * Shape.SHAPE_MAX_COLS + i] != null;
    }
    public fromData(data:string):void
    {
        if(data == "" || data == null) {
            return;
        }
        if (data.length < Shape.SHAPE_MAX_COLS * Shape.SHAPE_MAX_ROWS + 2) {
            return;
        }
        this.groupId = toNumber(data.charAt(0));
        this.blockId = toNumber(data.charAt(1));
        for (var i:number = 0; i < Shape.SHAPE_MAX_COLS * Shape.SHAPE_MAX_ROWS; i++) {
            var b:boolean = (data.charAt(i+2) == "1" ? true : false);
            this.setGrid(i % Shape.SHAPE_MAX_COLS, Math.floor(i / Shape.SHAPE_MAX_COLS), b);
        }
    }
    
    public toData(): string {
        if(this.blockId > 9) {
            throw Error("Block Max Than 9");
        }
        var s: string = "";
        s += this.groupId > 9 ? 9 : this.groupId;
        s += this.blockId > 9 ? 9 : this.blockId;
        for(var i: number = 0;i < Shape.SHAPE_MAX_COLS * Shape.SHAPE_MAX_ROWS;i++) {
            var grid: Grid = this.vecGrid[i];
            if(grid && grid.getState() == GridState.STATE_FILL) {
                s += "1";
            } else {
                s += "0";
            }
        }
        return s;
    }
    
    public reform(shape: Shape): void {
        for(var i: number = 0;i < Shape.SHAPE_MAX_COLS;i++) {
            for(var j: number = 0;j < Shape.SHAPE_MAX_COLS;j++) {
                this.setGrid(i,j,shape.check(i,j));
            }
        }
        this.updateShape(true);
    }
}
