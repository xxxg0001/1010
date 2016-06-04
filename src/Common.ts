/**
 *
 * @author 
 *
 */
class Common {
	public constructor() {
	}
    public static qzoneStar: number = 0;
    public static sound_del: egret.Sound = null;
    public static sound_set: egret.Sound = null;
    public static WIDTH:number = 720;
    public static HEIGHT:number = 1280;
    public static SERVER_URL:string = "http://1010.gz.1251634261.clb.myqcloud.com/tencent";
    public static clsEffectData: egret.MovieClipData;
    public static shapesData: string[];
    public static levelsData: any[];
    public static loadsound(): void {
        Common.sound_del = RES.getRes("sound_del");
        Common.sound_set = RES.getRes("sound_set");
        Common.sound_set.type = egret.Sound.EFFECT;
        Common.sound_del.type = egret.Sound.EFFECT;
    //Common.sound_set.load(document.location.protocol+"//" +document.location.host + "/1010/resource/sound/sound_set.mp3");
   //Common.sound_del.load(document.location.protocol+"//" +document.location.host + "/1010/resource/sound/sound_del.mp3");
        //RES.loadGroup("sound");
        //RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
    }
//    private static onResourceLoadComplete(e: RES.ResourceEvent): void {
//        if(e.groupName == "sound") {
//            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
//            Common.sound_del = RES.getRes("sound_del");
//            Common.sound_set = RES.getRes("sound_set");
//        }
//    }
    
    public static loadanin() {
        var data = RES.getRes("clsRainbow_ef_json");
        var txtr = RES.getRes("clsRainbow_ef");
        var clsEffect:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data,txtr);
        this.clsEffectData = clsEffect.generateMovieClipData("rainbow_ef");
    }
    
    public static load() {
        var data = RES.getRes("data_json");
        this.shapesData = data.Shapes;
        this.levelsData = data.Levels;
        this.loadanin();
        this.loadsound();
    }
}

function toNumber(s:string):number {
    if (s == null || s == "") {
        return 0;
    } else {
        return Number(s);
    }
}
