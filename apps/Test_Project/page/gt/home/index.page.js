import * as hmUI from "@zos/ui";
import { onKey } from "@zos/interaction";


let text;


Page({

build(){

    hmUI.setStatusBarVisible(false);


    text = hmUI.createWidget(
        hmUI.widget.TEXT,
        {
            x:20,
            y:180,
            w:350,
            h:80,
            text:"Waiting...",
            text_size:30,
            color:0xffffff
        }
    );


    onKey({

        callback:(key,event)=>{

            text.setProperty(
                hmUI.prop.TEXT,
                "KEY: "+key+"\nEVENT: "+event
            );


            return true;

        }

    });


}

});