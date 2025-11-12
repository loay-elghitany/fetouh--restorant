let addBtn = Array.from(document.querySelectorAll(".add-to-cart"));
let cartItems = document.querySelector("#cart-items");
let cartTotal = document.querySelector("#cart-total");
let clearCartBtn = document.querySelector("#cart-clear");
let cartOfItems = document.querySelector("#cart");
let cartCheckOut = document.querySelector("#cart-checkout");
let cartToggle = document.querySelector("#cart-toggle");
let extraIcon = document.querySelector(".extra-icon");
let sidextras = document.querySelector(".side-extras");
let cart = [];
let PHONE = "201004708818"; 

addBtn.forEach((button) => {
    button.addEventListener("click", () => {
        const productId = button.dataset.id;
        const sizeSelect = document.querySelector(`select[data-id="${productId}"]`);

        // إذا وُجد select (أي المنتج يدعم أحجام) استخدم الخيار المحدد، وإلا اعتمد على بيانات الزر (fallback)
        if (sizeSelect) {
            const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
            let product = {
                id: `${productId}-${sizeSelect.value}`,
                name: `${sizeSelect.dataset.name} (${selectedOption.text.split(' - ')[0]})`,
                price: selectedOption.dataset.price,
                size: sizeSelect.value
            };
            addOrIncrement(product);
        } else {
            // fallback: بعض العناصر قد لا تحتوي على select (أقسام لم تُحدّث بعد)
            const name = button.dataset.name || button.getAttribute('data-name') || button.textContent.trim() || 'منتج';
            const price = button.dataset.price || button.getAttribute('data-price') || 0;
            let product = {
                id: productId,
                name: name,
                price: price,
                size: null
            };
            addOrIncrement(product);
        }
    });
});


function addOrIncrement(product) {
// تأكد من تحويل السعر لرقم
product.price = Number(product.price) || 0;
// حاول إيجاد العنصر بنفس الـ id
const idx = cart.findIndex(it => it.id === product.id);
if (idx !== -1) {
// العنصر موجود -> زيد الكمية بواحد فقط
cart[idx].qty = (Number(cart[idx].qty) || 0) + 1;
} else {
// غير موجود -> أضفه مع qty = 1
product.qty = 1;
cart.push(product);
}
renderCart();
}


function renderCart() {
    cartItems.innerHTML = "";
    let total = 0;
    cart.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.style.cssText = "display:flex;justify-content:space-between;margin-bottom:8px;";
        itemDiv.innerHTML = `<div style="max-width:65%"><strong>${item.name}</strong><div style="font-size:12px;color:#666">${item.qty} × ${item.price} ج</div></div>
                     <div style="text-align:right">
                       <button data-i="${item.id}" class="cart-minus">−</button>
                       <button data-i="${item.id}" class="cart-plus">+</button>
                       <button data-i="${item.id}" class="cart-remove" style="margin-top:6px;display:block">حذف</button>
                     </div>`;
        cartItems.appendChild(itemDiv);
        total += Number(item.price) * item.qty;
    });
    cartTotal.textContent = `المجموع: ${total} ج`;
    // if (cart.length === 0) {
    //     cartOfItems.style.display = "none";
    // } else if (cart.length > 0) {
    //     cartOfItems.style.display = "block";
    // }
attachCartButtons() 
}
function attachCartButtons() {
    let plusBtns = Array.from(document.querySelectorAll(".cart-plus"));
    let minusBtns = Array.from(document.querySelectorAll(".cart-minus"));
    let removeBtns = Array.from(document.querySelectorAll(".cart-remove"));
    plusBtns.forEach((button) => {
        button.addEventListener("click", () => {
            let product = cart.find(it => it.id === button.dataset.i);
            addOrIncrement(product);
        });
    });
    minusBtns.forEach((button) => {
        button.addEventListener("click", () => {
            let idx = cart.findIndex(it => it.id === button.dataset.i);
            if (idx !== -1) {
                cart[idx].qty = (Number(cart[idx].qty) || 0) - 1;
                if (cart[idx].qty <= 0) {
                    cart.splice(idx, 1);
                }
                renderCart();
            }
        });})
    removeBtns.forEach((button) => {
        button.addEventListener("click", () => {
            let idToRemove = button.dataset.i;
            cart = cart.filter(it => it.id !== idToRemove);
            renderCart();
        });
    });
}

clearCartBtn.addEventListener("click", () => {
    cart = [];
    renderCart();
});

// Initial render
renderCart();

cartCheckOut.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("سلة التسوق فارغة!");
        return;
    } else {
        let summary = " طلب جديد من موقع اخوان فتوح:\n";
        cart.forEach((item) => {
            summary += `${item.qty} × ${item.name} — ${item.price} ج\n`;
        });
        summary += `المجموع: ${cart.reduce((s, it) => s + it.price * it.qty, 0)} ج`;
        summary += `\n\nالموقع: ${document.querySelector(".location").value || "غير محدد"}`;
        summary += `\nرقم الهاتف: ${document.querySelector(".phone").value || "غير محدد"}`;
        const msg = encodeURIComponent(summary);
        const waUrl = `https://wa.me/${PHONE}?text=${msg}`;
        window.open(waUrl, "_blank");
    }
});
cartToggle.addEventListener("click", () => {
    if (cartOfItems.style.display === "block") {
        cartOfItems.style.display = "none";
    } else {
        cartOfItems.style.display = "block";
    }
});
extraIcon.addEventListener("click", () => {
    if (sidextras.style.display === "block") {
        sidextras.style.display = "none";
    } else {
        sidextras.style.display = "block";
    }
});
window.onload = () => {
    cartOfItems.style.display = "none";
    sidextras.style.display = "none";
}