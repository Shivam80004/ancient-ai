"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable, InertiaPlugin, CustomEase } from "gsap/all";

type Slide = { img: string; fallback: string; title: string; desc: string };

// Thematic imagery pulled from the internet (Unsplash), with a guaranteed
// keyword-matched fallback (loremflickr) so a card never renders broken.
const SLIDES: Slide[] = [
    {
        img: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80",
        fallback: "https://loremflickr.com/800/800/workshop,seminar",
        title: "Workshops & Seminars",
        desc: "Philosophy, art and culture presentations",
    },
    {
        img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
        fallback: "https://loremflickr.com/800/800/yoga,retreat",
        title: "Yoga Retreats",
        desc: "Getaway towards the inner self",
    },
    {
        img: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80",
        fallback: "https://loremflickr.com/800/800/picnic,nature",
        title: "Picnics & Outings",
        desc: "Trips to charming places seemingly lost in time",
    },
    {
        img: "https://bhaktimarga.in/cdn/shop/files/project-mantra-chanting-the-divine-name.webp?v=1761660079&width=860",
        fallback: "https://loremflickr.com/800/800/meditation,candle",
        title: "Mantra Meditation",
        desc: "Tips and techniques to keep the spirit active",
    },
    {
        img: "/images/kirtan/bonfire.jpg",
        fallback: "https://loremflickr.com/800/800/music,dance",
        title: "Music, Dance & Drama",
        desc: "For those unforgettable moments of cultural expression",
    },
    {
        img: "/gellery-img/gallery-img-5.png",
        fallback: "https://loremflickr.com/800/800/counseling,conversation",
        title: "Lifestyle Counseling",
        desc: "Balance pressures from all corners of life",
    },
    {
        img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
        fallback: "https://loremflickr.com/800/800/etiquette,dining",
        title: "Culture & Etiquette",
        desc: "Do the right thing at the right time in the right place",
    },
    {
        img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
        fallback: "https://loremflickr.com/800/800/leadership,team",
        title: "Leadership & Management",
        desc: "Confidently and smartly go ahead in life",
    },
    {
        img: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
        fallback: "https://loremflickr.com/800/800/public,speaking",
        title: "Public Speaking",
        desc: "Debates and quizzes for words to make impact",
    },
    // {
    //     img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80",
    //     fallback: "https://loremflickr.com/800/800/confidence,portrait",
    //     title: "Personality Development",
    //     desc: "Character development to stand out of the crowd",
    // },
];

export default function SpatialSlider() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        gsap.registerPlugin(Draggable, InertiaPlugin, CustomEase);
        try {
            CustomEase.create("spatial", "0.25, 0.1, 0, 1");
        } catch {
            /* already created */
        }

        const slideDuration = 1;
        const clickEase = "spatial";

        // cleanup handles
        interface SpatialContainer extends HTMLDivElement {
            _spatialSliderDraggable?: Draggable;
            _spatialSliderImageObserver?: IntersectionObserver;
            _spatialSliderProxy?: HTMLElement;
        }
        const el = container as SpatialContainer;

        if (el._spatialSliderDraggable) el._spatialSliderDraggable.kill();
        if (el._spatialSliderImageObserver) el._spatialSliderImageObserver.disconnect();
        if (el._spatialSliderProxy) {
            gsap.killTweensOf(el._spatialSliderProxy);
            el._spatialSliderProxy.remove();
        }

        const collection = container.querySelector<HTMLElement>("[data-spatial-slider-collection]");
        const track = container.querySelector<HTMLElement>("[data-spatial-slider-list]");
        if (!collection || !track) return;

        gsap.set(track, { clearProps: "transform" });

        container.querySelectorAll<HTMLElement>("[data-spatial-slider-item]").forEach((item) => {
            gsap.set(item, { clearProps: "transform" });
        });

        container.querySelectorAll("[data-spatial-slider-clone]").forEach((node) => node.remove());

        const originalItems = Array.from(
            track.querySelectorAll<HTMLElement>(
                ":scope > [data-spatial-slider-item]:not([data-spatial-slider-clone])"
            )
        );
        if (!originalItems.length) return;

        container.setAttribute("role", "region");
        container.setAttribute("aria-roledescription", "carousel");
        container.setAttribute("aria-label", container.getAttribute("aria-label") || "Spatial Cards Slider");
        track.setAttribute("role", "group");
        track.setAttribute("aria-label", "Slides");

        const dotsWrap = container.querySelector<HTMLElement>("[data-spatial-slider-generate-dots]");

        if (dotsWrap) {
            const dots = Array.from(dotsWrap.querySelectorAll<HTMLElement>("[data-spatial-slider-control]"));

            if (dots.length) {
                const template = dots[0];
                dots.slice(1).forEach((dot) => dot.remove());

                for (let i = 1; i <= originalItems.length; i++) {
                    const dot = i === 1 ? template : (template.cloneNode(true) as HTMLElement);
                    dot.setAttribute("data-spatial-slider-control", String(i));
                    dot.setAttribute("data-spatial-slider-control-status", "not-active");
                    if (i > 1) dotsWrap.appendChild(dot);
                }
            }
        }

        const controls = Array.from(container.querySelectorAll<HTMLButtonElement>("[data-spatial-slider-control]"));
        const totalEl = container.querySelector<HTMLElement>("[data-spatial-slider-total-slide]");
        const indicators = Array.from(container.querySelectorAll<HTMLElement>("[data-spatial-slider-active-slide]"));
        const mod = (value: number, total: number) => ((value % total) + total) % total;
        const formatNumber = (value: number) => (value < 10 ? "0" + value : String(value));

        if (totalEl) totalEl.textContent = formatNumber(originalItems.length);

        originalItems.forEach((item, index) => {
            item.removeAttribute("data-spatial-slider-item-status");
            item.removeAttribute("aria-hidden");
            item.setAttribute("role", "group");
            item.setAttribute("aria-label", `Slide ${index + 1} of ${originalItems.length}`);
        });

        controls.forEach((btn) => {
            const value = btn.getAttribute("data-spatial-slider-control") || "";

            if (value === "prev") btn.setAttribute("aria-label", "Previous slide");
            if (value === "next") btn.setAttribute("aria-label", "Next slide");

            if (/^\d+$/.test(value)) {
                btn.setAttribute("aria-label", `Go to slide ${value}`);
                btn.setAttribute("aria-current", "false");
            }
        });

        const containerStyles = getComputedStyle(container);
        const trackStyles = getComputedStyle(track);
        const curve = Math.abs(parseFloat(containerStyles.getPropertyValue("--slider-curve"))) || 12;
        const directionValue = parseFloat(containerStyles.getPropertyValue("--slider-direction"));
        const direction = directionValue < 0 ? -1 : 1;
        const gap = parseFloat(trackStyles.columnGap) || 0;
        const curveRadians = (curve * Math.PI) / 180;

        const firstRect = originalItems[0].getBoundingClientRect();
        const itemWidth = firstRect.width;
        const itemHeight = firstRect.height;

        const perspectiveValue = parseFloat(getComputedStyle(track).perspective);
        const perspective = Number.isFinite(perspectiveValue) ? perspectiveValue : 1200;

        const getProjectedEdgeX = (radius: number, angle: number, side: number) => {
            const radians = (angle * Math.PI) / 180;
            const rotation = -direction * radians;
            const localX = (side * itemWidth) / 2;

            const centerX = Math.sin(radians) * radius;
            const centerZ = direction * radius * (1 - Math.cos(radians));

            const x = centerX + localX * Math.cos(rotation);
            const z = centerZ - localX * Math.sin(rotation);

            return (x * perspective) / (perspective - z);
        };

        let spatialRadius = itemWidth / Math.sin(curveRadians);

        for (let i = 0; i < 8; i++) {
            const nextLeft = getProjectedEdgeX(spatialRadius, curve, -1);
            const currentRight = itemWidth / 2;
            const currentGap = nextLeft - currentRight;
            const correction = gap - currentGap;

            spatialRadius += correction / Math.sin(curveRadians);
        }

        const stepDistance = Math.sin(curveRadians) * spatialRadius;
        const tangentRatio = (-direction * spatialRadius) / (perspective - direction * spatialRadius);
        const edgeAngle = (Math.acos(gsap.utils.clamp(-1, 1, tangentRatio)) * 180) / Math.PI;
        const maxSideItems = Math.ceil(edgeAngle / curve);
        const maxLoopItems = maxSideItems * 2;

        const getSpatialPosition = (offset: number) => {
            const angle = gsap.utils.clamp(-edgeAngle, edgeAngle, offset * curve);
            const radians = (angle * Math.PI) / 180;

            return {
                x: Math.sin(radians) * spatialRadius,
                z: direction * spatialRadius * (1 - Math.cos(radians)),
                rotationY: -direction * angle,
            };
        };

        const containerRect = container.getBoundingClientRect();
        const trackRect = track.getBoundingClientRect();
        const originX = trackRect.left + trackRect.width / 2;
        const leftLimit = containerRect.left - originX;
        const rightLimit = containerRect.right - originX;

        const isOffsetInside = (offset: number) => {
            if (Math.abs(offset * curve) >= edgeAngle) return false;

            const position = getSpatialPosition(offset);
            const scale = perspective / (perspective - position.z);
            const radians = (Math.abs(position.rotationY) * Math.PI) / 180;
            const halfWidth = (Math.abs(Math.cos(radians)) * itemWidth * scale) / 2;
            const x = position.x * scale;

            return x + halfWidth >= leftLimit && x - halfWidth <= rightLimit;
        };

        const getVisibleCount = () => {
            let left = 0;
            let right = 0;

            for (let i = 1; i < maxSideItems && isOffsetInside(i); i++) right = i;
            for (let i = 1; i < maxSideItems && isOffsetInside(-i); i++) left = i;

            return Math.min(maxLoopItems, 1 + left + right + 2);
        };

        const minItemsNeeded = getVisibleCount();
        const neededItems =
            originalItems.length >= minItemsNeeded
                ? originalItems.length
                : Math.ceil(minItemsNeeded / originalItems.length) * originalItems.length;

        for (let i = originalItems.length; i < neededItems; i++) {
            const clone = originalItems[i % originalItems.length].cloneNode(true) as HTMLElement;
            clone.setAttribute("data-spatial-slider-clone", "");
            clone.setAttribute("aria-hidden", "true");
            track.appendChild(clone);
        }

        const items = Array.from(track.querySelectorAll<HTMLElement>(":scope > [data-spatial-slider-item]"));
        const totalItems = items.length;

        track.style.height = itemHeight + "px";
        container.setAttribute("data-spatial-slider-drag-status", "grab");

        items.forEach((item) => item.setAttribute("data-spatial-slider-item-status", "not-active"));

        const proxy = document.createElement("div");
        proxy.setAttribute("data-spatial-slider-proxy", "");

        Object.assign(proxy.style, {
            position: "absolute",
            width: "1px",
            height: "1px",
            pointerEvents: "none",
            opacity: "0",
        });

        container.appendChild(proxy);
        el._spatialSliderProxy = proxy;

        gsap.set(proxy, { x: 0 });

        const setX = items.map((item) => gsap.quickSetter(item, "x", "px"));
        const setZ = items.map((item) => gsap.quickSetter(item, "z", "px"));
        const setRotationY = items.map((item) => gsap.quickSetter(item, "rotationY", "deg"));

        const getIndex = () => -(gsap.getProperty(proxy, "x") as number) / stepDistance;

        const nearestDelta = (index: number, realIndex: number) => {
            const loop = Math.round((realIndex - index) / totalItems);
            return index - (realIndex - loop * totalItems);
        };

        const getSlideDelta = (target: number, realIndex: number) => {
            let bestDelta = 0;
            let bestDistance = Infinity;

            items.forEach((item, index) => {
                if (index % originalItems.length !== target) return;

                const delta = nearestDelta(index, realIndex);
                const distance = Math.abs(delta);

                if (distance < bestDistance) {
                    bestDelta = delta;
                    bestDistance = distance;
                }
            });

            return bestDelta;
        };

        let lastActiveIndex: number | null = null;

        const updateActiveUI = (activeIndex: number, activeSlideIndex: number) => {
            if (activeIndex === lastActiveIndex) return;

            items.forEach((item, index) => {
                item.setAttribute(
                    "data-spatial-slider-item-status",
                    index === activeIndex ? "active" : "inview"
                );
            });

            indicators.forEach((elm) => (elm.textContent = formatNumber(activeSlideIndex + 1)));

            controls.forEach((btn) => {
                const value = btn.getAttribute("data-spatial-slider-control") || "";
                if (!/^\d+$/.test(value)) return;

                const isActive = parseInt(value, 10) - 1 === activeSlideIndex;
                btn.setAttribute("data-spatial-slider-control-status", isActive ? "active" : "not-active");
                btn.setAttribute("aria-current", isActive ? "true" : "false");
            });

            lastActiveIndex = activeIndex;
        };

        const render = () => {
            const realIndex = getIndex();
            const activeIndex = mod(Math.round(realIndex), totalItems);
            const activeSlideIndex = activeIndex % originalItems.length;

            items.forEach((item, index) => {
                const position = getSpatialPosition(nearestDelta(index, realIndex));

                setX[index](position.x);
                setZ[index](position.z);
                setRotationY[index](position.rotationY);
            });

            updateActiveUI(activeIndex, activeSlideIndex);
        };

        controls.forEach((btn) => {
            const value = btn.getAttribute("data-spatial-slider-control") || "";
            btn.disabled = false;

            btn.onclick = () => {
                gsap.killTweensOf(proxy);

                const currentIndex = getIndex();
                let targetIndex: number;

                if (value === "next" || value === "prev") {
                    targetIndex = Math.round(currentIndex) + (value === "next" ? 1 : -1);
                } else if (/^\d+$/.test(value)) {
                    const targetSlide = Math.max(
                        0,
                        Math.min(originalItems.length - 1, parseInt(value, 10) - 1)
                    );
                    targetIndex = currentIndex + getSlideDelta(targetSlide, currentIndex);
                } else {
                    return;
                }

                gsap.to(proxy, {
                    x: -targetIndex * stepDistance,
                    duration: slideDuration,
                    ease: clickEase,
                    onUpdate: render,
                });
            };
        });

        el._spatialSliderDraggable = Draggable.create(proxy, {
            type: "x",
            trigger: collection,
            inertia: true,
            throwResistance: 2000,
            dragResistance: 0.05,
            maxDuration: 1,
            minDuration: 0.5,
            edgeResistance: 0.75,
            overshootTolerance: 0,
            snap: (value: number) => Math.round(value / stepDistance) * stepDistance,
            onDrag: render,
            onThrowUpdate: render,
            onThrowComplete: () => {
                container.setAttribute("data-spatial-slider-drag-status", "grab");
                render();
            },
            onPress: () => container.setAttribute("data-spatial-slider-drag-status", "grabbing"),
            onDragStart: () => container.setAttribute("data-spatial-slider-drag-status", "grabbing"),
            onRelease: () => container.setAttribute("data-spatial-slider-drag-status", "grab"),
        })[0];

        render();

        // Fix for Lazy Loading images on Safari
        el._spatialSliderImageObserver = new IntersectionObserver(([entry], observer) => {
            if (!entry.isIntersecting) return;
            container.querySelectorAll<HTMLImageElement>('[data-spatial-slider-item] img[loading="lazy"]').forEach((img) => {
                img.loading = "eager";
            });
            observer.disconnect();
        });
        el._spatialSliderImageObserver.observe(container);

        // Rebuild on width change
        let lastWidth = window.innerWidth;
        let resizeTimer: ReturnType<typeof setTimeout>;
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth === lastWidth) return;
                lastWidth = window.innerWidth;
                // Recompute by clearing and re-running is complex; simplest reliable path
                // is a re-render of positions which stay valid; full rebuild handled on remount.
                render();
            }, 200);
        };
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
            clearTimeout(resizeTimer);
            if (el._spatialSliderDraggable) el._spatialSliderDraggable.kill();
            if (el._spatialSliderImageObserver) el._spatialSliderImageObserver.disconnect();
            if (el._spatialSliderProxy) {
                gsap.killTweensOf(el._spatialSliderProxy);
                el._spatialSliderProxy.remove();
            }
            container.querySelectorAll("[data-spatial-slider-clone]").forEach((node) => node.remove());
        };
    }, []);

    return (
        <section className="demo-section">
            <div className="demo-section__intro">
                <h2 className="text-3xl text-center md:text-5xl lg:text-6xl font-light tracking-tight text-white mb-4">Activities We <span className="font-medium">Organize</span></h2>
                <p className="demo-section__subtitle">
                    We organize and train in a wide range of activities designed to engage the mind,
                    body, and spirit.
                </p>
            </div>
            <div
                ref={containerRef}
                data-spatial-slider-init
                data-spatial-slider-drag-status="grab"
                className="spatial-gsap-slider"
            >
                <div data-spatial-slider-collection className="spatial-gsap-slider__collection">
                    <div data-spatial-slider-list className="spatial-gsap-slider__list">
                        {SLIDES.map((slide, index) => (
                            <div
                                key={slide.title}
                                data-spatial-slider-item-status={index === 0 ? "active" : "inview"}
                                data-spatial-slider-item
                                className="spatial-gsap-slider__item"
                            >
                                <div className="demo-card">
                                    <div className="demo-card__media">
                                        <img
                                            src={slide.img}
                                            loading="lazy"
                                            alt={slide.title}
                                            className="cover-image"
                                            onError={(e) => {
                                                const img = e.currentTarget;
                                                if (img.dataset.fallbackApplied) return;
                                                img.dataset.fallbackApplied = "true";
                                                img.src = slide.fallback;
                                            }}
                                        />
                                    </div>
                                    <div className="demo-card__info">
                                        <h3 className="demo-card__h">{slide.title}</h3>
                                        {/* <p className="demo-card__p">{slide.desc}</p> */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="spatial-gsap-slider__controls">
                    <button
                        data-spatial-slider-control="prev"
                        className="spatial-gsap-slider__control-btn"
                    >
                        Prev
                    </button>
                    <div data-spatial-slider-generate-dots className="spatial-gsap-slider__dots">
                        <button
                            data-spatial-slider-control="1"
                            data-spatial-slider-control-status="active"
                            className="spatial-gsap-slider__control-dot"
                        />
                    </div>
                    <button
                        data-spatial-slider-control="next"
                        className="spatial-gsap-slider__control-btn is--next"
                    >
                        Next
                    </button>
                </div>
            </div>

            <style jsx global>{`
                .demo-section {
                    min-height: 100dvh;
                    display: flex;
                    flex-flow: column;
                    justify-content: center;
                    align-items: center;
                    padding: 5em 1.5em 4em;
                    overflow: hidden;
                    background-color: #1a1614;
                    background:linear-gradient(1.26deg, rgba(246, 32, 3, 0) -11.86%, rgb(0, 0, 0) -5.96%, rgb(0,0, 0) 5.45%, #362320 30.99%, rgba(246, 32, 3, 0) 62.85%, rgb(246, 32, 3) 101.39%, rgb(253, 124, 52) 103.82%);
                }

                .demo-section__intro {
                    max-width: 46em;
                    text-align: center;
                    margin-bottom: 1em;
                }

                .demo-section__title {
                    color: #f5f5f5;
                    font-size: clamp(1.75rem, 4vw, 2.75rem);
                    font-weight: 500;
                    letter-spacing: -0.01em;
                    margin: 0 0 0.5em;
                    // background: linear-gradient(90deg, #f5f5f5 0%, #f7b98d 60%, #f15906 100%);
                    -webkit-background-clip: text;
                    // background-clip: text;
                    // -webkit-text-fill-color: transparent;
                }

                .demo-section__subtitle {
                    color: #dadada;
                    font-size: clamp(0.95rem, 1.6vw, 1.15rem);
                    line-height: 1.6;
                    margin: 0;
                }

                .spatial-gsap-slider {
                    grid-column-gap: 5em;
                    grid-row-gap: 3em;
                    flex-flow: column;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    padding-top: 3em;
                    display: flex;
                    position: relative;
                }

                [data-spatial-slider-init] {
                    --slider-gap: 2.5em;
                    --slider-curve: 30deg;
                    --slider-perspective: 120em;
                    --slider-direction: 1;
                }

                .spatial-gsap-slider__collection {
                    max-width: 100%;
                    position: relative;
                }

                .spatial-gsap-slider__list {
                    -webkit-user-select: none;
                    user-select: none;
                    will-change: transform;
                    touch-action: pan-y;
                    backface-visibility: hidden;
                    grid-column-gap: var(--slider-gap);
                    grid-row-gap: var(--slider-gap);
                    max-width: 100%;
                    transform-style: preserve-3d;
                    justify-content: center;
                    align-items: center;
                    display: flex;
                    position: relative;
                    perspective: var(--slider-perspective);
                }

                .spatial-gsap-slider__item {
                    flex: none;
                    position: absolute;
                }

                [data-spatial-slider-list] > :first-child {
                    position: relative;
                }

                @media screen and (max-width: 767px) {
                    [data-spatial-slider-init] {
                        --slider-gap: 1em;
                        --slider-curve: 45deg;
                    }
                }

                /* Demo Card */
                .demo-card {
                    color: #f5f5f5;
                    text-align: center;
                    // background-color: rgba(11, 27, 22, 0.32);
                    border: 1px solid rgba(245, 245, 245, 0.08);
                    box-shadow: 0 1.5em 3em rgba(0, 0, 0, 0.45);
                    backdrop-filter: blur(6px);
                    border-radius: 1.375em;
                    flex-flow: column;
                    align-items: flex-start;
                    width: 18em;
                    padding-top: 0.625em;
                    padding-left: 0.625em;
                    padding-right: 0.625em;
                    padding-bottom: 0.25em;
                    display: flex;
                }

                @media screen and (max-width: 767px) {
                    .demo-card {
                        width: 15em;
                    }
                }

                .demo-card__media {
                    aspect-ratio: 1;
                    border-radius: 0.75em;
                    width: 100%;
                    position: relative;
                    overflow: hidden;
                }

                .demo-card__media::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    border-radius: inherit;
                    background: linear-gradient(
                        to top,
                        rgba(26, 22, 20, 0.85) 0%,
                        rgba(26, 22, 20, 0) 55%
                    );
                }

                .cover-image {
                    object-fit: cover;
                    border-radius: inherit;
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                }

                .demo-card__info {
                    flex-flow: column;
                    justify-content: center;
                    align-items: center;
                    gap: 0.35em;
                    width: 100%;
                    min-height: 4em;
                    padding: 1em 1em 0.75em;
                    display: flex;
                }

                .demo-card__h {
                    color: #f5f5f5;
                    margin-top: 0;
                    margin-bottom: 0;
                    font-size: 1.15em;
                    font-weight: 500;
                    letter-spacing: -0.01em;
                    line-height: 1.1;
                }

                .demo-card__p {
                    color: white;
                    margin: 0;
                    font-size: 0.85em;
                    font-weight: 400;
                    line-height: 1.4;
                }

                /* Controls */
                .spatial-gsap-slider__controls {
                    grid-column-gap: 1em;
                    grid-row-gap: 1em;
                    justify-content: center;
                    align-items: center;
                    padding-left: 3em;
                    padding-right: 3em;
                    display: flex;
                    position: relative;
                }

                .spatial-gsap-slider__control-btn {
                    z-index: 1;
                    color: #f5f5f5;
                    letter-spacing: -0.02em;
                    cursor: pointer;
                    background-color: rgba(41, 27, 22, 0.85);
                    border: 1px solid rgba(245, 245, 245, 0.12);
                    border-radius: 50em;
                    height: 3em;
                    padding: 0 1.5em;
                    font-size: 1em;
                    font-weight: 600;
                    position: relative;
                    transition: transform 0.2s ease, background-color 0.2s ease;
                }

                .spatial-gsap-slider__control-btn:hover {
                    transform: translateY(-1px);
                }

                .spatial-gsap-slider__control-btn.is--next {
                    color: #fff;
                    border-color: transparent;
                    background-image: linear-gradient(
                        261deg,
                        #fc964c -6%,
                        #f15906 45%,
                        #f62003 101%
                    );
                }

                .spatial-gsap-slider__dots {
                    justify-content: center;
                    align-items: center;
                    display: flex;
                }

                .spatial-gsap-slider__control-dot {
                    z-index: 1;
                    outline-offset: 0px;
                    color: #6b5750;
                    cursor: pointer;
                    background-color: currentColor;
                    border: 0.1875em solid #1a1614;
                    border-radius: 50em;
                    width: 0.875em;
                    height: 0.875em;
                    padding: 0;
                    font-size: 1em;
                    font-weight: 500;
                    transition-property: color;
                    transition-duration: 0.1s;
                    transition-timing-function: ease;
                    position: relative;
                    overflow: hidden;
                    outline: 0 !important;
                    box-shadow: 0 0 #0000 !important;
                }

                .spatial-gsap-slider__control-dot[data-spatial-slider-control-status="active"] {
                    color: #f15906;
                }
            `}</style>
        </section>
    );
}
