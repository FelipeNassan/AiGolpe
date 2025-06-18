import { useCallback } from 'react';

export const useSpeech = () => {
  const speak = (text: string) => {
    return new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);

      const voices = window.speechSynthesis.getVoices();
      const portugueseVoice = voices.find(voice => 
        voice.lang.includes('pt') || voice.lang.includes('BR')
      );

      if (portugueseVoice) {
        utterance.voice = portugueseVoice;
      }

      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;   // Mais devagar (padrão é 1)
      utterance.pitch = 1;

      utterance.onend = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  };

  const playAudio = useCallback(async (text: string) => {
    window.speechSynthesis.cancel();

    // Divide o texto em partes, separadas por ponto final, quebra de linha ou ponto e vírgula
    const parts = text
      .split(/[\.\n;]/)
      .map(part => part.trim())
      .filter(part => part.length > 0);

    for (const part of parts) {
      await speak(part);
      await new Promise(res => setTimeout(res, 300)); // Pausa de 300ms entre partes
    }
  }, []);

  return { playAudio };
};
