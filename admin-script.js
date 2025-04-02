// --- Gestion de la page Admin et des commandes --- //
// Fonction pour récupérer les commandes depuis localStorage
function getCommandes() {
    return JSON.parse(localStorage.getItem("commandes")) || [];
}

// Fonction pour sauvegarder les commandes dans localStorage
function saveCommandes(commandes) {
    localStorage.setItem("commandes", JSON.stringify(commandes));
}

// Fonction pour afficher les commandes dans le tableau admin
function afficherCommandes() {
    let commandes = getCommandes();
    let tableBody = document.getElementById("liste-commandes");
    tableBody.innerHTML = "";

    if (commandes.length === 0) {
        let ligneVide = document.createElement("tr");
        ligneVide.innerHTML = `<td colspan="4" class="commande-vide">Aucune commande en attente</td>`;
        tableBody.appendChild(ligneVide);
    } else {
        commandes.forEach((commande, index) => {
            let ligne = document.createElement("tr");
            ligne.innerHTML = `
                <td>${commande.client}</td>
                <td>${commande.details}</td>
                <td>
                    <select onchange="changerStatut(${index}, this.value)">
                        <option value="En attente" ${commande.statut === "En attente" ? "selected" : ""}>En attente</option>
                        <option value="Expédiée" ${commande.statut === "Expédiée" ? "selected" : ""}>Expédiée</option>
                        <option value="Annulée" ${commande.statut === "Annulée" ? "selected" : ""}>Annulée</option>
                    </select>
                </td>
                <td><button onclick="supprimerCommande(${index})"><i class="bi bi-trash"></i></button></td>
            `;
            tableBody.appendChild(ligne);
        });
    }
}

// Fonction pour changer le statut d'une commande
function changerStatut(index, nouveauStatut) {
    let commandes = getCommandes();
    commandes[index].statut = nouveauStatut;
    saveCommandes(commandes);
}

// Fonction pour supprimer une commande
function supprimerCommande(index) {
    let commandes = getCommandes();
    commandes.splice(index, 1); // Supprime la commande
    saveCommandes(commandes);
    afficherCommandes(); // Met à jour l'affichage
}

// Charger les commandes au démarrage
document.addEventListener("DOMContentLoaded", afficherCommandes);
