document.addEventListener("DOMContentLoaded", function(event) {
  (function() {
  requestAnimationFrame(function() {
    var banner;
    banner.style.display = 'none';
    banner = document.querySelector('.exponea-banner3');
    banner.classList.add('exponea-in3');
    return banner.querySelector('.exponea-close3').addEventListener('click', function() {
      return banner.classList.remove('exponea-in3');
      
    });
  });

}).call(this); 
});
