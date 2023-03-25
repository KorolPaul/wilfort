const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
const thresholdSteps = [...Array(10).keys()].map(i => i / 10);

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
    });
})

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

/* hide header buttons when first section visible */
const headerEl = document.querySelector('.header')
const showcaseEl = document.querySelector('.section__showcase')

if (headerEl && showcaseEl) {
    const observerCallback = function (e) {
        const { intersectionRatio } = e[0];

        if (intersectionRatio < 0.1) {
            headerEl.classList.add('header__button-visible');
        } else {
            headerEl.classList.remove('header__button-visible');
        }
    };

    const observer = new IntersectionObserver(observerCallback, {
        rootMargin: '0px 0px 0px 0px',
        threshold: thresholdSteps,
        root: null
    });
    observer.observe(showcaseEl)
}

/* appaerance animation */
const animatedElements = document.querySelectorAll('.js-animation, .section_title, .section_subtitle');

if (animatedElements.length) {
    const ratio = isMobile ? 0.2 : 0.5
    const observerCallback = function (e) {
        const { target, intersectionRatio } = e[0];
        if (intersectionRatio > ratio) {
            target.classList.add('animated');
        }
    };

    animatedElements.forEach(el => {
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
