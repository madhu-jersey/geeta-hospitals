import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState, type TransitionEvent } from 'react';
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Camera, Check, Clock3, ExternalLink, Eye,
  HeartPulse, MapPin, Menu, Phone, ShieldCheck, Stethoscope, UsersRound, X,
} from 'lucide-react';
import { galleryImages, galleryPlaceholders, doctorImages, heroImage, type ImageRecord } from './data/images';
import { ReviewsSection } from './components/OptionalContent';
import { reviewsData } from './data/content';
import { useRevealGroup } from './hooks/useRevealGroup';
import { usePointerSurface } from './hooks/usePointerSurface';

const PHONE = 'tel:+918819224246';
const DIRECTIONS = 'https://www.google.com/maps/dir/?api=1&destination=16.7572875,81.6771406';
const GOOGLE_REVIEWS = 'https://www.google.com/maps/place/Geeta+Hospitals/@16.7572875,81.6771406,840m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3a37b70016182313:0x7fc7fde69b1ce9fd!8m2!3d16.7572875!4d81.6771406!16s%2Fg%2F11z5pn7nlj';
const ADDRESS = 'D.No. 22-7-2/1, Vinnakota Vari Street, Tanuku, West Godavari, Andhra Pradesh 534211.';
const TELUGU = 'గీతా హాస్పటల్స్';
const insurancePartners = [
  'Star Health',
  'HDFC ERGO',
  'Tata AIG',
  'ICICI Lombard',
  'SBI General Insurance',
  'Royal Sundaram',
  'ManipalCigna',
  'ACKO',
  'Aditya Birla Health',
  'Future Generali',
];
const faqItems = [
  {
    question: 'What departments are available at Geeta Hospitals?',
    answer: "Geeta Hospitals provides women's care and eye care, with specialist doctors in both departments.",
  },
  {
    question: 'What women’s care services are offered?',
    answer: "Services listed include obstetric and gynaecological care, normal and caesarean delivery, fertility treatment, ultrasound scanning, laparoscopic surgery, pre-conception counselling, and high-risk pregnancy care.",
  },
  {
    question: 'What eye care services are offered?',
    answer: 'Eye care services include comprehensive eye examinations, cataract and refractive care, retinal services, laser procedures, uveitis management, and neuro-ophthalmology.',
  },
  {
    question: 'What are the clinic hours?',
    answer: 'Clinic hours are Monday to Saturday, 9:00 AM to 2:00 PM and 5:00 PM to 8:00 PM. The clinic is closed on Sunday.',
  },
  {
    question: 'Is emergency care available at night or on Sundays?',
    answer: 'The hospital lists emergency services as available 24 hours a day, 7 days a week, including when the clinic is closed.',
  },
  {
    question: 'How can I call the hospital or ask about appointments?',
    answer: 'Call Geeta Hospitals at 08819-224246 for assistance or to ask about booking a consultation.',
  },
  {
    question: 'Which insurance providers are listed for cashless support?',
    answer: 'Listed partners are Star Health, HDFC ERGO, Tata AIG, ICICI Lombard, SBI General Insurance, Royal Sundaram, ManipalCigna, ACKO, Aditya Birla Health, and Future Generali. Medi Assist, FHPL, Paramount Health, and MD India are also listed among associated TPAs. Cashless facilities depend on policy terms, eligibility, and approval.',
  },
  {
    question: 'Where is Geeta Hospitals located?',
    answer: 'The hospital is at D.No. 22-7-2/1, Vinnakota Vari Street, Tanuku, West Godavari, Andhra Pradesh 534211, opposite Polytechnic College.',
  },
];

function useImageStatus(src: string) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'missing'>(src ? 'loading' : 'missing');
  useEffect(() => {
    if (!src) {
      setStatus('missing');
      return;
    }
    setStatus('loading');
    let active = true;
    const image = new Image();
    image.onload = () => { if (active) setStatus('loaded'); };
    image.onerror = () => { if (active) setStatus('missing'); };
    image.src = src;
    return () => {
      active = false;
      image.onload = null;
      image.onerror = null;
    };
  }, [src]);
  return status;
}

const galleryItems = galleryImages.length ? galleryImages : galleryPlaceholders;

function useDecodedImage(src: string) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  useEffect(() => {
    let active = true;
    const image = new Image();
    image.onload = () => {
      image.decode().then(
        () => { if (active) setStatus('ready'); },
        () => { if (active) setStatus('error'); },
      );
    };
    image.onerror = () => { if (active) setStatus('error'); };
    image.src = src;
    return () => {
      active = false;
      image.onload = null;
      image.onerror = null;
    };
  }, [src]);
  return status;
}

function useOpenStatus() {
  const getStatus = () => {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date());
    const value = (key: string) => parts.find((p) => p.type === key)?.value ?? '';
    const day = value('weekday');
    const mins = Number(value('hour')) * 60 + Number(value('minute'));
    return day !== 'Sun' && ((mins >= 540 && mins < 840) || (mins >= 1020 && mins < 1200));
  };
  const [open, setOpen] = useState(getStatus);
  useEffect(() => {
    const timer = window.setInterval(() => setOpen(getStatus()), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  return open;
}

function SectionTitle({ label, title, emphasize, children }: { label: string; title: string; emphasize: string; children: string }) {
  const words = title.split(' ');
  const highlighted = emphasize.split(' ').map(word => word.replace(/[.,]/g, ''));
  return <div className="section-heading"><span className="eyebrow" data-reveal>{label}</span><h2 data-reveal className="word-heading">{words.map((word, index) => <Fragment key={`${word}-${index}`}><span className="heading-word"><span style={{ transitionDelay: `${index * 60}ms` }}>{highlighted.includes(word.replace(/[.,]/g, '')) ? <em>{word}</em> : word}</span></span>{index < words.length - 1 && <span className="heading-space" aria-hidden="true"> </span>}</Fragment>)}</h2><p className="section-sub" data-reveal>{children}</p></div>;
}

function settleFeatureTile(event: TransitionEvent<HTMLDivElement>) {
  if (event.propertyName === 'opacity') event.currentTarget.style.transitionDelay = '0ms';
}

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a href="#home" className={footer ? 'footer-brand' : 'brand'} aria-label="Geeta Hospitals home">
      <span className={footer ? 'footer-logo' : undefined}><img src="/assets/logo.png" alt="Geeta Hospitals logo" /></span>
      {footer ? <span className="footer-title"><strong>Geeta Hospitals</strong><span className="telugu">{TELUGU}</span></span> :
        <span className="brand-copy"><strong>Geeta Hospitals</strong><span className="telugu">{TELUGU}</span></span>}
    </a>
  );
}

function Header({ active }: { active: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    let frame = 0;
    const tick = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        document.documentElement.style.setProperty('--scroll-progress', max > 0 ? `${window.scrollY / max}` : '0');
        setScrolled(window.scrollY > 20);
      });
    };
    tick(); window.addEventListener('scroll', tick, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', tick); };
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);
  const nav = [['about', 'About'], ['services', 'Services'], ['doctors', 'Doctors'], ['reviews', 'Reviews'], ['gallery', 'Gallery'], ['faq', 'FAQ'], ['visit', 'Visit us']];
  return <>
    <div className="top-progress" aria-hidden="true" />
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-inner">
        <Brand />
        <nav id="main-navigation" className={`nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          {nav.map(([id, text]) => <a key={id} className={active === id ? 'active' : ''} href={`#${id}`} onClick={() => setMenuOpen(false)}>{text}</a>)}
        </nav>
        <div className="header-actions">
          <button className="header-menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
          <a className="button primary header-call" href={PHONE}><Phone size={16} /> Call</a>
        </div>
      </div>
    </header>
  </>;
}

function HeroDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = document.getElementById('home');
    const context = canvas?.getContext('2d');
    if (!canvas || !context || !hero) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0; let height = 0; let raf = 0; let active = false; let held = false; let lastFrame = 0;
    let pausedAt = 0; let pausedDuration = 0;
    let pointer = { x: -1000, y: -1000 }; let pointerTarget = { x: -1000, y: -1000 };
    let pointerActive = false; let pointerInfluence = 0;
    let previousPointer = { x: -1000, y: -1000 };
    let ripple: { x: number; y: number; start: number } | null = null;
    let zones: DOMRect[] = [];
    let seed = 41;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    let dots: { x: number; y: number; r: number; phase: number; speed: number; ox: number; oy: number; layer: number }[] = [];
    const resize = () => {
      const rect = hero.getBoundingClientRect(); width = rect.width; height = rect.height;
      const dpr = Math.min(devicePixelRatio || 1, 2); canvas.width = width * dpr; canvas.height = height * dpr;
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`; context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = width >= 1200 ? 170 : width >= 600 ? 100 : 60;
      dots = Array.from({ length: count }, () => {
        const layer = Math.floor(random() * 3);
        const radius = layer === 0 ? 2 : layer === 1 ? 2.5 : 3;
        return { x: random() * width, y: random() * height, r: radius, phase: random() * Math.PI * 2, speed: .35 + random() * .65, ox: 0, oy: 0, layer };
      });
      zones = Array.from(hero.querySelectorAll<HTMLElement>('.hero h1,.hero-telugu,.hero-lede,.hero-actions')).map(element => {
        const box = element.getBoundingClientRect(); const heroBox = hero.getBoundingClientRect();
        return new DOMRect(box.left - heroBox.left, box.top - heroBox.top, box.width, box.height);
      });
      if (active && !document.hidden) draw(performance.now() - pausedDuration);
    };
    const overlapsText = (x: number, y: number, radius = 0) => zones.some(zone =>
      x + radius >= zone.left - 8 && x - radius <= zone.right + 8 &&
      y + radius >= zone.top - 8 && y - radius <= zone.bottom + 8
    );
    const draw = (time: number) => {
      if (!active) return;
      if (!reduce && lastFrame && time - lastFrame < 1000 / 60) { raf = requestDraw(); return; }
      const delta = Math.min(32, lastFrame ? Math.max(0, time - lastFrame) : 16.67);
      lastFrame = time;
      context.clearRect(0, 0, width, height);
      const frameScale = delta / 16.67;
      const ease = 1 - Math.pow(.92, frameScale);
      if (!reduce && pointerActive) {
        const pointerEase = 1 - Math.pow(.9, frameScale);
        pointer.x += (pointerTarget.x - pointer.x) * pointerEase;
        pointer.y += (pointerTarget.y - pointer.y) * pointerEase;
      }
      const cursorTarget = pointerActive ? 1 : 0;
      const influenceTime = cursorTarget ? 120 : 520;
      pointerInfluence += (cursorTarget - pointerInfluence) * (1 - Math.exp(-delta / influenceTime));
      const lines = width > 1024 && !reduce && Math.hypot(pointer.x - previousPointer.x, pointer.y - previousPointer.y) < 30;
      previousPointer = { x: pointer.x, y: pointer.y };
      const influenceRadius = Math.max(180, Math.min(280, width * .22));
      let lineCount = 0;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const baseX = d.x + (reduce ? 0 : Math.sin(time * .00028 * d.speed + d.phase) * (2 + d.layer));
        const baseY = d.y + (reduce ? 0 : Math.cos(time * .00023 * d.speed + d.phase) * (2 + d.layer));
        const dx = baseX - pointer.x; const dy = baseY - pointer.y; const distance = Math.hypot(dx, dy);
        let wantedX = 0; let wantedY = 0;
        if (!reduce && pointerInfluence > .001 && distance > 0 && distance < influenceRadius) {
          const strength = Math.pow(1 - distance / influenceRadius, 2) * pointerInfluence;
          const pull = 48 * strength;
          const pushStrength = Math.pow(Math.max(0, 1 - distance / 42), 2);
          const push = (34 + (held ? 11 : 0)) * pushStrength * pointerInfluence;
          wantedX += (-dx / distance * pull) + (dx / distance * push);
          wantedY += (-dy / distance * pull) + (dy / distance * push);
        }
        if (ripple && !reduce) {
          const elapsed = time - ripple.start;
          if (elapsed >= 800) ripple = null;
          else {
            const progress = elapsed / 800;
            const easedProgress = progress * progress * (3 - 2 * progress);
            const radius = easedProgress * 96;
            const ringDelta = Math.abs(Math.hypot(baseX - ripple.x, baseY - ripple.y) - radius);
            if (ringDelta < 22) {
              const force = Math.pow(1 - ringDelta / 22, 2) * .4;
              const rx = baseX - ripple.x; const ry = baseY - ripple.y; const rd = Math.hypot(rx, ry) || 1;
              wantedX += rx / rd * force * 9; wantedY += ry / rd * force * 9;
            }
          }
        }
        if (!reduce) {
          d.ox += (wantedX - d.ox) * ease;
          d.oy += (wantedY - d.oy) * ease;
        }
        const px = baseX + d.ox; const py = baseY + d.oy;
        const baseOpacity = d.layer === 0 ? .15 : d.layer === 1 ? .19 : .23;
        const visible = !overlapsText(px, py, d.r);
        if (visible) {
          context.beginPath(); context.arc(px, py, d.r, 0, Math.PI * 2);
          context.fillStyle = `rgba(91,42,103,${baseOpacity})`; context.fill();
        }
        if (visible && lines && lineCount < 50 && i % 2 === 0) {
          for (let j = i + 1; j < Math.min(i + 8, dots.length); j++) {
            const other = dots[j]; const otherX = other.x + other.ox; const otherY = other.y + other.oy;
            const dist = Math.hypot(px - otherX, py - otherY);
            if (dist < 110 && lineCount < 50 && !overlapsText(otherX, otherY, 3)) { context.beginPath(); context.moveTo(px, py); context.lineTo(otherX, otherY); context.strokeStyle = `rgba(91,42,103,${.1 * (1 - dist / 110)})`; context.stroke(); lineCount++; }
          }
        }
      }
      if (ripple && !reduce) {
        const elapsed = time - ripple.start; const progress = Math.min(1, elapsed / 800);
        const radius = progress * progress * (3 - 2 * progress) * 96;
        context.beginPath(); context.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
        context.strokeStyle = `rgba(91,42,103,${.18 * Math.pow(1 - progress, 2)})`; context.lineWidth = 1.2; context.stroke();
      }
      if (!reduce) raf = requestDraw();
    };
    const requestDraw = () => requestAnimationFrame(frameTime => draw(frameTime - pausedDuration));
    const pauseClock = () => { if (!pausedAt) pausedAt = performance.now(); };
    const resumeClock = () => {
      if (pausedAt) { pausedDuration += performance.now() - pausedAt; pausedAt = 0; }
    };
    const updatePointer = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      const position = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      if (!pointerActive) pointer = position;
      pointerTarget = position;
      pointerActive = true;
      if (active && !reduce && !raf) raf = requestDraw();
    };
    const down = (event: PointerEvent) => { if (reduce) return; updatePointer(event); held = true; };
    const up = (event: PointerEvent) => {
      if (reduce || !held) return;
      updatePointer(event); held = false; ripple = { x: pointer.x, y: pointer.y, start: performance.now() - pausedDuration };
    };
    const leave = () => { pointerActive = false; held = false; if (active && !reduce && !raf) raf = requestDraw(); };
    const visibilityChange = () => {
      if (document.hidden || !active) { pauseClock(); cancelAnimationFrame(raf); raf = 0; }
      else { resumeClock(); if (!reduce && !raf) raf = requestDraw(); }
    };
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active) {
        if (!document.hidden) resumeClock();
        if (reduce && !document.hidden) draw(performance.now() - pausedDuration);
        else if (!document.hidden && !raf) raf = requestDraw();
      } else { pauseClock(); cancelAnimationFrame(raf); raf = 0; }
    });
    observer.observe(hero);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(hero);
    hero.addEventListener('pointermove', updatePointer, { passive: true });
    hero.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    hero.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', visibilityChange);
    window.addEventListener('resize', resize); resize();
    return () => { observer.disconnect(); resizeObserver.disconnect(); window.removeEventListener('resize', resize); hero.removeEventListener('pointermove', updatePointer); hero.removeEventListener('pointerdown', down); window.removeEventListener('pointerup', up); hero.removeEventListener('pointerleave', leave); document.removeEventListener('visibilitychange', visibilityChange); cancelAnimationFrame(raf); };
  }, []);
  return <canvas className="hero-canvas" ref={canvasRef} aria-hidden="true" />;
}

function HoursCard({ open }: { open: boolean }) {
  return <div className="hours-card" aria-label="Clinic hours">
    <div className="hours-top"><strong>Clinic hours</strong><span key={open ? 'open' : 'closed'} className={`status ${open ? 'open' : ''}`}>{open ? 'Open now' : 'Closed now · Emergency 24/7'}</span></div>
    <div className="hour-row"><b>Emergency</b><span>24 hours, 7 days</span></div>
    <div className="hour-row"><b>Morning</b><span>Monday to Saturday,<br />9:00 AM to 2:00 PM</span></div>
    <div className="hour-row"><b>Evening</b><span>Monday to Saturday,<br />5:00 PM to 8:00 PM</span></div>
    <div className="hour-row"><b>Sunday</b><span>Closed</span></div>
  </div>;
}

function Hero({ open }: { open: boolean }) {
  const heroImageStatus = useDecodedImage(heroImage.src);
  const heroAvailable = heroImageStatus === 'ready';
  const sectionRef = useRevealGroup<HTMLElement>();
  const visualRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const visual = visualRef.current; const photo = photoRef.current; const inner = parallaxRef.current;
    if (!heroAvailable || !visual || !photo || !inner || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const finePointer = window.matchMedia('(pointer:fine)').matches;
    let frame = 0; let x = 0; let y = 0; let tx = 0; let ty = 0; let scrollDrift = 0; let targetScrollDrift = 0;
    const animate = () => {
      x += (tx - x) * .08; y += (ty - y) * .08;
      scrollDrift += (targetScrollDrift - scrollDrift) * .12;
      photo.style.transform = `rotateY(${-5 + x * 3}deg) rotateX(${2 - y * 3}deg)`;
      inner.style.transform = `translate3d(${-x * 10}px,${-y * 10 + scrollDrift}px,0)`;
      if (Math.abs(tx - x) > .001 || Math.abs(ty - y) > .001 || Math.abs(targetScrollDrift - scrollDrift) > .02) frame = requestAnimationFrame(animate);
      else frame = 0;
    };
    const move = (event: PointerEvent) => {
      if (!finePointer) return;
      const rect = photo.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      ty = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
      if (!frame) frame = requestAnimationFrame(animate);
    };
    const leave = () => { tx = 0; ty = 0; if (!frame) frame = requestAnimationFrame(animate); };
    const scroll = () => {
      const bounds = visual.getBoundingClientRect();
      targetScrollDrift = -8 * Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)));
      if (!frame) frame = requestAnimationFrame(animate);
    };
    visual.addEventListener('pointermove', move);
    visual.addEventListener('pointerleave', leave);
    window.addEventListener('scroll', scroll, { passive: true });
    scroll();
    return () => { visual.removeEventListener('pointermove', move); visual.removeEventListener('pointerleave', leave); window.removeEventListener('scroll', scroll); cancelAnimationFrame(frame); };
  }, [heroAvailable]);
  return <section ref={sectionRef} id="home" className="hero">
    <HeroDots />
    <div className="container">
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="hero-pill"><i />Geeta Hospitals · Tanuku</div>
          <h1><span className="headline-line"><span style={{ animationDelay: '300ms' }}>Geeta</span></span>{' '}<span className="headline-line"><span style={{ animationDelay: '420ms' }}><em>Hospitals</em></span></span></h1>
          <p className="hero-telugu telugu">{TELUGU}</p>
          <p className="hero-lede">{'Women\'s care and eye care under one roof in Tanuku.'.split(' ').map((word, index, words) => <Fragment key={`${word}-${index}`}><span className="hero-lede-word" style={{ animationDelay: `${1.55 + index * .02}s` }}>{word}</span>{index < words.length - 1 ? ' ' : ''}</Fragment>)}</p>
          <div className="hero-actions"><a className="button primary" href={PHONE}><Phone size={17} />Call now</a><a className="button outline" href={DIRECTIONS} target="_blank" rel="noopener noreferrer"><MapPin size={17} />Get directions <ArrowUpRight size={15} /></a></div>
          <p className="emergency-note">For emergencies, call <a href={PHONE}>08819-224246</a> at any hour.</p>
        </div>
        <div className="hero-visual" ref={visualRef}>
          <div className="hero-shadow" />
          <div className={`hero-photo ${heroAvailable ? 'photo-loaded' : ''}`} ref={photoRef}>
            {heroAvailable ? <div className="hero-image-parallax" ref={parallaxRef}><img src={heroImage.src} alt={heroImage.alt} loading="eager" fetchPriority="high" /></div> : <div className={`hero-placeholder ${heroImageStatus === 'loading' ? 'is-decoding' : ''}`}><div className="hero-placeholder-content"><Camera size={34} strokeWidth={1.2} /><span>Hospital photograph</span></div></div>}
          </div>
          <div className="hero-emblem"><img src="/assets/logo.png" alt="Geeta Hospitals logo" /></div>
          <HoursCard open={open} />
          <button className="scroll-cue" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}><span><ArrowDown size={19} /></span><span>Explore the hospital</span></button>
        </div>
      </div>
      <div className="trust-strip">
        <div className="trust-item" data-reveal><HeartPulse size={18} />Two departments</div>
        <div className="trust-item" data-reveal><Check size={18} />Four specialist doctors</div>
        <div className="trust-item" data-reveal><Clock3 size={18} />24/7 emergency services</div>
      </div>
    </div>
  </section>;
}

const womenServices = [
  'Normal and caesarean delivery','Infertility treatment for women and men','Ultrasound scanning',
  'Laparoscopic surgery including hysterectomy and tubectomy','Pre-conception counselling','High-risk pregnancy',
  'Ectopic pregnancy','Cervical and endometrial cancer screening and vaccination','PCOD',
  'Heavy menstrual bleeding','Irregular periods','Thyroid disorders','White discharge','Post-menopausal problems',
  'Urinary problems','Chromosomal disorders and recurrent pregnancy loss',
];
const eyeServices = [
  'Comprehensive eye examination','Implantable collamer lens (ICL)','Scleral-fixated IOL','Nd-YAG laser',
  'Green laser for diabetic retinopathy and vein occlusion','Cryopexy','Pneumatic retinopexy','Retinal detachment surgery',
  'Retinopathy of prematurity surgery','Retinal grafting for large macular holes','Endophthalmitis management',
  'Amniotic membrane grafting','Uveitis management','Neuro-ophthalmology',
];
function DepartmentCard({ eye = false }: { eye?: boolean }) {
  const services = eye ? eyeServices : womenServices;
  const cardRef = useRef<HTMLElement>(null);
  usePointerSurface(cardRef, 4);
  return <article ref={cardRef} data-reveal className={`department-card ${eye ? 'eye' : ''}`}>
    <div className="dept-head"><div data-reveal className="dept-icon">{eye ?
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path pathLength="1" d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" /><path pathLength="1" d="M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z" /></svg> :
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path pathLength="1" d="M20.8 8.7c0 5.4-8.8 11-8.8 11S3.2 14.1 3.2 8.7A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z" /><path pathLength="1" d="M2 12h5l2-3 3 7 2-4h8" /></svg>}</div><div><h3 data-reveal style={{ transitionDelay: '120ms' }}>{eye ? 'Eye care' : "Women's care"}</h3><div data-reveal style={{ transitionDelay: '240ms' }} className="telugu">{eye ? 'కంటి ఆసుపత్రి' : 'గైనిక్ ఫెర్టిలిటీ & లాపరాస్కோపిక్ విభాగం'}</div></div></div>
    <div className="service-label" data-reveal style={{ transitionDelay: '300ms' }}>Services</div>
    <div className="service-tags">{services.map((service, index) => <span data-reveal style={{ transitionDelay: `${350 + index * 40}ms` }} className="service-tag" key={service}>{service}</span>)}</div>
    <div className="dept-doctors"><span data-reveal style={{ transitionDelay: `${350 + services.length * 30}ms` }}>Specialist doctors</span>
      {eye ? <><a data-reveal style={{ transitionDelay: `${410 + services.length * 30}ms` }} className="doctor-chip" href="#aditya">Dr. V. Aditya Reddy</a><a data-reveal style={{ transitionDelay: `${470 + services.length * 30}ms` }} className="doctor-chip" href="#srinivasa">Dr. V.T. Srinivasa Reddy</a></> :
        <><a data-reveal style={{ transitionDelay: `${410 + services.length * 30}ms` }} className="doctor-chip" href="#bhuvanasri">Dr. P. Bhuvanasri</a><a data-reveal style={{ transitionDelay: `${470 + services.length * 30}ms` }} className="doctor-chip" href="#meghana">Dr. D. Meghana Reddy</a></>}
      <ArrowRight data-reveal style={{ transitionDelay: `${530 + services.length * 30}ms` }} className="card-arrow" size={19} />
    </div>
  </article>;
}

const doctors = [
  { id:'bhuvanasri', name:'Dr. P. Bhuvanasri', department:"Women's care", qualification:'MBBS, DGO', specialty:'ప్రసూతి మరియు స్త్రీ వ్యాధుల నిపుణులు', reg:'Reg. No. 42854', initial:'PB', areas:['Obstetrics','Gynaecological diseases','Normal and caesarean delivery','High-risk pregnancy'], caption:"Consultations begin with listening to the patient's concerns, then explaining what the evaluation will cover and why." },
  { id:'meghana', name:'Dr. D. Meghana Reddy', department:"Women's care", qualification:'MBBS, MS (OBGY), FMAS (Delhi), Advance Diploma in ART (Germany)', specialty:'', reg:'Reg. No. 98681', initial:'DM', areas:['Obstetrics and gynaecology','Infertility treatment','Laparoscopic surgery','Pre-conception counselling'], caption:'Treatment plans are explained step by step, so patients know what to expect at each stage.' },
  { id:'aditya', name:'Dr. V. Aditya Reddy', department:'Eye care', qualification:'MS Ophthalmology, FVRS (Amrita-Kochi)', specialty:'Consultant Vitreoretinal Surgeon, Uvea and ROP Specialist', reg:'', initial:'AR', areas:['Vitreoretinal surgery','Uveitis','Retinopathy of prematurity','Retinal detachment'], caption:"Eye care is planned around the patient's vision and comfort, with clear explanations at each step.", eye:true },
  { id:'srinivasa', name:'Dr. V.T. Srinivasa Reddy', department:'Eye care', qualification:'MS (Ophthalmology)', specialty:'Ophthalmologist', reg:'', initial:'SR', areas:['Comprehensive eye examination','Cataract and refractive care','Eye health check-ups'], caption:'Regular eye examinations help catch changes early, with clear advice on what to do next.', eye:true },
];
function DoctorPanel({ doctor, index }: { doctor: typeof doctors[number]; index: number }) {
  const image = doctorImages[doctor.id];
  const imageStatus = useImageStatus(image.src);
  const available = imageStatus === 'loaded';
  const portraitRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLAnchorElement>(null);
  usePointerSurface(portraitRef, 4);
  useEffect(() => {
    const button = bookingRef.current;
    if (!button || !window.matchMedia('(pointer:fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const move = (event: PointerEvent) => {
      const bounds = button.getBoundingClientRect();
      const dx = event.clientX - (bounds.left + bounds.width / 2);
      const dy = event.clientY - (bounds.top + bounds.height / 2);
      if (Math.hypot(dx, dy) < 40) button.style.transform = `translate(${Math.max(-6, Math.min(6, dx * .15))}px,${Math.max(-6, Math.min(6, dy * .15))}px)`;
    };
    const reset = () => { button.style.transform = ''; };
    button.addEventListener('pointermove', move);
    button.addEventListener('pointerleave', reset);
    return () => { button.removeEventListener('pointermove', move); button.removeEventListener('pointerleave', reset); };
  }, []);
  return <article data-reveal className={`doctor-panel ${index % 2 ? 'reverse' : ''}`} id={doctor.id}>
    <div className={`portrait ${available ? 'photo-loaded' : ''}`} ref={portraitRef} data-reveal>
      {available && <img src={image.src} alt={image.alt} loading="lazy" />}
      {imageStatus === 'missing' && <div className="portrait-placeholder"><span className="initials">{doctor.initial}</span><small>Portrait to be added</small></div>}
    </div>
    <div className="doctor-copy">
      <span data-reveal style={{ transitionDelay: '0ms' }} className={`doctor-label ${doctor.eye ? 'eye-label' : ''}`}>{doctor.department}</span>
      <h3 data-reveal style={{ transitionDelay: '120ms' }}>{doctor.name}</h3>
      <p data-reveal style={{ transitionDelay: '240ms' }} className="intro-placeholder">Short introduction to be provided</p>
      <p data-reveal style={{ transitionDelay: '360ms' }} className={`doctor-qual ${doctor.eye ? 'eye-label' : ''}`}>{doctor.qualification}</p>
      {doctor.specialty && <p data-reveal style={{ transitionDelay: '480ms' }} className={`doctor-specialty ${doctor.id === 'bhuvanasri' ? 'telugu' : ''}`}>{doctor.specialty}</p>}
      {doctor.reg && <p data-reveal style={{ transitionDelay: '600ms' }} className="registration">{doctor.reg}</p>}
      <hr className="doctor-divider" />
      <h4 data-reveal style={{ transitionDelay: '720ms' }}>Areas of care</h4>
      <ul className="care-list">{doctor.areas.map((area, areaIndex) => <li data-reveal key={area} style={{ transitionDelay: `${840 + areaIndex * 120}ms` }}><Check className="care-check" size={14} />{area}</li>)}</ul>
      <span data-reveal style={{ transitionDelay: `${840 + doctor.areas.length * 120}ms` }} className={`caption-label ${doctor.id === 'meghana' ? 'meghana-caption' : ''}`}>What patients can expect <span aria-label="Draft pending doctor approval">· DRAFT</span></span>
      <p data-reveal style={{ transitionDelay: `${960 + doctor.areas.length * 120}ms` }} className="doctor-caption">{/* DRAFT: pending doctor approval */}{doctor.caption}</p>
      <div className="doctor-actions" data-reveal style={{ transitionDelay: `${1080 + doctor.areas.length * 120}ms` }}><a ref={bookingRef} className="button primary" href={PHONE}><Phone size={15} />Call to book</a><a className="text-call" href={PHONE}>Call 08819-224246</a></div>
    </div>
  </article>;
}

function GalleryCard({ item, onOpen, leaving = false, index = 0, filteredOnce = false, expanding = false }: { item: ImageRecord; onOpen: (item: ImageRecord, button: HTMLButtonElement) => void; leaving?: boolean; index?: number; filteredOnce?: boolean; expanding?: boolean }) {
  const available = useImageStatus(item.src) === 'loaded';
  return <button data-reveal data-gallery-id={item.id} style={expanding ? { animationDelay: `${Math.max(index - 6, 0) * 60}ms` } : undefined} className={`gallery-card ${available ? 'photo-loaded' : ''} ${filteredOnce ? 'is-visible filter-enter' : ''} ${expanding ? 'is-visible expand-enter' : ''} ${leaving ? 'is-exiting' : ''}`} type="button" aria-label={`Open ${item.caption} image`} onClick={(event) => onOpen(item, event.currentTarget)}>
    {available && !item.placeholder ? <img src={item.src} alt={item.alt} loading="lazy" /> : <span className="gallery-placeholder"><Camera size={31} strokeWidth={1.2} /></span>}
  </button>;
}

function Gallery() {
  const sectionRef = useRevealGroup<HTMLElement>();
  const [filter, setFilter] = useState('All');
  const [filterUsed, setFilterUsed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [leaving, setLeaving] = useState<string[]>([]);
  const [selected, setSelected] = useState<ImageRecord | null>(null);
  const isDialogOpen = Boolean(selected);
  const [restoreFocus, setRestoreFocus] = useState<HTMLButtonElement | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState(false);
  const previousRects = useRef<Map<string, DOMRect>>(new Map());
  const dialogWasOpen = useRef(false);
  const categories = ['All', 'Building', 'Reception', 'Consultation room', 'Waiting area', 'Laboratory'];
  const shown = useMemo(() => {
    const filtered = filter === 'All' ? galleryItems : galleryItems.filter(item => item.category === filter);
    return expanded ? filtered : filtered.slice(0, 6);
  }, [filter, expanded]);
  const changeFilter = (next: string) => {
    if (next === filter) return;
    setFilterUsed(true);
    previousRects.current = new Map<string, DOMRect>(Array.from(document.querySelectorAll<HTMLElement>('[data-gallery-id]')).map(element => [element.dataset.galleryId!, element.getBoundingClientRect()]));
    const nextIds = new Set((next === 'All' ? galleryItems : galleryItems.filter(item => item.category === next)).map(item => item.id));
    const exiting = shown.filter(item => !nextIds.has(item.id)).map(item => item.id);
    if (exiting.length) {
      setLeaving(exiting);
      window.setTimeout(() => { setFilter(next); setLeaving([]); }, 250);
    } else setFilter(next);
  };
  const open = (item: ImageRecord, button: HTMLButtonElement) => { setSelected(item); setRestoreFocus(button); };
  const close = () => { setSelected(null); requestAnimationFrame(() => restoreFocus?.focus()); };
  const move = (step: number) => {
    if (!selected) return;
    const next = (galleryItems.findIndex(item => item.id === selected.id) + step + galleryItems.length) % galleryItems.length;
    setSelected(galleryItems[next]);
  };
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const slide = (step: number) => { setSlideDirection(step > 0 ? 'left' : 'right'); move(step); };
  useLayoutEffect(() => {
    if (!previousRects.current.size) return;
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-gallery-id]'));
    elements.forEach(element => {
      const before = previousRects.current.get(element.dataset.galleryId!);
      if (!before) return;
      const after = element.getBoundingClientRect();
      const dx = before.left - after.left; const dy = before.top - after.top;
      if (!dx && !dy) return;
      element.style.transition = 'none';
      element.style.transform = `translate(${dx}px,${dy}px)`;
      requestAnimationFrame(() => {
        element.style.transition = 'transform 400ms cubic-bezier(.22,1,.36,1), opacity 400ms';
        element.style.transform = '';
        window.setTimeout(() => { element.style.transition = ''; }, 420);
      });
    });
    previousRects.current.clear();
  }, [filter]);
  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
      if (event.key === 'Tab') {
        const buttons = document.querySelectorAll<HTMLButtonElement>('.lightbox button');
        const first = buttons[0]; const last = buttons[buttons.length - 1];
        if (!document.querySelector('.lightbox')?.contains(document.activeElement)) { event.preventDefault(); first?.focus(); }
        else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', closeOnEscape); return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selected, restoreFocus]);
  useEffect(() => {
    if (!isDialogOpen) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = oldOverflow; };
  }, [isDialogOpen]);
  useEffect(() => {
    if (selected && !dialogWasOpen.current) document.querySelector<HTMLButtonElement>('.lightbox-close')?.focus();
    dialogWasOpen.current = Boolean(selected);
  }, [selected]);
  useEffect(() => {
    if (!selected) { setLightboxPhoto(false); return; }
    if (selected.placeholder || !selected.src) { setLightboxPhoto(false); return; }
    const photo = new Image(); photo.src = selected.src;
    photo.decode().then(() => setLightboxPhoto(true)).catch(() => setLightboxPhoto(false));
  }, [selected]);
  return <section ref={sectionRef} id="gallery" className="section gallery-section">
    <div className="container">
      <SectionTitle label="A look around" title="A place for care." emphasize="care.">Explore the spaces at Geeta Hospitals.</SectionTitle>
      <div className="filters" role="group" aria-label="Filter gallery images" data-reveal>{categories.map(category => <button className={`filter ${filter === category ? 'active' : ''}`} aria-pressed={filter === category} onClick={() => changeFilter(category)} key={category}>{category}</button>)}</div>
      <div className="gallery-grid">{shown.map((item,index) => <GalleryCard key={item.id} item={item} index={index} filteredOnce={filterUsed} expanding={expanded && index >= 6} leaving={leaving.includes(item.id)} onOpen={open} />)}</div>
      {galleryImages.length > 6 && <button className="button outline gallery-expand" data-reveal type="button" aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>{expanded ? 'Show fewer' : 'View all photos'} {expanded ? <ArrowUp size={17} /> : <ArrowRight size={17} />}</button>}
    </div>
    {selected && <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${selected.caption} at Geeta Hospitals`} onMouseDown={event => { if (event.target === event.currentTarget) close(); }}>
      <button className="lightbox-close" aria-label="Close gallery" onClick={close}><X /></button>
      <button className="lightbox-arrow lightbox-prev" aria-label="Previous image" onClick={() => slide(-1)}><ArrowLeft /></button>
      <figure key={selected.id} className={`lightbox-slide slide-${slideDirection}`}>{lightboxPhoto ? <img src={selected.src} alt={selected.alt} /> : <div className="lightbox-placeholder"><Camera size={42} strokeWidth={1.1} /></div>}<figcaption className="lightbox-caption" aria-live="polite">{selected.caption}</figcaption></figure>
      <button className="lightbox-arrow lightbox-next" aria-label="Next image" onClick={() => slide(1)}><ArrowRight /></button>
    </div>}
  </section>;
}

function Visit({ open }: { open: boolean }) {
  const sectionRef = useRevealGroup<HTMLElement>();
  const [mapLoaded, setMapLoaded] = useState(false);
  return <section ref={sectionRef} id="visit" className="section visit-section">
    <div className="container">
      <SectionTitle label="Visit us" title="We're here when you need us." emphasize="you need us.">Plan your visit or call the hospital for assistance.</SectionTitle>
      <div className="visit-layout">
        <div className="visit-details contact-card" data-reveal>
          <div className="visit-block" data-reveal style={{ transitionDelay: '0ms' }}><h3>Address</h3><p>{ADDRESS}</p><p className="secondary-line">Opposite Polytechnic College</p></div>
          <div className="visit-block visit-contact-links" data-reveal style={{ transitionDelay: '60ms' }}><a href={PHONE}>08819-224246</a><a href="mailto:geetahospitals@gmail.com">geetahospitals@gmail.com</a></div>
          <div className="visit-block" data-reveal style={{ transitionDelay: '120ms' }}><div className="casualty"><i />24/7 emergency services</div></div>
          <div className="visit-block visit-hours" data-reveal style={{ transitionDelay: '180ms' }}><h3>Clinic hours <span key={open ? 'open' : 'closed'} className={`status ${open ? 'open' : ''}`}>{open ? 'Open now' : 'Closed now · Emergency 24/7'}</span></h3>
            <div className="hour-row" data-reveal style={{ transitionDelay: '0ms' }}><b>Emergency</b><span>24 hours, 7 days</span></div><div className="hour-row" data-reveal style={{ transitionDelay: '60ms' }}><b>Morning</b><span>Monday to Saturday, 9:00 AM to 2:00 PM</span></div><div className="hour-row" data-reveal style={{ transitionDelay: '120ms' }}><b>Evening</b><span>Monday to Saturday, 5:00 PM to 8:00 PM</span></div><div className="hour-row" data-reveal style={{ transitionDelay: '180ms' }}><b>Sunday</b><span>Closed</span></div>
          </div>
        </div>
        <div className="visit-map">
          <div data-reveal className={`map-card ${mapLoaded ? 'map-loaded' : ''}`} role="group" aria-label="Map to Geeta Hospitals">
            <iframe title="Geeta Hospitals, Vinnakota Vari Street, Tanuku" src="https://www.google.com/maps?q=16.7572875,81.6771406&z=17&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" onLoad={() => setMapLoaded(true)} />
            <a className="map-directions" href={DIRECTIONS} target="_blank" rel="noopener noreferrer" aria-label="Get directions to Geeta Hospitals in Google Maps"><MapPin size={17} />Go to location</a>
          </div>
          <div className="visit-actions" data-reveal><a className="button primary" href={PHONE}><Phone size={17} />Call now</a><a className="button outline" href={DIRECTIONS} target="_blank" rel="noopener noreferrer"><MapPin size={17} />Get directions <ArrowUpRight size={15} /></a></div>
        </div>
      </div>
    </div>
  </section>;
}

function FAQ() {
  const sectionRef = useRevealGroup<HTMLElement>();
  return <section ref={sectionRef} id="faq" className="section faq-section">
    <div className="container">
      <SectionTitle label="FAQs" title="Good to know before you visit." emphasize="visit.">Answers based on the services and information listed by Geeta Hospitals.</SectionTitle>
      <div className="faq-list">
        {faqItems.map(({ question, answer }, index) => <details className="faq-item" data-reveal key={question} style={{ transitionDelay: `${Math.min(index * 55, 330)}ms` }}>
          <summary>{question}<span className="faq-toggle" aria-hidden="true" /></summary>
          <p>{answer}</p>
        </details>)}
      </div>
    </div>
  </section>;
}

function Footer() {
  const footerRef = useRevealGroup<HTMLElement>();
  const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  const currentYear = new Date().getFullYear() || 2026;
  return <footer ref={footerRef} className="footer">
    <div className="container">
      <div className="footer-grid">
        <div data-reveal><div className="footer-brandrow"><Brand footer /></div><p className="footer-muted">Tanuku, West Godavari, Andhra Pradesh</p><p className="footer-muted">Run by Sri Geeta Health Care Private Limited</p></div>
        <div data-reveal><h3>Explore</h3><div className="footer-links"><a href="#services" onClick={e => {e.preventDefault();scroll('services');}}>Services</a><a href="#doctors" onClick={e => {e.preventDefault();scroll('doctors');}}>Doctors</a><a href="#visit" onClick={e => {e.preventDefault();scroll('visit');}}>Visit us</a><a href="#gallery" onClick={e => {e.preventDefault();scroll('gallery');}}>Gallery</a><a href="#faq" onClick={e => {e.preventDefault();scroll('faq');}}>FAQs</a></div></div>
        <div data-reveal><h3>Connect</h3><div className="footer-links"><a className="button outline footer-action" href={PHONE}><Phone size={16} />Call now</a><a className="button outline footer-action" href={DIRECTIONS} target="_blank" rel="noopener noreferrer"><MapPin size={16} />Get directions <ArrowUpRight size={14} /></a><a href="mailto:geetahospitals@gmail.com">geetahospitals@gmail.com</a></div></div>
      </div>
      <p className="footer-copyright">&copy; {currentYear || 2026} Geeta Hospitals | geetahospitalstanuku.com. All rights reserved.</p>
    </div>
  </footer>;
}

function App() {
  const open = useOpenStatus();
  const [active, setActive] = useState('');
  const servicesRef = useRevealGroup<HTMLElement>();
  const aboutRef = useRevealGroup<HTMLElement>();
  const doctorsRef = useRevealGroup<HTMLElement>();
  const reviewsRef = useRevealGroup<HTMLElement>();
  const insuranceRef = useRevealGroup<HTMLElement>();
  useEffect(() => {
    const sections = ['about','services','doctors','reviews','gallery','faq','visit'].map(id => document.getElementById(id)).filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: '-22% 0px -60% 0px', threshold: [0, .2, .5] });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return <div className="site-shell">
    <Header active={active} />
    <main>
      <Hero open={open} />
      {/* DRAFT: requested About section copy */}
      <section ref={aboutRef} id="about" className="section about-section"><div className="container">
        <SectionTitle label="About" title="About Geeta Hospitals" emphasize="Geeta Hospitals">Geeta Hospitals in Tanuku offers women's care and eye care under one roof. Our two departments are staffed by four specialist doctors, with emergency services available round the clock.</SectionTitle>
        <div className="about-features">
          <div className="about-feature" data-reveal onTransitionEnd={settleFeatureTile}><HeartPulse size={24} /><span>Women's care</span></div>
          <div className="about-feature" data-reveal onTransitionEnd={settleFeatureTile}><Eye size={24} /><span>Eye care</span></div>
          <div className="about-feature" data-reveal onTransitionEnd={settleFeatureTile}><Stethoscope size={24} /><span>Four specialist doctors</span></div>
          <div className="about-feature" data-reveal onTransitionEnd={settleFeatureTile}><Clock3 size={24} /><span>24/7 emergency services</span></div>
        </div>
        <a className="button primary about-doctors" href="#doctors"><UsersRound size={17} />Meet our doctors</a>
      </div></section>
      <section ref={servicesRef} id="services" className="section section-departments"><div className="container"><SectionTitle label="Our departments" title="Thoughtful care for every day." emphasize="every day.">Two departments, with specialist doctors and round-the-clock emergency services.</SectionTitle><div className="department-grid"><DepartmentCard /><DepartmentCard eye /></div></div></section>
      <section ref={insuranceRef} className="insurance-band"><div className="container"><div className="insurance-card" data-reveal>
        <div className="insurance-heading"><div className="insurance-icon"><ShieldCheck size={25} /></div><span className="insurance-number" aria-hidden="true">04</span></div>
        <h2>Insurance &amp; Cashless Support</h2>
        <div className="insurance-inner">
          <div className="insurance-item" data-reveal><Check size={17} />Medical Insurance Facilities</div>
          <div className="insurance-item" data-reveal style={{ transitionDelay: '90ms' }}><Check size={17} />Cashless Insurance Facilities</div>
        </div>
        <div className="insurance-partner-section">
          <h3>Selected empanelled partners</h3>
          <ul className="insurance-partners" aria-label="Insurance partners">{insurancePartners.map(partner => <li key={partner}>{partner}</li>)}</ul>
        </div>
        <p className="insurance-note">Also associated with TPAs including Medi Assist, FHPL, Paramount Health, MD India &amp; others.</p>
        <p className="insurance-disclaimer">Cashless facilities are subject to policy terms, eligibility and approval. EHS scheme is available for eye treatment.</p>
      </div></div></section>
      <section ref={doctorsRef} id="doctors" className="section"><div className="container"><div className="doctors-heading-row"><SectionTitle label="Doctors" title="Our specialist doctors." emphasize="doctors.">Specialist doctors in women's care and eye care.</SectionTitle><a className="doctors-contact" href={PHONE}>Contact the hospital <ArrowRight size={17} /></a></div><div className="doctors-list">{doctors.map((doctor,index) => <DoctorPanel key={doctor.id} doctor={doctor} index={index} />)}</div></div></section>
      <ReviewsSection data={reviewsData} />
      <section ref={reviewsRef} id="reviews" className="section google-reviews">
        <div className="container">
          <SectionTitle label="Patient reviews" title="What patients say on Google" emphasize="Google">Read reviews and share your own experience on Google.</SectionTitle>
          <div className="google-review-actions">
            <a className="button primary" data-reveal style={{ transitionDelay: '360ms' }} href={GOOGLE_REVIEWS} target="_blank" rel="noopener noreferrer">See Google reviews <ExternalLink size={16} /></a>
            <a className="button outline" data-reveal style={{ transitionDelay: '480ms' }} href={GOOGLE_REVIEWS} target="_blank" rel="noopener noreferrer">Write a review</a>
          </div>
        </div>
      </section>
      <Gallery />
      <FAQ />
      <Visit open={open} />
    </main>
    <Footer />
    <div className="mobile-call"><a href={PHONE} className="button primary"><Phone size={17} />Call · 08819-224246</a></div>
  </div>;
}

export default App;
