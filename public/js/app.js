// Récupérer le formulaire
const form = document.getElementById('item-form');

// Fonction pour afficher un message d'erreur
function showError(message) {
  // Vérifier si un message d'erreur existe déjà
  const existingError = document.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.style.color = 'red';
  errorDiv.style.marginBottom = '10px';
  errorDiv.textContent = message;
  
  // Insérer le message d'erreur avant le formulaire
  form.parentNode.insertBefore(errorDiv, form);
  
  // Faire disparaître le message après 5 secondes
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

// Ajouter un écouteur d'événements pour la soumission du formulaire
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Récupérer les valeurs des champs du formulaire
  const name = document.getElementById('name').value.trim();
  const quantity = document.getElementById('quantity').value.trim();
  const price = document.getElementById('price').value.trim();
  const image = document.getElementById('image').value.trim();

  // Validation côté client
  if (!name) {
    showError('Le nom du produit est requis');
    return;
  }
  
  if (price === '' || isNaN(Number(price)) || Number(price) <= 0) {
    showError('Le prix doit être un nombre positif');
    return;
  }

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
      body: JSON.stringify({ 
        name, 
        quantity: quantity || 0, 
        price, 
        image 
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      // Afficher le message d'erreur
      showError(data.message || 'Une erreur est survenue');
      return;
    }
    
    console.log('Response data:', data);
    
    // Réinitialiser le formulaire
    form.reset();
    
    // Rafraîchir getProducts après l'ajout d'un produit
    getProducts();
  } catch (error) {
    console.error('Error:', error);
    showError('Erreur de connexion au serveur');
  }
});

// Récupérer la liste des éléments
const itemList = document.getElementById('item-list');

// Fonction pour récupérer les produits de l'API
async function getProducts() {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/products');
    
    if (!response.ok) {
      const errorData = await response.json();
      showError(errorData.message || 'Erreur lors du chargement des produits');
      return;
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    // Parcourez la liste des produits et affichez-les dans la liste HTML
    itemList.innerHTML = '';
    
    if (data.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'Aucun produit disponible';
      itemList.appendChild(emptyMessage);
      return;
    }
    
    data.forEach(product => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${product.name}</span>
        <span>${product.quantity}</span>
        <span>${product.price}</span>
        <img class="product-image" src="${product.image}" alt="${product.name}"> 
        <button class="delete-btn" data-product-id="${product.id}">Supprimer</button>
        <button class="update-btn" data-product-id="${product.id}">Modifier</button>
      `;
      itemList.appendChild(li);
    });
  } catch (error) {
    console.error('Error:', error);
    showError('Erreur de connexion au serveur');
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
      
      if (!response.ok) {
        const errorData = await response.json();
        showError(errorData.message || 'Erreur lors de la suppression');
        return;
      }
      
      const data = await response.json();
      console.log(`Response data:`, data);
      // Supprimer le produit de la liste
      event.target.parentElement.remove();
    } catch (error) {
      console.error('Error:', error);
      showError('Erreur de connexion au serveur');
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
      <form class="edit-form">
        <input type="text" name="name" value="${name}" required>
        <input type="number" name="quantity" value="${quantity}" min="0">
        <input type="number" name="price" value="${price}" step="0.01" min="0.01" required>
        <input type="text" name="image" value="${image}">
        <button type="submit">Enregistrer</button>
        <button type="button" class="cancel-btn">Annuler</button>
      </form>
    `;

    // Ajouter un écouteur pour le bouton annuler
    li.querySelector('.cancel-btn').addEventListener('click', () => {
      getProducts(); // Recharger la liste complète
    });

    // Ajouter un écouteur d'événements pour la soumission du formulaire de modification
    li.querySelector('form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const newName = li.querySelector('input[name="name"]').value.trim();
      const newQuantity = li.querySelector('input[name="quantity"]').value.trim();
      const newPrice = li.querySelector('input[name="price"]').value.trim();
      const newImage = li.querySelector('input[name="image"]').value.trim();

      // Validation côté client
      if (!newName) {
        showError('Le nom du produit est requis');
        return;
      }
      
      if (newPrice === '' || isNaN(Number(newPrice)) || Number(newPrice) <= 0) {
        showError('Le prix doit être un nombre positif');
        return;
      }

      // Envoyer les nouvelles données à l'API
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/products/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            name: newName, 
            quantity: newQuantity || 0, 
            price: newPrice, 
            image: newImage 
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          showError(errorData.message || 'Erreur lors de la mise à jour');
          return;
        }
        
        const data = await response.json();
        console.log(`Response data:`, data);
        // Rafraîchir la liste des produits
        getProducts();
      } catch (error) {
        console.error('Error:', error);
        showError('Erreur de connexion au serveur');
      }
    });
  }
});
