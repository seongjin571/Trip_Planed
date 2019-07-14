const menuBtn = document.querySelector('.menu-btn');
const navWrap = document.querySelector('.nav-m-wrap');
menuBtn.addEventListener('click', function (e) {
    navWrap.style.transform = "translateX(0%)";
    document.querySelector('html').style.overflow = 'hidden';
    document.querySelector('.title_weather').style.zIndex = "-1";
})
navWrap.addEventListener('click', function (e) {
    if (e.target.className === 'nav-m-wrap'){
        navWrap.style.transform = "translateX(100%)";
        document.querySelector('html').style.overflow = 'unset';
        document.querySelector('.title_weather').style.zIndex = "0";
    }
})