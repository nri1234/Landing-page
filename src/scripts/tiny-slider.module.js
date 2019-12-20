import { tns } from 'tiny-slider/src/tiny-slider';

// funkcja ustawia slider na odpowiednim slajdzie w zaleznosci od kliknietej strony (kropki)
export const sliderChangeSlide = (slider, event, info) => {
  event.preventDefault();

  // domyslny slajd
  let slideIndex = 0;
  // wybrana strona
  let sliderPage = event.currentTarget.getAttribute('data-page');
  if (sliderPage === 'next') {
    // numer nastepnej strony
    sliderPage = info.navCurrentIndex + 1;
    if (sliderPage >= info.pages) sliderPage = 0;
  } else if (sliderPage === 'prev') {
    // numer poprzedniej strony
    sliderPage = info.navCurrentIndex - 1;
    if (sliderPage < 0) sliderPage = info.pages;
  }

  if (sliderPage > 0) {
    // index pierwszego slajdu na wybranej stronie w zaleznosci od elementow na stronie
    slideIndex = sliderPage * info.items;
  }

  // przejscie do slajdu
  slider.goTo(slideIndex);
};

// funkcja generuje nawigację do slidera
const sliderCreateNav = (slider, info, dotsContainerSelector) => {
  if (dotsContainerSelector !== '') {
    // usuniecie elementow nawigacji
    const dotsContainer = document.querySelector(dotsContainerSelector);
    dotsContainer.innerHTML = '';

    if (info.pages > 1) {
      // utworzenie kropek
      for (let i = 0; i < info.pages; i++) {
        const dotLink = '<li><a href="#" data-page="' + i + '"></a></li>';
        dotsContainer.insertAdjacentHTML('beforeend', dotLink);
      }

      // dodanie clickow na kropkach nawigacji
      for (let i = 0; i < dotsContainer.children.length; i++) {
        dotsContainer.children[i]
          .querySelector('a')
          .addEventListener('click', event => {
            sliderChangeSlide(slider, event, info);
          });
      }
    }

    // ustawienie aktywnej strony
    sliderSetActivePage(info, dotsContainerSelector);
  }
};

const sliderSetActivePage = (info, dotsContainerSelector) => {
  if (dotsContainerSelector !== '' && info.pages > 1) {
    // wylaczenie aktywnej kropki
    const activeDot = document.querySelector(dotsContainerSelector + ' a.active');
    if (activeDot) activeDot.classList.remove('active');

    // ustawienie aktywnej kropki
    const activeDotIndex = Math.floor((info.displayIndex - 1) / info.items);
    document
      .querySelector(dotsContainerSelector + ' a[data-page="' + activeDotIndex + '"]')
      .classList.add('active');
  }
};

// wrapper do inicjalizacji slidera
export const sliderStart = sliderContainerSelector => {
  const sliderContainer = document.querySelector(sliderContainerSelector);
  const slider = tns({
    container: sliderContainerSelector,
    slideBy: sliderContainer.dataset.slideBy,
    items: parseInt(sliderContainer.dataset.items),
    center: sliderContainer.dataset.center === 'true',
    loop: sliderContainer.dataset.loop === 'true',
    gutter: parseInt(sliderContainer.dataset.gutter),
    edgePadding: parseInt(sliderContainer.dataset.edgePadding),
    mouseDrag: sliderContainer.dataset.mouseDrag === 'true',
    controls: sliderContainer.dataset.controls === 'true',
    nav: sliderContainer.dataset.nav === 'true',
    navContainer: sliderContainer.dataset.navContainer === 'true',
    autoplay: sliderContainer.dataset.autoplay === 'true',
    autoplayButtonOutput: sliderContainer.dataset.autoplayButtonOutput === 'true',
    responsive: JSON.parse(sliderContainer.dataset.responsive)
  });
  slider.goTo(0);

  // event jesli zmieniona szerokosc ekranu
  slider.events.on('newBreakpointEnd', info => {
    sliderCreateNav(slider, info, sliderContainer.dataset.dotsContainer);
  });
  // event jesli zmieniony slajd
  slider.events.on('indexChanged', info => {
    // zmiana aktywnej kropki
    sliderSetActivePage(info, sliderContainer.dataset.dotsContainer);
  });
  // generowanie nawigacji do slidera
  sliderCreateNav(slider, slider.getInfo(), sliderContainer.dataset.dotsContainer);

  return slider;
};
