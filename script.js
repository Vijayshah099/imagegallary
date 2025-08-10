(function(){
  const gallery = document.getElementById('gallery');
  const cards = Array.from(gallery.querySelectorAll('.card'));
  const filters = Array.from(document.querySelectorAll('[data-filter]'));
  const effectBtns = Array.from(document.querySelectorAll('[data-effect]'));
  const lb = document.getElementById('lightbox');
  const lbImage = document.getElementById('lb-image');
  const lbTitle = document.getElementById('lb-title');
  const lbDesc = document.getElementById('lb-desc');
  const openSource = document.getElementById('open-source');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const closeBtn = document.getElementById('lb-close');

  let activeIndex = 0;
  let activeSet = cards;

  function applyFilter(cat){
    if(cat === '*'){
      activeSet = cards;
      cards.forEach(c=>c.style.display='');
    } else {
      activeSet = cards.filter(c => c.dataset.category === cat);
      cards.forEach(c=>{
        c.style.display = (c.dataset.category === cat) ? '' : 'none';
      });
    }
  }

  filters.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      filters.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });

  effectBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const effect = btn.dataset.effect;
      gallery.classList.remove('filter-grayscale','filter-sepia','filter-blur','filter-none');
      gallery.classList.add('filter-'+effect);
    });
  });

  function openLightbox(index){
    activeIndex = index;
    const card = activeSet[index];
    if(!card) return;
    const img = card.querySelector('img');
    const src = img.src;
    lbImage.src = src;
    lbImage.alt = img.alt || '';
    lbTitle.textContent = card.dataset.title || '';
    lbDesc.textContent = card.dataset.description || '';
    openSource.onclick = ()=> window.open(src, '_blank');
    lb.classList.add('open');
    lb.setAttribute('aria-hidden','false');
    closeBtn.focus();
  }

  function closeLightbox(){
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden','true');
    lbImage.src = '';
  }

  function showNext(){
    if(!activeSet.length) return;
    activeIndex = (activeIndex + 1) % activeSet.length;
    openLightbox(activeIndex);
  }
  function showPrev(){
    if(!activeSet.length) return;
    activeIndex = (activeIndex - 1 + activeSet.length) % activeSet.length;
    openLightbox(activeIndex);
  }

  cards.forEach((card, i) => {
    card.addEventListener('click', ()=>{
      const visible = cards.filter(c => c.style.display !== 'none');
      activeSet = visible;
      const indexInSet = visible.indexOf(card);
      openLightbox(indexInSet);
    });
    card.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });
  });

  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);
  closeBtn.addEventListener('click', closeLightbox);

  lb.addEventListener('click', (e)=>{
    if(e.target === lb) closeLightbox();
  });

  document.addEventListener('keydown', (e)=>{
    if(lb.classList.contains('open')){
      if(e.key === 'Escape') closeLightbox();
      if(e.key === 'ArrowRight') showNext();
      if(e.key === 'ArrowLeft') showPrev();
    }
  });

  applyFilter('*');
})();
