module ui {
	/**
	 *
	 * @author 
	 *
	 */
    export class ScoreField extends egret.DisplayObjectContainer {
        private txtScore: egret.TextField;
        private imgAchievement: egret.Bitmap;
        private txtHighScore: egret.TextField;

        private hightScore: number = 0;
        public constructor() {
            super();
            this.txtScore = new egret.TextField();
            this.txtScore.size = Common.HEIGHT * 0.04;
            this.txtScore.text = "0";
            this.txtScore.width = Common.WIDTH * 0.25;
            this.txtScore.height = Common.HEIGHT * 0.07;
            this.txtScore.textColor = 0xffffff;
            this.txtScore.stroke = 1;
            this.addChild(this.txtScore);

            this.imgAchievement = new egret.Bitmap();
            this.imgAchievement.texture = RES.getRes("clsAchieveMent");
            this.imgAchievement.height = this.txtScore.height;
            this.imgAchievement.scaleX = this.imgAchievement.scaleY;
            this.imgAchievement.x = this.txtScore.x + this.txtScore.width + 5;
            this.addChild(this.imgAchievement);

            this.txtHighScore = new egret.TextField();
            this.txtHighScore.text = this.hightScore.toString();
            this.txtHighScore.size = Common.HEIGHT * 0.04;
            this.txtHighScore.width = Common.WIDTH * 0.25;
            this.txtHighScore.height = Common.HEIGHT * 0.07;
            this.txtHighScore.textColor = 0xf0ff32;
            this.txtHighScore.stroke = 1;
            this.txtHighScore.textAlign = egret.HorizontalAlign.RIGHT;
            this.txtHighScore.x = this.imgAchievement.x + this.imgAchievement.width + 5;

            this.addChild(this.txtHighScore);
        }
        public saveStorage(): void {
            egret.localStorage.setItem("hightScore",this.txtHighScore.text);
        }
        public loadStorage(): void {
            this.hightScore = toNumber(egret.localStorage.getItem("hightScore"));
           
            this.txtHighScore.text = this.hightScore.toString();
        }
        public set score(score: number) {
            this.txtScore.text = score.toString();
            if(score > this.hightScore) {
                this.hightScore = score;
                this.txtHighScore.text = this.hightScore.toString();
            }
            var urlloader: egret.URLLoader = new egret.URLLoader();
            var urlreq: egret.URLRequest = new egret.URLRequest();
            urlreq.url =  Common.SERVER_URL + "/set_achievement.php";
            urlreq.method = egret.URLRequestMethod.POST;
            var urlvar: egret.URLVariables = new egret.URLVariables("");
            urlvar.variables["openid"] = egret.getOption("openid");
            urlvar.variables["openkey"] = egret.getOption("openkey");
            urlvar.variables["user_attr"] = JSON.stringify({ "level": this.hightScore });
            urlreq.data = urlvar;
            urlloader.load(urlreq);
            
            
        }
        public getHightScore():number {
            return this.hightScore
        }
    }
}
