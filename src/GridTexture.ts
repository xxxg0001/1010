/**
 *
 * @author 
 *
 */
class GridTexture {
    public static MAX_BLOCKID:number = 10;
    private nilTexture:egret.Texture;
    private emptyTexture:egret.Texture;
    private objTextureBlock:egret.Texture[]= [];
    private static _inst:GridTexture;
    static get inst() {
        if (this._inst == null) {
            this._inst = new GridTexture();
        }
        return this._inst;
    }
    
	public constructor() {
    	
	}
	
    public getNilTexTure():egret.Texture
    {
        return null;//this.nilTexture ? this.nilTexture : this.nilTexture = new egret.Texture();
        //KEmbedRes.getColorTexture(this.GRID_WIDTH, this.GRID_HEIGHT, 0);
    }
    
    public getEmptyTexTure():egret.Texture
    {
        return this.emptyTexture ? this.emptyTexture : this.emptyTexture = RES.getRes("bmGridEmpty");
    }
    private genBlockTexture(blockId:number): egret.Texture {
        switch(blockId) {
            case 1:
                this.objTextureBlock[blockId] = RES.getRes("clsGrid1");
                break;
            case 2:
                this.objTextureBlock[blockId] = RES.getRes("clsGrid2");
                break;
            case 3:
                this.objTextureBlock[blockId] = RES.getRes("clsGrid3");
                break;
            case 4:
                this.objTextureBlock[blockId] = RES.getRes("clsGrid4");
                break;
            case 5:
                this.objTextureBlock[blockId] = RES.getRes("clsGrid5");
                break;
            case 6:
                this.objTextureBlock[blockId] = RES.getRes("clsGrid6");
                break;
            case 7:
                this.objTextureBlock[blockId] = RES.getRes("clsGrid7");
                break;
            case 8:
                this.objTextureBlock[blockId] = RES.getRes("clsGrid8");
                break;
            case Grid.OBSBLOCK_1:
                this.objTextureBlock[blockId] = RES.getRes("clsGrid1001");
                break;
            case Grid.OBSBLOCK_2:
                this.objTextureBlock[blockId] = RES.getRes("clsGrid1002");
                break;
            case Grid.OBSBLOCK_3:
                this.objTextureBlock[blockId] = RES.getRes("clsGrid1003");
                break;
            default:
                return this.nilTexture;
                break;
        }
        return this.objTextureBlock[blockId];
    }
    public textureBlock(blockId:number):egret.Texture
    {
        if (this.objTextureBlock[blockId] != null) {
            return this.objTextureBlock[blockId];
        }
        return this.genBlockTexture(blockId);
    }
   
}
