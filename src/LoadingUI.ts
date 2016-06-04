//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class LoadingUI extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        this.createView();
    }


    private process: egret.Bitmap;
    private star: egret.Bitmap;
    private createView():void {
        
        
        var bg: egret.Bitmap = new egret.Bitmap(RES.getRes("loading_bg_png"));
        bg.x = Common.WIDTH / 2;
        bg.y = Common.HEIGHT / 2 - 100;
        bg.anchorOffsetX = bg.width / 2;
        bg.anchorOffsetY = bg.height / 2;
        
        var process_bg: egret.Bitmap = new egret.Bitmap(RES.getRes("loading_png"));
        process_bg.x = bg.x - process_bg.width/2;
        process_bg.y = bg.y + 250;
    
        
        this.process = new egret.Bitmap(RES.getRes("load_png"));
        this.process.x = process_bg.x;
        this.process.y = process_bg.y;
       
        this.star = new egret.Bitmap(RES.getRes("star_png"));
        this.star.x = this.process.x;
        this.star.y = process_bg.y;
        this.star.anchorOffsetX = this.star.width / 2;
        this.star.anchorOffsetY = this.star.height / 2;
        
        
        this.addChild(bg);
        this.addChild(process_bg);
        this.addChild(this.process);
        this.addChild(this.star);
        this.star.rotation
        
        egret.Tween.get(this.star,{ loop: true }).to({ rotation: 180 },500);
        
    }
    
    public setProgress(current, total):void {
        //显示进度        
        this.process.scaleX = current / total;
        this.star.x = this.process.width * this.process.scaleX + this.process.x;
    }
}
