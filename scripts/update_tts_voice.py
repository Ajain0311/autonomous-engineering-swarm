with open('frontend/src/utils/speechTts.ts', 'w', encoding='utf-8') as f:
    f.write('''// Web Speech API Text-to-Speech Engine with High-Fidelity Hindi & Indian Neural Voices
class SpeechTTS {
  private isVoiceMuted = false;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoiceName: string | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  private loadVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices();
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices();
    }
    return this.voices;
  }

  public setVoice(voiceName: string) {
    this.selectedVoiceName = voiceName;
  }

  public getSelectedVoiceName(): string | null {
    return this.selectedVoiceName;
  }

  public speak(text: string) {
    if (this.isVoiceMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN'; // Explicit Hindi India locale
      utterance.rate = 0.94;    // Human conversational pace
      utterance.pitch = 1.0;

      const voices = this.getAvailableVoices();
      let voice: SpeechSynthesisVoice | undefined;

      // 1. User-selected voice
      if (this.selectedVoiceName) {
        voice = voices.find((v) => v.name === this.selectedVoiceName);
      }

      // 2. High-quality Microsoft Natural Online Neural Hindi Voices (Madhur / Swara)
      if (!voice) {
        voice = voices.find(
          (v) =>
            v.name.includes('Madhur') ||
            v.name.includes('Swara') ||
            (v.name.includes('Natural') && (v.lang.includes('hi') || v.name.includes('Hindi')))
        );
      }

      // 3. Google Hindi / Android Hindi
      if (!voice) {
        voice = voices.find(
          (v) =>
            v.lang.toLowerCase() === 'hi-in' ||
            v.lang.toLowerCase().startsWith('hi') ||
            v.name.toLowerCase().includes('hindi')
        );
      }

      // 4. Indian English Natural Voices (Neerja / Hemant / en-IN)
      if (!voice) {
        voice = voices.find(
          (v) =>
            v.lang.toLowerCase() === 'en-in' ||
            v.name.toLowerCase().includes('neerja') ||
            v.name.toLowerCase().includes('hemant') ||
            v.name.toLowerCase().includes('india')
        );
      }

      // 5. Fallback voice
      if (!voice) {
        voice = voices.find((v) => v.lang.startsWith('en')) || voices[0];
      }

      if (voice) {
        utterance.voice = voice;
        this.selectedVoiceName = voice.name;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public setMuted(muted: boolean) {
    this.isVoiceMuted = muted;
    if (muted) this.stop();
  }

  public getMuted(): boolean {
    return this.isVoiceMuted;
  }
}

export const speechTts = new SpeechTTS();
''')
print('Updated speechTts.ts successfully')
