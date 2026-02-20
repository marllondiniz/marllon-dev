"use client";

import { useLayoutEffect, useRef, useCallback, type ReactNode } from "react";
import Lenis from "lenis";
import "./ScrollStack.css";

export function ScrollStackItem({
  children,
  itemClassName = "",
}: {
  children: ReactNode;
  itemClassName?: string;
}) {
  return (
    <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
  );
}

type ScrollStackProps = {
  children: ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string | number;
  scaleEndPosition?: string | number;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  fadeOpacity?: boolean;
  shadowDepth?: boolean;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
};

export default function ScrollStack({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "20%",
  scaleEndPosition = "10%",
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 2,
  fadeOpacity = true,
  shadowDepth = true,
  useWindowScroll = false,
  onStackComplete,
}: ScrollStackProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<Element[]>([]);
  const lastTransformsRef = useRef(
    new Map<
      number,
      { translateY: number; scale: number; rotation: number; blur: number; opacity: number }
    >()
  );
  const isUpdatingRef = useRef(false);

  const calculateProgress = useCallback(
    (scrollTop: number, start: number, end: number) => {
      if (scrollTop < start) return 0;
      if (scrollTop > end) return 1;
      return (scrollTop - start) / (end - start);
    },
    []
  );

  const parsePercentage = useCallback(
    (value: string | number, containerHeight: number) => {
      if (typeof value === "string" && value.includes("%")) {
        return (parseFloat(value) / 100) * containerHeight;
      }
      return typeof value === "string" ? parseFloat(value) : value;
    },
    []
  );

  const getScrollData = useCallback(() => {
    if (useWindowScroll && typeof window !== "undefined") {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement,
      };
    }
    const scroller = scrollerRef.current;
    if (!scroller)
      return {
        scrollTop: 0,
        containerHeight: 0,
        scrollContainer: document.documentElement,
      };
    return {
      scrollTop: scroller.scrollTop,
      containerHeight: scroller.clientHeight,
      scrollContainer: scroller,
    };
  }, [useWindowScroll]);

  const getElementOffset = useCallback((element: Element) => {
    // Usar offsetTop em vez de getBoundingClientRect para evitar feedback
    // com transforms (que causava vibração/jitter nos cards ao rolar).
    return (element as HTMLElement).offsetTop;
  }, []);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const endElement = useWindowScroll
      ? document.querySelector(".scroll-stack-end")
      : scrollerRef.current?.querySelector(".scroll-stack-end");

    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    let topCardIndex = 0;
    for (let j = 0; j < cardsRef.current.length; j++) {
      const jCard = cardsRef.current[j];
      if (!jCard) continue;
      const jCardTop = getElementOffset(jCard);
      const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
      if (scrollTop >= jTriggerStart) {
        topCardIndex = j;
      }
    }

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = getElementOffset(card);
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      // Profundidade máxima que fica visível no fundo
      const depthInStack = Math.max(0, topCardIndex - i);
      const MAX_DEPTH_VISIBLE = 3;
      const MAX_DEPTH_BLUR = 2;

      let blur = 0;
      if (blurAmount && depthInStack > 0) {
        const clampedDepth = Math.min(depthInStack, MAX_DEPTH_BLUR);
        blur = Math.max(0, clampedDepth * blurAmount);
      }

      let opacity = 1;
      if (fadeOpacity && depthInStack > 0) {
        // Quanto mais fundo, mais some; depois de 3 níveis, some por completo
        if (depthInStack > MAX_DEPTH_VISIBLE) {
          opacity = 0;
        } else {
          const factor = depthInStack / MAX_DEPTH_VISIBLE;
          opacity = Math.max(0.18, 1 - factor * 0.7);
        }
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
        opacity: Math.round(opacity * 100) / 100,
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1 ||
        Math.abs(lastTransform.opacity - newTransform.opacity) > 0.01;

      if (hasChanged) {
        const el = card as HTMLElement;
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;

        el.style.transform = transform;
        el.style.opacity = String(newTransform.opacity);

        if (newTransform.blur > 0) {
          el.style.filter = `blur(${newTransform.blur}px)`;
        } else {
          el.style.filter = "";
        }

        if (shadowDepth) {
          if (depthInStack > 0) {
            el.style.boxShadow = `0 ${4 + depthInStack * 4}px ${18 + depthInStack * 10}px rgba(0,0,0,${0.12 + depthInStack * 0.08})`;
          } else {
            el.style.boxShadow = "0 4px 18px rgba(0,0,0,0.18)";
          }
        } else {
          el.style.boxShadow = "";
        }

        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    fadeOpacity,
    shadowDepth,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
    getElementOffset,
  ]);

  const handleScroll = useCallback(() => {
    updateCardTransforms();
  }, [updateCardTransforms]);

  const setupLenis = useCallback(() => {
    if (useWindowScroll && typeof window !== "undefined") {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
      });

      lenis.on("scroll", handleScroll);

      const raf = (time: number) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    }

    const scroller = scrollerRef.current;
    if (!scroller) return;

    const inner = scroller.querySelector(".scroll-stack-inner");
    if (!inner) return;

    const lenis = new Lenis({
      wrapper: scroller,
      content: inner as HTMLElement,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
      infinite: false,
      gestureOrientation: "vertical",
      wheelMultiplier: 1,
      touchInertiaExponent: 35,
      lerp: 0.1,
      syncTouch: true,
      syncTouchLerp: 0.075,
    });

    lenis.on("scroll", handleScroll);

    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameRef.current = requestAnimationFrame(raf);
    };
    animationFrameRef.current = requestAnimationFrame(raf);

    lenisRef.current = lenis;
    return lenis;
  }, [handleScroll, useWindowScroll]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller && !useWindowScroll) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll(".scroll-stack-card")
        : scroller!.querySelectorAll(".scroll-stack-card")
    );

    cardsRef.current = cards;
    const transformsCache = lastTransformsRef.current;

    cards.forEach((card, i) => {
      const el = card as HTMLElement;
      if (i < cards.length - 1) {
        el.style.marginBottom = `${itemDistance}px`;
      }
      el.style.willChange = "transform, filter, opacity";
      el.style.transformOrigin = "top center";
      el.style.backfaceVisibility = "hidden";
      el.style.transform = "translateZ(0)";
      el.style.webkitTransform = "translateZ(0)";
      el.style.perspective = "1000px";
      el.style.webkitPerspective = "1000px";
      el.style.transition = "box-shadow 0.3s ease, opacity 0.3s ease";
    });

    setupLenis();
    updateCardTransforms();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      transformsCache.clear();
      isUpdatingRef.current = false;
    };
  }, [itemDistance, useWindowScroll, setupLenis, updateCardTransforms]);

  return (
    <div
      className={`scroll-stack-scroller ${useWindowScroll ? "scroll-stack-scroller--window" : ""} ${className}`.trim()}
      ref={scrollerRef}
    >
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" aria-hidden />
      </div>
    </div>
  );
}
