let parameters_lin = {
    "id": "ggbApplet_lin",
    "width":600,
    "height":600,
    "showMenuBar":false,
    "showAlgebraInput":false,
    "showToolBar":false,
    "customToolBar":"0 73 62 | 1 501 67 , 5 19 , 72 75 76 | 2 15 45 , 18 65 , 7 37 | 4 3 8 9 , 13 44 , 58 , 47 | 16 51 64 , 70 | 10 34 53 11 , 24  20 22 , 21 23 | 55 56 57 , 12 | 36 46 , 38 49  50 , 71  14  68 | 30 29 54 32 31 33 | 25 17 26 60 52 61 | 40 41 42 , 27 28 35 , 6",
    "showToolBarHelp":false,
    "showResetIcon":false,
    "enableLabelDrags":false,
    "enableShiftDragZoom":true,
    "enableRightClick":false,
    "errorDialogsActive":false,
    "useBrowserForJS":false,
    "allowStyleBar":false,
    "preventFocus":false,
    "showZoomButtons":true,
    "capturingThreshold":3,
    // add code here to run when the applet starts
    "appletOnLoad":function(api){api.evalCommand('setCoordSystem(-6,6,-6,6)');},
    "showFullscreenButton":true,
    "scale":1,
    "disableAutoScale":false,
    "allowUpscale":false,
    "clickToLoad":false,
    "appName":"classic",
    "buttonRounding":0.7,
    "buttonShadows":false,
    "language":"fr",
    "material_id":"pfdhkpcw"
};
let parameters_aff = {
    "id": "ggbApplet_aff",
    "width":600,
    "height":600,
    "showMenuBar":false,
    "showAlgebraInput":false,
    "showToolBar":false,
    "customToolBar":"0 73 62 | 1 501 67 , 5 19 , 72 75 76 | 2 15 45 , 18 65 , 7 37 | 4 3 8 9 , 13 44 , 58 , 47 | 16 51 64 , 70 | 10 34 53 11 , 24  20 22 , 21 23 | 55 56 57 , 12 | 36 46 , 38 49  50 , 71  14  68 | 30 29 54 32 31 33 | 25 17 26 60 52 61 | 40 41 42 , 27 28 35 , 6",
    "showToolBarHelp":false,
    "showResetIcon":false,
    "enableLabelDrags":false,
    "enableShiftDragZoom":true,
    "enableRightClick":false,
    "errorDialogsActive":false,
    "useBrowserForJS":false,
    "allowStyleBar":false,
    "preventFocus":false,
    "showZoomButtons":true,
    "capturingThreshold":3,
    // add code here to run when the applet starts
    "appletOnLoad":function(api){ /* api.evalCommand('Segment((1,2),(3,4))');*/ },
    "showFullscreenButton":true,
    "scale":1,
    "disableAutoScale":false,
    "allowUpscale":false,
    "clickToLoad":false,
    "appName":"classic",
    "buttonRounding":0.7,
    "buttonShadows":false,
    "language":"fr",
    "material_id":"uvvuvdxp"
};
let parameters_quad = {
    "id": "ggbApplet_quad",
    "width":600,
    "height":600,
    "showMenuBar":false,
    "showAlgebraInput":false,
    "showToolBar":false,
    "customToolBar":"0 73 62 | 1 501 67 , 5 19 , 72 75 76 | 2 15 45 , 18 65 , 7 37 | 4 3 8 9 , 13 44 , 58 , 47 | 16 51 64 , 70 | 10 34 53 11 , 24  20 22 , 21 23 | 55 56 57 , 12 | 36 46 , 38 49  50 , 71  14  68 | 30 29 54 32 31 33 | 25 17 26 60 52 61 | 40 41 42 , 27 28 35 , 6",
    "showToolBarHelp":false,
    "showResetIcon":false,
    "enableLabelDrags":false,
    "enableShiftDragZoom":true,
    "enableRightClick":false,
    "errorDialogsActive":false,
    "useBrowserForJS":false,
    "allowStyleBar":false,
    "preventFocus":false,
    "showZoomButtons":true,
    "capturingThreshold":3,
    // add code here to run when the applet starts
    "appletOnLoad":function(api){ /* api.evalCommand('Segment((1,2),(3,4))');*/ },
    "showFullscreenButton":true,
    "scale":1,
    "disableAutoScale":false,
    "allowUpscale":false,
    "clickToLoad":false,
    "appName":"classic",
    "buttonRounding":0.7,
    "buttonShadows":false,
    "language":"fr",
    "material_id":"su44rswr"
};

let views = {'is3D': 0,'AV': 0,'SV': 0,'CV': 0,'EV2': 0,'CP': 0,'PC': 0,'DA': 0,'FI': 0,'macro': 0};

let applet_lin = new GGBApplet(parameters_lin, '5.0', views);
let applet_aff = new GGBApplet(parameters_aff, '5.0', views);
let applet_quad = new GGBApplet(parameters_quad, '5.0', views);

window.onload = function() {
    applet_lin.inject('ggbApplet_lin');
    applet_aff.inject('ggbApplet_aff');
    applet_quad.inject('ggbApplet_quad');
    triggerFonctionsOnload();
};
applet_lin.setPreviewImage('data:image/gif;base64,R0lGODlhAQABAAAAADs=','https://www.geogebra.org/images/GeoGebra_loading.png','https://www.geogebra.org/images/applet_play.png');
applet_aff.setPreviewImage('data:image/gif;base64,R0lGODlhAQABAAAAADs=','https://www.geogebra.org/images/GeoGebra_loading.png','https://www.geogebra.org/images/applet_play.png');
applet_quad.setPreviewImage('data:image/gif;base64,R0lGODlhAQABAAAAADs=','https://www.geogebra.org/images/GeoGebra_loading.png','https://www.geogebra.org/images/applet_play.png');
