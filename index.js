// Sélectionne les conteneurs HTML pour afficher les desserts et le panier
const dessertsContainer = document.getElementById("desserts");
const panierContainer = document.getElementById("panier");
const cartCountElement = document.querySelector(".panier-ctn h3");
const totalOrderElement = document.getElementById("total-order");
const orderConfirmation = document.querySelector(".order-confirmation");
const confirmedItemsContainer = document.getElementById("confirmed-items");

// Initialise un tableau pour stocker les articles ajoutés au panier
let panier = [];

// Fonction asynchrone pour récupérer les données des desserts depuis un fichier JSON
async function fetchDesserts() {
  try {
    const response = await fetch("./data.json");
    const desserts = await response.json();
    displayDesserts(desserts);
  } catch (error) {
    console.error("Erreur lors de la récupération des desserts :", error);
  }
}

// Fonction pour afficher la liste des desserts
function displayDesserts(desserts) {
  desserts.forEach((dessert) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="card-card">
        <img src="${dessert.image.mobile}" alt="${dessert.name}">
        <h4>${dessert.category}</h4>
        <h3>${dessert.name}</h3>
        <p>Prix: ${dessert.price}$</p>
        <div class="btn-container">
          <button id="add-${dessert.name}" class="add-to-cart-button">
            <img src="/assets/images/icon-add-to-cart.svg" alt="Add to cart">
            <p>Add to cart</p>
          </button>
        </div>
      </div>
    `;
    dessertsContainer.appendChild(card);

    // Ajouter un événement pour chaque bouton "Add to cart"
    document
      .getElementById(`add-${dessert.name}`)
      .addEventListener("click", () => {
        addToPanier(dessert.name, dessert.price, dessert.image.mobile);
      });
  });
}

// Fonction pour ajouter un dessert au panier
function addToPanier(name, price, image) {
  const existingItem = panier.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    panier.push({ name, price, quantity: 1, image });
  }
  displayPanier();
  updateCartCount();
  updateTotalPrice();
}

// Fonction pour afficher le contenu du panier
function displayPanier() {
  const emptyCard = document.querySelector(".empty-card");
  const emptyText = document.querySelector(".empty-text");

  emptyCard.style.display = panier.length > 0 ? "none" : "block";
  emptyText.style.display = panier.length > 0 ? "none" : "block";

  panierContainer.innerHTML = "";

  panier.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "panier-item";
    const totalPrice = item.price * item.quantity;

    itemDiv.innerHTML = `
      <div class="panier-order">
        <div>
          <h4>${item.name}</h4>
          <p>
            <span class="item-quantity">${item.quantity} x</span> 
            <span class="item-price-unit">@$${item.price}</span> - 
            <span class="total-units">$${totalPrice}</span>
          </p>
        </div>
        <button onclick="removeFromPanier(${index})">X</button>
      </div>
    `;
    panierContainer.appendChild(itemDiv);
  });
}

// Fonction pour supprimer un article du panier
function removeFromPanier(index) {
  panier.splice(index, 1);
  displayPanier();
  updateCartCount();
  updateTotalPrice();
}

// Fonction pour mettre à jour le compteur d'articles dans le panier
function updateCartCount() {
  const totalItems = panier.reduce((acc, item) => acc + item.quantity, 0);
  cartCountElement.textContent = `Your Cart (${totalItems})`;
}

// Fonction pour mettre à jour le total de la commande
function updateTotalPrice() {
  const totalPrice = panier.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  totalOrderElement.textContent = `$${totalPrice}`;
}

// Fonction pour afficher la confirmation de commande avec les articles sélectionnés
function confirmOrder() {
  confirmedItemsContainer.innerHTML = ""; // Efface les articles précédents
  let orderTotal = 0; // Initialiser le total de la commande

  panier.forEach((item) => {
    const confirmedItem = document.createElement("div");
    confirmedItem.className = "confirmed-item"; // Classe pour le style

    const itemTotalPrice = item.price * item.quantity; // Calcul du prix total pour l'article
    orderTotal += itemTotalPrice; // Ajouter au total de la commande

    confirmedItem.innerHTML = `
    <div class="confirm-order-list">
      <div class="confirm-order-card-ctn">
        <img class="confirm-dessert-img" src="${item.image}" alt="${item.name}">
        <div class="confirm-dessert-text">
          <h5>${
            item.name.length > 10 ? item.name.slice(0, 10) + "..." : item.name
          }</h5>
          <div class="confirm-dessert-price">
            <p>${item.quantity} x $${item.price}</p>
          </div>   
        </div>
        <p class="confirm-order-total-item-price">$${itemTotalPrice}</p>
      </div>
    </div>
  `;

    confirmedItemsContainer.appendChild(confirmedItem);
  });

  // Afficher le total de la commande
  const totalElement = document.createElement("div");
  totalElement.className = "order-total"; // Classe pour le style
  totalElement.innerHTML = `
  <div class="confirmed-total-order-confirmation">
  <h4>Order Total</h4>
  <p>$${orderTotal.toFixed(2)}</p>
  </div>`; // Affichage du total

  confirmedItemsContainer.appendChild(totalElement); // Ajouter le total au conteneur

  // Ajouter un bouton pour commencer une nouvelle commande
  const newOrderButton = document.createElement("button");
  newOrderButton.textContent = "Start New Order";
  newOrderButton.className = "start-new-order"; // Classe pour le style
  newOrderButton.onclick = startNewOrder; // Lier à la fonction pour commencer une nouvelle commande

  confirmedItemsContainer.appendChild(newOrderButton); // Ajouter le bouton au conteneur

  orderConfirmation.style.display = "flex"; // Affiche l'écran de confirmation
}

// Fonction pour commencer une nouvelle commande
function startNewOrder() {
  panier = []; // Réinitialiser le panier
  displayPanier(); // Mettre à jour l'affichage du panier
  updateCartCount(); // Mettre à jour le compteur d'articles
  updateTotalPrice(); // Mettre à jour le total de la commande
  closeConfirmation(); // Fermer l'écran de confirmation
}

// Fonction pour masquer la confirmation de commande
function closeConfirmation() {
  orderConfirmation.style.display = "none"; // Assurez-vous que l'élément est masqué
}

// Ajoute un événement pour le bouton de confirmation de commande
document
  .getElementById("confirm-order")
  .addEventListener("click", confirmOrder);

// Assurez-vous que la confirmation de commande est masquée au début
orderConfirmation.style.display = "none";

// Optionnel : ajouter un bouton de fermeture sur l'écran de confirmation
orderConfirmation.addEventListener("click", closeConfirmation);

// Appelle la fonction pour récupérer et afficher les desserts dès le chargement de la page
fetchDesserts();
