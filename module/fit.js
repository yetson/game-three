(function(){
    var bs = ['', '-o-', '-ms-', '-moz-', '-webkit-'];
    var prefix;

    bs.forEach(function(b){
        if(b + 'transform' in document.documentElement.style){
            prefix = b;
            return false;
        }
    });

    exports.prefix = prefix;
})();