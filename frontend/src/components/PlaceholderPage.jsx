import { useEffect } from 'react';

export default function PlaceholderPage({ title, children }) {
  useEffect(() => {
    document.title = `${title} | Thaai Thadam`;
  }, [title]);

  return (
    <section className="page" aria-labelledby="page-title">
      <p className="eyebrow">Prototype · Coming later</p>
      <h1 id="page-title">{title}</h1>
      {children}
    </section>
  );
}
