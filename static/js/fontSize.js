function setHtmlFontSize(){
    var doc = document;
    var win = doc.documentElement;
    var winWidth = win.clientWidth;
    var size = (winWidth / 750) * 100;
    win.style.fontSize = (size < 100 ? size : 100) + 'px';
}
window.onresize = function(){
    setHtmlFontSize();
}
setHtmlFontSize();
