import { useEffect, useRef, useState } from 'react';

export default function useSpeech() {
  const supported = typeof window !== 'undefined' && typeof window.speechSynthesis?.speak === 'function' && typeof window.SpeechSynthesisUtterance === 'function';
  const [speaking, setSpeaking] = useState(null);
  const [error, setError] = useState('');
  const active = useRef(null);
  function stop() {
    active.current = null;
    if (supported) window.speechSynthesis.cancel();
    setSpeaking(null);
  }
  useEffect(() => () => { if (supported) window.speechSynthesis.cancel(); }, [supported]);
  function read(id, text) {
    if (speaking === id) { stop(); return; }
    stop();
    setError('');
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => /^en[-_]IN$/i.test(v.lang)) || voices.find(v => /^en/i.test(v.lang));
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang || 'en-IN';
      utterance.rate = 0.95;
      active.current = utterance;
      utterance.onend = () => { if (active.current === utterance) { active.current = null; setSpeaking(null); } };
      utterance.onerror = () => {
        if (active.current !== utterance) return;
        active.current = null;
        setSpeaking(null);
        setError('Reading aloud is unavailable right now. You can still read the response here.');
      };
      setSpeaking(id);
      window.speechSynthesis.speak(utterance);
    } catch { setSpeaking(null); setError('Reading aloud is unavailable in this browser.'); }
  }
  return { supported, speaking, error, read, stop };
}
