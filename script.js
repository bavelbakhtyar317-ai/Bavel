// ====== EDIT YOUR GAMES HERE ======
const games = [
  { id: 1, title: "Neon Drifter",    genre: "Racing",    price: 29.99, old: 39.99, colors: ["#ff0080", "#7928ca"] },
  { id: 2, title: "Realm of Embers", genre: "RPG",       price: 49.99, old: null,  colors: ["#f97316", "#b91c1c"] },
  { id: 3, title: "Star Outpost",    genre: "Strategy",  price: 24.99, old: 34.99, colors: ["#0ea5e9", "#1e3a8a"] },
  { id: 4, title: "Shadow Circuit",  genre: "Action",    price: 39.99, old: null,  colors: ["#10b981", "#064e3b"] },
  { id: 5, title: "Pocket Farmers",  genre: "Casual",    price: 14.99, old: 19.99, colors: ["#facc15", "#65a30d"] },
  { id: 6, title: "Skyward Blades",  genre: "Action",    price: 44.99, old: null,  colors: ["#a78bfa", "#312e81"] },
  { id: 7, title: "Deep Abyss",      genre: "Adventure", price: 34.99, old: 44.99, colors: ["#06b6d4", "#0f172a"] },
  { id: 8, title: "Kingdom Tactics", genre: "Strategy",  price: 27.99, old: null,  colors: ["#f43f5e", "#881337"] },
];
// ==================================

const $ = (id) => document.getElementById(id);
let category = "All";
let query = "";
let cart = [];
try { cart = JSON.parse(localStorage.getItem("cart")) || []; } catch (e) {}

const money = (n) => "$" + n.toFixed(2);
const save = () => { try { localStorage.setItem("cart", JSON.stringify(cart)); } catch (e) {} };

function renderFilters() {
  const cats = ["All", ...new Set(games.map((g) => g.genre))];
  $("filters").innerHTML = cats
    .map((c) => `<button class="chip ${c === category ? "active" : ""}" data-cat="${c}">${c}</button>`)
    .join("");
}

function renderGrid() {
  const list = games.filter(
    (g) => (category === "All" || g.genre === category) && g.title.toLowerCase().includes(query)
  );
  $("empty").hidden = list.length > 0;
  $("grid").innerHTML = list
    .map((g) => {
      const off = g.old ? Math.round((1 - g.price / g.old) * 100) : 0;
      return `<article class="card">
        <div class="cover" style="background:linear-gradient(135deg,${g.colors[0]},${g.colors[1]})">
          ${off ? `<span class="badge">-${off}%</span>` : ""}${g.title}
        </div>
        <div class="info">
          <span class="genre">${g.genre}</span>
          <div class="price-row">
            <span class="price">${money(g.price)}${g.old ? `<span class="old">${money(g.old)}</span>` : ""}</span>
            <button class="add" data-add="${g.id}">Add</button>
          </div>
        </div>
      </article>`;
    })
    .join("");
}

function renderCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.qty * games.find((g) => g.id === i.id).price, 0);
  $("cartCount").textContent = count;
  $("cartTotal").textContent = money(total);
  $("cartItems").innerHTML = cart.length
    ? cart
        .map((i) => {
          const g = games.find((x) => x.id === i.id);
          return `<div class="line">
            <div>${g.title}<br><small>${money(g.price)}</small></div>
            <div class="qty">
              <button data-dec="${g.id}">-</button><span>${i.qty}</span><button data-inc="${g.id}">+</button>
            </div>
          </div>`;
        })
        .join("")
    : '<p class="empty">Your cart is empty.</p>';
  save();
}

function change(id, d) {
  const item = cart.find((i) => i.id === id);
  if (!item) { if (d > 0) cart.push({ id, qty: 1 }); }
  else { item.qty += d; if (item.qty <= 0) cart = cart.filter((i) => i.id !== id); }
  renderCart();
}

function toggleCart(open) {
  $("drawer").classList.toggle("open", open);
  $("overlay").classList.toggle("show", open);
}

document.addEventListener("click", (e) => {
  const t = e.target;
  if (t.dataset.cat) { category = t.dataset.cat; renderFilters(); renderGrid(); }
  if (t.dataset.add) { change(+t.dataset.add, 1); toggleCart(true); }
  if (t.dataset.inc) change(+t.dataset.inc, 1);
  if (t.dataset.dec) change(+t.dataset.dec, -1);
});
$("search").addEventListener("input", (e) => { query = e.target.value.toLowerCase(); renderGrid(); });
$("cartBtn").addEventListener("click", () => toggleCart(true));
$("closeCart").addEventListener("click", () => toggleCart(false));
$("overlay").addEventListener("click", () => toggleCart(false));
$("checkout").addEventListener("click", () => {
  alert("Demo checkout. Connect Stripe or PayPal to accept real payments.");
});

renderFilters();
renderGrid();
renderCart();
