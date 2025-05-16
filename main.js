import Trustindex from './components/Trustindex.js';

import TrustindexWidget from './components/TrustindexWidget.js';
import TrustindexReviewWidget from './components/TrustindexReviewWidget.js';
import TrustindexSliderWidget from './components/TrustindexSliderWidget.js';
import TrustindexMasonryWidget from './components/TrustindexMasonryWidget.js';
import TrustindexPopupWidget from './components/TrustindexPopupWidget.js';
import TrustindexFloatingWidget from './components/TrustindexFloatingWidget.js';
import TrustindexTopRatedWidget from './components/TrustindexTopRatedWidget.js';

import TrustindexReadMoreModule from './components/TrustindexReadMoreModule.js';
import TrustindexLoadMoreModule from './components/TrustindexLoadMoreModule.js';
import TrustindexHeaderModule from './components/TrustindexHeaderModule.js';
import TrustindexReviewImageModule from './components/TrustindexReviewImageModule.js';
import TrustindexLightboxModule from './components/TrustindexLightboxModule.js';
import TrustindexAiSummaryModule from './components/TrustindexAiSummaryModule.js';
import TrustindexDarkModeModule from './components/TrustindexDarkModeModule.js';

Element.prototype.toggleShow = function(display) {
	this.style.display = display || '';
};

Element.prototype.toggleHide = function() {
	this.style.display = 'none';
};

if (typeof window.TrustindexWidget === 'undefined') {
	window.tiWidgetInstances = [];
	window.Trustindex = Trustindex;

	window.TrustindexWidget = TrustindexWidget;
	window.TrustindexReviewWidget = TrustindexReviewWidget;
	window.TrustindexSliderWidget = TrustindexSliderWidget;
	window.TrustindexMasonryWidget = TrustindexMasonryWidget;
	window.TrustindexPopupWidget = TrustindexPopupWidget;
	window.TrustindexFloatingWidget = TrustindexFloatingWidget;
	window.TrustindexTopRatedWidget = TrustindexTopRatedWidget;

	window.TrustindexReadMoreModule = TrustindexReadMoreModule;
	window.TrustindexLoadMoreModule = TrustindexLoadMoreModule;
	window.TrustindexHeaderModule = TrustindexHeaderModule;
	window.TrustindexReviewImageModule = TrustindexReviewImageModule;
	window.TrustindexLightboxModule = TrustindexLightboxModule;
	window.TrustindexAiSummaryModule = TrustindexAiSummaryModule;
	window.TrustindexDarkModeModule = TrustindexDarkModeModule;

	Trustindex.setConstants();

	let cachedWidth = document.body ? document.body.offsetWidth : 0;
	let resizeTimeout = null;
	window.addEventListener('resize', () => {
		if (document.body.offsetWidth !== cachedWidth) {
			cachedWidth = document.body.offsetWidth;

			if (resizeTimeout) {
				clearTimeout(resizeTimeout);
			}

			window.tiWidgetInstances.forEach(TrustindexWidget => TrustindexWidget.resize());
		}
	});

	document.addEventListener('click', (event) => {
		window.tiWidgetInstances.forEach(TrustindexWidget => TrustindexWidget.documentClick(event));
	});

	document.addEventListener('keyup', (event) => {
		window.tiWidgetInstances.forEach(TrustindexWidget => TrustindexWidget.documentKeyup(event));
	});

	// lazy-load
	window.tiElementToWaitForVisibility = [];
	window.tiElementToWaitForActivity = [];

	let scrollCallback = function (event) {
		window.tiElementToWaitForVisibility.forEach((element, index) => {
			if (element.isTriggerLoad()) {
				new TrustindexWidget(null, element);

				window.tiElementToWaitForVisibility.splice(index, 1);
			}
		})
	};

	let interactivityCallback = function(event) {
		window.tiElementToWaitForActivity.forEach((element, index) => {
			window.tiElementToWaitForActivity.splice(index, 1);

			if (true === element.isWaitForVisibility && !element.isTriggerLoad()) {
				return window.tiElementToWaitForVisibility.push(element);
			}

			new TrustindexWidget(null, element);
		});
	};

	window.addEventListener('keydown', interactivityCallback, false);
	window.addEventListener('mousemove', interactivityCallback, false);
	window.addEventListener('mouseover', interactivityCallback, false);
	window.addEventListener('wheel', interactivityCallback, false);
	window.addEventListener('touchmove', interactivityCallback, false);
	window.addEventListener('touchstart', interactivityCallback, false);

	window.addEventListener('scroll', scrollCallback, false);
	window.addEventListener('wheel', scrollCallback, false);
	window.addEventListener('touchmove', scrollCallback, false);

	// mobile debug for swipe (some pages put unnecessary "overflow: hidden" to html element)
	if (Trustindex.isMobileDevice() && window.getComputedStyle(document.documentElement, null).getPropertyValue('overflow') === 'hidden') {
		document.documentElement.style.overflow = 'unset';
	}
}

if (!document.currentScript.getAttribute('data-skip-init')) {
	// replace pre.ti-widget with its child .ti-widget (for unnecessary <p> workaround)
	document.querySelectorAll('pre.ti-widget').forEach(item => item.replaceWith(item.firstChild));

	setTimeout(() => {
		Trustindex.initWidgetsFromDom();
		Trustindex.loadWidgetsFromDom();
	}, 4);
}