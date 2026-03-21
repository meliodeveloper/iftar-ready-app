import { useEffect, useState } from "react";

interface StickyHeaderProps {
  title: string;
  rightElement?: React.ReactNode;
}

export default function StickyHeader({ title, rightElement }: StickyHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = document.querySelector('.page-scroll-container') || window;
    const handler = () => {
      const scrollTop = el === window ? window.scrollY : (el as Element).scrollTop;
      setScrolled(scrollTop > 10);
    };
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          paddingTop: 'env(safe-area-inset-top, 0px)',
          transition: 'background 0.3s ease, backdrop-filter 0.3s ease',
          background: scrolled ? 'var(--header-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(1.8)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.8)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'hsl(var(--primary))' }}>{title}</h1>
          {rightElement}
        </div>
      </div>
      <div style={{ height: 'calc(env(safe-area-inset-top, 0px) + 56px)' }} />
    </>
  );
}
