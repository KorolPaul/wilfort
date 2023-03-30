const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
const thresholdSteps = [...Array(10).keys()].map(i => i / 10);
const isMobile = window.innerWidth <= 768

// sliders
const mainider = document.querySelectorAll('.slider');
mainider.forEach(el => {
    tns({
        container: el,
        items: 1,
        center: true,
        gutter: 0,
        mouseDrag: true,
        autoplay: true,
        nav: true,
        navPosition: 'bottom',
        controls: true,
        loop: true,
        prevButton: false,
        autoplayButton: false,
        autoplayButtonOutput: false,
        autoplayTimeout: 10000,
        mode: 'gallery',
    });
});

const smallSlider = document.querySelectorAll('.small-slider');
smallSlider.forEach(el => {
    tns({
        container: el,
        items: 1,
        center: true,
        gutter: 0,
        mouseDrag: true,
        autoplay: true,
        nav: true,
        navPosition: 'bottom',
        controls: false,
        loop: true,
        prevButton: false,
        autoplayButton: false,
        autoplayButtonOutput: false,
        autoplayTimeout: 10000,
    });
});

// menu
const menuToggleElement = document.querySelector('.menu-toggle');
if (menuToggleElement) {
    menuToggleElement.addEventListener('click', () => document.body.classList.toggle('menu-opened'));
}


function closeAllOpened() {
    document.querySelectorAll('.opened').forEach(el => el.classList.remove('opened'));
    document.body.classList.remove('menu-opened');
    document.querySelectorAll('.popup-opened').forEach(el => el.classList.remove('popup-opened'));
    document.querySelectorAll('.js-form-popup').forEach(el => el.classList.remove('opened'));
    document.querySelectorAll('.filters_content').forEach(el => el.classList.remove('opened'));
}

/* hide menu on scroll */
const parallaxElement = document.querySelector('.parallax');
parallaxElement.addEventListener('scroll', function(e) {
    if (parallaxElement.scrollTop > 200) {
        document.body.classList.add('menu-hidden');
        document.body.classList.add('menu-hidden-transition');
    } else {
        document.body.classList.remove('menu-opened');
        document.body.classList.remove('menu-hidden');
    }

    setTimeout(() => {
        document.body.classList.remove('menu-hidden-transition');
    }, 500);
})


/* appaerance animation */
const animatedElements = document.querySelectorAll('.js-animation, .section_title');

if (animatedElements.length) {
    animatedElements.forEach(el => {
        const isActivityTextEl = el.classList.contains('activity_text');
        const ratio = (isMobile || isActivityTextEl) ? 0.1 : 0.3;
        const observerCallback = function (e) {
            const { target, intersectionRatio } = e[0];
            if (intersectionRatio > ratio) {
                target.classList.add('animated');
            }
        };

        const observer = new IntersectionObserver(observerCallback, {
            rootMargin: '0px 0px -15% 0px',
            threshold: thresholdSteps,
            //root: document.body
        });
        observer.observe(el);
    })
}

/* form */
const feedbackAPiUrl = 'https://api.herowarsportal.com/api/feedback';
const submitEl = document.querySelector('.form_submit');

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

if (submitEl) {
    submitEl.addEventListener('click', (e) => {
        const email = document.getElementById('email');
        const question = document.getElementById('question');

        if (email.value === '' || !validateEmail(email.value)) {
            email.parentElement.classList.add('error')
        }
        if (question.value === '') {
            question.parentElement.classList.add('error')
        }

        if (email.value === '' || !validateEmail(email.value) || question.value === '') {
            return
        }

        email.parentElement.classList.remove('error');
        question.parentElement.classList.remove('error');

        fetch(feedbackAPiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                email: email.value,
                question: question.value,
            })
        }).then(() => {
            e.target.setAttribute('disabled', true)
        })

        
    });
}
