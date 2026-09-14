/**
 * Background Music Player Controller
 * Dedicated song: "Soorarai Pottru - Usurey"
 * Supports HTML5 Audio with Web Audio API romantic acoustic piano arpeggio fallback
 */

const AudioPlayer = (() => {
  let audioElement = null;
  let isPlaying = false;
  let isSynthPlaying = false;
  let synthInterval = null;
  let audioCtx = null;
  let vinylDisc = null;
  let playToggleBtn = null;

  function init() {
    audioElement = document.getElementById('bg-music');
    vinylDisc = document.querySelector('.vinyl-disc');
    playToggleBtn = document.getElementById('audio-toggle-btn');

    if (playToggleBtn) {
      playToggleBtn.addEventListener('click', togglePlay);
    }
    if (vinylDisc) {
      vinylDisc.addEventListener('click', togglePlay);
    }

    // Attempt to preload audio file
    if (audioElement) {
      audioElement.volume = 0.7;
      audioElement.addEventListener('ended', () => {
        audioElement.currentTime = 0;
        audioElement.play();
      });

      audioElement.addEventListener('error', () => {
        console.log('[Audio] Local audio file not detected, using romantic ambient synth fallback');
      });
    }
  }

  function play() {
    if (isPlaying) return;

    if (audioElement && !audioElement.error) {
      audioElement.play().then(() => {
        isPlaying = true;
        updateUI(true);
      }).catch((err) => {
        console.log('[Audio] Direct playback error, falling back to synth:', err);
        startSynthMelody();
      });
    } else {
      // Fallback: Romantic Piano Arpeggio
      startSynthMelody();
    }
  }

  function pause() {
    if (audioElement && !audioElement.paused) {
      audioElement.pause();
    }
    stopSynthMelody();
    isPlaying = false;
    updateUI(false);
  }

  function togglePlay() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  function updateUI(playing) {
    if (vinylDisc) {
      if (playing) {
        vinylDisc.classList.add('spinning');
      } else {
        vinylDisc.classList.remove('spinning');
      }
    }
    if (playToggleBtn) {
      playToggleBtn.innerHTML = playing ? '❚❚' : '▶';
      playToggleBtn.title = playing ? 'Pause Music' : 'Play Music';
    }
  }

  // Romantic acoustic piano chord progression in Web Audio API (Usurey vibe)
  function startSynthMelody() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      // Chord sequence: D maj, A maj, B min, G maj (romantic warm cadence)
      const chords = [
        [293.66, 369.99, 440.00, 587.33], // D - F# - A - D
        [220.00, 277.18, 329.63, 440.00], // A - C# - E - A
        [246.94, 293.66, 369.99, 493.88], // B - D - F# - B
        [196.00, 246.94, 293.66, 392.00]  // G - B - D - G
      ];

      let chordIndex = 0;
      let noteIndex = 0;

      function playNextNote() {
        if (!isPlaying) return;
        const currentChord = chords[chordIndex];
        const freq = currentChord[noteIndex];

        playTone(freq, 0.9);

        noteIndex++;
        if (noteIndex >= currentChord.length) {
          noteIndex = 0;
          chordIndex = (chordIndex + 1) % chords.length;
        }
      }

      isPlaying = true;
      isSynthPlaying = true;
      updateUI(true);

      // Arpeggiate notes softly
      synthInterval = setInterval(playNextNote, 420);
      playNextNote();
    } catch (e) {
      console.warn('Synth playback failed:', e);
    }
  }

  function playTone(freq, duration) {
    if (!audioCtx || audioCtx.state !== 'running') return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Warm envelope
    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  function stopSynthMelody() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
    isSynthPlaying = false;
  }

  return {
    init,
    play,
    pause,
    togglePlay
  };
})();

window.AudioPlayer = AudioPlayer;
