(function( root ) {

    Polymer( 'urban-login', {

        _showing: false,
        _loading: false,

        loadEl: null,

        eventDelegates: {
            down: 'downAction',
            up: 'upAction'
        },


        ready: function() {
            console.log( 'Urban-login ready to rock' );

            this.loadEl = this.querySelector( '#loading' );
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
            if ( !this._showing || !this._loading ) return;

            this.$.login.classList.add( 'disable', 'transparent' );
            this._showing = false;
        },

        showLoading: function() {
            if ( !this.loadEl || this.loading ) return;

            this._loading = true;
            this.hide();
            this.loadEl.classList.remove( 'disable', 'transparent' );
        },

        hideLoading: function() {
            if ( !this.loadEl || !this._loading ) return;

            this.loadEl.classList.add( 'disable', 'transparent' );
            this._loading = false;
            this.show();
        }

    });


})( this );
