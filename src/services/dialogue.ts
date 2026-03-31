import { Character, Adventure } from '../types';
import { generateDialogue } from './ai';
import { CHARACTER_PROFILES } from './personality';

export interface ConversationMessage {
  id: string;
  speakerId: string;
  speakerName: string;
  message: string;
  timestamp: number;
}

export class DialogueManager {
  private static lastConversationTime: number = 0;
  private static conversationCooldown: number = 5000; // 5 seconds between conversations
  private static proximityThreshold: number = 5; // Distance to trigger conversation

  static async triggerProximityConversation(
    characters: Character[], 
    currentAdventure: Adventure | null,
    onMessage: (message: ConversationMessage) => void
  ) {
    const now = Date.now();
    if (now - this.lastConversationTime < this.conversationCooldown) return;

    // Find nearby characters
    for (let i = 0; i < characters.length; i++) {
      for (let j = i + 1; j < characters.length; j++) {
        const c1 = characters[i];
        const c2 = characters[j];

        if (c1.isAbstracted || c2.isAbstracted) continue;

        const dist = this.getDistance(c1.position, c2.position);
        if (dist < this.proximityThreshold) {
          // Trigger conversation!
          this.lastConversationTime = now;
          await this.startConversation(c1, c2, currentAdventure, onMessage);
          return;
        }
      }
    }
  }

  static async triggerEventConversation(
    characters: Character[],
    event: string,
    currentAdventure: Adventure | null,
    onMessage: (message: ConversationMessage) => void
  ) {
    const now = Date.now();
    this.lastConversationTime = now;

    // Pick a character to react to the event
    const available = characters.filter(c => !c.isAbstracted);
    if (available.length === 0) return;

    const speaker = available[Math.floor(Math.random() * available.length)];
    const context = `Event: ${event}. We are in ${currentAdventure ? currentAdventure.name : "the Circus hub"}.`;
    const profile = CHARACTER_PROFILES[speaker.name] || CHARACTER_PROFILES['Caine'];

    const message = await generateDialogue(context, speaker.name, profile.personality);
    onMessage({
      id: `msg-${now}`,
      speakerId: speaker.id,
      speakerName: speaker.name,
      message,
      timestamp: now
    });
  }

  private static async startConversation(
    c1: Character, 
    c2: Character, 
    currentAdventure: Adventure | null,
    onMessage: (message: ConversationMessage) => void
  ) {
    const now = Date.now();
    const context = `Conversation between ${c1.name} and ${c2.name}. They are nearby each other in ${currentAdventure ? currentAdventure.name : "the Circus hub"}.`;
    
    // c1 speaks first
    const p1 = CHARACTER_PROFILES[c1.name] || CHARACTER_PROFILES['Caine'];
    const m1 = await generateDialogue(context, c1.name, p1.personality);
    
    onMessage({
      id: `msg-${now}-1`,
      speakerId: c1.id,
      speakerName: c1.name,
      message: m1,
      timestamp: now
    });

    // c2 responds after a short delay
    setTimeout(async () => {
      const p2 = CHARACTER_PROFILES[c2.name] || CHARACTER_PROFILES['Caine'];
      const responseContext = `${c1.name} just said to ${c2.name}: "${m1}". ${context}`;
      const m2 = await generateDialogue(responseContext, c2.name, p2.personality);
      
      onMessage({
        id: `msg-${now}-2`,
        speakerId: c2.id,
        speakerName: c2.name,
        message: m2,
        timestamp: Date.now()
      });
    }, 2000);
  }

  private static getDistance(p1: [number, number, number], p2: [number, number, number]): number {
    return Math.sqrt(
      Math.pow(p1[0] - p2[0], 2) +
      Math.pow(p1[1] - p2[1], 2) +
      Math.pow(p1[2] - p2[2], 2)
    );
  }
}
