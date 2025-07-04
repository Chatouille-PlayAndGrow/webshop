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
            // Création de la liste déroulante des quantités
            let options = "";
            for (let i = 1; i <= 10; i++) {
                options += `<option value="${i}" ${i === produit.quantite ? 'selected' : ''}>${i}</option>`;
            }
            ligne.innerHTML = `<td>${produit.nom}</td> <td>${produit.prix.toFixed(2)}€</td> <td><select onchange="modifierQuantite(${index}, this.value)"> ${options} </select></td> <td>${(produit.prix * produit.quantite).toFixed(2)}€</td> <td><button onclick="supprimerProduit(${index})"><i class="bi bi-x-circle"></i></button></td>`;
            listePanier.appendChild(ligne);
            total += produit.prix * produit.quantite;
        });
    }
    
    totalElement.textContent = total.toFixed(2);
}

// Appel initial pour afficher le panier dès le chargement
document.addEventListener("DOMContentLoaded", afficherPanier);

// Fct pour modifier la quantité d'un produit
function modifierQuantite(index, nouvelleQuantite) {
    let panier = getPanier();
    nouvelleQuantite = parseInt(nouvelleQuantite);

    if (nouvelleQuantite >= 1) {
        panier[index].quantite = nouvelleQuantite;
        localStorage.setItem("panier", JSON.stringify(panier));
        afficherPanier(); // recharge l'affichage
    }
}

// Fonction pour supprimer un produit du panier
function supprimerProduit(index) {
    let panier = getPanier();
    panier.splice(index, 1); // Supprime l'élément à cet index
    savePanier(panier);
    afficherPanier();
    mettreAJourCompteurPanier();
}

document.getElementById("commander").addEventListener("click", function() {
    let panier = getPanier();

    if (panier.length === 0) {
        alert("Votre panier est vide !");
        return;
    }

    // Récupération des infos client
    let nom = document.getElementById("client-nom").value.trim();
    let email = document.getElementById("client-email").value.trim();
    let adresse = document.getElementById("client-adresse").value.trim();

    if (!nom || !email || !adresse) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
    }

    // Créer le contenu de l'email
    let contenu = panier.map(p =>
        `${p.nom} - ${p.quantite} x ${p.prix.toFixed(2)}€ = ${(p.quantite * p.prix).toFixed(2)}€`
    ).join("\n");

    let total = panier.reduce((t, p) => t + p.prix * p.quantite, 0).toFixed(2);
    
    // Envoyer l'email avec EmailJS
    emailjs.send("service_wwi2hca", "template_8qiiggq", {
        produits: contenu,
        total: total,
        email: email,
        nom: nom,
        adresse: adresse
    })
        
    .then(function () {
        // Vider panier
        localStorage.removeItem("panier");
        afficherPanier();
    
        // Masquer le formulaire et le bouton en modifiant le style
        document.getElementById("form-client").style.display = "none";
        document.querySelector(".commande-container").style.display = "none";
    
        // Réinitialiser le formulaire au cas où
        document.getElementById("form-client").reset();
    
        // Afficher le message de confirmation
        const messageDiv = document.getElementById("confirmation-message");
        messageDiv.style.display = "block";
    }, function (error) {
        console.error("Erreur:", error);
        alert("Erreur lors de l'envoi de l'email.");
    });
});
