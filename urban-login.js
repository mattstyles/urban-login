(function( root ) {

    Polymer( 'urban-login', {

        _showing: false,
        _loading: false,

        eventDelegates: {
            down: 'downAction',
            up: 'upAction'
        },


        ready: function() {
            console.log( 'Urban-login ready to rock' );
        },


        downAction: function( event ) {
            if ( !this._showing ) return;

            
        },

        upAction: function( event ) {
            console.log( 'urban login :: up action' );
        },


        show: function() {
            if ( this._showing || this._loading ) return;

            this.$.login.classList.remove( 'disable', 'transparent' );
            this._showing = true;
        },

        hide: function() {
            if ( !this.showing || !this._loading ) return;

            this.$.login.classList.add( 'disable', 'transparent' );
            this._showing = false;
        }

    });


})( this );
