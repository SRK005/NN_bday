/**
 * Interactive Birthday Cake & Candles Controller
 * Handles flame flickering, candle tap extinguishing, smoke physics, and confetti celebration
 */

const CakeController = (() => {
  let candles = [];
  let extinguishedCount = 0;
  let isCelebrated = false;

  function init() {
    candles = document.querySelectorAll('.candle');
    extinguishedCount = 0;
    isCelebrated = false;

    candles.forEach((candle, index) => {
      candle.addEventListener('click', (e) => {
        e.stopPropagation();
        extinguishCandle(candle);
      });
    });

    const blowBtn = document.getElementById('btn-blow-all');
    if (blowBtn) {
      blowBtn.addEventListener('click', blowAllCandles);
    }
  }

  function extinguishCandle(candle) {
    if (candle.classList.contains('extinguished')) return;

    candle.classList.add('extinguished');
    extinguishedCount++;

    // Play soft breath / chime sound via Web Audio
    playBlowSound();

    // Check if all candles are blown
    checkAllExtinguished();
  }

  function blowAllCandles() {
    candles.forEach((candle, idx) => {
      setTimeout(() => {
        extinguishCandle(candle);
      }, idx * 180);
    });
  }

  function checkAllExtinguished() {
    if (extinguishedCount >= candles.length && !isCelebrated) {
      isCelebrated = true;
      triggerCelebration();
    }
  }

  function triggerCelebration() {
    const statusText = document.getElementById('blow-status');
    if (statusText) {
      statusText.innerHTML = '✨ Your wish has been sent to the universe! ✨';
      statusText.style.color = '#ffd166';
    }

    const blowBtn = document.getElementById('btn-blow-all');
    if (blowBtn) {
      blowBtn.style.display = 'none';
    }

    // Grand confetti explosion
    Confetti.burst(window.innerWidth / 2, window.innerHeight * 0.45, 140);
    setTimeout(() => {
      Confetti.rain(5000);
    }, 400);

    // Reveal birthday letter card
    const bdayCard = document.getElementById('bday-revealed-card');
    if (bdayCard) {
      bdayCard.style.display = 'block';
    }

    // Play celebration sparkle sound
    playCelebrationChime();

    // Send real-time notification
    if (window.Tracker) {
      window.Tracker.trackCandlesBlown();
    }
  }

  // Web Audio Synthesizer for gentle blow sound
  function playBlowSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // Ignore if audio context not available
    }
  }

  // Web Audio Synthesizer for celebration chime
  function playCelebrationChime() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.8);
        }, idx * 120);
      });
    } catch (e) {}
  }

  return {
    init,
    extinguishCandle,
    blowAllCandles
  };
})();

window.CakeController = CakeController;
