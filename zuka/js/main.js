(() => {
  const init = () => {
    const menuButton = document.getElementById('menuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIconOpen = document.getElementById('menuIconOpen');
    const menuIconClose = document.getElementById('menuIconClose');
    const fabButton = document.querySelector('.js-fab');
    const messengerMenu = document.getElementById('messengerMenu');
    const copyToast = document.getElementById('copyToast');
    const contactForm = document.getElementById('contact-form');
    const contactSubmitButton = document.getElementById('contact-submit');
    const copyButtons = Array.from(document.querySelectorAll('.copy-contact-btn'));

    const BOT_TOKEN = '8903390726:AAGnlAAYOmESfUtCNl-t8CTWXm0Nukh8C3s';
    const CHAT_ID = '8474830496';

    const syncMenu = () => {
      if (!menuButton || !mobileMenu || !menuIconOpen || !menuIconClose) {
        return;
      }

      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      menuIconOpen.classList.toggle('hidden');
      menuIconClose.classList.toggle('hidden');
      menuButton.setAttribute('aria-expanded', String(!isOpen));
    };

    if (menuButton) {
      menuButton.addEventListener('click', syncMenu);
    }

    const showToast = (message) => {
      if (!copyToast) {
        return;
      }

      copyToast.textContent = message;
      copyToast.classList.remove('hidden', 'opacity-0', 'translate-y-3');
      copyToast.classList.add('opacity-100', 'translate-y-0');

      window.clearTimeout(showToast.hideTimer);
      showToast.hideTimer = window.setTimeout(() => {
        copyToast.classList.add('opacity-0', 'translate-y-3');
        copyToast.classList.remove('opacity-100', 'translate-y-0');
        window.setTimeout(() => {
          copyToast.classList.add('hidden');
        }, 240);
      }, 2000);
    };

    const copyToClipboard = async (value, label) => {
      try {
        await navigator.clipboard.writeText(value);
        showToast('скопировано!');
      } catch {
        const fallback = document.createElement('textarea');
        fallback.value = value;
        fallback.setAttribute('readonly', 'true');
        fallback.style.position = 'fixed';
        fallback.style.left = '-9999px';
        document.body.appendChild(fallback);
        fallback.select();
        document.execCommand('copy');
        document.body.removeChild(fallback);
        showToast('скопировано!');
      }
    };

    copyButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const value = button.dataset.copyValue || '';
        const label = button.dataset.copyLabel || '';
        if (value) {
          copyToClipboard(value, label);
        }
      });
    });

    const setSubmitState = (isLoading) => {
      if (!contactSubmitButton) {
        return;
      }

      contactSubmitButton.disabled = isLoading;
      contactSubmitButton.textContent = isLoading ? 'იგზავნება...' : 'განაცხადის გაგზავნა';
      contactSubmitButton.classList.toggle('opacity-70', isLoading);
      contactSubmitButton.classList.toggle('cursor-not-allowed', isLoading);
    };

    const escapeHtml = (value) =>
      value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

    if (contactForm) {
      contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const name = String(formData.get('name') || '').trim();
        const phone = String(formData.get('phone') || '').trim();
        const type = String(formData.get('type') || '').trim();
        const date = String(formData.get('date') || '').trim();
        const message = String(formData.get('message') || '').trim();

        if (!name || !phone) {
          showToast('გთხოვთ, შეავსეთ სახელი და ტელეფონი.');
          return;
        }

        setSubmitState(true);

        const telegramText = [
          '<b>ახალი განაცხადი საიტიდან</b>',
          `<b>სახელი:</b> ${escapeHtml(name)}`,
          `<b>ტელეფონი:</b> ${escapeHtml(phone)}`,
          `<b>გადაღების ტიპი:</b> ${escapeHtml(type)}`,
          `<b>თარიღი:</b> ${escapeHtml(date || '—')}`,
          `<b>შეტყობინება:</b> ${escapeHtml(message || '—')}`,
        ].join('\n');

        try {
          const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: CHAT_ID,
              text: telegramText,
              parse_mode: 'HTML',
              disable_web_page_preview: true,
            }),
          });

          if (!response.ok) {
            throw new Error('Telegram request failed');
          }

          showToast('გმადლობთ! თქვენი განაცხადი მიღებულია. მალე დაგიკავშირდებით.');
          contactForm.reset();
        } catch (error) {
          console.error(error);
          showToast('გაგზავნა ვერ მოხერხდა. სცადეთ მოგვიანებით.');
        } finally {
          setSubmitState(false);
        }
      });
    }

    if (fabButton && messengerMenu) {
      const closeMessengerMenu = () => {
        messengerMenu.classList.add('hidden');
        fabButton.setAttribute('aria-expanded', 'false');
      };

      fabButton.addEventListener('click', () => {
        const isHidden = messengerMenu.classList.contains('hidden');
        messengerMenu.classList.toggle('hidden');
        fabButton.setAttribute('aria-expanded', String(isHidden));
      });

      document.addEventListener('click', (event) => {
        if (!messengerMenu.contains(event.target) && !fabButton.contains(event.target)) {
          closeMessengerMenu();
        }
      });

      messengerMenu.querySelectorAll('a[href="#contact"]').forEach((link) => {
        link.addEventListener('click', () => {
          closeMessengerMenu();
        });
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
