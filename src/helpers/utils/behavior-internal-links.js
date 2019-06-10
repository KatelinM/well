/* eslint-disable */
import addListener from './add-listener';

function timeFunction(t) {
	return t * (2 - t);
}

function getHeaderHeight() {
	if (window.matchMedia('(min-width: 1024px)').matches) {
		return 108;
	}
	return 72;
}

function getOffsetTop(elem) {
	const box = elem.getBoundingClientRect();

	const docBody = document.body;
	const docEl = document.documentElement;
	const headerHeight = getHeaderHeight();

	const scrollTop = window.pageYOffset || docEl.scrollTop || docBody.scrollTop;
	const clientTop = docEl.clientTop || docBody.clientTop || 0;
	const top = box.top + scrollTop - clientTop - headerHeight;

	return Math.round(top);
}

function scrollIt(destination, duration) {
	const start = Math.ceil(window.pageYOffset);
	const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
	const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
	const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
	const destinationOffset = getOffsetTop(destination);
	const destinationOffsetToScroll = Math.ceil(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);

	if ('requestAnimationFrame' in window === false) {
		window.scroll(0, destinationOffsetToScroll);
		return;
	}

	function scroll() {
		const now = 'now' in window.performance ? performance.now() : new Date().getTime();
		const time = timeFunction(Math.min(1, ((now - startTime) / duration)));

		window.scroll(0, Math.ceil((time * (destinationOffsetToScroll - start)) + start));

		if ((start < destinationOffset && Math.ceil(window.pageYOffset) >= destinationOffsetToScroll) || (start >= destinationOffset && Math.floor(window.pageYOffset) <= destinationOffsetToScroll)) {
			return;
		}
		requestAnimationFrame(scroll);
	}

	scroll();
}

export default function () {
	if (typeof window !== 'undefined') {
		addListener(window, 'load', () => {
			const param = location.href.split('#')[1];
			const hashReg = /^[A-z0-9-]*$/;
			const navLinks = Array.from(document.querySelectorAll('.top-navigation__link'));

			if (!hashReg.test(param)) {
				return;
			}
			const internalLinks = Array.from(document.querySelectorAll('a[href^="#"]')).filter(a => a.getAttribute('href') && a.getAttribute('href').substring(0, 1) === '#');

			const sections = Array.from(document.querySelectorAll('.section'))
				.filter(section => section.hasAttribute('id') && section.getAttribute('id') !== '');

			if (param) {
				const $section = document.querySelector('[id="' + param + '"]');

				scrollIt($section, 600);
			}

			internalLinks.forEach(link => {
				addListener(link, 'click', e => {
					e.preventDefault();
					e.stopPropagation();

					const section = document.querySelector('[id="' + link.getAttribute('href').split('#')[1] + '"]');

					scrollIt(section, 600);
				});
			});

			let hash = '';

			addListener(document, 'scroll', () => {
				const scrollTop = document.documentElement.scrollTop;
				const purposeSection = sections.filter(section => scrollTop >= getOffsetTop(section) && scrollTop < (getOffsetTop(section) + section.offsetHeight));
				const newHash = purposeSection.length > 0 ? purposeSection[purposeSection.length - 1].getAttribute('id') : '';

				if (newHash !== hash) {
					hash = newHash;
					const hashString = hash !== '' ? '#' + hash : ' ';
					const link = document.querySelector('[href="#' + hash + '"]');

					if (history.replaceState) {
						history.replaceState(null, null, hashString);
					} else {
						location.hash = hashString;
					}

					navLinks.forEach(l => l.classList.remove('top-navigation__link_active'));
					if (link !== null) link.classList.add('top-navigation__link_active');
				}
			});
		});
	}
}

