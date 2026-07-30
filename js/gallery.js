(() => {
  const init = () => {
    const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
    const portfolioCards = Array.from(document.querySelectorAll('.portfolio-card'));

    if (filterButtons.length === 0 || portfolioCards.length === 0) {
      return;
    }

    const activeClasses = ['bg-white', 'text-black', 'font-semibold', 'px-5', 'py-2', 'md:px-6', 'md:py-2.5', 'rounded-full', 'shadow-md', 'text-xs', 'md:text-sm', 'transition-all', 'duration-300', 'active:scale-95', 'cursor-pointer'];
    const inactiveClasses = ['text-gray-400', 'hover:text-white', 'hover:bg-white/10', 'px-5', 'py-2', 'md:px-6', 'md:py-2.5', 'rounded-full', 'text-xs', 'md:text-sm', 'font-medium', 'transition-all', 'duration-300', 'active:scale-95', 'cursor-pointer'];

    const setActiveButton = (activeButton) => {
      filterButtons.forEach((button) => {
        const isActive = button === activeButton;
        inactiveClasses.forEach((className) => button.classList.toggle(className, !isActive));
        activeClasses.forEach((className) => button.classList.toggle(className, isActive));
      });
    };

    const applyFilter = (filter) => {
      portfolioCards.forEach((card) => {
        const matches = filter === 'all' || card.dataset.category === filter;

        window.clearTimeout(card._hideTimer);

        if (matches) {
          card.classList.remove('hidden');
          requestAnimationFrame(() => {
            card.classList.add('opacity-100', 'scale-100');
            card.classList.remove('opacity-0', 'scale-95');
          });
          return;
        }

        card.classList.add('opacity-0', 'scale-95');
        card.classList.remove('opacity-100', 'scale-100');
        card._hideTimer = window.setTimeout(() => {
          card.classList.add('hidden');
        }, 300);
      });
    };

    const lightbox = document.createElement('div');
    lightbox.className = 'fixed inset-0 z-[60] hidden items-center justify-center bg-black/90 px-4';
    lightbox.innerHTML = `
      <button type="button" class="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white hover:text-black" data-lightbox-close>
        დახურვა
      </button>
      <figure class="mx-auto w-full max-w-6xl">
        <img src="" alt="" class="max-h-[85vh] w-full rounded-3xl object-contain shadow-2xl" data-lightbox-image />
        <figcaption class="mt-4 text-center text-sm text-gray-300" data-lightbox-caption></figcaption>
      </figure>
    `;
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector('[data-lightbox-image]');
    const lightboxCaption = lightbox.querySelector('[data-lightbox-caption]');

    const closeLightbox = () => {
      lightbox.classList.add('hidden');
      lightbox.classList.remove('flex');
      document.body.classList.remove('overflow-hidden');
    };

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox || event.target.hasAttribute('data-lightbox-close')) {
        closeLightbox();
      }
    });

    portfolioCards.forEach((card) => {
      card.addEventListener('click', (event) => {
        event.preventDefault();
        const imageSource = card.dataset.thumb || card.querySelector('img')?.src || card.href;
        lightboxImage.src = imageSource;
        lightboxImage.alt = card.dataset.title || '';
        lightboxCaption.textContent = `${card.dataset.title || ''} — ${card.dataset.subtitle || ''}`.trim();
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
        document.body.classList.add('overflow-hidden');
      });
    });

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const activeFilter = button.dataset.filter || 'all';
        applyFilter(activeFilter);
        setActiveButton(button);
      });
    });

    const initialButton = filterButtons.find((button) => button.dataset.filter === 'all') || filterButtons[0];
    if (initialButton) {
      applyFilter(initialButton.dataset.filter || 'all');
      setActiveButton(initialButton);
    }

  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
