// The same page, in a real narrow browsing context. No duplicated LP content.
(() => {
  const frame = document.querySelector('#mobile-site');
  const stage = document.querySelector('#viewer-stage');
  const toggle = document.querySelector('#fit-phone');
  const destination = new URL('index.html', location.href);
  destination.search = location.search;
  destination.hash = location.hash;
  for (const link of document.querySelectorAll('#full-site, #open-site')) link.href = destination.href;

  const onPhone = matchMedia('(max-width:600px)');
  if (onPhone.matches) {
    location.replace(destination.href);
    return;
  }
  function styleFrame() {
    // Phone screens scroll without a desktop scrollbar; scoped to this preview.
    try {
      const doc = frame.contentDocument;
      if (!doc.head || doc.querySelector('#viewer-scroll-style')) return;
      const style = doc.createElement('style');
      style.id = 'viewer-scroll-style';
      style.textContent = 'html{scrollbar-width:none}html::-webkit-scrollbar,body::-webkit-scrollbar{display:none}';
      doc.head.appendChild(style);
    } catch {}
  }
  frame.addEventListener('load', styleFrame);
  styleFrame();
  if (frame.src !== destination.href) frame.src = destination.href;
  let wholePhone = false;
  function fit() {
    const width = Math.max(1, stage.clientWidth - 40);
    const height = Math.max(1, stage.clientHeight - 24);
    const screenHeight = wholePhone ? 844 : Math.min(844, Math.max(260, height - 24));
    const scale = Math.min(1, width / 414, height / (screenHeight + 24));
    document.documentElement.style.setProperty('--screen-height', `${screenHeight}px`);
    document.documentElement.style.setProperty('--phone-scale', String(scale));
  }
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    wholePhone = !wholePhone;
    toggle.setAttribute('aria-pressed', String(wholePhone));
    fit();
  });
  addEventListener('resize', fit);
  addEventListener('hashchange', () => {
    // Parent links to a section also work after the preview has opened.
    destination.hash = location.hash;
    for (const link of document.querySelectorAll('#full-site, #open-site')) link.href = destination.href;
    try { frame.contentWindow.location.hash = location.hash; } catch {}
  });
  fit();
})();
