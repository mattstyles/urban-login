var frames, anims;

(function() {

    frames = {
        show: new KeyframeEffect([
            { opacity: '0', transform: 'scale(.8,.8) translateY( 20 )' },
            { opacity: '1', transform: 'scale(1,1), translateY( 0 )' }
        ]),

        hide: new KeyframeEffect([
            { opacity: '1', transform: 'scale(1,1), translateY( 0 )' },
            { opacity: '0', transform: 'scale(0.8,0.8) translateY( -10 )' }
        ]),

        spin: new KeyframeEffect([
            { transform: 'rotate( 0 )' },
            { transform: 'rotate( 180 )' }
        ])
    };

})();
