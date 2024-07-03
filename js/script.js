$(document).ready(function() {

    new WOW({
        mobile: false,
        animateClass: 'animate__animated', 
    }).init();

    // Preloader handling
    $('.preloader-wrap').fadeIn('slow');

    // Wait for all images to load before hiding the preloader and initializing the rest of the scripts
    var $grid = $('.grid-single');
    $grid.imagesLoaded({ background: true }).done(function() {
        $('.preloader-wrap').fadeOut('slow');

        // Initialize Masonry
        $grid.masonry({
            itemSelector: '.grid-single .grid-item',
            percentPosition: true,
            columnWidth: '.grid-single .grid-sizer',
            gutter: 15
        });

        // Initialize Magnific Popup
        $('.grid-single .grid-item a').magnificPopup({
            type: 'image',
            removalDelay: 500,
            gallery: {
                enabled: true
            },
            callbacks: {
                beforeOpen: function() {
                    this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
                    this.st.mainClass = this.st.el.attr('data-effect');
                }
            },
        });

        // Album page Masonry
        function albumMasonry() {
            var $gridAlbum = $('.grid-album').masonry({
                itemSelector: '.grid-album .grid-item',
                percentPosition: true,
                columnWidth: '.grid-album .grid-sizer',
                gutter: 20
            });
            $gridAlbum.imagesLoaded().progress(function() {
                $gridAlbum.masonry();
            });
        }
        albumMasonry();

        // Initialize BLazy
        var bLazy = new Blazy();

        // Album tab click handler
        $('.album-tab a').on('click', function(e) {
            e.preventDefault();
            var href = $(this).attr('href');
            $('.album-tab a').removeClass('is-active');
            $(this).addClass('is-active');

            $('.grid-album').removeClass('is-active');
            $(href).addClass('is-active');

            $(href).addClass('animate__animated animate__slideInUp');
            $('.grid-album.is-active:not(' + href + ')').removeClass('animate__animated animate__slideInUp');

            albumMasonry();
        });

        // Settings
        $('.settings-btn').on('click', function() {
            var settings = $('.settings-wrap');
            settings.toggleClass('is-active');
        });
        var savedColor = localStorage.getItem('boxColor');
        if (savedColor) {
            $(':root').css('--color-def', savedColor);
        }
        $('.settings-color-item').on('click', function() {
            var color = $(this).css('background-color');
            $('.settings-color-item').css('border-color', '#fff');
            $(this).css('border-color', color);
            $(':root').css('--color-def', color);
            localStorage.setItem('boxColor', color);
        });

        // Ajax Form Send
        $('#contact-form').on('submit', function() {
            var th = $(this);
            $.ajax({
                type: 'POST',
                url: 'mail.php',
                data: th.serialize(),
                success: function() {
                    th.trigger('reset');
                    $('.input-field').removeClass('is-active');
                    $.magnificPopup.open({
                        items: {
                            src: '<div class="form-alert"><p>Your application has been successfully sent. <br> Expect a call!</p></div>',
                            type: 'inline'
                        }
                    });
                },
                error: function() {
                    th.trigger('reset');
                    $('.input-field').removeClass('is-active');
                    $.magnificPopup.open({
                        items: {
                            src: '<div class="form-alert"><p>An error occurred, please try again</p></div>',
                            type: 'inline'
                        }
                    });
                }
            });
            return false;
        });

        // Banner Swiper initialization
        const swiperBanner = new Swiper('.swiper-banner', {
            speed: 800,
            spaceBetween: 100,
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            navigation: {
                nextEl: '.swiper-banner .swiper-button-next',
                prevEl: '.swiper-banner .swiper-button-prev',
            },
            scrollbar: {
                el: '.swiper-banner .swiper-scrollbar',
                enabled: true,
                draggable: true
            },
        });

        // Menu interactions
        $('body').on('click', '.hamburger-button', function(e) {
            e.preventDefault();
            $('.menu-wrap').addClass('menu-active');
            $('.menu-nav').addClass('menu-item-active');
            $('.menu-overlay').addClass('menu-overlay__active');
        });

        $(document).on('mouseup', function(e) {
            if (!$('.menu-wrap').is(e.target) && $('.menu-wrap').has(e.target).length === 0) {
                $('.menu-wrap').removeClass('menu-active');
                $('.menu-nav').removeClass('menu-item-active');
                $('.menu-overlay').removeClass('menu-overlay__active');
            }
        });

        $('.menu-close').on('mousedown', function() {
            $('.menu-wrap').removeClass('menu-active');
            $('.menu-nav').removeClass('menu-item-active');
            $('.menu-overlay').removeClass('menu-overlay__active');
        });

        // Contact input field interactions
        $('.input-field input, textarea').on('input', function() {
            var inputValue = $(this).val();
            var inputParent = $(this).parent('.input-field');
            inputParent.toggleClass('is-active', inputValue.length > 0);
        });
    });
});
