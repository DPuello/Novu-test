import { gsap } from "gsap";

const INTRO_DURATION = 5;
const LOOP_DURATION = 5;
const LOOP_REPEATS = 2;

const banner = document.getElementById("banner");
const cta = document.getElementById("cta");
const phoneWrap = document.getElementById("phoneWrap");
const shapeNavy = document.getElementById("shapeNavy");
const shapeAccent = document.getElementById("shapeAccent");
const dotGrid = document.getElementById("dotGrid");
const shine = document.getElementById("shine");
const ripple = document.getElementById("ripple");

window.clickTag = window.clickTag || "https://novuapp.com";

const openClickTag = () => {
  window.open(window.clickTag, "_blank");
};

const rippleAt = (x, y) => {
  const rect = banner.getBoundingClientRect();

  gsap.set(ripple, {
    x: x - rect.left - 5,
    y: y - rect.top - 5,
    scale: 0.2,
    opacity: 0.7
  });

  gsap.to(ripple, {
    scale: 9,
    opacity: 0,
    duration: 0.55,
    ease: "power2.out"
  });
};

const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

intro
  .from("#logoWrap", { autoAlpha: 0, y: -8, duration: 0.45 })
  .from("#copyStart", { autoAlpha: 0, x: -26, duration: 0.45 }, "+=0.05")
  .from("#copyFresh", { autoAlpha: 0, x: -20, duration: 0.42 }, "-=0.26")
  .from("#subhead", { autoAlpha: 0, x: -16, duration: 0.38 }, "-=0.2")
  .from("#phoneWrap", { autoAlpha: 0, x: 22, y: 16, rotate: 8, duration: 0.62, ease: "back.out(1.28)" }, "-=0.22")
  .from("#cta", { autoAlpha: 0, y: 8, scale: 0.9, duration: 0.42, ease: "back.out(1.6)" }, "-=0.18");

if (intro.duration() < INTRO_DURATION) {
  intro.to({}, { duration: INTRO_DURATION - intro.duration() });
}

const loopTweenDuration = LOOP_DURATION / (LOOP_REPEATS + 1);
const phaseDuration = loopTweenDuration / 2;

const loop = gsap.timeline({
  paused: true,
  repeat: LOOP_REPEATS,
  yoyo: true,
  defaults: { ease: "sine.inOut" }
});

loop
  .to(phoneWrap, { y: -4, x: -4, rotate: -3, duration: phaseDuration }, 0)
  .to(shapeNavy, { y: -3, x: -3, duration: phaseDuration }, 0)
  .to(shapeAccent, { y: 2, x: -4, duration: phaseDuration }, 0)
  .to(dotGrid, { y: -1, opacity: 0.5, duration: phaseDuration }, 0)
  .to(shine, { xPercent: 120, duration: phaseDuration }, 0)
  .to(cta, { scale: 1.045, boxShadow: "0 10px 22px rgba(233, 69, 96, 0.4)", duration: phaseDuration }, 0)
  .to("#cta .cta-arrow", { x: 2, duration: phaseDuration }, 0)
  .to(phoneWrap, { y: -2, x: -1, rotate: -1.9, duration: phaseDuration }, phaseDuration)
  .to(shapeNavy, { y: -1, x: 0, duration: phaseDuration }, phaseDuration)
  .to(shapeAccent, { y: 1, x: -1, duration: phaseDuration }, phaseDuration)
  .to(dotGrid, { y: 0, opacity: 0.66, duration: phaseDuration }, phaseDuration)
  .to(shine, { xPercent: 210, duration: phaseDuration }, phaseDuration)
  .to(cta, { scale: 1.058, boxShadow: "0 12px 24px rgba(233, 69, 96, 0.46)", duration: phaseDuration }, phaseDuration)
  .to("#cta .cta-arrow", { x: 0, duration: phaseDuration }, phaseDuration);

intro.call(() => loop.play(), null, ">");

cta.addEventListener("mouseenter", () => {
  gsap.to(cta, { scale: 1.08, duration: 0.22, ease: "power2.out" });
});

cta.addEventListener("mouseleave", () => {
  gsap.to(cta, { scale: 1, duration: 0.22, ease: "power2.out" });
});

banner.addEventListener("pointermove", (event) => {
  const rect = banner.getBoundingClientRect();
  const nx = (event.clientX - rect.left) / rect.width - 0.5;
  const ny = (event.clientY - rect.top) / rect.height - 0.5;

  gsap.to(phoneWrap, {
    x: nx * 3.2,
    y: ny * 2.6,
    rotation: -2.4 + nx * 2.2 + ny * 1.1,
    duration: 0.52,
    overwrite: "auto",
    ease: "power3.out"
  });
});

banner.addEventListener("pointerleave", () => {
  gsap.to(phoneWrap, { x: 0, y: 0, rotation: -2.4, duration: 0.6, ease: "power3.out" });
});

banner.addEventListener("wheel", (event) => {
  const up = Math.sign(event.deltaY || 1) < 0;

  gsap.fromTo(
    cta,
    { scale: up ? 1.02 : 0.98 },
    { scale: 1.06, duration: 0.28, yoyo: true, repeat: 1, ease: "sine.inOut" }
  );
});

cta.addEventListener("click", () => {
  const rect = cta.getBoundingClientRect();
  rippleAt(rect.left + rect.width / 2, rect.top + rect.height / 2);
  gsap.fromTo(cta, { scale: 0.98 }, { scale: 1.08, duration: 0.26, yoyo: true, repeat: 1, ease: "power2.out" });
  openClickTag();
});
