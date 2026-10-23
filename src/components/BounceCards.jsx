// Physics-inspired card stack with optional previews, hover callbacks, and click callbacks.
'use client';

import { useEffect, useRef, useState } from 'react';

import './BounceCards.css';

// Give each card a stable starting rotation while keeping the stack visually varied.
const PATTERN = [1, 0.5, -0.3, -1, 0.2, 0.75, -0.6, 0.35, -0.85, 0.1];

// Keep animation input within a safe range before it reaches the spring solver.
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// Convert an optional CSS transform override into numeric animation targets.
const parseTransform = value => {
  if (typeof value !== 'string') return null;
  const rotate = value.match(/rotate\(\s*(-?[\d.]+)deg\s*\)/);
  const translate = value.match(/translate\(\s*(-?[\d.]+)px(?:\s*,\s*(-?[\d.]+)px)?\s*\)/);
  return {
    x: translate ? Number(translate[1]) : 0,
    y: translate && translate[2] ? Number(translate[2]) : 0,
    rotate: rotate ? Number(rotate[1]) : 0
  };
};

// Normalize string and object card inputs into the internal card model.
const toCard = item => (
  typeof item === 'string'
    ? { src: item, alt: '' }
    : { src: item?.src, alt: item?.alt ?? '', preview: item?.preview }
);

export default function BounceCards({
  images = [],
  className = '',
  style,
  containerWidth = 400,
  containerHeight = 400,
  cardSize = 200,
  cardWidth = cardSize,
  cardHeight = cardSize,
  spread = 85,
  rotation = 10,
  arc = 0,
  animationDelay = 0.5,
  animationStagger = 0.06,
  bounciness = 0.6,
  enableHover = true,
  pushDistance = 160,
  hoverScale = 1.06,
  borderWidth = 5,
  borderColor = '#ffffff',
  radius = 25,
  shadow = true,
  transformStyles,
  onCardClick,
  onCardHover
}) {
  // DOM refs let the animation loop update transforms without React re-rendering each frame.
  const rootRef = useRef(null);
  const cardRefs = useRef([]);
  const wakeRef = useRef(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  // Normalize the public image API once per render.
  const cards = images.map(toCard);
  const count = cards.length;
  const middle = (count - 1) / 2;
  const reach = Math.max(1, middle);
  // Calculate each card's resting position relative to the center of the stack.
  const slots = cards.map((_, i) => {
    const custom = transformStyles ? parseTransform(transformStyles[i]) : null;
    if (custom) return custom;
    const offset = i - middle;
    return {
      x: offset * spread,
      y: arc * (offset / reach) ** 2,
      rotate: rotation * PATTERN[i % PATTERN.length]
    };
  });
  // Keep all animation parameters in one object shared by the event handlers and RAF loop.
  const settings = {
    slots,
    cardWidth: Math.max(10, cardWidth),
    cardHeight: Math.max(10, cardHeight),
    delay: Math.max(0, animationDelay),
    stagger: Math.max(0, animationStagger),
    bounciness: clamp(bounciness, 0, 1),
    enableHover,
    pushDistance,
    hoverScale: clamp(hoverScale, 0.5, 2),
    clickable: typeof onCardClick === 'function',
    mobileIndex: count ? clamp(mobileIndex, 0, count - 1) : 0
  };
  const settingsRef = useRef(settings);
  const clickRef = useRef(onCardClick);
  const hoverRef = useRef(onCardHover);

  // Keep callbacks current without recreating the long-lived event listeners.
  useEffect(() => {
    settingsRef.current = settings;
    clickRef.current = onCardClick;
    hoverRef.current = onCardHover;
  });

  useEffect(() => {
    if (window.matchMedia?.('(max-width: 700px)').matches) {
      onCardHover?.(settings.mobileIndex);
    }
  }, [onCardHover, settings.mobileIndex]);

  // Start one animation loop that sleeps automatically when the stack is settled.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const bodies = [];
    const state = { hovered: -1, time: 0, layer: -1 };
    let raf = 0;
    let last = 0;
    let alive = true;

    // Lazily create spring state for each card so empty stacks remain inexpensive.
    const body = i => {
      if (!bodies[i]) {
        const slot = settingsRef.current.slots[i] ?? { x: 0, y: 0, rotate: 0 };
        bodies[i] = {
          x: slot.x,
          y: slot.y,
          rotate: slot.rotate,
          scale: reduce ? 1 : 0,
          vx: 0,
          vy: 0,
          vr: 0,
          vs: 0,
          born: state.time
        };
      }
      return bodies[i];
    };

    // Integrate one damped spring step using the frame's time delta.
    const step = (value, velocity, target, stiffness, damping, dt) => {
      const next = velocity + ((target - value) * stiffness - velocity * damping) * dt;
      return [value + next * dt, next];
    };

    // Advance positions, rotations, and scale values for all cards.
    const frame = now => {
      raf = 0;
      if (!alive) return;
      const s = settingsRef.current;
      const dt = Math.min(1 / 30, Math.max(1 / 240, (now - last) / 1000));
      last = now;
      state.time += dt;

      const hovered = s.enableHover ? state.hovered : -1;
      const mobile = window.matchMedia?.('(max-width: 700px)').matches ?? false;
      const active = mobile ? s.mobileIndex : hovered;
      const popStiffness = 170;
      const popDamping = 2 * (1 - 0.85 * s.bounciness) * Math.sqrt(popStiffness);
      const moveStiffness = 210;
      const moveDamping = 2 * (reduce ? 1 : 0.72) * Math.sqrt(moveStiffness);
      const substeps = Math.ceil(dt / (1 / 240));
      const h = dt / substeps;
      let moving = 0;

      for (let i = 0; i < s.slots.length; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const card = body(i);
        const slot = s.slots[i];
        const appeared = reduce || state.time - card.born >= s.delay + i * s.stagger;
        let targetX = mobile ? (i === active ? 0 : (i < active ? -s.cardWidth * 1.5 : s.cardWidth * 1.5)) : slot.x;
        let targetY = mobile ? 0 : slot.y;
        let targetRotate = mobile ? 0 : slot.rotate;
        let targetScale = appeared ? 1 : 0;
        if (!mobile && hovered >= 0 && appeared) {
          if (i === hovered) {
            targetY = slot.y - s.cardHeight * 0.04;
            targetRotate = 0;
            targetScale = s.hoverScale;
          } else {
            targetX = slot.x + Math.sign(i - hovered) * s.pushDistance;
          }
        }
        for (let k = 0; k < substeps; k++) {
          [card.x, card.vx] = step(card.x, card.vx, targetX, moveStiffness, moveDamping, h);
          [card.y, card.vy] = step(card.y, card.vy, targetY, moveStiffness, moveDamping, h);
          [card.rotate, card.vr] = step(card.rotate, card.vr, targetRotate, moveStiffness, moveDamping, h);
          if (reduce) {
            card.scale = targetScale;
            card.vs = 0;
          } else {
            [card.scale, card.vs] = step(card.scale, card.vs, targetScale, popStiffness, popDamping, h);
          }
        }
        moving +=
          Math.abs(card.vx) +
          Math.abs(card.vy) +
          Math.abs(card.vr) +
          Math.abs(card.vs) * 100 +
          Math.abs(targetX - card.x) +
          Math.abs(targetY - card.y) +
          Math.abs(targetRotate - card.rotate) +
          Math.abs(targetScale - card.scale) * 100 +
          (appeared ? 0 : 1);
        el.style.transform = `translate(-50%, -50%) translate3d(${card.x.toFixed(2)}px, ${card.y.toFixed(2)}px, 0) rotate(${card.rotate.toFixed(3)}deg) scale(${Math.max(0, card.scale).toFixed(4)})`;
      }

      if (state.layer !== active) {
        state.layer = active;
        cardRefs.current.forEach((el, i) => {
          if (!el) return;
          el.style.zIndex = i === active ? String(s.slots.length + 1) : String(i + 1);
          el.toggleAttribute('data-active', i === active);
        });
      }

      if (moving > 0.02) raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (raf || !alive) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    wakeRef.current = wake;

    // Resolve a pointer position to the closest visible card slot.
    const pick = event => {
      const s = settingsRef.current;
      const mobile = window.matchMedia?.('(max-width: 700px)').matches ?? false;
      const rect = root.getBoundingClientRect();
      const px = event.clientX - rect.left - rect.width / 2;
      const py = event.clientY - rect.top - rect.height / 2;
      if (mobile) {
        const halfWidth = s.cardWidth / 2;
        const halfHeight = s.cardHeight / 2;
        return Math.abs(px) <= halfWidth + 12 && Math.abs(py) <= halfHeight + 12
          ? s.mobileIndex
          : -1;
      }
      let best = -1;
      let distance = Infinity;
      s.slots.forEach((slot, i) => {
        const gap = Math.abs(px - slot.x);
        if (gap < distance) {
          distance = gap;
          best = i;
        }
      });
      if (best < 0) return -1;
      const slot = s.slots[best];
      const halfWidth = s.cardWidth / 2;
      const halfHeight = s.cardHeight / 2;
      if (Math.abs(py - slot.y) > halfHeight + 12 || distance > halfWidth + 12) return -1;
      if (state.hovered >= 0 && state.hovered !== best) {
        const current = s.slots[state.hovered];
        if (current && Math.abs(px - current.x) - distance < 6) return state.hovered;
      }
      return best;
    };

    // Wake the animation only when the hovered card changes.
    const onMove = event => {
      if (window.matchMedia?.('(max-width: 700px)').matches) return;
      const next = pick(event);
      if (next !== state.hovered) {
        state.hovered = next;
        hoverRef.current?.(next);
        wake();
      }
    };
    const onLeave = () => {
      if (window.matchMedia?.('(max-width: 700px)').matches) return;
      if (state.hovered !== -1) {
        state.hovered = -1;
        hoverRef.current?.(-1);
        wake();
      }
    };
    const onClick = event => {
      const index = pick(event);
      if (index < 0) return;
      const card = bodies[index];
      if (card && !reduce) card.vs -= 2.2;
      wake();
      clickRef.current?.(index);
    };
    const onFocus = event => {
      const index = cardRefs.current.indexOf(event.target);
      if (index >= 0) {
        state.hovered = index;
        wake();
      }
    };
    const onKey = event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const index = cardRefs.current.indexOf(event.target);
      if (index < 0 || !settingsRef.current.clickable) return;
      event.preventDefault();
      if (bodies[index] && !reduce) bodies[index].vs -= 2.2;
      wake();
      clickRef.current?.(index);
    };

    root.addEventListener('pointermove', onMove, true);
    root.addEventListener('pointerdown', onMove);
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('click', onClick);
    root.addEventListener('focusin', onFocus);
    root.addEventListener('focusout', onLeave);
    root.addEventListener('keydown', onKey);
    wake();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      wakeRef.current = null;
      root.removeEventListener('pointermove', onMove, true);
      root.removeEventListener('pointerdown', onMove);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('click', onClick);
      root.removeEventListener('focusin', onFocus);
      root.removeEventListener('focusout', onLeave);
      root.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    wakeRef.current?.();
  });

  return (
    <div
      ref={rootRef}
      className={`bounce-cards${className ? ` ${className}` : ''}`}
      style={{
        width: containerWidth,
        height: containerHeight,
        '--bounce-cards-width': `${settings.cardWidth}px`,
        '--bounce-cards-height': `${settings.cardHeight}px`,
        '--bounce-cards-border': `${Math.max(0, borderWidth)}px`,
        '--bounce-cards-border-color': borderColor,
        '--bounce-cards-radius': `${Math.max(0, radius)}px`,
        '--bounce-cards-shadow': shadow
          ? '0 1px 2px rgba(0, 0, 0, 0.12), 0 10px 28px -6px rgba(0, 0, 0, 0.32)'
          : 'none',
        '--bounce-cards-shadow-active': shadow
          ? '0 2px 4px rgba(0, 0, 0, 0.14), 0 22px 44px -10px rgba(0, 0, 0, 0.42)'
          : 'none',
        ...style
      }}
    >
      {count > 1 && (
        <div className="bounce-cards__mobile-controls" aria-label="Card navigation">
          <button
            type="button"
            className="bounce-cards__mobile-arrow"
            aria-label="Previous card"
            onClick={event => {
              event.stopPropagation();
              setMobileIndex(index => (index - 1 + count) % count);
            }}
          >
            <span aria-hidden="true">&lsaquo;</span>
          </button>
          <button
            type="button"
            className="bounce-cards__mobile-arrow"
            aria-label="Next card"
            onClick={event => {
              event.stopPropagation();
              setMobileIndex(index => (index + 1) % count);
            }}
          >
            <span aria-hidden="true">&rsaquo;</span>
          </button>
        </div>
      )}
      {cards.map((card, i) => (
        <div
          key={i}
          ref={el => {
            cardRefs.current[i] = el;
          }}
          className={`bounce-cards__card${settings.clickable ? ' bounce-cards__card--clickable' : ''}`}
          style={{ zIndex: i + 1 }}
          {...(settings.clickable ? { role: 'button', tabIndex: 0, 'aria-label': card.alt || `Card ${i + 1}` } : null)}
        >
          {card.preview && (
            <iframe
              className="bounce-cards__preview"
              src={card.preview}
              title={`${card.alt} live preview`}
              loading="lazy"
              sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            />
          )}
          {card.src && <img src={card.src} alt={card.alt} draggable={false} />}
        </div>
      ))}
    </div>
  );
}
