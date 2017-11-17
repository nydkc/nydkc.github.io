/*
	Forty by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	skel.breakpoints({
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)',
		xxsmall: '(max-width: 360px)'
	});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = (skel.vars.browser == 'ie' || skel.vars.browser == 'edge' || skel.vars.mobile) ? function() { return $(this) } : function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {

			var $t = $(this),
				on, off;

			on = function() {

				$t.css('background-position', 'center 100%, center 100%, center 0px');

				$window
					.on('scroll._parallax', function() {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$t.css('background-position', 'center ' + (pos * (-1 * intensity)) + 'px');

					});

			};

			off = function() {

				$t
					.css('background-position', '');

				$window
					.off('scroll._parallax');

			};

			skel.on('change', function() {

				if (skel.breakpoint('medium').active)
					(off)();
				else
					(on)();

			});

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);

	};

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$wrapper = $('#wrapper'),
			$header = $('#header'),
			$banner = $('#banner');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load pageshow', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Clear transitioning state on unload/hide.
			$window.on('unload pagehide', function() {
				window.setTimeout(function() {
					$('.is-transitioning').removeClass('is-transitioning');
				}, 250);
			});

		// Fix: Enable IE-only tweaks.
			if (skel.vars.browser == 'ie' || skel.vars.browser == 'edge')
				$body.addClass('is-ie');

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Scrolly.
			$('.scrolly').scrolly({
				offset: function() {
					return $header.height() - 2;
				}
			});

		// Tiles.
			var $tiles = $('.tiles > article');

			$tiles.each(function() {

				var $this = $(this),
					$image = $this.find('.image'), $img = $image.find('img'),
					$link = $this.find('.link'),
					x;

				// Image.

					// Set image.
						$this.css('background-image', 'url(' + $img.attr('src') + ')');

					// Set position.
						if (x = $img.data('position'))
							$image.css('background-position', x);

					// Hide original.
						$image.hide();

				// Link.
					if ($link.length > 0) {

						$x = $link.clone()
							.text('')
							.addClass('primary')
							.appendTo($this);

						$link = $link.add($x);

						$link.on('click', function(event) {

							var href = $link.attr('href');

							// Prevent default.
								event.stopPropagation();
								event.preventDefault();

							// Start transitioning.
								$this.addClass('is-transitioning');
								$wrapper.addClass('is-transitioning');

							// Redirect.
								window.setTimeout(function() {

									if ($link.attr('target') == '_blank')
										window.open(href);
									else
										location.href = href;

								}, 500);

						});

					}

			});

		// Header.
			if (skel.vars.IEVersion < 9)
				$header.removeClass('alt');

			if ($banner.length > 0
			&&	$header.hasClass('alt')) {

				$window.on('resize', function() {
					$window.trigger('scroll');
				});

				$window.on('load', function() {

					$banner.scrollex({
						bottom:		$header.height() + 10,
						terminate:	function() { $header.removeClass('alt'); },
						enter:		function() { $header.addClass('alt'); },
						leave:		function() { $header.removeClass('alt'); $header.addClass('reveal'); }
					});

					window.setTimeout(function() {
						$window.triggerHandler('scroll');
					}, 100);

				});

			}

		// Banner.
			$banner.each(function() {

				var $this = $(this),
					$image = $this.find('.image'), $img = $image.find('img');

				// Parallax.
					$this._parallax(0.275);

				// Image.
					if ($image.length > 0) {

						// Set image.
							$this.css('background-image', 'url(' + $img.attr('src') + ')');

						// Hide original.
							$image.hide();

					}

			});

		// Menu.
			var $menu = $('#menu'),
				$menuInner;

			$menu.wrapInner('<div class="inner"></div>');
			$menuInner = $menu.children('.inner');
			$menu._locked = false;

			$menu._lock = function() {

				if ($menu._locked)
					return false;

				$menu._locked = true;

				window.setTimeout(function() {
					$menu._locked = false;
				}, 350);

				return true;

			};

			$menu._show = function() {

				if ($menu._lock())
					$body.addClass('is-menu-visible');

			};

			$menu._hide = function() {

				if ($menu._lock())
					$body.removeClass('is-menu-visible');

			};

			$menu._toggle = function() {

				if ($menu._lock())
					$body.toggleClass('is-menu-visible');

			};

			$menuInner
				.on('click', function(event) {
					event.stopPropagation();
				})
				.on('click', 'a', function(event) {

					var href = $(this).attr('href');

					event.preventDefault();
					event.stopPropagation();

					// Hide.
						$menu._hide();

					// Redirect.
						window.setTimeout(function() {
							window.location.href = href;
						}, 250);

				});

			$menu
				.appendTo($body)
				.on('click', function(event) {

					event.stopPropagation();
					event.preventDefault();

					$body.removeClass('is-menu-visible');

				})
				.append('<a class="close" href="#menu">Close</a>');

			$body
				.on('click', 'a[href="#menu"]', function(event) {

					event.stopPropagation();
					event.preventDefault();

					// Toggle.
						$menu._toggle();

				})
				.on('click', function(event) {

					// Hide.
						$menu._hide();

				})
				.on('keydown', function(event) {

					// Hide on escape.
						if (event.keyCode == 27)
							$menu._hide();

				});


		// Menu2.
			var $menu2 = $('#menu2'),
				$menu2Inner;

			$menu2.wrapInner('<div class="inner"></div>');
			$menu2Inner = $menu2.children('.inner');
			$menu2._locked = false;

			$menu2._lock = function() {

				if ($menu2._locked)
					return false;

				$menu2._locked = true;

				window.setTimeout(function() {
					$menu2._locked = false;
				}, 350);

				return true;

			};

			$menu2._show = function() {

				if ($menu2._lock())
					$body.addClass('is-menu2-visible');

			};

			$menu2._hide = function() {

				if ($menu2._lock())
					$body.removeClass('is-menu2-visible');

			};

			$menu2._toggle = function() {

				if ($menu2._lock())
					$body.toggleClass('is-menu2-visible');

			};

			$menu2Inner
				.on('click', function(event) {
					event.stopPropagation();
				})
				.on('click', 'a', function(event) {

					var href = $(this).attr('href');

					event.preventDefault();
					event.stopPropagation();

					// Hide.
						$menu2._hide();

					// Redirect.
						window.setTimeout(function() {
							window.location.href = href;
						}, 250);

				});

			$menu2
				.appendTo($body)
				.on('click', function(event) {

					event.stopPropagation();
					event.preventDefault();

					$body.removeClass('is-menu2-visible');

				})
				.append('<a class="close" href="#menu2">Close</a>');

			$body
				.on('click', 'a[href="#menu2"]', function(event) {

					event.stopPropagation();
					event.preventDefault();

					// Toggle.
						$menu2._toggle();

				})
				.on('click', function(event) {

					// Hide.
						$menu2._hide();

				})
				.on('keydown', function(event) {

					// Hide on escape.
						if (event.keyCode == 27)
							$menu2._hide();

				});


			// Menu3.
			var $menu3 = $('#menu3'),
				$menu3Inner;

			$menu3.wrapInner('<div class="inner"></div>');
			$menu3Inner = $menu3.children('.inner');
			$menu3._locked = false;

			$menu3._lock = function() {

				if ($menu3._locked)
					return false;

				$menu3._locked = true;

				window.setTimeout(function() {
					$menu3._locked = false;
				}, 350);

				return true;

			};

			$menu3._show = function() {

				if ($menu3._lock())
					$body.addClass('is-menu3-visible');

			};

			$menu3._hide = function() {

				if ($menu3._lock())
					$body.removeClass('is-menu3-visible');

			};

			$menu3._toggle = function() {

				if ($menu3._lock())
					$body.toggleClass('is-menu3-visible');

			};

			$menu3Inner
				.on('click', function(event) {
					event.stopPropagation();
				})
				.on('click', 'a', function(event) {

					var href = $(this).attr('href');

					event.preventDefault();
					event.stopPropagation();

					// Hide.
						$menu3._hide();

					// Redirect.
						window.setTimeout(function() {
							window.location.href = href;
						}, 250);

				});

			$menu3
				.appendTo($body)
				.on('click', function(event) {

					event.stopPropagation();
					event.preventDefault();

					$body.removeClass('is-menu3-visible');

				})
				.append('<a class="close" href="#menu3">Close</a>');

			$body
				.on('click', 'a[href="#menu3"]', function(event) {

					event.stopPropagation();
					event.preventDefault();

					// Toggle.
						$menu3._toggle();

				})
				.on('click', function(event) {

					// Hide.
						$menu3._hide();

				})
				.on('keydown', function(event) {

					// Hide on escape.
						if (event.keyCode == 27)
							$menu3._hide();

				});


		// Menu4.
			var $menu4 = $('#menu4'),
				$menu4Inner;

			$menu4.wrapInner('<div class="inner"></div>');
			$menu4Inner = $menu4.children('.inner');
			$menu4._locked = false;

			$menu4._lock = function() {

				if ($menu4._locked)
					return false;

				$menu4._locked = true;

				window.setTimeout(function() {
					$menu4._locked = false;
				}, 350);

				return true;

			};

			$menu4._show = function() {

				if ($menu4._lock())
					$body.addClass('is-menu4-visible');

			};

			$menu4._hide = function() {

				if ($menu4._lock())
					$body.removeClass('is-menu4-visible');

			};

			$menu4._toggle = function() {

				if ($menu4._lock())
					$body.toggleClass('is-menu4-visible');

			};

			$menu4Inner
				.on('click', function(event) {
					event.stopPropagation();
				})
				.on('click', 'a', function(event) {

					var href = $(this).attr('href');

					event.preventDefault();
					event.stopPropagation();

					// Hide.
						$menu4._hide();

					// Redirect.
						window.setTimeout(function() {
							window.location.href = href;
						}, 250);

				});

			$menu4
				.appendTo($body)
				.on('click', function(event) {

					event.stopPropagation();
					event.preventDefault();

					$body.removeClass('is-menu4-visible');

				})
				.append('<a class="close" href="#menu4">Close</a>');

			$body
				.on('click', 'a[href="#menu4"]', function(event) {

					event.stopPropagation();
					event.preventDefault();

					// Toggle.
						$menu4._toggle();

				})
				.on('click', function(event) {

					// Hide.
						$menu4._hide();

				})
				.on('keydown', function(event) {

					// Hide on escape.
						if (event.keyCode == 27)
							$menu4._hide();

				});


		// Menu5.
			var $menu5 = $('#menu5'),
				$menu5Inner;

			$menu5.wrapInner('<div class="inner"></div>');
			$menu5Inner = $menu5.children('.inner');
			$menu5._locked = false;

			$menu5._lock = function() {

				if ($menu5._locked)
					return false;

				$menu5._locked = true;

				window.setTimeout(function() {
					$menu5._locked = false;
				}, 350);

				return true;

			};

			$menu5._show = function() {

				if ($menu5._lock())
					$body.addClass('is-menu5-visible');

			};

			$menu5._hide = function() {

				if ($menu5._lock())
					$body.removeClass('is-menu5-visible');

			};

			$menu5._toggle = function() {

				if ($menu5._lock())
					$body.toggleClass('is-menu5-visible');

			};

			$menu5Inner
				.on('click', function(event) {
					event.stopPropagation();
				})
				.on('click', 'a', function(event) {

					var href = $(this).attr('href');

					event.preventDefault();
					event.stopPropagation();

					// Hide.
						$menu5._hide();

					// Redirect.
						window.setTimeout(function() {
							window.location.href = href;
						}, 250);

				});

			$menu5
				.appendTo($body)
				.on('click', function(event) {

					event.stopPropagation();
					event.preventDefault();

					$body.removeClass('is-menu5-visible');

				})
				.append('<a class="close" href="#menu5">Close</a>');

			$body
				.on('click', 'a[href="#menu5"]', function(event) {

					event.stopPropagation();
					event.preventDefault();

					// Toggle.
						$menu5._toggle();

				})
				.on('click', function(event) {

					// Hide.
						$menu5._hide();

				})
				.on('keydown', function(event) {

					// Hide on escape.
						if (event.keyCode == 27)
							$menu5._hide();

				});




	});

})(jQuery);