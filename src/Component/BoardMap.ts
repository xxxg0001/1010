/**
 *
 * @author 
 *
 */
class BoardMap extends egret.DisplayObjectContainer{
    protected vecGrids:Grid[][];
    protected maxRows: number;
    protected maxCols:number;
    private shapeMask: egret.Sprite;
    private vecGridsMask: Grid[] = null;
	public constructor(maxCols:number, maxRows:number) {
        super();
        this.maxRows = maxRows;
        this.maxCols = maxCols;
        this.vecGrids = [];
        
        this.vecGridsMask = [];
        
        for(var i: number = 0;i < maxCols; i++) {
            this.vecGrids[i] = [];
            for(var j: number = 0;j < maxRows; j++) {
                this.vecGrids[i][j] = new Grid(i,j,GridTexture.inst,GridState.STATE_EMPTY);
                this.addChild(this.vecGrids[i][j]);
            }
            
        }
        this.cacheAsBitmap = true;
	}
    public getGrid(i:number, j:number):Grid // 获取第i,j个Grid
    {
        if(i >= this.vecGrids.length || j >= this.vecGrids[0].length) {
            return null;
        }
        return this.vecGrids[i][j];
    }
    
    public getGridFromPoint(pt:egret.Point):Grid // 根据坐标点获取Grid
    {
        if(pt.x < 0 || pt.y < 0) {
            return null;
        }
        var i:number = Math.floor(pt.x / (Grid.GRID_WIDTH + Grid.GRID_GAP));
        var j:number = Math.floor(pt.y / (Grid.GRID_HEIGHT + Grid.GRID_GAP));
        return this.getGrid(i, j);
    }
    
    public setAllEmpty():void
    {
        for (var i:number = 0;i < this.maxCols; i++)
        {
            for (var j:number = 0; j < this.maxRows; j++)
            {
                this.vecGrids[i][j].setState(GridState.STATE_EMPTY);
            }
        }
    }
    
    public fromData(data: string): void {
        if(data == "" || data == null) {
            return;
        }
        if(data.length < this.maxCols * this.maxRows) {
            throw Error("Error data string");
        }
        for(var j: number = 0;j < this.maxRows;j++) {
            for(var i: number = 0;i < this.maxCols;i++) {
                var grid: Grid = this.vecGrids[i][j];
                var ch: string = data.charAt(j * this.maxCols + i);
                var chCode: number = ch.charCodeAt(0);
                if(grid) {
                    if(ch == "0") {
                        grid.setState(GridState.STATE_EMPTY);
                    } else if(ch == "~") {
                        grid.setState(GridState.STATE_NIL);
                    } else if(chCode < "0".charCodeAt(0)) {
                        grid.setState(GridState.STATE_FILL);
                        grid.setBlockId(Grid.OBSBLOCK_1 - 1 + "0".charCodeAt(0) - chCode);
                        if(grid.getBlockId() > Grid.OBSBLOCK_MAX) {
                            grid.setBlockId(Grid.OBSBLOCK_MAX);
                        }
                    } else {
                        grid.setState(GridState.STATE_FILL);
                        grid.setBlockId(chCode - "0".charCodeAt(0));
                    }
                }
            }
        }
    }
    public toData():string {
        var s:string = "";
        for(var j: number = 0;j < this.maxRows;j++) {
            for(var i: number = 0;i < this.maxCols;i++) {
                var grid: Grid = this.vecGrids[i][j];
                if(grid.getState() == GridState.STATE_EMPTY) {
                    s += "0";
                } else if(grid.getState() == GridState.STATE_NIL) {
                    s += "~";
                } else if(grid.getBlockId() >= Grid.OBSBLOCK_1) {
                    s += String.fromCharCode("0".charCodeAt(0) + Grid.OBSBLOCK_1 - grid.getBlockId() - 1);
                } else if(grid.getBlockId() > 0) {
                    s += String.fromCharCode("0".charCodeAt(0) + grid.getBlockId());
                }
            }
        }
        return s;
    }
    public getCurTarget(): number {
        var count: number = 0;
        for(var j: number = 0;j < this.maxRows;j++) {
            for(var i: number = 0;i < this.maxCols;i++) {
                var grid: Grid = this.vecGrids[i][j];
                if(grid.getState() == GridState.STATE_FILL && grid.getBlockId() >= Grid.OBSBLOCK_1) {
                    count++;
                }
            }
        }
        return count;
    }
    public static getTarget(data:string): number {
        if(data == "" || data == null) {
            return 0;
        }
        var total: number = 0;
        for(var i: number = 0;i < data.length;i++) {
            var ch: string = data.charAt(i);
            var chCode: number = ch.charCodeAt(0);
            if(chCode < "0".charCodeAt(0)) {
                total++;
            }
        }
        return total;
    }
    
   
    public restoreShapeMask(): void {
        for(var i = 0;i < this.vecGrids.length;i++) {
            for(var j = 0;j < this.vecGrids[i].length;j++) {
                this.getGrid(i,j).restoreState();
            }
        }
    }
    public setShapeMask(shape:Shape): void {
        var rt = shape.getGridBound();
        var ptCheck: egret.Point = new egret.Point();
        var ptShape: egret.Point = new egret.Point();
        var ptBoard: egret.Point = new egret.Point();
        var ptOffset: egret.Point = shape.getGridOffset();
        for(ptCheck.x = rt.x + Grid.GRID_WIDTH / 2;ptCheck.x < rt.right;ptCheck.x += Grid.GRID_WIDTH + Grid.GRID_GAP) {
            for(ptCheck.y = rt.y + Grid.GRID_HEIGHT / 2;ptCheck.y < rt.bottom;ptCheck.y += Grid.GRID_HEIGHT + Grid.GRID_GAP) {
                shape.localToGlobal(ptCheck.x + ptOffset.x,ptCheck.y + ptOffset.y,ptShape);
                if(shape.checkWithPos(ptCheck.x,ptCheck.y)) {
                    this.globalToLocal(ptShape.x,ptShape.y,ptBoard);
                    var grid: Grid = this.getGridFromPoint(ptBoard);
                    if(grid && grid.getState() == GridState.STATE_EMPTY) {
                        grid.setMask();
                    }
                }
            }
        }
        }
        
}
