/**
 * Real-Time Activity & Visit Tracker for Nandhini's Birthday Website
 * Sends instant push notifications to https://ntfy.sh/nandoos-bday-alert-6379044546
 */

const Tracker = (() => {
  const TOPIC = 'nandoos-bday-alert-6379044546';
  const ENDPOINT = `https://ntfy.sh/${TOPIC}`;
  const sentEvents = new Set();

  /**
   * Dispatch a notification ping to ntfy.sh
   * @param {string} title - Notification title
   * @param {string} message - Notification body
   * @param {string} tags - Emojis/tags
   * @param {string} priority - 'default' | 'high' | 'urgent'
   */
  async function notify(title, message, tags = 'heart,sparkles', priority = 'default') {
    const eventKey = `${title}_${message}`;
    if (sentEvents.has(eventKey)) return; // Prevent duplicate pings in same session
    sentEvents.add(eventKey);

    const payload = {
      topic: TOPIC,
      title: title,
      message: `${message}\n⏰ ${new Date().toLocaleTimeString()}`,
      tags: tags.split(','),
      priority: priority === 'urgent' ? 5 : (priority === 'high' ? 4 : 3)
    };

    try {
      // Fire and forget via fetch
      await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Title': title,
          'Priority': priority === 'urgent' ? '5' : (priority === 'high' ? '4' : '3'),
          'Tags': tags
        },
        body: `${message}\nTime: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      });
      console.log(`[Tracker] Ping sent: ${title}`);
    } catch (err) {
      console.warn('[Tracker] Silent ping fallback:', err);
    }
  }

  // Pre-configured Milestone Triggers
  return {
    trackPageOpen: () => {
      notify(
        '✨ Nandoos🖤 Opened The Website!',
        'Nandhini just opened the birthday & apology website link on her device!',
        'tada,heart_eyes,sparkles',
        'urgent'
      );
    },

    trackLetterOpen: () => {
      notify(
        '💌 Nandoos Opened Your Apology Letter',
        'She broke the wax seal and is reading your heartfelt letter...',
        'love_letter,pleading_face',
        'high'
      );
    },

    trackStepView: (stepNumber, stepName) => {
      notify(
        `📖 Nandoos Reached Step ${stepNumber}: ${stepName}`,
        `She moved to the ${stepName} section.`,
        'page_facing_up,sparkles'
      );
    },

    trackCandlesBlown: () => {
      notify(
        '🎂 Nandoos Blew Out The Candles!',
        'She made a wish and extinguished the birthday candles! Gold confetti is bursting!',
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
        'She clicked the WhatsApp button to text you on 6379044546!',
        'speech_balloon,green_heart',
        'urgent'
      );
    }
  };
})();

// Export globally
window.Tracker = Tracker;
