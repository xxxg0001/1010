/**
 *
 * @author 
 *
 */
class ShapesField extends egret.DisplayObjectContainer{
    public shapesScale: number = 0.6;
    public orgShapesFieldY: number = 0;
	public constructor() {
        super();
	}
    public addShapes(data: string[]): void {
        this.removeChildren();
        var num: number = data.length;
        var gaps: number = (this.parent.width - Shape.SHAPE_MAX_WIDTH * 3 * this.shapesScale) / (4 + 2) / this.shapesScale;

        if(num > 3) {
            this.shapesScale = (gaps * 3 + (Shape.SHAPE_MAX_WIDTH + gaps) * num) / this.parent.width;
        }

        this.removeChildren();
        var xOffset: number = gaps * 2 * this.shapesScale;
        for(var i: number = 0;i < num;i++) {
            var shape: Shape = this.addShape(data[i]);
            shape.x = xOffset;
            xOffset += (Shape.SHAPE_MAX_WIDTH + gaps) * this.shapesScale;
        }

        var destY: number = this.orgShapesFieldY;
        this.y = this.parent.height;
        var tw: egret.Tween = egret.Tween.get(this);
        tw.to({ y: this.orgShapesFieldY },500, egret.Ease.backOut);
    }
                
    private addShape(data: string): Shape {
        var shape: Shape = new Shape(GridTexture.inst,0,0);
        shape.fromData(data);
        shape.updateShape(true);
        this.addChild(shape);
        shape.scaleX = shape.scaleY = this.shapesScale;
        return shape;
    }
    
}
