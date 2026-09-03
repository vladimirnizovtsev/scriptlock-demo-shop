// First-party storefront code, built from this repository and reviewed here.
(function () {
  window.__shop = { name: 'Bramble & Fig', currency: 'EUR' };
  document.addEventListener('click', function (e) {
    var add = e.target.closest('[data-add]');
    if (!add) return;
    e.preventDefault();
    var n = Number(localStorage.getItem('bf.cart') || 0) + 1;
    localStorage.setItem('bf.cart', String(n));
    var badge = document.querySelector('[data-cart-count]');
    if (badge) badge.textContent = String(n);
  });
})();
