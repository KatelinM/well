import './components/main.scss';
import addListener from './helpers/utils/add-listener';

window.onload = function () {
    //slider
    var mySwiper = new Swiper('.swiper-container', {
        loop: true,
        slidesPerView: 'auto',
        slidesPerGroup: 1,
        spaceBetween: 30,
        freeMode: true,
        grabCursor: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        breakpoints: {
            720: {
                slidesPerView: 1,
                centeredSlides: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
            }
        },
    })
    /*make left padding for slider at the news block*/
    const product = document.querySelector(".product__label");
    const leftContainer = product.offsetLeft

    const news = document.querySelector(".news");

    news.style.paddingLeft = leftContainer + 'px'
}//end window.onload

//header
function toggleNav() {
    const nav = document.querySelector('.top-navigation');

    nav.classList.toggle('top-navigation_open');
}

(() => {
    const trigger = document.querySelector('.js-nav');
    const header = document.querySelector('.header');
    const nav = document.querySelector('.top-navigation');
    const navLinks = Array.from(nav.querySelectorAll('.top-navigation__link'));

    addListener(trigger, 'click', toggleNav);

    navLinks.forEach(link => {
        addListener(link, 'click', () => {
            nav.classList.remove('top-navigation_open');
        });
    });

    addListener(document, 'scroll', () => {
        if (document.body.scrollTop > 90 || document.documentElement.scrollTop > 90) {
            header.classList.add('header_shrink');
        } else {
            header.classList.remove('header_shrink');
        }
    });
})();
//scroll
var anchorLink = document.querySelector("[href='#top']"),
    target = document.getElementById("top");
anchorLink.addEventListener("click", function(e) {
    if (window.scrollTo) {
        e.preventDefault();
        window.scrollTo({"behavior": "smooth", "top": target.offsetTop});
    }
})
