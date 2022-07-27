/**
 * Global variables
 */
"use strict";

var userAgent = navigator.userAgent.toLowerCase(),
	initialDate = new Date(),
	isNoviBuilder = window.xMode,

$document = $(document),
	$window = $(window),
	$html = $("html"),

	isDesktop = $html.hasClass("desktop"),
	isRtl = $html.attr("dir") === "rtl",
	isIE = userAgent.indexOf("msie") != -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") != -1 ? 11 : userAgent.indexOf("edge") != -1 ? 12 : false,
	isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
	isTouch = "ontouchstart" in window,
	onloadCaptchaCallback,
	plugins = {
		pointerEvents: isIE < 11 ? "js/pointer-events.min.js" : false,
		bootstrapTooltip: $("[data-toggle='tooltip']"),
		bootstrapModalDialog: $('.modal'),
		bootstrapTabs: $(".tabs-custom-init"),
		rdNavbar: $(".rd-navbar"),
		materialParallax: $(".parallax-container"),
		rdMailForm: $(".rd-mailform"),
		rdInputLabel: $(".form-label"),
		regula: $("[data-constraints]"),
		owl: $(".owl-carousel"),
		swiper: $(".swiper-container"),
		slick: $('.slick-slider'),
		search: $(".rd-search"),
		searchResults: $('.rd-search-results'),
		statefulButton: $('.btn-stateful'),
		isotope: $(".isotope-wrap"),
		popover: $('[data-toggle="popover"]'),
		viewAnimate: $('.view-animate'),
		rdVideoBG: $(".rd-video"),
		radio: $("input[type='radio']"),
		checkbox: $("input[type='checkbox']"),
		customToggle: $("[data-custom-toggle]"),
		customToggleSlider: $("[data-custom-toggle-slider]"),
		facebookWidget: $('#fb-root'),
		flickrfeed: $(".flickr"),
		twitterfeed: $(".twitter"),
		counter: $(".counter"),
		instafeed: $(".instafeed"),
		progressLinear: $(".progress-linear"),
		circleProgress: $(".progress-bar-circle"),
		dateCountdown: $('.DateCountdown'),
		pageLoader: $(".page-loader"),
		captcha: $('.recaptcha'),
		scroller: $(".scroll-wrap"),
		lightGallery: $("[data-lightgallery='group']"),
		lightGalleryItem: $("[data-lightgallery='item']"),
		lightDynamicGalleryItem: $("[data-lightgallery='dynamic']"),
		mailchimp: $('.mailchimp-mailform'),
		campaignMonitor: $('.campaign-mailform'),
		copyrightYear: $(".copyright-year"),
		maps: $(".google-map-container")
	};

	/**
	 * @desc Check the element was been scrolled into the view
	 * @param {object} elem - jQuery object
	 * @return {boolean}
	 */
	function isScrolledIntoView ( elem ) {
		if ( isNoviBuilder ) return true;
		return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
	}

	/**
	 * @desc Calls a function when element has been scrolled into the view
	 * @param {object} element - jQuery object
	 * @param {function} func - init function
	 */
	function lazyInit( element, func ) {
		var scrollHandler = function () {
			if ( ( !element.hasClass( 'lazy-loaded' ) && ( isScrolledIntoView( element ) ) ) ) {
				func.call();
				element.addClass( 'lazy-loaded' );
			}
		};

		scrollHandler();
		$window.on( 'scroll', scrollHandler );
	}

	$window.on('load', function(){
		// Isotope
		if ( plugins.isotope.length ) {
			for ( var i = 0; i < plugins.isotope.length; i++ ) {
				var
					wrap = plugins.isotope[ i ],
					filterHandler = function ( event ) {
						event.preventDefault();
						for ( var n = 0; n < this.isoGroup.filters.length; n++ ) this.isoGroup.filters[ n ].classList.remove( 'active' );
						this.classList.add( 'active' );
						this.isoGroup.isotope.arrange( { filter: this.getAttribute( "data-isotope-filter" ) !== '*' ? '[data-filter*="' + this.getAttribute( "data-isotope-filter" ) + '"]' : '*' } );
					},
					resizeHandler = function () {
						this.isoGroup.isotope.layout();
					};

				wrap.isoGroup = {};
				wrap.isoGroup.filters = wrap.querySelectorAll( '[data-isotope-filter]' );
				wrap.isoGroup.node = wrap.querySelector( '.isotope' );
				wrap.isoGroup.layout = wrap.isoGroup.node.getAttribute( 'data-isotope-layout' ) ? wrap.isoGroup.node.getAttribute( 'data-isotope-layout' ) : 'masonry';
				wrap.isoGroup.isotope = new Isotope( wrap.isoGroup.node, {
					itemSelector: '.isotope-item',
					layoutMode: wrap.isoGroup.layout,
					filter: '*'
				} );

				for ( var n = 0; n < wrap.isoGroup.filters.length; n++ ) {
					var filter = wrap.isoGroup.filters[ n ];
					filter.isoGroup = wrap.isoGroup;
					filter.addEventListener( 'click', filterHandler );
				}

				window.addEventListener( 'resize', resizeHandler.bind( wrap ) );

			}
		}
	})

/**
 * Initialize All Scripts
 */
$document.ready(function () {



	/**
	 * @desc Google map function for getting latitude and longitude
	 */
	function getLatLngObject(str, marker, map, callback) {
		var coordinates = {};
		try {
			coordinates = JSON.parse(str);
			callback(new google.maps.LatLng(
				coordinates.lat,
				coordinates.lng
			), marker, map)
		} catch (e) {
			map.geocoder.geocode({'address': str}, function (results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					var latitude = results[0].geometry.location.lat();
					var longitude = results[0].geometry.location.lng();

					callback(new google.maps.LatLng(
						parseFloat(latitude),
						parseFloat(longitude)
					), marker, map)
				}
			})
		}
	}


	// /**
	//  * @desc Initialize Google maps
	//  */
	// function initMaps() {
	// 	var key;

	// 	for ( var i = 0; i < plugins.maps.length; i++ ) {
	// 		if (plugins.maps[i].hasAttribute( "data-key" ) ) {
	// 			key = plugins.maps[i].getAttribute( "data-key" );
	// 			break;
	// 		}
	// 	}

	// 	$.getScript('//maps.google.com/maps/api/js?'+ ( key ? 'key='+ key + '&' : '' ) +'sensor=false&libraries=geometry,places&v=quarterly', function () {
	// 		var head = document.getElementsByTagName('head')[0],
	// 			insertBefore = head.insertBefore;

	// 		head.insertBefore = function (newElement, referenceElement) {
	// 			if (newElement.href && newElement.href.indexOf('//fonts.googleapis.com/css?family=Roboto') !== -1 || newElement.innerHTML.indexOf('gm-style') !== -1) {
	// 				return;
	// 			}
	// 			insertBefore.call(head, newElement, referenceElement);
	// 		};

	// 		var geocoder = new google.maps.Geocoder;
	// 		for (var i = 0; i < plugins.maps.length; i++) {
	// 			var zoom = parseInt(plugins.maps[i].getAttribute("data-zoom")) || 11;
	// 			var styles;
	// 			if (plugins.maps[i].hasAttribute('data-styles')){
	// 				try {
	// 					styles = JSON.parse(plugins.maps[i].getAttribute("data-styles"));
	// 				}
	// 				catch (error){
	// 					styles = [];
	// 				}
	// 			}
	// 			var center = plugins.maps[i].getAttribute("data-center");

	// 			// Initialize map
	// 			var map = new google.maps.Map(plugins.maps[i].querySelectorAll(".google-map")[0], {
	// 				zoom: zoom,
	// 				styles: styles,
	// 				scrollwheel: false,
	// 				center: {lat: 0, lng: 0}
	// 			});
	// 			// Add map object to map node
	// 			plugins.maps[i].map = map;
	// 			plugins.maps[i].geocoder = geocoder;
	// 			plugins.maps[i].keySupported = true;
	// 			plugins.maps[i].google = google;

	// 			// Get Center coordinates from attribute
	// 			getLatLngObject(center, null, plugins.maps[i], function (location, markerElement, mapElement) {
	// 				mapElement.map.setCenter(location);
	// 			})

	// 			// Add markers from google-map-markers array
	// 			var markerItems = plugins.maps[i].querySelectorAll(".google-map-markers li");
	// 			if (markerItems.length){
	// 				var markers = [];
	// 				for (var j = 0; j < markerItems.length; j++){
	// 					var markerElement = markerItems[j];
	// 					getLatLngObject(markerElement.getAttribute("data-location"), markerElement, plugins.maps[i], function(location, markerElement, mapElement){
	// 						var icon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
	// 						var activeIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active");
	// 						var info = markerElement.getAttribute("data-description") || "";
	// 						var infoWindow = new google.maps.InfoWindow({
	// 							content: info
	// 						});
	// 						markerElement.infoWindow = infoWindow;
	// 						var markerData = {
	// 							position: location,
	// 							map: mapElement.map
	// 						}
	// 						if (icon){
	// 							markerData.icon = icon;
	// 						}
	// 						var marker = new google.maps.Marker(markerData);
	// 						markerElement.gmarker = marker;
	// 						markers.push({markerElement: markerElement, infoWindow: infoWindow});
	// 						marker.isActive = false;
	// 						// Handle infoWindow close click
	// 						google.maps.event.addListener(infoWindow,'closeclick',(function(markerElement, mapElement){
	// 							var markerIcon;
	// 							markerElement.gmarker.isActive = false
	// 							if (markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")){
	// 								markerElement.gmarker.setIcon(markerIcon);
	// 							}
	// 						}).bind(this, markerElement, mapElement));


	// 						// Set marker active on Click and open infoWindow
	// 						google.maps.event.addListener(marker, 'click', (function(markerElement, mapElement) {
	// 							if (markerElement.infoWindow.getContent().length === 0) return;
	// 							var gMarker, currentMarker = markerElement.gmarker, currentInfoWindow;
	// 							for (var k =0; k < markers.length; k++){
	// 								var markerIcon;
	// 								if (markers[k].markerElement === markerElement){
	// 									currentInfoWindow = markers[k].infoWindow;
	// 								}
	// 								gMarker = markers[k].markerElement.gmarker;
	// 								if (gMarker.isActive && markers[k].markerElement !== markerElement){
	// 									gMarker.isActive = false;
	// 									if (markerIcon = markers[k].markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")){
	// 										gMarker.setIcon(markerIcon);
	// 									}
	// 									markers[k].infoWindow.close();
	// 								}
	// 							}

	// 							currentMarker.isActive = !currentMarker.isActive;
	// 							if (currentMarker.isActive) {
	// 								if (markerIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active")){
	// 									currentMarker.setIcon(markerIcon);
	// 								}

	// 								currentInfoWindow.open(map, marker);
	// 							}else{
	// 								if (markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")){
	// 									currentMarker.setIcon(markerIcon);
	// 								}
	// 								currentInfoWindow.close();
	// 							}
	// 						}).bind(this, markerElement, mapElement))
	// 					})
	// 				}
	// 			}
	// 		}
	// 	});
	// }


	/**
	 * @desc Toggle swiper videos on active slides
	 * @param {object} swiper - swiper slider
	 */
	function toggleSwiperInnerVideos(swiper) {
		var prevSlide = $(swiper.slides[swiper.previousIndex]),
			nextSlide = $(swiper.slides[swiper.activeIndex]),
			videos,
			videoItems = prevSlide.find("video");

		for (var i = 0; i < videoItems.length; i++) {
			videoItems[i].pause();
		}

		videos = nextSlide.find("video");
		if (videos.length) {
			videos.get(0).play();
		}
	}

	/**
	 * @desc Toggle swiper animations on active slides
	 * @param {object} swiper - swiper slider
	 */
	function toggleSwiperCaptionAnimation(swiper) {
		var prevSlide = $(swiper.container).find("[data-caption-animate]"),
			nextSlide = $(swiper.slides[swiper.activeIndex]).find("[data-caption-animate]"),
			delay,
			duration,
			nextSlideItem,
			prevSlideItem;

		for (var i = 0; i < prevSlide.length; i++) {
			prevSlideItem = $(prevSlide[i]);

			prevSlideItem.removeClass("animated")
				.removeClass(prevSlideItem.attr("data-caption-animate"))
				.addClass("not-animated");
		}


		var tempFunction = function (nextSlideItem, duration) {
			return function () {
				nextSlideItem
					.removeClass("not-animated")
					.addClass(nextSlideItem.attr("data-caption-animate"))
					.addClass("animated");
				if (duration) {
					nextSlideItem.css('animation-duration', duration + 'ms');
				}
			};
		};

		for (var i = 0; i < nextSlide.length; i++) {
			nextSlideItem = $(nextSlide[i]);
			delay = nextSlideItem.attr("data-caption-delay");
			duration = nextSlideItem.attr('data-caption-duration');
			if (!isNoviBuilder) {
				if (delay) {
					setTimeout(tempFunction(nextSlideItem, duration), parseInt(delay, 10));
				} else {
					tempFunction(nextSlideItem, duration);
				}

			} else {
				nextSlideItem.removeClass("not-animated")
			}
		}
	}

	/**
	 * initOwlCarousel
	 * @description  Init owl carousel plugin
	 */
	function initOwlCarousel(c) {
		var aliaces = ["-", "-xs-", "-sm-", "-md-", "-lg-"],
			values = [0, 480, 768, 992, 1200],
			responsive = {},
			j, k;

		for (j = 0; j < values.length; j++) {
			responsive[values[j]] = {};
			for (k = j; k >= -1; k--) {
				if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
					responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"), 10);
				}
				if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
					responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"), 10);
				}
				if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
					responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"), 10);
				}
			}
		}

		// Enable custom pagination
		if (c.attr('data-dots-custom')) {
			c.on("initialized.owl.carousel", function (event) {
				var carousel = $(event.currentTarget),
					customPag = $(carousel.attr("data-dots-custom")),
					active = 0;

				if (carousel.attr('data-active')) {
					active = parseInt(carousel.attr('data-active'));
				}

				carousel.trigger('to.owl.carousel', [active, 300, true]);
				customPag.find("[data-owl-item='" + active + "']").addClass("active");

				customPag.find("[data-owl-item]").on('click', function (e) {
					e.preventDefault();
					carousel.trigger('to.owl.carousel', [parseInt(this.getAttribute("data-owl-item")), 300, true]);
				});

				carousel.on("translate.owl.carousel", function (event) {
					customPag.find(".active").removeClass("active");
					customPag.find("[data-owl-item='" + event.item.index + "']").addClass("active")
				});
			});
		}


		c.owlCarousel({
			autoplay: c.attr("data-autoplay") === "true",
			loop: false,
			items: 1,
			rtl: isRtl,
			dotsContainer: c.attr("data-pagination-class") || false,
			navContainer: c.attr("data-navigation-class") || false,
			mouseDrag: isNoviBuilder ? false : c.attr("data-mouse-drag") !== "false",
			nav: c.attr("data-nav") === "true",
			dots: c.attr("data-dots") === "true",
			dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each")) : false,
			animateIn: c.attr('data-animation-in') ? c.attr('data-animation-in') : false,
			animateOut: c.attr('data-animation-out') ? c.attr('data-animation-out') : false,
			responsive: responsive,
			navText: $.parseJSON(c.attr("data-nav-text")) || [],
			navClass: $.parseJSON(c.attr("data-nav-class")) || ['owl-prev', 'owl-next'],
		});
	}

	/**
	 * @desc Initialize the gallery with set of images
	 * @param {object} itemsToInit - jQuery object
	 * @param {string} addClass - additional gallery class
	 */
	function initLightGallery(itemsToInit, addClass) {
		if (!isNoviBuilder) {
			$(itemsToInit).lightGallery({
				thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
				selector: "[data-lightgallery='item']",
				autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
				pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
				addClass: addClass,
				mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
				loop: $(itemsToInit).attr("data-lg-loop") !== "false"
			});
		}
	}

	/**
	 * @desc Initialize the gallery with dynamic addition of images
	 * @param {object} itemsToInit - jQuery object
	 * @param {string} addClass - additional gallery class
	 */
	function initDynamicLightGallery(itemsToInit, addClass) {
		if (!isNoviBuilder) {
			$(itemsToInit).on("click", function () {
				$(itemsToInit).lightGallery({
					thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
					selector: "[data-lightgallery='item']",
					autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
					pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
					addClass: addClass,
					mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
					loop: $(itemsToInit).attr("data-lg-loop") !== "false",
					dynamic: true,
					dynamicEl: JSON.parse($(itemsToInit).attr("data-lg-dynamic-elements")) || []
				});
			});
		}
	}

	/**
	 * @desc Initialize the gallery with one image
	 * @param {object} itemToInit - jQuery object
	 * @param {string} addClass - additional gallery class
	 */
	function initLightGalleryItem(itemToInit, addClass) {
		if (!isNoviBuilder) {
			$(itemToInit).lightGallery({
				selector: "this",
				addClass: addClass,
				counter: false,
				youtubePlayerParams: {
					modestbranding: 1,
					showinfo: 0,
					rel: 0,
					controls: 0
				},
				vimeoPlayerParams: {
					byline: 0,
					portrait: 0
				}
			});
		}
	}

	/**
	 * attachFormValidator
	 * @description  attach form validation to elements
	 */
	function attachFormValidator(elements) {
		for (var i = 0; i < elements.length; i++) {
			var o = $(elements[i]), v;
			o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
			v = o.parent().find(".form-validation");
			if (v.is(":last-child")) {
				o.addClass("form-control-last-child");
			}
		}

		elements
			.on('input change propertychange blur', function (e) {
				var $this = $(this), results;

				if (e.type != "blur") {
					if (!$this.parent().hasClass("has-error")) {
						return;
					}
				}

				if ($this.parents('.rd-mailform').hasClass('success')) {
					return;
				}

				if ((results = $this.regula('validate')).length) {
					for (i = 0; i < results.length; i++) {
						$this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error")
					}
				} else {
					$this.siblings(".form-validation").text("").parent().removeClass("has-error")
				}
			})
			.regula('bind');

		var regularConstraintsMessages = [
			{
				type: regula.Constraint.Required,
				newMessage: "Обязательное текстовое поле."
			},
			{
				type: regula.Constraint.Email,
				newMessage: "Электронная почта задана некорректно."
			},
			{
				type: regula.Constraint.Numeric,
				newMessage: "Допустимо только цифры"
			},
			{
				type: regula.Constraint.Selected,
				newMessage: "Пожалуйста, выберите опцию."
			}
		];


		for (var i = 0; i < regularConstraintsMessages.length; i++) {
			var regularConstraint = regularConstraintsMessages[i];

			regula.override({
				constraintType: regularConstraint.type,
				defaultMessage: regularConstraint.newMessage
			});
		}
	}

	/**
	 * isValidated
	 * @description  check if all elemnts pass validation
	 */
	function isValidated(elements, captcha) {
		var results, errors = 0;

		if (elements.length) {
			for (j = 0; j < elements.length; j++) {

				var $input = $(elements[j]);
				if ((results = $input.regula('validate')).length) {
					for (k = 0; k < results.length; k++) {
						errors++;
						$input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
					}
				} else {
					$input.siblings(".form-validation").text("").parent().removeClass("has-error")
				}
			}

			if (captcha) {
				if (captcha.length) {
					return validateReCaptcha(captcha) && errors == 0
				}
			}

			return errors == 0;
		}
		return true;
	}

	/**
	 * Init Bootstrap tooltip
	 * @description  calls a function when need to init bootstrap tooltips
	 */
	function initBootstrapTooltip(tooltipPlacement) {
		if (window.innerWidth < 599) {
			plugins.bootstrapTooltip.tooltip('destroy');
			plugins.bootstrapTooltip.tooltip({
				placement: 'bottom'
			});
		} else {
			plugins.bootstrapTooltip.tooltip('destroy');
			plugins.bootstrapTooltip.tooltip();
		}
	}


	/**
	 * Copyright Year
	 * @description  Evaluates correct copyright year
	 */
	if (plugins.copyrightYear.length) {
		plugins.copyrightYear.text(initialDate.getFullYear());
	}

	// // Google maps
	// if( plugins.maps.length ) {
	// 	lazyInit( plugins.maps, initMaps );
	// }


	/**
	 * Page loader
	 * @description Enables Page loader
	 */
	if (plugins.pageLoader.length > 0) {
		$window.on("load", function () {
			setTimeout(function () {
				plugins.pageLoader.addClass("loaded");
				$window.trigger("resize");
			}, 1000);
		});
	}

	/**
	 * validateReCaptcha
	 * @description  validate google reCaptcha
	 */
	function validateReCaptcha(captcha) {
		var $captchaToken = captcha.find('.g-recaptcha-response').val();

		if ($captchaToken == '') {
			captcha
				.siblings('.form-validation')
				.html('Пожалуйста, докажите, что вы не робот.')
				.addClass('active');
			captcha
				.closest('.form-group')
				.addClass('has-error');

			captcha.on('propertychange', function () {
				var $this = $(this),
					$captchaToken = $this.find('.g-recaptcha-response').val();

				if ($captchaToken != '') {
					$this
						.closest('.form-group')
						.removeClass('has-error');
					$this
						.siblings('.form-validation')
						.removeClass('active')
						.html('');
					$this.off('propertychange');
				}
			});

			return false;
		}

		return true;
	}


	/**
	 * onloadCaptchaCallback
	 * @description  init google reCaptcha
	 */
	onloadCaptchaCallback = function () {
		for (i = 0; i < plugins.captcha.length; i++) {
			var $capthcaItem = $(plugins.captcha[i]);

			grecaptcha.render(
				$capthcaItem.attr('id'),
				{
					sitekey: $capthcaItem.attr('data-sitekey'),
					size: $capthcaItem.attr('data-size') ? $capthcaItem.attr('data-size') : 'normal',
					theme: $capthcaItem.attr('data-theme') ? $capthcaItem.attr('data-theme') : 'light',
					callback: function (e) {
						$('.recaptcha').trigger('propertychange');
					}
				}
			);
			$capthcaItem.after("<span class='form-validation'></span>");
		}
	};

	/**
	 * Google ReCaptcha
	 * @description Enables Google ReCaptcha
	 */
	if (plugins.captcha.length) {
		$.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
	}

	/**
	 * Is Mac os
	 * @description  add additional class on html if mac os.
	 */
	if (navigator.platform.match(/(Mac)/i)) $html.addClass("mac-os");

	/**
	 * IE Polyfills
	 * @description  Adds some loosing functionality to IE browsers
	 */
	if (isIE) {
		if (isIE < 10) {
			$html.addClass("lt-ie-10");
		}

		if (isIE < 11) {
			if (plugins.pointerEvents) {
				$.getScript(plugins.pointerEvents)
					.done(function () {
						$html.addClass("ie-10");
						PointerEventsPolyfill.initialize({});
					});
			}
		}

		if (isIE === 11) {
			$("html").addClass("ie-11");
		}

		if (isIE === 12) {
			$("html").addClass("ie-edge");
		}
	}

	/**
	 * Bootstrap Tooltips
	 * @description Activate Bootstrap Tooltips
	 */
	if (plugins.bootstrapTooltip.length) {
		var tooltipPlacement = plugins.bootstrapTooltip.attr('data-placement');
		initBootstrapTooltip(tooltipPlacement);

		$window.on('resize orientationchange', function () {
			initBootstrapTooltip(tooltipPlacement);
		})
	}

	/**
	 * bootstrapModalDialog
	 * @description Stap vioeo in bootstrapModalDialog
	 */
	if (plugins.bootstrapModalDialog.length > 0) {
		var i = 0;

		for (i = 0; i < plugins.bootstrapModalDialog.length; i++) {
			var modalItem = $(plugins.bootstrapModalDialog[i]);

			modalItem.on('hidden.bs.modal', $.proxy(function () {
				var activeModal = $(this),
					rdVideoInside = activeModal.find('video'),
					youTubeVideoInside = activeModal.find('iframe');

				if (rdVideoInside.length) {
					rdVideoInside[0].pause();
				}

				if (youTubeVideoInside.length) {
					var videoUrl = youTubeVideoInside.attr('src');

					youTubeVideoInside
						.attr('src', '')
						.attr('src', videoUrl);
				}
			}, modalItem))
		}
	}

	/**
	 * JQuery mousewheel plugin
	 * @description  Enables jquery mousewheel plugin
	 */
	if (plugins.scroller.length) {
		var i;
		for (i = 0; i < plugins.scroller.length; i++) {
			var scrollerItem = $(plugins.scroller[i]);

			scrollerItem.mCustomScrollbar({
				theme: scrollerItem.attr('data-theme') ? scrollerItem.attr('data-theme') : 'minimal',
				scrollInertia: 100,
				scrollButtons: {enable: false}
			});
		}
	}




	/**
	 * Facebook widget
	 * @description  Enables official Facebook widget
	 */
	if (plugins.facebookWidget.length) {
		lazyInit(plugins.facebookWidget, function () {
			(function (d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) return;
				js = d.createElement(s);
				js.id = id;
				js.src = "//connect.facebook.net/en_EN/sdk.js#xfbml=1&version=v2.5";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
		});
	}

	// lightGallery
	if (plugins.lightGallery.length) {
		for (var i = 0; i < plugins.lightGallery.length; i++) {
			initLightGallery(plugins.lightGallery[i]);
		}
	}

	// lightGallery item
	if (plugins.lightGalleryItem.length) {
		// Filter carousel items
		var notCarouselItems = [];

		for (var z = 0; z < plugins.lightGalleryItem.length; z++) {
			if (!$(plugins.lightGalleryItem[z]).parents('.owl-carousel').length &&
				!$(plugins.lightGalleryItem[z]).parents('.swiper-slider').length &&
				!$(plugins.lightGalleryItem[z]).parents('.slick-slider').length) {
				notCarouselItems.push(plugins.lightGalleryItem[z]);
			}
		}

		plugins.lightGalleryItem = notCarouselItems;

		for (var i = 0; i < plugins.lightGalleryItem.length; i++) {
			initLightGalleryItem(plugins.lightGalleryItem[i]);
		}
	}

	// Dynamic lightGallery
	if (plugins.lightDynamicGalleryItem.length) {
		for (var i = 0; i < plugins.lightDynamicGalleryItem.length; i++) {
			initDynamicLightGallery(plugins.lightDynamicGalleryItem[i]);
		}
	}

	/**
	 * Radio
	 * @description Add custom styling options for input[type="radio"]
	 */
	if (plugins.radio.length) {
		var i;
		for (i = 0; i < plugins.radio.length; i++) {
			var $this = $(plugins.radio[i]);
			$this.addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")
		}
	}

	/**
	 * Checkbox
	 * @description Add custom styling options for input[type="checkbox"]
	 */
	if (plugins.checkbox.length) {
		var i;
		for (i = 0; i < plugins.checkbox.length; i++) {
			var $this = $(plugins.checkbox[i]);
			$this.addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>")
		}
	}

	/**
	 * Popovers
	 * @description Enables Popovers plugin
	 */
	if (plugins.popover.length) {
		if (window.innerWidth < 767) {
			plugins.popover.attr('data-placement', 'bottom');
			plugins.popover.popover();
		}
		else {
			plugins.popover.popover();
		}
	}

	/**
	 * Bootstrap Buttons
	 * @description  Enable Bootstrap Buttons plugin
	 */
	if (plugins.statefulButton.length) {
		$(plugins.statefulButton).on('click', function () {
			var statefulButtonLoading = $(this).button('loading');

			setTimeout(function () {
				statefulButtonLoading.button('reset')
			}, 2000);
		})
	}

	/**
	 * UI To Top
	 * @description Enables ToTop Button
	 */
	if (isDesktop && !isNoviBuilder) {
		$().UItoTop({
			easingType: 'easeOutQuart',
			containerClass: 'ui-to-top'
		});
	}

	/**
	 * RD Navbar
	 * @description Enables RD Navbar plugin
	 */
	if (plugins.rdNavbar.length) {
		plugins.rdNavbar.RDNavbar({
			stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
			responsive: {
				0: {
					stickUp: (!isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up") === 'true' : false
				},
				768: {
					stickUp: (!isNoviBuilder) ? plugins.rdNavbar.attr("data-sm-stick-up") === 'true' : false
				},
				992: {
					stickUp: (!isNoviBuilder) ? plugins.rdNavbar.attr("data-md-stick-up") === 'true' : false
				},
				1200: {
					stickUp: (!isNoviBuilder) ? plugins.rdNavbar.attr("data-lg-stick-up") === 'true' : false
				}
			},
			callbacks: {
				onStuck: function () {
					var navbarSearch = this.$element.find('.rd-search input');

					if (navbarSearch) {
						navbarSearch.val('').trigger('propertychange');
					}
				},
				onUnstuck: function () {
					if (this.$clone === null)
						return;

					var navbarSearch = this.$clone.find('.rd-search input');

					if (navbarSearch) {
						navbarSearch.val('').trigger('propertychange');
						navbarSearch.blur();
					}
				},
				onDropdownOver: function(){
					return !isNoviBuilder;
				}
			}
		});
		if (plugins.rdNavbar.attr("data-body-class")) {
			document.body.className += ' ' + plugins.rdNavbar.attr("data-body-class");
		}
	}

	/**
	 * ViewPort Universal
	 * @description Add class in viewport
	 */
	if (plugins.viewAnimate.length) {
		var i;
		for (i = 0; i < plugins.viewAnimate.length; i++) {
			var $view = $(plugins.viewAnimate[i]).not('.active');
			$document.on("scroll", $.proxy(function () {
				if (isScrolledIntoView(this)) {
					this.addClass("active");
				}
			}, $view))
				.trigger("scroll");
		}
	}


	// Swiper
	if (plugins.swiper.length) {
		for (var i = 0; i < plugins.swiper.length; i++) {
			var s = $(plugins.swiper[i]);
			var pag = s.find(".swiper-pagination"),
				next = s.find(".swiper-button-next"),
				prev = s.find(".swiper-button-prev"),
				bar = s.find(".swiper-scrollbar"),
				swiperSlide = s.find(".swiper-slide"),
				autoplay = false;

			for (var j = 0; j < swiperSlide.length; j++) {
				var $this = $(swiperSlide[j]),
					url;

				if (url = $this.attr("data-slide-bg")) {
					$this.css({
						"background-image": "url(" + url + ")",
						"background-size": "cover"
					})
				}
			}

			swiperSlide.end()
				.find("[data-caption-animate]")
				.addClass("not-animated")
				.end();

			s.swiper({
				autoplay: !isNoviBuilder && $.isNumeric( s.attr('data-autoplay') ) ? s.attr('data-autoplay') : false,
				direction: s.attr('data-direction') ? s.attr('data-direction') : "horizontal",
				effect: s.attr('data-slide-effect') ? s.attr('data-slide-effect') : "slide",
				speed: s.attr('data-slide-speed') ? s.attr('data-slide-speed') : 600,
				keyboardControl: s.attr('data-keyboard') === "true",
				mousewheelControl: s.attr('data-mousewheel') === "true",
				mousewheelReleaseOnEdges: s.attr('data-mousewheel-release') === "true",
				nextButton: next.length ? next.get(0) : null,
				prevButton: prev.length ? prev.get(0) : null,
				pagination: pag.length ? pag.get(0) : null,
				paginationClickable: pag.length ? pag.attr("data-clickable") !== "false" : false,
				paginationBulletRender: pag.length ? pag.attr("data-index-bullet") === "true" ? function (swiper, index, className) {
					return '<span class="' + className + '">' + (index + 1) + '</span>';
				} : null : null,
				scrollbar: bar.length ? bar.get(0) : null,
				scrollbarDraggable: bar.length ? bar.attr("data-draggable") !== "false" : true,
				scrollbarHide: bar.length ? bar.attr("data-draggable") === "false" : false,
				loop: isNoviBuilder ? false : s.attr('data-loop') !== "false",
				simulateTouch: s.attr('data-simulate-touch') && !isNoviBuilder ? s.attr('data-simulate-touch') === "true" : false,
				onTransitionStart: function (swiper) {
					toggleSwiperInnerVideos(swiper);
				},
				onTransitionEnd: function (swiper) {
					toggleSwiperCaptionAnimation(swiper);
				},
				onInit: function (swiper) {
					toggleSwiperInnerVideos(swiper);
					toggleSwiperCaptionAnimation(swiper);
					initLightGalleryItem(s.find('[data-lightgallery="item"]'), 'lightGallery-in-carousel');
				}
			});
		}
	}


	/**
	 * Owl carousel
	 * @description Enables Owl carousel plugin
	 */
	if (plugins.owl.length) {
		var i;
		for (i = 0; i < plugins.owl.length; i++) {
			var c = $(plugins.owl[i]);
			//skip owl in bootstrap tabs
			if (!c.parents('.tab-content').length) {
				initOwlCarousel(c);
			}
		}
	}





	/**
	 * WOW
	 * @description Enables Wow animation plugin
	 */
	if (isDesktop && $html.hasClass("wow-animation") && $(".wow").length && !isNoviBuilder)  {
		new WOW().init();
	}

	/**
	 * Bootstrap tabs
	 * @description Activate Bootstrap Tabs
	 */
	if (plugins.bootstrapTabs.length) {
		var i;
		for (i = 0; i < plugins.bootstrapTabs.length; i++) {
			var bootstrapTabsItem = $(plugins.bootstrapTabs[i]);

			//If have owl carousel inside tab - resize owl carousel on click
			if (bootstrapTabsItem.find('.owl-carousel').length) {
				// init first open tab

				var carouselObj = bootstrapTabsItem.find('.tab-content .tab-pane.active .owl-carousel');

				initOwlCarousel(carouselObj);

				//init owl carousel on tab change
				bootstrapTabsItem.find('.nav-custom a').on('click', $.proxy(function () {
					var $this = $(this);

					$this.find('.owl-carousel').trigger('destroy.owl.carousel').removeClass('owl-loaded');
					$this.find('.owl-carousel').find('.owl-stage-outer').children().unwrap();

					setTimeout(function () {
						var carouselObj = $this.find('.tab-content .tab-pane.active .owl-carousel');

						if (carouselObj.length) {
							for (var j = 0; j < carouselObj.length; j++) {
								var carouselItem = $(carouselObj[j]);
								initOwlCarousel(carouselItem);
							}
						}

					}, isNoviBuilder ? 1500 : 300);

				}, bootstrapTabsItem));
			}

			//If have slick carousel inside tab - resize slick carousel on click
			if (bootstrapTabsItem.find('.slick-slider').length) {
				bootstrapTabsItem.find('.tabs-custom-list > li > a').on('click', $.proxy(function () {
					var $this = $(this);
					var setTimeOutTime = isNoviBuilder ? 1500 : 300;

					setTimeout(function () {
						$this.find('.tab-content .tab-pane.active .slick-slider').slick('setPosition');
					}, setTimeOutTime);
				}, bootstrapTabsItem));
			}
		}
	}


	/**
	 * RD Input Label
	 * @description Enables RD Input Label Plugin
	 */

	if (plugins.rdInputLabel.length) {
		plugins.rdInputLabel.RDInputLabel();
	}


	/**
	 * Regula
	 * @description Enables Regula plugin
	 */

	if (plugins.regula.length) {
		attachFormValidator(plugins.regula);
	}


	/**
	 * MailChimp Ajax subscription
	 */

	if (plugins.mailchimp.length) {
		for (i = 0; i < plugins.mailchimp.length; i++) {
			var $mailchimpItem = $(plugins.mailchimp[i]),
				$email = $mailchimpItem.find('input[type="email"]');

			// Required by MailChimp
			$mailchimpItem.attr('novalidate', 'true');
			$email.attr('name', 'EMAIL');

			$mailchimpItem.on('submit', $.proxy(function (e) {
				e.preventDefault();

				var $this = this;

				var data = {},
					url = $this.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
					dataArray = $this.serializeArray(),
					$output = $("#" + $this.attr("data-form-output"));

				for (i = 0; i < dataArray.length; i++) {
					data[dataArray[i].name] = dataArray[i].value;
				}

				$.ajax({
					data: data,
					url: url,
					dataType: 'jsonp',
					error: function (resp, text) {
						$output.html('Server error: ' + text);

						setTimeout(function () {
							$output.removeClass("active");
						}, 4000);
					},
					success: function (resp) {
						$output.html(resp.msg).addClass('active');

						setTimeout(function () {
							$output.removeClass("active");
						}, 6000);
					},
					beforeSend: function (data) {
						// Stop request if builder or inputs are invalide
						if (isNoviBuilder || !isValidated($this.find('[data-constraints]')))
							return false;

						$output.html('Submitting...').addClass('active');
					}
				});

				return false;
			}, $mailchimpItem));
		}
	}


	/**
	 * Campaign Monitor ajax subscription
	 */

	if (plugins.campaignMonitor.length) {
		for (i = 0; i < plugins.campaignMonitor.length; i++) {
			var $campaignItem = $(plugins.campaignMonitor[i]);

			$campaignItem.on('submit', $.proxy(function (e) {
				var data = {},
					url = this.attr('action'),
					dataArray = this.serializeArray(),
					$output = $("#" + plugins.campaignMonitor.attr("data-form-output")),
					$this = $(this);

				for (i = 0; i < dataArray.length; i++) {
					data[dataArray[i].name] = dataArray[i].value;
				}

				$.ajax({
					data: data,
					url: url,
					dataType: 'jsonp',
					error: function (resp, text) {
						$output.html('Server error: ' + text);

						setTimeout(function () {
							$output.removeClass("active");
						}, 4000);
					},
					success: function (resp) {
						$output.html(resp.Message).addClass('active');

						setTimeout(function () {
							$output.removeClass("active");
						}, 6000);
					},
					beforeSend: function (data) {
						// Stop request if builder or inputs are invalide
						if (isNoviBuilder || !isValidated($this.find('[data-constraints]')))
							return false;

						$output.html('Submitting...').addClass('active');
					}
				});

				return false;
			}, $campaignItem));
		}
	}


	/**
	 * RD Mailform
	 * @version      3.0.0
	 */
	if (plugins.rdMailForm.length) {
		var i, j, k,
			msg = {
				'MF000': 'Успешно отправлено!',
				'MF001': 'Получатели не установлены!',
				'MF002': 'Форма не будет работать локально!',
				'MF003': 'Укажите поле электронной почты в своей форме!',
				'MF004': 'Укажите тип своей формы!',
				'MF254': 'Что-то пошло не так с PHPMailer!',
				'MF255': 'Вот блин! Что-то пошло не так.'
			},
			recipients = 'test@demolink.com';

		for (i = 0; i < plugins.rdMailForm.length; i++) {
			var $form = $(plugins.rdMailForm[i]),
				formHasCaptcha = false;

			$form.attr('novalidate', 'novalidate').ajaxForm({
				data: {
					"form-type": $form.attr("data-form-type") || "contact",
					"recipients": recipients,
					"counter": i
				},
				beforeSubmit: function (arr, $form, options) {
					if (isNoviBuilder)
						return;

					var form = $(plugins.rdMailForm[this.extraData.counter]),
						inputs = form.find("[data-constraints]"),
						output = $("#" + form.attr("data-form-output")),
						captcha = form.find('.recaptcha'),
						captchaFlag = true;

					output.removeClass("active error success");

					if (isValidated(inputs, captcha)) {

						// veify reCaptcha
						if (captcha.length) {
							var captchaToken = captcha.find('.g-recaptcha-response').val(),
									captchaMsg = {
										'CPT001': 'Пожалуйста, настройте «ключ сайта» и «секретный ключ» reCaptcha',
										'CPT002': 'Что-то не так с google reCaptcha'
									}

							formHasCaptcha = true;

							$.ajax({
								method: "POST",
								url: "bat/reCaptcha.php",
								data: {'g-recaptcha-response': captchaToken},
								async: false
							})
								.done(function (responceCode) {
									if (responceCode != 'CPT000') {
										if (output.hasClass("snackbars")) {
											output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')

											setTimeout(function () {
												output.removeClass("active");
											}, 3500);

											captchaFlag = false;
										} else {
											output.html(captchaMsg[responceCode]);
										}

										output.addClass("active");
									}
								});
						}

						if (!captchaFlag) {
							return false;
						}

						form.addClass('form-in-process');

						if (output.hasClass("snackbars")) {
							output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
							output.addClass("active");
						}
					} else {
						return false;
					}
				},
				error: function (result) {
					if (isNoviBuilder)
						return;

					var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
						form = $(plugins.rdMailForm[this.extraData.counter]);

					output.text(msg[result]);
					form.removeClass('form-in-process');

					if (formHasCaptcha) {
						grecaptcha.reset();
					}
				},
				success: function (result) {
					if (isNoviBuilder)
						return;

					var form = $(plugins.rdMailForm[this.extraData.counter]),
						output = $("#" + form.attr("data-form-output"));

					form
						.addClass('success')
						.removeClass('form-in-process');

					if (formHasCaptcha) {
						grecaptcha.reset();
					}

					result = result.length === 5 ? result : 'MF255';
					output.text(msg[result]);

					if (result === "MF000") {
						if (output.hasClass("snackbars")) {
							output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
						} else {
							output.addClass("active success");
						}
					} else {
						if (output.hasClass("snackbars")) {
							output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
						} else {
							output.addClass("active error");
						}
					}

					form.clearForm();
					form.find('input, textarea').trigger('blur');

					setTimeout(function () {
						output.removeClass("active error success");
						form.removeClass('success');
					}, 3500);
				}
			});
		}
	}


	if (plugins.customToggleSlider.length) {
		var i;

		for (i = 0; i < plugins.customToggleSlider.length; i++) {
			var $this = $(plugins.customToggleSlider[i]);

			$this.on('click', $.proxy(function (event) {
				event.preventDefault();
				var $ctx = $(this);
				$($ctx.attr('data-custom-toggle-slider')).add(this).toggleClass('active');
			}, $this));

			if ($this.attr("data-custom-toggle-slider-hide-on-blur") === "true") {
				$(".slider-item").on("click", $this, function (e) {
					if (e.target !== e.data[0]
						&& $(e.data.attr('data-custom-toggle-slider')).find($(e.target)).length
						&& e.data.find($(e.target)).length == 0) {
						$(e.data.attr('data-custom-toggle-slider')).add(e.data[0]).removeClass('active');
					}
				})
			}

			if ($this.attr("data-custom-toggle-slider-disable-on-blur") === "true") {
				$(".slider-item").on("click", $this, function (e) {
					if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle-slider')).find($(e.target)).length == 0 && e.data.find($(e.target)).length == 0) {
						$(e.data.attr('data-custom-toggle-slider')).add(e.data[0]).removeClass('active');
					}
				})
			}
		}
	}

	/**
	 * Custom Toggles
	 */
	if (plugins.customToggle.length) {
		var i;

		for (i = 0; i < plugins.customToggle.length; i++) {
			var $this = $(plugins.customToggle[i]);

			$this.on('click', $.proxy(function (event) {
				event.preventDefault();
				var $ctx = $(this);
				$($ctx.attr('data-custom-toggle')).add(this).toggleClass('active');
			}, $this));

			if ($this.attr("data-custom-toggle-hide-on-blur") === "true") {
				$("body").on("click", $this, function (e) {
					if (e.target !== e.data[0]
						&& $(e.data.attr('data-custom-toggle')).find($(e.target)).length
						&& e.data.find($(e.target)).length == 0) {
						$(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
					}
				})
			}

			if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {
				$("body").on("click", $this, function (e) {
					if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length == 0 && e.data.find($(e.target)).length == 0) {
						$(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
					}
				})
			}
		}
	}

	/**
	 * jQuery Count To
	 * @description Enables Count To plugin
	 */
	if (plugins.counter.length) {
		var i;

		for (i = 0; i < plugins.counter.length; i++) {
			var $counterNotAnimated = $(plugins.counter[i]).not('.animated');
			$document
				.on("scroll", $.proxy(function () {
					var $this = this;

					if ((!$this.hasClass("animated")) && (isScrolledIntoView($this))) {
						$this.countTo({
							refreshInterval: 40,
							from: 0,
							to: parseInt($this.text(), 10),
							speed: $this.attr("data-speed") || 1000
						});
						$this.addClass('animated');
					}
				}, $counterNotAnimated))
				.trigger("scroll");
		}
	}




	// TimeCircles
	if (plugins.dateCountdown.length) {
		for ( var i = 0; i < plugins.dateCountdown.length; i++ ) {
			var
				dateCountdownItem = $( plugins.dateCountdown[ i ] ),
				countdownRender = function () {
					dateCountdownItem.TimeCircles( {
						time: { Seconds: { show: !( window.innerWidth < 768 ), } }
					} ).rebuild();
				};

			dateCountdownItem.TimeCircles( {
				color: dateCountdownItem.attr( "data-color" ) ? dateCountdownItem.attr( "data-color" ) : "rgba(247, 247, 247, 1)",
				animation: "smooth",
				bg_width: dateCountdownItem.attr( "data-bg-width" ) ? dateCountdownItem.attr( "data-bg-width" ) : 0.6,
				circle_bg_color: dateCountdownItem.attr( "data-bg" ) ? dateCountdownItem.attr( "data-bg" ) : "rgba(0, 0, 0, 1)",
				fg_width: dateCountdownItem.attr( "data-width" ) ? dateCountdownItem.attr( "data-width" ) : 0.03,
				time: {
					Days: {
						text: "Дни",
						show: true,
						color: dateCountdownItem.attr( "data-color" ) ? dateCountdownItem.attr( "data-color" ) : "#f9f9f9"
					},
					Hours: {
						text: "Часы",
						show: true,
						color: dateCountdownItem.attr( "data-color" ) ? dateCountdownItem.attr( "data-color" ) : "#f9f9f9"
					},
					Minutes: {
						text: "Минуты",
						show: true,
						color: dateCountdownItem.attr( "data-color" ) ? dateCountdownItem.attr( "data-color" ) : "#f9f9f9"
					},
					Seconds: {
						text: "Секунды",
						show: false,
						color: dateCountdownItem.attr( "data-color" ) ? dateCountdownItem.attr( "data-color" ) : "#f9f9f9"
					}
				}
			} );

			countdownRender();
			window.addEventListener( 'resize', countdownRender );
		}
	}

	/**
	 * Circle Progress
	 * @description Enable Circle Progress plugin
	 */
	if (plugins.circleProgress.length) {
		var i;
		for (i = 0; i < plugins.circleProgress.length; i++) {
			var circleProgressItem = $(plugins.circleProgress[i]);
			$document
				.on("scroll", $.proxy(function () {
					var $this = $(this);

					if (!$this.hasClass('animated') && isScrolledIntoView($this)) {

						var arrayGradients = $this.attr('data-gradient').split(",");

						$this.circleProgress({
							value: $this.attr('data-value'),
							size: $this.attr('data-size') ? $this.attr('data-size') : 175,
							fill: {gradient: arrayGradients, gradientAngle: Math.PI / 4},
							startAngle: -Math.PI / 4 * 2,
							emptyFill: $this.attr('data-empty-fill') ? $this.attr('data-empty-fill') : "rgb(245,245,245)",
							thickness: $this.attr('data-thickness') ? parseInt($this.attr('data-thickness')) : 10,

						}).on('circle-animation-progress', function (event, progress, stepValue) {
							$(this).find('span').text(String(stepValue.toFixed(2)).replace('0.', '').replace('1.', '1'));
						});
						$this.addClass('animated');
					}
				}, circleProgressItem))
				.trigger("scroll");
		}
	}

	/**
	 * Linear Progress bar
	 * @description  Enable progress bar
	 */
	if (plugins.progressLinear.length) {
		for (i = 0; i < plugins.progressLinear.length; i++) {
			var progressBar = $(plugins.progressLinear[i]);
			$window
				.on("scroll load", $.proxy(function () {
					var bar = $(this);
					if (!bar.hasClass('animated-first') && isScrolledIntoView(bar)) {
						var end = parseInt($(this).find('.progress-value').text(), 10);
						bar.find('.progress-bar-linear').css({width: end + '%'});
						bar.find('.progress-value').countTo({
							refreshInterval: 40,
							from: 0,
							to: end,
							speed: 500
						});
						bar.addClass('animated-first');
					}
				}, progressBar));
		}
	}

	// Material Parallax
	if ( plugins.materialParallax.length ) {
		if ( !isNoviBuilder && !isIE && !isMobile) {
			plugins.materialParallax.parallax();
		} else {
			for ( var i = 0; i < plugins.materialParallax.length; i++ ) {
				var $parallax = $(plugins.materialParallax[i]);

				$parallax.addClass( 'parallax-disabled' );
				$parallax.css({ "background-image": 'url('+ $parallax.data("parallax-img") +')' });
			}
		}
	}

	/**
	 * Slick carousel
	 * @description  Enable Slick carousel plugin
	 */
	if (plugins.slick.length) {
		var i;
		for (i = 0; i < plugins.slick.length; i++) {
			var $slickItem = $(plugins.slick[i]);

			$slickItem.slick({
				slidesToScroll: parseInt($slickItem.attr('data-slide-to-scroll')) || 1,
				asNavFor: $slickItem.attr('data-for') || false,
				dots: $slickItem.attr("data-dots") == "true",
				infinite: isNoviBuilder ? false : $slickItem.attr("data-loop") == "true",
				focusOnSelect: true,
				arrows: $slickItem.attr("data-arrows") == "true",
				swipe: $slickItem.attr("data-swipe") == "true",
				autoplay: $slickItem.attr("data-autoplay") == "true",
				vertical: $slickItem.attr("data-vertical") == "true",
				centerMode: $slickItem.attr("data-center-mode") == "true",
				centerPadding: $slickItem.attr("data-center-padding") ? $slickItem.attr("data-center-padding") : '0.50',
				mobileFirst: true,
				rtl: isRtl,
				responsive: [
					{
						breakpoint: 0,
						settings: {
							slidesToShow: parseInt($slickItem.attr('data-items')) || 1,
						}
					},
					{
						breakpoint: 480,
						settings: {
							slidesToShow: parseInt($slickItem.attr('data-xs-items')) || 1,
						}
					},
					{
						breakpoint: 768,
						settings: {
							slidesToShow: parseInt($slickItem.attr('data-sm-items')) || 1,
						}
					},
					{
						breakpoint: 992,
						settings: {
							slidesToShow: parseInt($slickItem.attr('data-md-items')) || 1,
						}
					},
					{
						breakpoint: 1200,
						settings: {
							slidesToShow: parseInt($slickItem.attr('data-lg-items')) || 1,
						}
					}
				]
			})
				.on('afterChange', function (event, slick, currentSlide, nextSlide) {
					var $this = $(this),
						childCarousel = $this.attr('data-child');

					if (childCarousel) {
						$(childCarousel + ' .slick-slide').removeClass('slick-current');
						$(childCarousel + ' .slick-slide').eq(currentSlide).addClass('slick-current');
					}
				});
		}
	}

	/**
	 * RD Flickr Feed
	 * @description Enables RD Flickr Feed plugin
	 */
	if (plugins.flickrfeed.length > 0) {
		var i;
		for (i = 0; i < plugins.flickrfeed.length; i++) {
			var flickrfeedItem = $(plugins.flickrfeed[i]);
			flickrfeedItem.RDFlickr({
				callback: function () {
					var items = flickrfeedItem.find("[data-photo-swipe-item]");

					if (items.length) {
						for (var j = 0; j < items.length; j++) {
							var image = new Image();
							image.setAttribute('data-index', j);
							image.onload = function () {
								items[this.getAttribute('data-index')].setAttribute('data-size', this.naturalWidth + 'x' + this.naturalHeight);
							};
							image.src = items[j].getAttribute('href');
						}
					}
				}
			});
		}
	}

	/**
	 * RD Twitter Feed
	 * @description Enables RD Twitter Feed plugin
	 */
	if (plugins.twitterfeed.length > 0) {
		var i;
		for (i = 0; i < plugins.twitterfeed.length; i++) {
			var twitterfeedItem = plugins.twitterfeed[i];
			$(twitterfeedItem).RDTwitter({});
		}
	}

	/**
	 * RD Video
	 * @description Enables RD Video plugin
	 */
	if (plugins.rdVideoBG.length) {
		var i;
		for (i = 0; i < plugins.rdVideoBG.length; i++) {
			var videoItem = $(plugins.rdVideoBG[i]);
			videoItem.RDVideo({});
		}
	}

	/**
	 * AJAX script: Show more posts in blog page.
	 */
	let block_posts = document.getElementById('posts');
	let post_bottom = document.getElementById('posts-bottom-button');

	if (window.location.pathname === blog_url ||
		window.location.pathname === search_url ||
		window.location.pathname === archive_url) {
		if (block_posts.childElementCount < start_posts_number) {post_bottom.remove()}
	}

	$('#show_more_posts').click(function (){

		let block_posts = document.getElementById('posts');
		let get_params = (new URL(document.location)).searchParams;
		let data_params = {
				count_posts: block_posts.childElementCount
			};

		if (window.location.pathname === archive_url) {
			data_params = {
				count_posts: block_posts.childElementCount,
				month: get_params.get("month"),
				year: get_params.get("year")
			}
		}

		$.ajax({
			type:"GET",
			url: "show_more_posts/",
			dataType: "json",
			data: data_params,
			success: function(data){
				if (data){
					let _json = JSON.parse(JSON.stringify(data));
					let posts_left = _json[0]['posts_left'];
					let count_posts_add = _json[0]['count_posts_add'];

					if (data.length > 1){

						for (let iter = 0, item = 1; iter < data.length - 1; iter++, item++ ){

							let background_image = _json[item]['background_image'];
							let description = _json[item]['description'];
							let creation_time = _json[item]['creation_time'];
							let slug = post_slug_url.replace('ajax_hoOJmiSf9N', _json[item]['slug']);
							let title = _json[item]['title'];
							let author = _json[item]['author'];
							let author_avatar = _json[item]['author_avatar'];

							if (posts_left <= 0){
								$('#show_more_posts').remove();
							}
							$('#posts').append(`
								<div class="cell-sm-6 cell-flex">
								<article class="post-grid custom-bg-image"
									style="background-image: url(${background_image});">
									<div class="post-item">
										<div class="post-author">
											<a class="author-media">
												<img src="${author_avatar}" alt="" width="50" ></a>
											<a class="author-name">${author}</a>
										</div>
									</div>
									<div class="post-item">
										<div class="content">
											<div class="time">
												<time>${creation_time}</time>
											</div>
											<h4 class="post-title">
												<a href="${slug}">${title}</a>
											</h4>
											<div class="post-exeption">
												<p>${description}</p>
											</div>
										</div>
									</div>
								</article>
							</div>`
							)
						}
					}
					let height_block_post = document.getElementById('show_more_posts');
					height_block_post.scrollIntoView({block: "end", behavior: "smooth"})

					if (posts_left <= count_posts_add){
						document.getElementById('posts-bottom-button').remove();
					}
				}
				else {
					console.log('No data');
				}
			},
			error: function (error) {
				console.log('error => ', error);
			}
		})
	});

	/**
	* Sidebar blog page: Remove blocks if there are no elements.
	*/

	// archive
	let archive_block = document.getElementById('sidebar_archive')
	let archive_elements_count = archive_block.querySelector('ul').childElementCount
	if (archive_elements_count === 0) {archive_block.remove()}

	// gallery
	let gallery_block = document.getElementById('sidebar_gallery')
	let gallery_elements_count = gallery_block.querySelector('ul').childElementCount
	if (gallery_elements_count === 0) {gallery_block.remove()}
});