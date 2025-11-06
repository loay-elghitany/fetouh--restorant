// ...existing code...
(function(){
  const PHONE = "01090748215"; // استبدل برقمك الدولي بدون +
  const cartKey = "elghitany_cart_v1";

  function qs(sel, ctx=document){ return ctx.querySelector(sel); }
  function qsa(sel, ctx=document){ return Array.from(ctx.querySelectorAll(sel)); }

  let cart = [];
try {
  const raw = localStorage.getItem(cartKey);
  cart = raw ? JSON.parse(raw) : [];
  if (!Array.isArray(cart)) cart = [];
} catch (err) {
  console.error('Failed to parse cart from localStorage:', err);
  cart = [];
}

  // Render cart UI
  function renderCart(){
    const panel = qs('#cart');
    const itemsEl = qs('#cart-items');
    const totalEl = qs('#cart-total');
    itemsEl.innerHTML = '';
    let total = 0;
    cart.forEach((it, idx)=>{
      total += it.price * it.qty;
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.justifyContent = 'space-between';
      row.style.marginBottom = '8px';
      row.innerHTML = `<div style="max-width:65%"><strong>${it.name}</strong><div style="font-size:12px;color:#666">${it.qty} × ${it.price} ر.س</div></div>
                       <div style="text-align:right">
                         <button data-i="${idx}" class="cart-minus">−</button>
                         <button data-i="${idx}" class="cart-plus">+</button>
                         <button data-i="${idx}" class="cart-remove" style="margin-top:6px;display:block">حذف</button>
                       </div>`;
      itemsEl.appendChild(row);
    });
    totalEl.textContent = `المجموع: ${total} ج`;
    panel.style.display = cart.length ? 'block' : 'none';
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }

  // Expose addToCart function
  window.addToCart = function(item){
    const existing = cart.find(i=>i.id === item.id);
    if(existing) existing.qty += item.qty || 1;
    else cart.push(Object.assign({qty: item.qty || 1}, item));
    renderCart();
  };

  // Cart controls
  document.addEventListener('click', e=>{
    if(e.target.matches('#cart-toggle')) {
      const panel = qs('#cart');
      panel.style.display = panel.style.display === 'block' ? 'none' : (cart.length? 'block' : 'none');
    }
    if(e.target.matches('.cart-plus')){
      const i = +e.target.dataset.i; cart[i].qty++; renderCart();
    }
    if(e.target.matches('.cart-minus')){
      const i = +e.target.dataset.i; cart[i].qty = Math.max(1, cart[i].qty-1); renderCart();
    }
    if(e.target.matches('.cart-remove')){
      const i = +e.target.dataset.i; cart.splice(i,1); renderCart();
    }
    if(e.target.matches('#cart-clear')){
      cart = []; renderCart();
    }
    if(e.target.matches('#cart-checkout')){
      if(cart.length===0){ alert('العربة فارغة'); return; }
      // Prepare message
      let lines = [`طلب جديد من موقع elghitany:`];
      cart.forEach(it=> lines.push(`${it.qty} × ${it.name} — ${it.price} ر.س`));
      const total = cart.reduce((s,it)=>s+it.price*it.qty,0);
      lines.push(`المجموع: ${total} ر.س`);
      const msg = encodeURIComponent(lines.join('\n'));
      const waUrl = `https://wa.me/${PHONE}?text=${msg}`;
      window.open(waUrl, '_blank');
    }
  });

  // Init render
  renderCart();

  // Helper: attach add buttons automatically if data attributes present
  // Usage example in HTML: <button class="add-to-cart" data-id="f1" data-name="فطيرة زعتر" data-price="10">أضف</button>
  document.addEventListener('click', e=>{
    const btn = e.target.closest('.add-to-cart');
    if(!btn) return;
    const item = {
      id: btn.dataset.id || btn.dataset.name,
      name: btn.dataset.name || 'منتج',
      price: Number(btn.dataset.price) || 0,
      qty: Number(btn.dataset.qty) || 1
    };
    window.addToCart(item);
  });
})();
 // ...existing code...