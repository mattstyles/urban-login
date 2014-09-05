(function( root ) {

    Polymer( 'urban-login', {

        _showing: false,
        _loading: false,

        // core-icon element housing the loading spinner
        loadEl: null,

        /**
         * Fired when Polymer has got the element ready
         */
        ready: function() {
            console.log( 'Urban-login ready to rock' );

            // Hard code to look for a core-icon for now
            this.loadEl = this.querySelector( 'core-icon' );

            // Simple dirty bindAll method so any methods invoked as a callback maintain scope to this object
            for ( method in this ) {
                if ( typeof this[ method ] === 'function' && !this.hasOwnProperty( method ) ) {
                    try {
                        this[ method ] = this[ method ].bind( this );
                    } catch( err ) {
                        console.log( 'urban-login:: method binding error', method, err );
                    }
                }
            }
        },


        /**
         * Events
         */
        eventDelegates: {
            down: 'downAction',
            up: 'upAction'
        },

        downAction: function( event ) {},

        upAction: function( event ) {
            if ( !this._showing ) return;

            this.showLoading();
        },

        onShowLoad: function( event ) {
            this.$.login.removeEventListener( 'transitionend', this.onShowLoad );
            this.$.loadState.classList.remove( 'disable', 'transparent' );
            this.loadEl.classList.add( 'active' );
        },

        onHideLoad: function( event ) {
            this.$.loadState.removeEventListener( 'transitionend', this.onHideLoad );
            this.loadEl.classList.remove( 'active' );
            this._loading = false;
            this.show();
        },


        /**
         * State Management
         */
        show: function() {
            if ( this._showing || this._loading ) return;

            this.$.login.classList.remove( 'disable', 'transparent' );
            this._showing = true;
            this.fire( 'show' );
        },

        hide: function() {
            if ( !this._showing || !this._loading ) return;

            this.$.login.classList.add( 'disable', 'transparent' );
            this._showing = false;
            this.fire( 'hide' );
        },

        showLoading: function() {
            if ( !this.loadEl || this.loading ) return;

            this._loading = true;
            this.$.login.addEventListener( 'transitionend', this.onShowLoad );
            this.hide();
        },

        hideLoading: function() {
            if ( !this.loadEl || !this._loading ) return;

            this.$.loadState.addEventListener( 'transitionend', this.onHideLoad );
            this.$.loadState.classList.add( 'disable', 'transparent' );
        }

    });


})( this );
