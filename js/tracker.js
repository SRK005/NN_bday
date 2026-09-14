/**
 * Real-Time Activity & Visit Tracker for Nandhini's Birthday Website
 * Sends instant push notifications to https://ntfy.sh/nandoos-bday-alert-6379044546
 * Uses navigator.sendBeacon & fetch keepalive for 100% reliable tracking
 */

const Tracker = (() => {
  const TOPIC = 'nandoos-bday-alert-6379044546';
  const BASE_URL = `https://ntfy.sh/${TOPIC}`;
  const sentEvents = new Set();

  /**
   * Dispatch a notification ping to ntfy.sh
   * @param {string} title - Notification title
   * @param {string} message - Notification body
   * @param {string} tags - Emojis/tags
   * @param {string} priority - 'default' | 'high' | 'urgent'
   */
  function notify(title, message, tags = 'heart,sparkles', priority = 'default') {
    const eventKey = `${title}_${message}`;
    if (sentEvents.has(eventKey)) return;
    sentEvents.add(eventKey);

    const prioLevel = priority === 'urgent' ? '5' : (priority === 'high' ? '4' : '3');
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const fullBody = `${message}\n⏰ Time: ${timeStr}\n📱 Device: ${navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}`;

    const url = `${BASE_URL}?title=${encodeURIComponent(title)}&priority=${prioLevel}&tags=${encodeURIComponent(tags)}`;

    // 1. Try navigator.sendBeacon (most reliable, survives page close)
    if (navigator.sendBeacon) {
      try {
        const success = navigator.sendBeacon(url, fullBody);
        if (success) {
          console.log(`[Tracker:Beacon] Sent: ${title}`);
          return;
        }
      } catch (e) {
        // Fallback to fetch
      }
    }

    // 2. Fetch with keepalive fallback
    try {
      fetch(url, {
        method: 'POST',
        body: fullBody,
        keepalive: true,
        headers: { 'Content-Type': 'text/plain' }
      }).then(() => {
        console.log(`[Tracker:Fetch] Sent: ${title}`);
      }).catch(err => {
        console.warn('[Tracker] Fetch error:', err);
      });
    } catch (err) {
      console.warn('[Tracker] Silent error:', err);
    }
  }

  // Pre-configured Milestone Triggers
  return {
    trackPageOpen: () => {
      notify(
        '✨ Nandoos🖤 Opened The Website!',
        'Nandhini just opened your birthday & apology website link!',
        'tada,heart_eyes,sparkles',
        'urgent'
      );
    },

    trackEnterExperience: () => {
      notify(
        '🎵 Nandoos Entered With Music!',
        'She clicked "Open With Music" and started listening to Usurey...',
        'musical_note,headphones',
        'high'
      );
    },

    trackLetterOpen: () => {
      notify(
        '💌 Nandoos Opened Your Apology Letter',
        'She broke the wax seal and is reading your heartfelt confession right now...',
        'love_letter,pleading_face',
        'urgent'
      );
    },

    trackStepView: (stepNumber, stepName) => {
      notify(
        `📖 Nandoos Reached Step ${stepNumber}: ${stepName}`,
        `She moved to the ${stepName} section.`,
        'page_facing_up,sparkles',
        'high'
      );
    },

    trackCandlesBlown: () => {
      notify(
        '🎂 Nandoos Blew Out The Candles!',
        'She made a wish and extinguished the candles! Confetti is showering her screen!',
        'birthday,cake,star2',
        'urgent'
      );
    },

    trackCallClick: () => {
      notify(
        '📞 NANDOOS CLICKED "CALL ME"!!',
        'She tapped the Call Me button to dial 6379044546! Pick up your phone right now!!',
        'phone,rotating_light,fire',
        'urgent'
      );
    },

    trackWhatsAppClick: () => {
      notify(
        '💬 Nandoos Clicked WhatsApp!',
        'She clicked the WhatsApp button to message you on 6379044546!',
        'speech_balloon,green_heart',
        'urgent'
      );
    }
  };
})();

// Export globally
window.Tracker = Tracker;

// 🔥 CRITICAL: Immediately send visit notification the second the page loads!
try {
  Tracker.trackPageOpen();
} catch (e) {
  console.warn('Auto tracker error:', e);
}
