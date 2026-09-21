import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import Icon from '../Icon';
import { askThaai } from '../../services/assistant';
import useSpeech from './useSpeech';

const welcome = "Hi, I'm Thaai. I can help with journeys, Safe Hubs, safety information and finding your way around Thaai Thadam. What would you like help with?";
const suggestions = ['Plan a safer journey', 'Find a Safe Hub', 'How does the safety score work?', 'How do I report a concern?', 'Show me emergency help', 'What is Thaai Thadam?'];
const routes = { '/': 'Home', '/journey': 'Journey', '/safe-hubs': 'Safe Hubs', '/report': 'Report', '/community': 'Community', '/emergency': 'Emergency Help', '/about': 'About' };
const initialMessages = [{ id: 0, role: 'assistant', content: welcome, local: true }];

export default function AskThaai() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [intro, setIntro] = useState(() => {
    try { return sessionStorage.getItem('thaai-thadam:assistant-intro') !== 'true'; } catch { return true; }
  });
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState('');
  const launcher = useRef(null);
  const dialog = useRef(null);
  const input = useRef(null);
  const end = useRef(null);
  const request = useRef(null);
  const serial = useRef(0);
  const speech = useSpeech();

  useEffect(() => {
    try { sessionStorage.setItem('thaai-thadam:assistant-intro', 'true'); } catch { /* Only the label preference uses storage. */ }
    const timer = setTimeout(() => setIntro(false), 5000);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => {
    if (open) { dialog.current.showModal(); input.current?.focus(); }
    else if (dialog.current.open) { dialog.current.close(); launcher.current?.focus(); }
  }, [open]);
  useEffect(() => { if (!open) return; if (messages.length > 1) end.current?.scrollIntoView({ block: 'nearest' }); else dialog.current?.querySelector('.assistant-conversation')?.scrollTo(0, 0); }, [messages, pending, failure, open]);

  // Keep the input inside the visible viewport when a phone keyboard opens.
  useEffect(() => {
    const viewport = window.visualViewport;
    function resize() {
      const height = viewport?.height || window.innerHeight;
      dialog.current?.style.setProperty('--chat-height', `${height}px`);
      if (dialog.current) dialog.current.dataset.compact = String(height < 500);
      dialog.current?.style.setProperty('--chat-top', `${viewport?.offsetTop || 0}px`);
    }
    resize();
    viewport?.addEventListener('resize', resize);
    viewport?.addEventListener('scroll', resize);
    return () => { viewport?.removeEventListener('resize', resize); viewport?.removeEventListener('scroll', resize); };
  }, []);

  // Move the small launcher upward if it would cover an important page control.
  useEffect(() => {
    if (open) return;
    let frame;
    function reposition() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const button = launcher.current;
        if (!button || document.activeElement === button) return;
        const base = window.innerWidth <= 800 ? 88 : 24;
        const right = window.innerWidth - 16;
        const controls = [...document.querySelectorAll('main button, main a, main input, main select, main textarea, main [role=button], .app-footer a, .leaflet-control')];
        let bottom = base;
        for (; bottom < window.innerHeight - 140; bottom += 64) {
          const top = window.innerHeight - bottom - 56;
          const overlaps = controls.some(element => {
            const box = element.getBoundingClientRect();
            return box.width && box.height && box.left < right && box.right > right - 56 && box.top < top + 56 && box.bottom > top;
          });
          if (!overlaps) break;
        }
        button.parentElement.style.bottom = `${Math.min(bottom, window.innerHeight - 140)}px`;
      });
    }
    const observer = new MutationObserver(reposition);
    observer.observe(document.getElementById('main-content'), { childList: true, subtree: true });
    window.addEventListener('scroll', reposition, { passive: true });
    window.addEventListener('resize', reposition);
    reposition();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('scroll', reposition); window.removeEventListener('resize', reposition); };
  }, [open, pathname]);

  function keepFocusInPanel(event) {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.current.querySelectorAll('button:not(:disabled), a[href], textarea, summary')]
      .filter(element => element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }

  function close() {
    speech.stop();
    setOpen(false);
  }
  function clear() {
    request.current?.abort();
    request.current = null;
    speech.stop();
    setPending(false);
    setMessages(initialMessages);
    const links = dialog.current?.querySelector("details");
    if (links) links.open = false;
    setDraft('');
    setFailure('');
    input.current?.focus();
  }
  async function send(text = draft) {
    const message = text.trim();
    if (!message || message.length > 2000 || request.current) return;
    speech.stop();
    setFailure('');
    const history = messages.filter(m => !m.local).slice(-10).map(({ role, content }) => ({ role, content }));
    setMessages(current => [...current, { id: ++serial.current, role: 'user', content: message }]);
    setDraft('');
    setPending(true);
    const controller = new AbortController();
    request.current = controller;
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const reply = await askThaai(message, history, Object.hasOwn(routes, pathname) ? pathname : '/', controller.signal);
      if (request.current !== controller) return;
      setMessages(current => [...current, { id: ++serial.current, role: 'assistant', content: reply }]);
    } catch (error) {
      if (request.current !== controller) return;
      setFailure(error.message);
      setDraft(current => current || message);
      // Keep unsuccessful messages visible but don't send them as prior turns on retry.
      setMessages(current => current.map(m => m.role === 'user' && m.id === serial.current ? { ...m, local: true } : m));
    } finally {
      clearTimeout(timer);
      if (request.current === controller) { request.current = null; setPending(false); }
    }
  }

  return <>
    <div className={`assistant-launcher${intro ? ' assistant-intro' : ''}`} hidden={open}>
      <span className="assistant-label">Ask Thaai</span>
      <button ref={launcher} type="button" aria-label="Ask Thaai" aria-haspopup="dialog" aria-expanded={open} aria-controls="thaai-chat" onClick={() => { setIntro(false); setOpen(true); }}><Icon name="footprint" size={29} /></button>
    </div>
    <dialog ref={dialog} id="thaai-chat" className="assistant-panel" onKeyDown={keepFocusInPanel} aria-labelledby="thaai-title" onCancel={event => { event.preventDefault(); close(); }}>
      <header className="assistant-header"><span className="assistant-mark"><Icon name="footprint" size={28} /></span><div><h2 id="thaai-title">Thaai</h2><p>Here to help with your journey</p></div><button className="assistant-close" type="button" onClick={close} aria-label="Close Ask Thaai"><Icon name="close" size={20} /></button></header>
      <div className="assistant-toolbar"><button type="button" onClick={clear}>Clear conversation</button><Link to="/emergency" onClick={close}>Emergency Help</Link></div>
      <div className="assistant-conversation" role="log" aria-label="Conversation with Thaai" aria-live="polite" aria-relevant="additions text">
        {messages.map(message => <div key={message.id} className={`chat-message chat-${message.role}`}><span className="chat-author">{message.role === 'user' ? 'You' : 'Thaai'}</span><p>{message.content}</p>
          {message.role === 'assistant' && speech.supported && <button className="speech-button" type="button" onClick={() => speech.read(message.id, message.content)} aria-label={speech.speaking === message.id ? 'Stop reading' : 'Read response aloud'}><Icon name="speaker" size={17} />{speech.speaking === message.id ? 'Stop reading' : 'Listen'}</button>}
        </div>)}
        {messages.length === 1 && <div className="assistant-suggestions" aria-label="Suggested questions">{suggestions.map(text => <button type="button" key={text} onClick={() => send(text)}>{text}</button>)}</div>}
        {pending && <div className="chat-loading" role="status"><span className="skeleton skeleton-text" aria-hidden="true" /><span>Thaai is preparing a reply...</span></div>}
        {failure && <p className="assistant-error" role="alert">{failure}</p>}
        {speech.error && <p role="status" className="field-help">{speech.error}</p>}
      <details className="assistant-links"><summary>Open a feature</summary><nav aria-label="Assistant feature links">{Object.entries(routes).map(([path, label]) => <Link to={path} key={path} onClick={close}>{label}</Link>)}</nav></details>
        <div ref={end} />
      </div>
      <form className="assistant-form" onSubmit={event => { event.preventDefault(); send(); }}>
        <label className="sr-only" htmlFor="thaai-input">Message Thaai</label>
        <textarea ref={input} id="thaai-input" rows={2} maxLength={2000} value={draft} placeholder="Ask about your journey, Safe Hubs or safety features" onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); send(); } }} />
        <button className="button button-primary" type="submit" disabled={pending || !draft.trim()} aria-label="Send message"><Icon name="arrow" size={20} /></button>
      </form>
      <p className="assistant-disclosure">Thaai is an automated assistant and may make mistakes. For emergencies, use <Link to="/emergency" onClick={close}>Emergency Help</Link>. Messages are sent to OpenAI. Please leave out identifying details.</p>
    </dialog>
  </>;
}
