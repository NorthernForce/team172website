



const scrollToTopButton = document.getElementById('js-top');
const scrollFunc = () => {

  let y = window.scrollY;
    if (y > 0) {
    scrollToTopButton.className = "top-link show-to-top";
  } else {
    scrollToTopButton.className = "top-link hide-to-top";
  }
};
window.addEventListener("scroll", scrollFunc);
const scrollToTop = () => {

  const c = document.documentElement.scrollTop || document.body.scrollTop;
  
 
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);

    window.scrollTo(0, c - c / 7);
  }
};
scrollToTopButton.onclick = function(e) {
  e.preventDefault();
  scrollToTop();
}