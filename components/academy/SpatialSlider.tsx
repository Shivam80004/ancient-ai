"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable, InertiaPlugin, CustomEase } from "gsap/all";

type Slide = { img: string; title: string };

const SLIDES: Slide[] = [
    {
        img: "https://cdn.prod.website-files.com/6a798376b45151908ea24de4/6a798376b45151908ea24e13_Contemplative%20Man%20by%20the%20Ocean.avif",
        title: "CÄP",
    },
    {
        img: "https://cdn.prod.website-files.com/6a798376b45151908ea24de4/6a79b1ea765244038a6b380b_elegant-curved-wood-grain-abstract-small.avif",
        title: "WØOD",
    },
    {
        img: "https://cdn.prod.website-files.com/6a798376b45151908ea24de4/6a798376b45151908ea24e12_Sunset%20Mountain%20Trail.avif",
        title: "GRĀSS",
    },
    {
        img: "https://cdn.prod.website-files.com/6a798376b45151908ea24de4/6a79b3bab5cd07a60d207204_stylish-man-walking-on-coastal-rocks-under-soft-sky-small.avif",
        title: "STĒPS",
    },
    {
        img: "https://cdn.prod.website-files.com/6a798376b45151908ea24de4/6a79b35e7f258156a7998a0b_close-up-of-a-human-eye-with-warm-tones-small.avif",
        title: "SK!N",
    },
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
                                            alt=""
                                            className="cover-image"
                                        />
                                    </div>
                                    <div className="demo-card__info">
                                        <h3 className="demo-card__h">{slide.title}</h3>
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
                    // background-color: #5a4239;
                }

                .spatial-gsap-slider {
                    grid-column-gap: 5em;
                    grid-row-gap: 5em;
                    flex-flow: column;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    padding-top: 5em;
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
                    color: #ebe0cf;
                    text-align: center;
                    background-color: #291b16;
                    border-radius: 1.375em;
                    flex-flow: column;
                    align-items: flex-start;
                    width: 18em;
                    padding-top: 0.625em;
                    padding-left: 0.625em;
                    padding-right: 0.625em;
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
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 3.5em;
                    padding-left: 0.75em;
                    padding-right: 0.75em;
                    display: flex;
                }

                .demo-card__h {
                    text-transform: uppercase;
                    margin-top: 0;
                    margin-bottom: 0;
                    font-size: 1.25em;
                    font-weight: 800;
                    line-height: 1;
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
                    color: #ebe0cf;
                    letter-spacing: -0.02em;
                    cursor: pointer;
                    background-color: #291b16;
                    border-radius: 50em;
                    height: 3em;
                    padding: 0 1.5em;
                    font-size: 1em;
                    font-weight: 600;
                    position: relative;
                }

                .spatial-gsap-slider__control-btn.is--next {
                    color: #27150f;
                    background-color: #ebe0cf;
                }

                .spatial-gsap-slider__dots {
                    justify-content: center;
                    align-items: center;
                    display: flex;
                }

                .spatial-gsap-slider__control-dot {
                    z-index: 1;
                    outline-offset: 0px;
                    color: #866b61;
                    cursor: pointer;
                    background-color: currentColor;
                    border: 0.1875em solid #5a4239;
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
                    color: #ebe0cf;
                }
            `}</style>
        </section>
    );
}
