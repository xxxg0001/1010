/**
 *
 * @author 
 *
 */
/**
* 弹支付提示
* @param {object} opts
* {
*   defaultScore:{int}
* }
*/
declare function popPayTips(data:any):void
function __paySuccess() {

    var e: WanbaEvent = new WanbaEvent(WanbaEvent.PAY_SUCCESS);
    wanba.dispatchEvent(e);
}
function __payError() {

    var e: WanbaEvent = new WanbaEvent(WanbaEvent.PAY_ERROR);
    wanba.dispatchEvent(e);
}
function __payClose() {

    var e: WanbaEvent = new WanbaEvent(WanbaEvent.PAY_CLOSE);
    wanba.dispatchEvent(e);
}

class WanbaEvent extends egret.Event {
    public static PAY_SUCCESS: string = "PAY_SUCCESS";
    public static PAY_ERROR: string = "PAY_ERROR";
    public static PAY_CLOSE: string = "PAY_CLOSE";
}

class WanbaApi extends egret.EventDispatcher{
	public constructor() {
        super();
	}
	public popPayTips(defaultScore:number) {
        popPayTips({ defaultScore: defaultScore });
	    
	}
}

var wanba: WanbaApi 


