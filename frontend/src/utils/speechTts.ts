// Web Speech API Text-to-Speech Engine with STRICT Hindi & Punjabi Indian Voices Only
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

  // Returns ONLY Indian Hindi and Punjabi voice models (English models excluded)
  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices();
    }
    const filtered = this.voices.filter((v) => {
      const name = v.name.toLowerCase();
      const lang = v.lang.toLowerCase();
      const isHindi = lang.startsWith('hi') || name.includes('hindi') || name.includes('madhur') || name.includes('swara');
      const isPunjabi = lang.startsWith('pa') || name.includes('punjabi') || name.includes('raavi') || name.includes('gagan');
      return isHindi || isPunjabi;
    });

    // If device doesn't have local Hindi/Punjabi voice packages installed, fallback gracefully
    return filtered.length > 0 ? filtered : this.voices.filter(v => v.lang.toLowerCase().includes('in'));
  }

  public setVoice(voiceName: string) {
    this.selectedVoiceName = voiceName;
  }

  public getSelectedVoiceName(): string | null {
    return this.selectedVoiceName;
  }

  public speak(
    text: string,
    options?: { isPunjabi?: boolean; pitch?: number; rate?: number; forceLang?: string }
  ) {
    if (this.isVoiceMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const isPunjabi = options?.isPunjabi ?? true; // Authentic Punjabi & Desi Hindi expression
      utterance.lang = options?.forceLang || (isPunjabi ? 'pa-IN' : 'hi-IN');
      utterance.rate = options?.rate ?? 0.98;
      utterance.pitch = options?.pitch ?? 1.04;

      const allSystemVoices = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : [];
      let voice: SpeechSynthesisVoice | undefined;

      // 1. User manually selected voice from dropdown
      if (this.selectedVoiceName) {
        voice = allSystemVoices.find((v) => v.name === this.selectedVoiceName);
      }

      // 2. High priority Punjabi voice (pa-IN, Punjabi, Raavi, Gagan)
      if (!voice && isPunjabi) {
        voice = allSystemVoices.find(
          (v) =>
            v.lang.toLowerCase().startsWith('pa') ||
            v.name.toLowerCase().includes('punjabi') ||
            v.name.toLowerCase().includes('raavi') ||
            v.name.toLowerCase().includes('gagan')
        );
      }

      // 3. High quality Hindi Voices (hi-IN, Madhur, Swara, Google Hindi)
      if (!voice) {
        voice = allSystemVoices.find(
          (v) =>
            v.name.toLowerCase().includes('madhur') ||
            v.name.toLowerCase().includes('swara') ||
            v.lang.toLowerCase().startsWith('hi') ||
            v.name.toLowerCase().includes('hindi')
        );
      }

      // 4. Fallback Indian voice if device lacks Hindi/Punjabi pack
      if (!voice) {
        voice = allSystemVoices.find((v) => v.lang.toLowerCase().includes('in')) || allSystemVoices[0];
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
