// First-party checkout code, built from this repository and reviewed here.
// It renders the order summary. It never touches the payment fields, which
// live inside the provider frame.
(function () {
  var items = [
    { name: 'Ethiopia Guji, 250 g', price: 14.5 },
    { name: 'Colombia Huila, 250 g', price: 12.0 }
  ];
  var list = document.querySelector('[data-summary]');
  if (!list) return;
  var total = 0;
  items.forEach(function (item) {
    total += item.price;
    var row = document.createElement('div');
    row.className = 'summary';
    row.innerHTML = '<span></span><span></span>';
    row.children[0].textContent = item.name;
    row.children[1].textContent = item.price.toFixed(2) + ' EUR';
    list.appendChild(row);
  });
  var sum = document.createElement('div');
  sum.className = 'summary';
  sum.innerHTML = '<span></span><span></span>';
  sum.children[0].textContent = 'Total';
  sum.children[1].textContent = total.toFixed(2) + ' EUR';
  list.appendChild(sum);
})();
