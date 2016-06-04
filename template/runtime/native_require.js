
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/game/game.js",
	"libs/modules/game/game.native.js",
	"libs/modules/tween/tween.js",
	"libs/modules/res/res.js",
	"libs/modules/dcagent/dcagent.js",
	"bin-debug/Common.js",
	"bin-debug/Component/BoardMap.js",
	"bin-debug/Component/Grid.js",
	"bin-debug/Component/Shape.js",
	"bin-debug/Component/ShapesField.js",
	"bin-debug/effect/CountDown.js",
	"bin-debug/effect/Light.js",
	"bin-debug/effect/Rotate.js",
	"bin-debug/effect/Shake.js",
	"bin-debug/GameEvent.js",
	"bin-debug/GridTexture.js",
	"bin-debug/LoadingUI.js",
	"bin-debug/Main.js",
	"bin-debug/ShapesRate.js",
	"bin-debug/ui/Base.js",
	"bin-debug/ui/Begin.js",
	"bin-debug/ui/Game.js",
	"bin-debug/ui/GiftBar.js",
	"bin-debug/ui/Guide.js",
	"bin-debug/ui/PauseMenu.js",
	"bin-debug/ui/Popmessage.js",
	"bin-debug/ui/ScoreField.js",
	"bin-debug/ui/SelectLevel.js",
	"bin-debug/ui/Shop.js",
	"bin-debug/ui/ToolsField.js",
	"bin-debug/WanbaApi.js",
	//----auto game_file_list end----
];

var window = {};

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    egret_native.requireFiles();
    egret.TextField.default_fontFamily = "/system/fonts/DroidSansFallback.ttf";
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 60,
		scaleMode: "exactFit",
		contentWidth: 720,
		contentHeight: 1280,
		showPaintRect: false,
		showFPS: true,
		fpsStyles: "x:0,y:0,size:30",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel(egret.TextField.default_fontFamily, 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};