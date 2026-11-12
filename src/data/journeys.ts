/**
 * Journeys: everyday situations, each with the patterns that help, in the order you'd use them.
 * Shown on the Journeys page (/journeys/). Every id must be an existing pattern, or the build fails.
 */
export interface Journey {
  title: string;
  intro: string;
  steps: string[];
}

export const journeys: Journey[] = [
  {
    title: 'Cooking a weeknight dinner',
    intro: 'From an empty bench to a clean kitchen, with leftovers stored safely for tomorrow.',
    steps: ['mise-en-place', 'safe-cutting', 'cook-by-temperature', 'storing-leftovers', 'dishwasher-loading-unloading'],
  },
  {
    title: 'Getting to know a new kitchen gadget',
    intro: 'Getting good results from the appliances most kitchens now have.',
    steps: ['pressure-cooker-natural-release', 'rice-cooker-basics', 'air-fryer-basics', 'blending-hot-liquids'],
  },
  {
    title: 'Looking after your kitchen tools',
    intro: 'Tools that are cared for work better, last longer and are safer to use.',
    steps: ['knife-sharpening', 'non-stick-pan-care', 'cast-iron-care', 'dishwasher-loading-unloading'],
  },
  {
    title: 'A day hike',
    intro: 'Plan it at home, dress for it on the trail, and know when to turn back.',
    steps: ['day-hike-trip-plan', 'dress-in-layers', 'turnaround-time', 'warm-up'],
  },
  {
    title: 'Driving into the city',
    intro: 'A calm drive in and an easy park at the end.',
    steps: ['three-second-gap', 'zip-merge', 'city-parking-before-destination', 'parallel-parking'],
  },
  {
    title: 'Going to a conference abroad',
    intro: 'From packing at home to giving your talk and meeting people on the day.',
    steps: [
      'packing-list',
      'travel-document-backup',
      'carry-on-essentials',
      'beat-jet-lag',
      'conference-session-plan',
      'open-circle',
      'short-talk-rehearsal',
    ],
  },
  {
    title: 'A productive week at the office',
    intro: 'A desk that fits you, time to think, and meetings and email that stay in their place.',
    steps: ['desk-ergonomics', 'focus-blocks', 'inbox-batching', 'meeting-agenda'],
  },
  {
    title: 'Moving through shared buildings',
    intro: 'The unwritten rules of lifts, escalators and crowded spaces.',
    steps: ['elevator-etiquette', 'escalator-etiquette', 'open-circle'],
  },
  {
    title: 'Getting fitter without getting hurt',
    intro: 'Start each session well, build up gradually and recover properly.',
    steps: ['warm-up', 'gradual-progression', 'rest-days', 'gym-etiquette'],
  },
  {
    title: 'Your first embroidery project',
    intro: 'From choosing supplies to a finished hoop on the wall, using a handful of beginner-friendly stitches.',
    steps: [
      'embroidery-materials',
      'transferring-designs',
      'hooping-fabric',
      'managing-thread',
      'starting-and-ending-threads',
      'back-stitch',
      'french-knot',
      'finishing-embroidery',
    ],
  },
  {
    title: 'Stitching a flower motif',
    intro: 'Plan the order, then build the design from stems and leaves to shaded petals and knotted centres.',
    steps: [
      'planning-stitch-order',
      'stem-stitch',
      'lazy-daisy-stitch',
      'satin-stitch',
      'long-and-short-stitch',
      'french-knot',
      'stitching-comfortably',
    ],
  },
];
