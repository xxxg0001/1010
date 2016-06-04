


class ShapesRate
{
    private scroes:any[] = [2000, 3000, 4000, -1]; // 分数段
    private rates:any[] = [
        [10,  6, 12, 12,  3,  4, 10,  8, 12], // 直 54321,3X3,2X2,3拐,2拐
        [ 2,  2,  2,  2,  1,  2,  2,  4,  4], 
        [10,  6, 12, 12,  3,  4, 10,  8, 12],
        [ 2,  2,  2,  2,  1,  2,  2,  4,  4]]; // 分数段对应概率分配
        
    private levels:any[] = [26, 31, 35, 51, 52, 53, 71, 72, 73, 74, 
        83, 84, 85, 86, 87, 88, 96, 97, 98, 100, 101, -1]; // 关卡段,<不是<=
            
    private ratesLevel:any[] =[ 
        [ 6,  6, 12, 12,  3,  0, 10,  8, 12], //26前
        [ 0,  1,  2,  0,  0,  0,  0,  1,  4], //26~31
        [ 1,  2,  3,  3,  2,  1,  2,  1,  4], //31~35
        [ 6,  6, 12, 12,  3,  0, 10,  8, 12], //36~51
        [ 0,  0, 12, 12,  0,  0, 10,  8, 12], //51
        [ 0,  6, 12, 12,  3,  0, 10,  8, 12], //52
        [ 6,  6, 12, 12,  3,  0, 10,  8, 12], //53~71
        [ 0,  6, 12, 12,  3,  0, 10,  8, 12], //71
        [ 6,  6, 12, 12,  3,  0, 10,  8, 12], //72~73
        [ 0,  0,  0,  1,  1,  0,  4,  0,  4], //73
        [ 6,  6, 12, 12,  3,  0, 10,  8, 12], //74~83
        [ 0,  6, 12, 12,  3,  0, 10,  8, 12], //83
        [ 6,  6, 12, 12,  3,  0, 10,  8, 12], //84
        [ 0,  6, 12, 12,  3,  0, 10,  8, 12], //85
        [ 6,  6, 12, 12,  3,  0, 10,  8, 12], //86
        [ 0,  1,  0,  0,  0,  0,  0,  0,  0], //87
        [ 6,  6, 12, 12,  3,  0, 10,  8, 12], //88~96
        [ 0,  0, 12, 12,  3,  0, 10,  8, 12], //96
        [ 0,  0, 12, 12,  3,  0, 10,  8, 12], //97
        [ 6,  6, 12, 12,  3,  0, 10,  8, 12], //98~100
        [ 1,  0,  0,  0,  0,  0,  0,  0,  0], //100
        [ 6,  6, 12, 12,  3,  0, 10,  8, 12], //101+
        //[ 0,  1,  0,  0,  0,  0,  0,  0,  0],
    ];
            
    private groups:Object = new Object;
    constructor()
    {
        var data: string[] = Common.shapesData;
        for(var i: number = 0;i < data.length; i++) {
            var s: string = data[i];
            var nGroup:number = toNumber(s.charAt(0));
            if (nGroup < 0 || nGroup > 9) {
                throw Error;
            }
            if (this.groups[nGroup] == null) {
                this.groups[nGroup] = [];
            }
            this.groups[nGroup].push(s);
        }
    }
    public GenShapeData(score:number, level:number = 0):string
    {
        var i:number;
        var rate:any[];
        // 根据分数求概率表
        
        if (level == 0) {
            for (i = 0; i < this.scroes.length; i++) {
                if (this.scroes[i] < 0 || score < this.scroes[i])	{					
                    rate = this.rates[i];
                    break;
                }
            }
        } else {
            for (i = 0; i < this.levels.length; i++) {
                if (this.levels[i] < 0 || level < this.levels[i])	{					
                    rate = this.ratesLevel[i];
                    break;
                }
            }
        }
        if (!rate) {
            throw Error;
        }
        // 插杆求组号
        var total:number = 0;
        var a:any[] = new Array;
        for (i = 0; i < rate.length; i++) {
            total += rate[i];
            a[i] = total;
        }
        var r:number = total * Math.random();
        for (i = 0; i < a.length; i++) {
            if(a[i] > r) {
                break;
            }
        }
        var nGroup:number = i;
        // 根据组号随机得形状
        var shapes:string[] = this.groups[nGroup];
        if (!shapes) {
            throw Error;
        }
        r = shapes.length * Math.random();
        return shapes[Math.floor(r)];
    }
}
        