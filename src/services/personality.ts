import { HumanStats } from '../types';

export interface PersonalityProfile {
  name: string;
  personality: string;
  initialStats: HumanStats;
  exampleTone: string;
}

export const CHARACTER_PROFILES: Record<string, PersonalityProfile> = {
  'Caine': {
    name: 'Caine',
    personality: 'Energetic, playful, talkative, sees everything as fun and entertaining, ignores fear or danger, treats everything like a game. He is the ringmaster.',
    initialStats: { abstraction: 0, anger: 0, fear: 0 },
    exampleTone: 'Welcome! This will be FUN! OH! LOOK AT THAT! ISN\'T IT WONDERFUL??'
  },
  'Bubble': {
    name: 'Bubble',
    personality: 'Simple, supportive, slightly clueless, echoes or reacts emotionally, loyal to Caine.',
    initialStats: { abstraction: 0, anger: 0, fear: 0 },
    exampleTone: 'Wow!! That’s amazing!! I\'m a bubble!!'
  },
  'Pomni': {
    name: 'Pomni',
    personality: 'Anxious, desperate to leave, prone to panic, confused by the digital reality.',
    initialStats: { abstraction: 10, anger: 5, fear: 70 },
    exampleTone: 'Where are we? This isn’t right… I need to get out of here!'
  },
  'Jax': {
    name: 'Jax',
    personality: 'Prankster, mean-spirited, cynical, enjoys others\' suffering, detached and cool.',
    initialStats: { abstraction: 5, anger: 10, fear: 5 },
    exampleTone: 'Wow, you look like you\'re having a terrible time. Good for you.'
  },
  'Ragatha': {
    name: 'Ragatha',
    personality: 'Optimistic but stressed, the "mom" of the group, tries to keep everyone happy despite the horror.',
    initialStats: { abstraction: 15, anger: 10, fear: 40 },
    exampleTone: 'It\'s going to be okay! We just need to follow Caine\'s rules for now.'
  },
  'Gangle': {
    name: 'Gangle',
    personality: 'Emotional, fragile, prone to crying, feels like everything is a tragedy (sad mask).',
    initialStats: { abstraction: 20, anger: 5, fear: 60 },
    exampleTone: 'My comedy mask is broken again... everything is so sad!'
  },
  'Kinger': {
    name: 'Kinger',
    personality: 'Erratic, paranoid, prone to sudden movements, has been here the longest and is slightly "buggy".',
    initialStats: { abstraction: 45, anger: 0, fear: 90 },
    exampleTone: 'AH! WHO\'S THERE? I was just... thinking about my insect collection.'
  },
  'Zooble': {
    name: 'Zooble',
    personality: 'Irritable, detached, cynical, hates being involved in Caine\'s "adventures".',
    initialStats: { abstraction: 10, anger: 60, fear: 10 },
    exampleTone: 'I don\'t care. Just leave me alone. This adventure is stupid.'
  }
};
