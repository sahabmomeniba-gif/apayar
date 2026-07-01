import DrawCircle from "./Draw/DrawCircle";
import DrawCircle3p from "./Draw/DrawCircle3p";
import DrawLine from "./Draw/DrawLine";
import DrawPoint from "./Draw/DrawPoint";
import DrawPolygon from "./Draw/DrawPolygons";
import DrawPolyline from "./Draw/DrawPolyline";

export const SiCommandType = {
    general:{
        name:commandType.general,
        collection:[
            {
                cl:'line',
                command:DrawLine
            },
            {
                cl:'polyline',
                command:DrawPolyline
            },
            {
                cl:'point',
                command:DrawPoint
            },
            {
                cl:'poly',
                command:DrawPolygon
            },
            {
                cl:'circle3p',
                command:DrawCircle3p
            },
            {
                cl:'circle',
                command:DrawCircle
            }
        ]
    },
    draw:{
        name:commandType.draw,
        collection:[
            {
                cl:',',
                command:null
            },
            {
                cl:'@',
                command:null
            }
        ]
    }
}

export const commandType = {
    general:'general',
    draw:'draw',
    modify:'modify'
}