// Récupérer le formulaire
const form = document.getElementById('item-form');

// Ajouter un écouteur d'événements pour la soumission du formulaire
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Récupérer les valeurs des champs du formulaire
  const name = document.getElementById('name').value;
  const quantity = document.getElementById('quantity').value;
  const price = document.getElementById('price').value;
  const image = document.getElementById('image').value;

  // Afficher les valeurs récupérées dans la console
  console.log('Name:', name);
  console.log('Quantity:', quantity);
  console.log('Price:', price);
  console.log('Image:', image);

  // Envoyer les données du formulaire à l'API
  try {
    const response = await fetch('http://127.0.0.1:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, quantity, price, image })
    });

    const data = await response.json();
    console.log('Response data:', data);
    // Rafraîchir getProducts après l'ajout d'un produit
    getProducts();
  } catch (error) {
    console.error('Error:', error);
  }
});

// Récupérer la liste des éléments
const itemList = document.getElementById('item-list');

// Fonction pour récupérer les produits de l'API
async function getProducts() {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/products');
    const data = await response.json();
    console.log('Response data:', data);
    // Parcourez la liste des produits et affichez-les dans la liste HTML
    itemList.innerHTML = '';
    data.forEach(product => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${product.name}</span>
        <span>${product.quantity}</span>
        <span>${product.price}</span>
        <img class="product-image" src="${product.image}" alt="${product.name}"> 
        <button class="delete-btn" data-product-id="${product._id}">Supprimer</button>
        <button class="update-btn" data-product-id="${product._id}">Modifier</button>
      `;
      itemList.appendChild(li);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// Appeler la fonction getProducts() au chargement de la page
window.addEventListener('load', getProducts);

// Ajouter un écouteur d'événements pour le clic sur le bouton "Supprimer"
itemList.addEventListener('click', async (event) => {
  if (event.target.classList.contains('delete-btn')) {
    const productId = event.target.dataset.productId; // Récupérer l'ID du produit à supprimer
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/products/${productId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      console.log(`Response data:`, data);
      // Supprimer le produit de la liste
      event.target.parentElement.remove();
    } catch (error) {
        console.error('Error:', error);
      }
    }
  });

// Ajouter un écouteur d'événements pour le clic sur le bouton "Modifier"
itemList.addEventListener('click', async (event) => {
  if (event.target.classList.contains('update-btn')) {
    const productId = event.target.dataset.productId; // Récupérer l'ID du produit à modifier
    const li = event.target.parentElement;
    const name = li.querySelector('span:nth-child(1)').textContent;
    const quantity = li.querySelector('span:nth-child(2)').textContent;
    const price = li.querySelector('span:nth-child(3)').textContent;
    const image = li.querySelector('img').src;

    // Afficher un formulaire pour modifier les informations du produit
    li.innerHTML = `
      <form>
        <input type="text" name="name" value="${name}">
        <input type="number" name="quantity" value="${quantity}">
        <input type="number" name="price" value="${price}">
        <input type="text" name="image" value="${image}">
        <button type="submit">Enregistrer</button>
      </form>
    `;

    // Ajouter un écouteur d'événements pour la soumission du formulaire de modification
    li.querySelector('form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const newName = li.querySelector('input[name="name"]').value;
      const newQuantity = li.querySelector('input[name="quantity"]').value;
      const newPrice = li.querySelector('input[name="price"]').value;
      const newImage = li.querySelector('input[name="image"]').value;

      // Envoyer les nouvelles données à l'API
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/products/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: newName, quantity: newQuantity, price: newPrice, image: newImage })
        });
        const data = await response.json();
        console.log(`Response data:`, data);
        // Rafraîchir la liste des produits
        getProducts();
      } catch (error) {
        console.error('Error:', error);
      }
    });
  }
});
