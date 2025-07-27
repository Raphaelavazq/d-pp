// Test scroll detection
window.addEventListener("load", () => {
  console.log("Page loaded, adding scroll test...");

  let scrollCount = 0;
  window.addEventListener("scroll", () => {
    scrollCount++;
    console.log(`Scroll event #${scrollCount}, position: ${window.scrollY}`);

    // Update page title to show scroll position
    document.title = `Scroll: ${window.scrollY}px`;
  });

  console.log("Scroll test listener added successfully");
});
