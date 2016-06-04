module ui {
	/**
	 *
	 * @author 
	 *
	 */
	export class Shop extends Base{
        private toolsField: ToolsField;
        private countDown:effect.CountDown
		public constructor(toolsField: ToolsField, countDown:effect.CountDown) {
            super();
            this.toolsField = toolsField;
            this.countDown = countDown;
            var bg: egret.Bitmap = new egret.Bitmap(RES.getRes("shop_png"));
            this.addChild(bg);
            
            var txtStar: egret.TextField = new egret.TextField();
            //txtStar.text = "当前拥有星星:" + Common.qzoneStar;
            txtStar.text = "点击就送！";
            txtStar.x = bg.x + bg.width / 2;
            txtStar.y = bg.y + bg.height / 2;
            txtStar.anchorOffsetX = txtStar.width / 2;
            txtStar.anchorOffsetY = txtStar.height / 2;
            txtStar.size = 24;
            this.addChild(txtStar);
            
            var txt: egret.TextField = new egret.TextField();
            txt.text = "∞";
            txt.x = bg.x + bg.width / 2;
            txt.y = bg.y +50 + bg.height / 2;
            txt.size = 60;
            
            this.addChild(txt);
            bg.touchEnabled = true;
            bg.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchTap,this);
           
		}
        public open(parent:egret.DisplayObjectContainer) {
            super.open(parent);

            //wanba.addEventListener(WanbaEvent.PAY_SUCCESS,this.onPaySuccess,this);
            //wanba.addEventListener(WanbaEvent.PAY_ERROR,this.payerror,this);
            //wanba.addEventListener(WanbaEvent.PAY_CLOSE,this.payclose,this);
            
        }
        private onTouchTap(e: egret.TouchEvent) {
            if(e.localX >= 173 && e.localX <= 445 &&
                e.localY >= 158 && e.localY <= 257) {
                this.buy();
                /*
                if(Common.qzoneStar >= 90) {
                    this.buy();
                } else {
                    this.countDown.pause();
                    wanba.popPayTips(90);
                }*/


            } else if(e.localX >= 537 && e.localX <= 614 &&
                e.localY >= 0 && e.localY <= 44) {
                this.close();
            }

        }
        
        public close() {            
            //wanba.removeEventListener(WanbaEvent.PAY_SUCCESS,this.onPaySuccess,this);
            //wanba.removeEventListener(WanbaEvent.PAY_ERROR,this.payerror,this);
            //wanba.removeEventListener(WanbaEvent.PAY_CLOSE,this.payclose,this);
            this.countDown.resume();
            super.close();
        }
        
        private buy() {
            this.toolsField.onPaySuccess();
            this.close();
            /*
            Common.qzoneStar--;
            var urlloader: egret.URLLoader = new egret.URLLoader();
            var urlreq: egret.URLRequest = new egret.URLRequest();
            urlreq.url =  Common.SERVER_URL + "/buy_item.php";
            urlreq.method = egret.URLRequestMethod.POST;
            var urlvar: egret.URLVariables = new egret.URLVariables("");
            urlvar.variables["openid"] = egret.getOption("openid");
            urlvar.variables["openkey"] = egret.getOption("openkey");
            urlvar.variables['zoneid'] = egret.getOption("platform");
            switch(egret.getOption("platform")) {
                case "1":
                    urlvar.variables["itemid"] = "3655";
                    break;
                case "2":
                    urlvar.variables["itemid"] = "3656";
                    break;
                default:
                    return;
            }

            urlvar.variables["count"] = 1;
            urlreq.data = urlvar;
            urlloader.load(urlreq);
            urlloader.addEventListener(egret.Event.COMPLETE,this.onBuyComplete,this);
            */
        }
        /*
        private onPaySuccess(e: WanbaEvent) {
            Popmessage.show("支付成功");
            this.buy()
        }*/
        private onBuyComplete(e:egret.Event) {
            var urlloader: egret.URLLoader = <egret.URLLoader>e.target;
            var ret = JSON.parse(urlloader.data);
            if(ret.code != 0) {
                switch (ret.code) {
                    case 1004:
                        Popmessage.show("购买失败，没有足够的星星。");
                        break;
                    default:
                        Popmessage.show(ret.message);
                }
                Common.qzoneStar++;
                return;
            }
            this.toolsField.onPaySuccess();
            var paymentConfig = new DCAgentPaymentConfig();
            paymentConfig.amount = ret.data[0].cost;
            DCAgent.onPayment(paymentConfig);
            this.close();
            
        }
        /*
        private payerror(e:WanbaEvent) {
            Popmessage.show("支付失败");
            this.close();
        }
        private payclose(e:WanbaEvent) {
            Popmessage.show("支付关闭");
            this.close();
        }*/
       
	}
   
}
