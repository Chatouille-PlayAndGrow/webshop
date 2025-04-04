// Fonction pour récupérer le panier depuis localStorage
function getPanier() {
    return JSON.parse(localStorage.getItem("panier")) || [];
}

// Fonction pour sauvegarder le panier dans localStorage
function savePanier(panier) {
    localStorage.setItem("panier", JSON.stringify(panier));
}

// Fonction pour ajouter un produit au panier
function ajouterAuPanier(produit) {
    let panier = getPanier();
    
    // Vérifie si le produit est déjà dans le panier
    let produitExistant = panier.find(item => item.id === produit.id);
    if (produitExistant) {
        produitExistant.quantite += 1;
    } else {
        produit.quantite = 1;
        panier.push(produit);
    }

    savePanier(panier);
    alert(produit.nom + " ajouté au panier !");
}

// Écoute les clics sur tous les boutons "Ajouter au panier"
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".button-panier").forEach(button => {
        button.addEventListener("click", function() {
            let produitElement = this.closest(".product");
            let produit = {
                id: produitElement.getAttribute("data-id"),
                nom: produitElement.getAttribute("data-nom"),
                prix: parseFloat(produitElement.getAttribute("data-prix"))
            };

            ajouterAuPanier(produit);
        });
    });

    // Vérifie si on est sur la page panier et affiche le panier
    if (document.getElementById("liste-panier")) {
        afficherPanier();
    }
});

// Fonction pour afficher le panier
function afficherPanier() {
    let panier = getPanier();
    let listePanier = document.getElementById("liste-panier");
    let totalElement = document.getElementById("total");
    
    listePanier.innerHTML = "";
    let total = 0;

     if (panier.length === 0) {
        // Ajoute une ligne dans le tbody si le panier est vide
        let ligneVide = document.createElement("tr");
        ligneVide.innerHTML = `<td colspan="5" class="panier-vide">Votre panier est vide</td>`;
        listePanier.appendChild(ligneVide);
    } else {
        panier.forEach((produit, index) => {
            let ligne = document.createElement("tr");
            ligne.innerHTML = `<td>${produit.nom}</td> <td>${produit.prix.toFixed(2)}€</td> <td>${produit.quantite}</td> <td>${(produit.prix * produit.quantite).toFixed(2)}€</td> <td><button onclick="supprimerProduit(${index})"><i class="bi bi-x-circle"></i></button></td>`;
            listePanier.appendChild(ligne);
            total += produit.prix * produit.quantite;
        });
    }
    
    totalElement.textContent = total.toFixed(2);
}

// Appel initial pour afficher le panier dès le chargement
document.addEventListener("DOMContentLoaded", afficherPanier);

// Fonction pour supprimer un produit du panier
function supprimerProduit(index) {
    let panier = getPanier();
    panier.splice(index, 1); // Supprime l'élément à cet index
    savePanier(panier);
    afficherPanier();
    mettreAJourCompteurPanier();
}

// Fonction pour récupérer les commandes depuis localStorage
function getCommandes() {
    return JSON.parse(localStorage.getItem("commandes")) || [];
}

// Fonction pour sauvegarder les commandes dans localStorage
function saveCommandes(commandes) {
    localStorage.setItem("commandes", JSON.stringify(commandes));
}

document.getElementById("commander").addEventListener("click", function() {
    let panier = getPanier();

    if (panier.length === 0) {
        alert("Votre panier est vide !");
    } else {
        alert("on est dans le else");
        fetch('http://localhost:3000/api/commandes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date,
                produits: panier,
                total
            })
        })
        .then(response => response.json())
        .then(data => {
            alert("Commande enregistrée et confirmée !");
            localStorage.removeItem("panier");
            window.location.reload();
        })
        .catch(error => {
            console.error('Erreur lors de l\'enregistrement de la commande :', error);
        });
        // Mettre à jour l'affichage du panier
        afficherPanier();
    }
});
