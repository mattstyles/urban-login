(function( root ) {

    var ANIM_OUT_SPD = 100,
        ANIM_IN_SPD = 200,
        ANIM_SPIN_SPD = 400;

    Polymer( 'urban-login', {

        _showing: false,
        _loading: false,

        // core-icon element housing the loading spinner
        loadEl: null,
        spinAnimation: null,

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

            // Create and store the icon spin animation
            if ( this.loadEl ) {
                this.spinAnimation = document.timeline.play( new Animation(
                    this.loadEl,
                    frames.spin, {
                        duration: ANIM_SPIN_SPD,
                        iterations: 'Infinity'
                    }
                ));
                this.spinAnimation.pause();
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
            if ( !this._showing || this._loading ) return;

            this.showLoading();
        },

        onShowLoad: function( event ) {
            // Show loadstate and animate in
            this.$.loadState.classList.remove( 'transparent' );
            document.timeline.play( new Animation(
                this.$.loadState,
                frames.show, {
                    duration: ANIM_IN_SPD,
                    fill: 'forwards'
                }
            ));

            // Set the icon spinning
            this.spinAnimation.play();

            // Hide the login button
            this.$.login.classList.add( 'disable' );
        },

        onHideLoad: function( event ) {
            // Re-enable login button
            this.$.login.classList.remove( 'disable' );
            this.$.loadState.classList.add( 'transparent' );

            // Show login button
            document.timeline.play( new Animation(
                this.$.login,
                frames.show, {
                    duration: ANIM_IN_SPD,
                    fill: 'forwards'
                }
            ));

            // Stop the spinner animation from eating resources
            this.spinAnimation.pause();
        },


        /**
         * State Management
         */
        show: function() {
            if ( this._showing ) return;

            this.$.container.classList.remove( 'disable', 'transparent' );

            var anim = document.timeline.play( new Animation(
                this.$.login,
                frames.show, {
                    duration: ANIM_IN_SPD,
                    fill: 'forwards'
                }
            ));

            this._showing = true;
            this.fire( 'show' );
        },

        hide: function() {
            if ( !this._showing ) return;

            var anim = document.timeline.play( new Animation(
                this.$.login,
                frames.hide, {
                    duration: ANIM_OUT_SPD,
                    fill: 'forwards'
                }
            ));

            anim.onfinish = function( event ) {
                this.$.container.classList.add( 'disable', 'transparent' );
                this._showing = false;
                this.fire( 'hide' );
            }.bind( this );
        },

        showLoading: function() {
            if ( !this.loadEl || this.loading ) return;

            this._loading = true;

            var anim = document.timeline.play( new Animation(
                this.$.login,
                frames.hide, {
                    duration: ANIM_OUT_SPD,
                    fill: 'forwards'
                }
            ));

            anim.onfinish = this.onShowLoad;
        },

        hideLoading: function() {
            if ( !this.loadEl || !this._loading ) return;

            this._loading = false;

            var anim = document.timeline.play( new Animation(
                this.$.loadState,
                frames.hide, {
                    duration: ANIM_OUT_SPD,
                    fill: 'forwards'
                }
            ));

            anim.onfinish = this.onHideLoad;
        }

    });


})( this );
