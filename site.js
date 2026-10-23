// Pip follows the pointer, blinks now and then, and the month column explains
// itself. Nothing here sends or stores anything.
(() => {
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Pip's face looks toward the pointer — a few pixels, never off his head.
  const pip = document.getElementById("pip");
  const face = document.getElementById("pip-face");
  if (pip && face) {
    const look = (event) => {
      const box = pip.getBoundingClientRect();
      const dx = event.clientX - (box.left + box.width / 2);
      const dy = event.clientY - (box.top + box.height * 0.18);
      const reach = Math.max(1, Math.hypot(dx, dy));
      const pull = Math.min(1, reach / 400);
      face.style.transform = `translate(${(dx / reach) * 7 * pull}px, ${(dy / reach) * 5 * pull}px)`;
    };
    addEventListener("pointermove", look, { passive: true });
    addEventListener("pointerdown", look, { passive: true });

    // A blink every few seconds, once he has landed. Never more often than
    // once in three seconds; none at all for people who ask for less motion.
    if (!still) {
      const blink = () => {
        pip.classList.add("blink");
        setTimeout(() => pip.classList.remove("blink"), 130);
        setTimeout(blink, 3200 + Math.random() * 3200);
      };
      setTimeout(blink, 2600);
    }
  }

  // The column: each band, pressed or hovered, describes itself.
  const bands = [...document.querySelectorAll(".band")];
  const out = {
    name: document.getElementById("r-name"),
    amount: document.getElementById("r-amount"),
    share: document.getElementById("r-share"),
    text: document.getElementById("r-text"),
  };
  const show = (band) => {
    for (const b of bands) b.setAttribute("aria-pressed", String(b === band));
    out.name.textContent = band.dataset.name;
    out.amount.textContent = band.dataset.amount;
    out.share.textContent = band.dataset.share;
    out.text.textContent = band.dataset.text;
  };
  for (const band of bands) {
    band.addEventListener("click", () => show(band));
    band.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") show(band); });
    band.addEventListener("focus", () => show(band));
  }
  const fixed = bands.find((b) => b.dataset.name === "Fixed");
  if (fixed) show(fixed);
})();
