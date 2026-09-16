(function () {
  'use strict';

  function iniciarScrub(section, video) {
    var duracao = 0;
    var pronto = false;

    video.addEventListener('loadedmetadata', function () {
      duracao = video.duration || 0;
      pronto = duracao > 0;
    });

    function atualizar() {
      if (!pronto) return;
      var rect = section.getBoundingClientRect();
      var alturaTotal = section.offsetHeight - window.innerHeight;
      if (alturaTotal <= 0) return;

      var progresso = -rect.top / alturaTotal;
      progresso = Math.min(Math.max(progresso, 0), 1);

      var tempoAlvo = progresso * duracao;
      if (Math.abs(video.currentTime - tempoAlvo) > 0.03) {
        video.currentTime = tempoAlvo;
      }
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () { atualizar(); ticking = false; });
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', atualizar);
    window.addEventListener('orientationchange', atualizar);
    atualizar();
  }

  function init() {
    var mqReduce = window.matchMedia('(prefers-reduced-motion:reduce)');
    if (mqReduce.matches) return; // respeita acessibilidade em qualquer dispositivo

    var section = document.getElementById('cenaHero');
    var video   = document.getElementById('cenaVideo');
    if (!section || !video) return;

    video.pause();
    iniciarScrub(section, video);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
