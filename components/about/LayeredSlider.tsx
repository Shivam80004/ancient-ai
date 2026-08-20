'use client';
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Observer } from "gsap/all";
import { CustomEase } from "gsap/all";
import MagneticButton from "../ui/MagneticButton";

type Slide = { overline: string; title: string; story: string; bg: string; mask: string };

const SLIDES: Slide[] = [
    {
        overline: "I can't stop asking",
        title: "The Big Questions",
        story: "Why am I here? What actually matters? You've never settled for easy answers — and that restless curiosity isn't a flaw to fix. It's the beginning of real wisdom.",
        bg: "/images/home/inq.jpg",
        mask: "/gellery-img/gallery-img-1.jpg",
    },
    {
        overline: "I'm going through a",
        title: "Transition in Life",
        story: "A chapter is closing — a career, a relationship, an old version of you. The ground feels unsteady, but this in-between is exactly where the next you is quietly being built.",
        bg: "/images/home/transition.jpg",
        mask: "/gellery-img/gallery-img-3.jpg",
    },
    {
        overline: "I am a",
        title: "Spiritual Seeker",
        story: "You feel the pull toward something deeper than the endless scroll. Not dogma, not noise — just meaning that actually holds when life gets heavy.",
        bg: "/images/home/spiritual-seek.jpg",
        mask: "/gellery-img/gallery-img-5.png",
    },
    {
        overline: "I'm ready to",
        title: "Master Mind & Body",
        story: "You don't lack effort — you lack a compass. It's time to build a practice that trains the mind and spirit with the same intent you already give the body.",
        bg: "/images/home/mind-body.png",
        mask: "/gellery-img/gallery-img-7.png",
    },
];

export default function LayeredSlider() {
    const rootRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        gsap.registerPlugin(Observer, CustomEase);
        try { CustomEase.create("osmo", "M0,0 C0.625,0.05 0,1 1,1"); } catch { /* already created */ }

        const titles = Array.from(root.querySelectorAll<HTMLElement>("[data-layered-slider-title]"));
        if (!titles.length) return;
        const count = titles.length;

        const backgrounds = Array.from(root.querySelectorAll<HTMLElement>("[data-layered-slider-bg]"));
        const maskItems = Array.from(root.querySelectorAll<HTMLElement>("[data-layered-slider-mask-item]"));
        const descriptions = Array.from(root.querySelectorAll<HTMLElement>("[data-layered-slider-desc]"));
        const maskFrame = root.querySelector<HTMLElement>("[data-layered-slider-mask]");
        const fill = root.querySelector<HTMLElement>("[data-layered-slider-fill]");
        const currentEl = root.querySelector<HTMLElement>("[data-layered-slider-current]");
        const totalEl = root.querySelector<HTMLElement>("[data-layered-slider-total]");
        const prevBtn = root.querySelector<HTMLElement>("[data-layered-slider-prev]");
        const nextBtn = root.querySelector<HTMLElement>("[data-layered-slider-next]");

        const controls = Array.from(new Set<HTMLElement>([...titles, ...Array.from(root.querySelectorAll<HTMLElement>("a, button"))]));

        const autoplayAttr = root.getAttribute("data-layered-slider-autoplay");
        const autoplay = autoplayAttr !== null ? parseFloat(autoplayAttr) : 5;

        const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
        const clamp = gsap.utils.clamp;
        const wrap = (distance: number) => distance - count * Math.round(distance / count);

        const transitionDuration = 1;
        const backgroundZoom = 0.06;
        const titleGap = 0.5;
        const titleSpacing = 40;

        if (totalEl) totalEl.textContent = String(count).padStart(2, "0");

        let titleStep = 0;
        let maskStep = 0;
        const measure = () => {
            const widestTitle = Math.max(...titles.map((title) => title.offsetWidth));
            titleStep = Math.max(root.clientWidth * titleGap, widestTitle + titleSpacing);
            maskStep = maskFrame ? maskFrame.clientWidth : root.clientWidth;
        };
        measure();

        const state = { progress: 0 };
        let activeIndex = -1;

        const setActive = (previousIndex: number, index: number) => {
            [backgrounds, titles, maskItems, descriptions].forEach((list) => {
                if (previousIndex >= 0 && list[previousIndex]) list[previousIndex].removeAttribute("data-active");
                if (list[index]) list[index].setAttribute("data-active", "");
            });
        };

        const render = (progress: number) => {
            const centeredIndex = ((Math.round(progress) % count) + count) % count;
            for (let i = 0; i < count; i++) {
                const offset = wrap(i - progress);
                const distance = Math.abs(offset);

                const background = backgrounds[i];
                if (background) {
                    const backgroundOpacity = clamp(0, 1, 1 - distance);
                    gsap.set(background, {
                        opacity: backgroundOpacity,
                        scale: 1 + backgroundZoom - backgroundZoom * backgroundOpacity,
                        zIndex: Math.round(backgroundOpacity * 100),
                    });
                }

                gsap.set(titles[i], { x: offset * titleStep, opacity: i === centeredIndex ? 1 : 0.4, pointerEvents: "auto" });

                const maskItem = maskItems[i];
                if (maskItem) gsap.set(maskItem, { x: offset * maskStep });

                const desc = descriptions[i];
                if (desc) gsap.set(desc, { opacity: i === centeredIndex ? 1 : 0 });
            }

            if (centeredIndex !== activeIndex) {
                const previousIndex = activeIndex;
                activeIndex = centeredIndex;
                setActive(previousIndex, centeredIndex);
                if (currentEl) currentEl.textContent = String(centeredIndex + 1).padStart(2, "0");
            }
        };

        let hovering = 0;
        let autoTween: gsap.core.Tween | null = null;
        const startAutoplay = () => {
            if (!autoTween) return;
            autoTween.restart();
            if (hovering > 0) autoTween.pause();
        };

        let slideTween: gsap.core.Tween | null = null;
        let current = 0;
        const goTo = (delta: number) => {
            current += delta;
            if (slideTween) slideTween.kill();
            slideTween = gsap.to(state, {
                progress: current,
                duration: reduced ? 0 : transitionDuration,
                ease: "osmo",
                onUpdate: () => render(state.progress),
            });
            startAutoplay();
        };
        const goToIndex = (i: number) => {
            const delta = wrap(i - current);
            if (delta !== 0) goTo(delta);
        };

        if (autoplay > 0 && !reduced && fill) {
            gsap.set(fill, { scaleX: 0, transformOrigin: "left center" });
            autoTween = gsap.to(fill, { scaleX: 1, duration: autoplay, ease: "none", paused: true, onComplete: () => goTo(1) });
        }

        let gestureUsed = false;
        const observer = Observer.create({
            target: root,
            type: "touch,pointer",
            dragMinimum: 10,
            tolerance: 25,
            lockAxis: true,
            onDragStart() { gestureUsed = false; },
            onLeft() { if (!gestureUsed) { gestureUsed = true; goTo(1); } },
            onRight() { if (!gestureUsed) { gestureUsed = true; goTo(-1); } },
        });

        const onPrev = () => goTo(-1);
        const onNext = () => goTo(1);
        if (prevBtn) prevBtn.addEventListener("click", onPrev);
        if (nextBtn) nextBtn.addEventListener("click", onNext);

        const onTitleClick = (e: Event) => {
            const i = titles.indexOf(e.currentTarget as HTMLElement);
            if (i === activeIndex) return;
            e.preventDefault();
            goToIndex(i);
        };
        titles.forEach((title) => title.addEventListener("click", onTitleClick));

        const onEnter = () => { hovering++; if (autoTween) autoTween.pause(); };
        const onLeave = () => { hovering = Math.max(0, hovering - 1); if (autoTween && hovering === 0) autoTween.resume(); };
        controls.forEach((el) => { el.addEventListener("pointerenter", onEnter); el.addEventListener("pointerleave", onLeave); });

        const onResize = () => { measure(); render(state.progress); };
        window.addEventListener("resize", onResize);
        if (document.fonts) document.fonts.ready.then(onResize);

        render(0);
        startAutoplay();

        return () => {
            observer.kill();
            if (slideTween) slideTween.kill();
            if (autoTween) autoTween.kill();
            window.removeEventListener("resize", onResize);
            if (prevBtn) prevBtn.removeEventListener("click", onPrev);
            if (nextBtn) nextBtn.removeEventListener("click", onNext);
            titles.forEach((title) => title.removeEventListener("click", onTitleClick));
            controls.forEach((el) => { el.removeEventListener("pointerenter", onEnter); el.removeEventListener("pointerleave", onLeave); });
        };
    }, []);

    return (
        <section ref={rootRef} data-layered-slider-init data-layered-slider-autoplay="5" className="layered-slider">
            <div className="layered-slider__container">
                <div className="layered-slider__bg-collection">
                    <div className="layered-slider__bg-list">
                        {SLIDES.map((s) => (
                            <div key={s.title} data-layered-slider-bg className="layered-slider__bg-item">
                                <img src={s.bg} alt="" className="layered-slider__bg-img" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="layered-slider__bg-dark" />
                <div className="layered-slider__text-collection">
                    <div className="layered-slider__text-list">
                        {SLIDES.map((s) => (
                            <div key={s.title} data-layered-slider-title className="layered-slider__text-item">
                                <span className="layered-slider__text-overline">{s.overline}</span>
                                <span className="layered-slider__text-title h-auto text-center md:text-[2.7rem] text-3xl mb-4">{s.title}</span>
                                 <MagneticButton link="/contact-us" text="Enroll Now" />
                            </div>
                        ))}
                    </div>
                </div>
                <div data-layered-slider-mask className="layered-slider__mask-collectio">
                    <div className="layered-slider__mask-list">
                        {/* {SLIDES.map((s) => (
                            <div key={s.title} data-layered-slider-mask-item className="layered-slider__mask-item">
                                <img src={s.mask} draggable={false} alt="" className="layered-slider__mask-img" />
                            </div>
                        ))} */}
                    </div>
                </div>
                <div className="layered-slider__overlay">
                    <div className="layered-slider__overlay-top">
                        <span data-layered-slider-current className="layered-slider__span">01</span>
                        <div className="layered-slider__progress">
                            <div data-layered-slider-fill className="layered-slider__progress-inner" />
                        </div>
                        <span data-layered-slider-total className="layered-slider__span">04</span>
                    </div>
                    {/* <div className="layered-slider__desc-collection">
                        {SLIDES.map((s) => (
                            <p key={s.title} data-layered-slider-desc className="layered-slider__desc-item">{s.story}</p>
                        ))}
                    </div> */}
                    <div className="layered-slider__overlay-btm">
                        <div className="layered-slider__nav">
                            <button type="button" data-layered-slider-prev aria-label="Previous" className="layered-slider__nav-button">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" className="layered-slider__nav-icon"><path d="M15 6l-6 6 6 6" /></svg>
                            </button>
                            <button type="button" data-layered-slider-next aria-label="Next" className="layered-slider__nav-button">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" className="layered-slider__nav-icon"><path d="M9 6l6 6-6 6" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .layered-slider { color: #fff; user-select: none; -webkit-user-select: none; position: relative; overflow: clip; background:#000; }
                .layered-slider__container { width: 100%; position: relative; }
                .layered-slider__bg-collection { z-index: 0; position: absolute; inset: 0; overflow: clip; }
                .layered-slider__bg-item { width: 100%; height: 100%; position: absolute; inset: 0; opacity: 0; }
                .layered-slider__bg-img { object-fit: cover; width: 100%; height: 100%; display: block; }
                .layered-slider__bg-dark { z-index: 2; background-color: rgba(0,0,0,0.45); position: absolute; inset: 0; }
                .layered-slider__text-collection { z-index: 3; justify-content: center; align-items: center; width: 100%; padding-top: 22em; padding-bottom: 22em; display: flex; position: relative; }
                .layered-slider__text-list { justify-content: center; align-items: center; width: 100%; height: 100%; display: flex; }
                .layered-slider__text-item { text-align: center; cursor: pointer; max-width: 80%; position: absolute; display: flex; flex-direction: column; align-items: center; gap: 0.5em; }
                .layered-slider__text-overline { font-size: 1rem; font-weight: 500; letter-spacing: 0.02em; color: rgba(255,255,255,0.75); }
                .layered-slider__text-title {color: inherit; }
                .layered-slider__mask-collection { z-index: 3; aspect-ratio: 4 / 5; border-radius: .75em; width: 18em; position: absolute; bottom: 0; left: 50%; overflow: hidden; transform: translate(-50%, 30%); box-shadow: 0 30px 80px rgba(0,0,0,0.5); }
                .layered-slider__mask-list { position: absolute; inset: 0; }
                .layered-slider__mask-item { flex: none; width: 100%; height: 100%; position: absolute; inset: 0; overflow: hidden; }
                .layered-slider__mask-img { pointer-events: none; object-fit: cover; width: 100%; height: 100%; display: block; }
                .layered-slider__overlay { z-index: 4; pointer-events: none; flex-flow: row; justify-content: space-between; align-items: end; width: 100%; max-width: 120em; margin: 0 auto; padding: 2em; display: flex; position: absolute; inset: 0; }
                .layered-slider__overlay-top { gap: .5em; pointer-events: auto; justify-content: center; align-items: center; display: flex; }
                .layered-slider__span { font-variant-numeric: tabular-nums; font-size: 0.9rem; }
                .layered-slider__progress { background-color: rgba(255,255,255,0.25); border-radius: 10em; width: 6em; height: 2px; overflow: hidden; }
                .layered-slider__progress-inner { transform-origin: 0%; width: 100%; height: 100%; background-color: #f15906; transform: scale3d(0,1,1); }
                .layered-slider__desc-collection { display: grid; place-items: center; max-width: 34em; margin: 0 auto; text-align: center; }
                .layered-slider__desc-item { grid-area: 1 / 1; margin: 0; opacity: 0; font-size: 1rem; line-height: 1.6; color: rgba(255,255,255,0.8); }
                .layered-slider__overlay-btm { justify-content: flex-end; align-items: center; width: 100%; display: flex; }
                .layered-slider__nav { gap: .5em; pointer-events: auto; justify-content: center; align-items: center; display: flex; }
                .layered-slider__nav-button { background-color: transparent; border: 1px solid rgba(255,255,255,0.3); border-radius: 100em; justify-content: center; align-items: center; width: 3em; height: 3em; padding: .75em; display: flex; position: relative; color: #fff; cursor: pointer; transition: background-color .3s, border-color .3s; }
                .layered-slider__nav-button:hover { background-color: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.6); }
                .layered-slider__nav-icon { justify-content: center; align-items: center; width: 100%; height: 100%; display: flex; }
                @media screen and (max-width: 767px) {
                    .layered-slider__text-title { font-size: 2.5em; }
                    .layered-slider__text-collection { padding-top: 16em; padding-bottom: 16em; }
                    .layered-slider__overlay { padding: 1em; flex-flow: column; align-items: center;}
                    .layered-slider__desc-item { font-size: 0.9rem; }
                    .layered-slider__overlay-btm { justify-content: center; align-items: center; }
                    .layered-slider__nav { align-items: center; width: 100%; }
                }
                @media screen and (max-width: 479px) {
                    .layered-slider__mask-collection { width: 13em; }
                }
            `}</style>
        </section>
    );
}
