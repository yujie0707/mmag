
    var width = window.screen.width;
    document.documentElement.style.fontSize = (width / 750) * 100 + 'px';

window.onresize = function() {
    var width = window.screen.width;
    document.documentElement.style.fontSize = (width / 750) * 100 + 'px'
}


// (function(doc, win) {
//     var docEl = doc.documentElement,
//         resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
//         recalc = function() {
//             var clientWidth = docEl.clientWidth;
//             if (!clientWidth) return;
//             if (clientWidth >= 640) {
//                 docEl.style.fontSize = '100px';
//             } else {
//                 docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
//             }
//         };

//     if (!doc.addEventListener) return;
//     win.addEventListener(resizeEvt, recalc, false);
//     doc.addEventListener('DOMContentLoaded', recalc, false);
// })(document, window);