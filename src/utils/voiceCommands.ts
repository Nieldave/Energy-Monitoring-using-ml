import { processVoiceCommand } from '../api';

class VoiceCommandService {
  private recognition: any = null;
  private isListening = false;
  private commandCallback: ((command: string) => void) | null = null;

  constructor() {
    if ('webkitSpeechRecognition' in window) {
      // @ts-ignore - webkitSpeechRecognition is not in the TypeScript types
      this.recognition = new webkitSpeechRecognition();
      this.setupRecognition();
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim();
      console.log('Voice command recognized:', transcript);
      
      if (this.commandCallback) {
        this.commandCallback(transcript);
      }
      
      this.processCommand(transcript);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };
  }

  startListening(callback?: (command: string) => void) {
    if (!this.recognition) {
      console.warn('Speech recognition not supported');
      return false;
    }

    if (this.isListening) return true;

    try {
      this.commandCallback = callback || null;
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      this.isListening = false;
      return false;
    }
  }

  stopListening() {
    if (!this.recognition || !this.isListening) return;

    try {
      this.recognition.stop();
      this.isListening = false;
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  }

  async processCommand(command: string) {
    try {
      const response = await processVoiceCommand(command);
      return response.data;
    } catch (error) {
      console.error('Error processing voice command:', error);
      throw error;
    }
  }

  isSupported() {
    return 'webkitSpeechRecognition' in window;
  }
}

export default new VoiceCommandService();