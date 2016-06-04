/**
 *
 * @author 
 *
 */
class GameEvent extends egret.Event{
    public static RESET: string = "RESET";
    public static USE_TOOL: string = "USE_TOOL";
    public static BTN_AGAIN: string = "BTN_AGAIN";
    public static BTN_HOME: string = "BTN_HOME";
    public static ON_GET_GIFT: string = "ON_GET_GIFT";
    public static ON_TOOL_EMPTY: string = "ON_TOOL_EMPTY";
	public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false) {
        super(type,bubbles,cancelable);
	}
}
