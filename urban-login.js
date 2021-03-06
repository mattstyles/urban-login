(function( root ) {

    var ANIM_OUT_SPD = 100,
        ANIM_IN_SPD = 200,
        ANIM_SPIN_SPD = 400;


    Polymer( 'urban-login', {

        publish: {
            /**
             * Is the element showing
             *
             * @type {Boolean}
             */
            _showing: false,

            /**
             * Is the element in a loading state
             *
             * @type {Boolean}
             */
            _loading: false,

            /**
             * Holds the loading spinner icon if it has been supplied
             *
             * @type {core-icon element}
             */
            loadEl: null,

            /**
             * The spin animation for the loading icon
             *
             * @type {AnimationPlayer}
             */
            spinAnimation: null,
        },


        /**
         * Fired when Polymer has got the element ready
         */
        ready: function() {
            // Hard code to look for a core-icon for now
            this.loadEl = this.querySelector( 'core-icon' );

            // Simple dirty bindAll method so any methods invoked as a callback maintain scope to this object
            this.bindAll( this );

            this.createAnimationFrames();

            if ( this.loadEl ) {
                this.createSpinAnimation();
            }

            // Start the element in the shown state
            if ( this.startShowing ) {
                this.show( true );
            }
        },


        /*-----------------------------------------------------------*\
         *
         *  Events
         *
        \*-----------------------------------------------------------*/

        eventDelegates: {
            down: 'downAction',
            up: 'upAction'
        },

        /**
         * Abstract for initial touch on element
         */
        downAction: function( event ) {},

        /**
         * A click starts state transition to loading if the element is shown and not already loading
         */
        upAction: function( event ) {
            if ( !this._showing || this._loading ) return;

            this.showLoading();
        },

        /**
         * Fired mid-way through the transition to loading
         * This function shows the loading icon and starts it spinning
         */
        onShowLoad: function( event ) {
            // Bug out if the loading has already been cancelled/finished
            if ( !this._loading ) return;

            // Show loadstate and animate in
            this.$.loadState.classList.remove( 'transparent' );
            document.timeline.play( new Animation(
                this.$.loadState,
                this.frames.show, {
                    duration: ANIM_IN_SPD,
                    fill: 'forwards'
                }
            ));

            // Set the icon spinning
            this.spinAnimation.play();

            // Hide the login button
            this.$.login.classList.add( 'disable' );
        },

        /**
         * Fired mid-way through the transition back to login from loading
         * This function stops the spin animation and shows the login button
         */
        onHideLoad: function( event ) {
            // Re-enable login button
            this.$.login.classList.remove( 'disable' );
            this.$.loadState.classList.add( 'transparent' );

            // Show login button
            document.timeline.play( new Animation(
                this.$.login,
                this.frames.show, {
                    duration: ANIM_IN_SPD,
                    fill: 'forwards'
                }
            ));

            // Stop the spinner animation from eating resources
            this.spinAnimation.pause();
        },


        /*-----------------------------------------------------------*\
         *
         *  State Management
         *
        \*-----------------------------------------------------------*/


        /**
         * Shows the whole login element, transitions in the login button
         *
         * @param animate {Boolean} determines if the animation fires or not
         * @event - emits a 'show' event
         */
        show: function( immediate ) {
            if ( this._showing ) return;

            this.$.container.classList.remove( 'disable', 'transparent' );

            var anim = document.timeline.play( new Animation(
                this.$.login,
                this.frames.show, {
                    duration: immediate ? 0 : ANIM_IN_SPD,
                    fill: 'forwards'
                }
            ));

            this._showing = true;
            this.fire( 'show' );
        },


        /**
         * Hides the whole login element, after transitioning out the login button
         *
         * @event - emits a 'hide' event
         */
        hide: function() {
            if ( !this._showing ) return;

            var anim = document.timeline.play( new Animation(
                this.$.login,
                this.frames.hide, {
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


        /**
         * State transition from displaying the login button to displaying the loading spinner if one exists
         *
         * @event - emits a 'loadStart' event
         */
        showLoading: function() {
            if ( !this.loadEl || this.loading ) return;

            this._loading = true;
            this.fire( 'loadStart' );

            var anim = document.timeline.play( new Animation(
                this.$.login,
                this.frames.hide, {
                    duration: ANIM_OUT_SPD,
                    fill: 'forwards'
                }
            ));

            anim.onfinish = this.onShowLoad;
        },


        /**
         * State transition from loading to login
         *
         * @event - emits a 'loadEnd' event
         */
        hideLoading: function() {
            if ( !this.loadEl || !this._loading ) return;

            this._loading = false;
            this.fire( 'loadEnd' );

            var anim = document.timeline.play( new Animation(
                this.$.loadState,
                this.frames.hide, {
                    duration: ANIM_OUT_SPD,
                    fill: 'forwards'
                }
            ));

            anim.onfinish = this.onHideLoad;
        },


        /*-----------------------------------------------------------*\
         *
         *  Helpers
         *
        \*-----------------------------------------------------------*/

        /**
         * Creates the spinning animation for the loading element
         */
        createSpinAnimation: function() {
            this.spinAnimation = document.timeline.play( new Animation(
                this.loadEl,
                this.frames.spin, {
                    duration: ANIM_SPIN_SPD,
                    iterations: 'Infinity'
                }
            ));
            this.spinAnimation.pause();
        },


        /**
         * Creates the animation frames
         */
        createAnimationFrames: function() {
            this.frames = {
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
        },


        /**
         * Simple, dirty bindAll implementation
         */
        bindAll: function( ctx ) {
            for ( method in this ) {
                if ( typeof this[ method ] === 'function' && !this.hasOwnProperty( method ) ) {
                    try {
                        this[ method ] = this[ method ].bind( ctx );
                    } catch( err ) {
                        console.log( 'urban-login:: method binding error', method, err );
                    }
                }
            }
        }

    });


})( this );
