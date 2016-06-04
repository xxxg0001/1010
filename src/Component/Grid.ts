/**
 *
 * @author 
 *
 */
enum GridState {STATE_NIL = -1, STATE_EMPTY, STATE_FILL};
class Grid extends egret.Bitmap {
    protected state: GridState;
    public static OBSBLOCK_1: number = 1001; // 
    public static OBSBLOCK_2: number = 1002; // 
    public static OBSBLOCK_3: number = 1003; // 
    public static OBSBLOCK_MAX: number = 1003;
    public static GRID_WIDTH: number = 60;
    public static GRID_HEIGHT: number = 60;
    public static GRID_GAP:number = 2; // 边缘空白
    protected gridTexture: GridTexture;
    protected blockId: number = -1;

    public constructor(_xPos:number, _yPos:number, gridTxe:GridTexture, state:GridState, blockId:number = -1) {
        super();
        this.gridTexture = gridTxe;
        this.state = state;
        this.blockId = blockId;
        this.texture = this.curViewTexture();
        this.x = _xPos * (Grid.GRID_WIDTH + Grid.GRID_GAP);
        this.y = _yPos * (Grid.GRID_HEIGHT + Grid.GRID_GAP);
    }

    public getState(): GridState {
        return this.state;
    }
    public restoreState(): void {
        this.texture = this.curViewTexture();
    }
    public setState(state: GridState): void {
        if(this.state != state) {
            if(state == GridState.STATE_EMPTY && 　this.state == GridState.STATE_FILL) {
                //effect
            }
            this.state = state;
            this.texture = this.curViewTexture();
        }
    }
    public setMask(): void {
        this.texture = RES.getRes("bmGridEmptyMask");
    }
    private curViewTexture(): egret.Texture {
        var txe: egret.Texture;
        if(this.state == GridState.STATE_EMPTY) {
            txe = this.gridTexture.getEmptyTexTure();
        } else if(this.blockId >= 0 && this.state == GridState.STATE_FILL) {
            txe = this.gridTexture.textureBlock(this.blockId);
        } else {
            txe = this.gridTexture.getNilTexTure();
        }
        return txe;
    }
    public getBlockId(): number { return this.blockId; }
    public setBlockId(id: number): void {
        if(this.blockId != id && this.state == GridState.STATE_FILL) {
            this.texture = this.gridTexture.textureBlock(id);
        }
        this.blockId = id;
    }

}
