// Déclarez le tableau global des zones disponibles
const zones = ["Bloodbane Isle", "Phindym", "Misc", "Breya Coast", "Volden Mines", "Dowe Valley", "Mysree Grove", "Deenan Woods", "Betland Plains", "N.Betland Plains"]; // Assurez-vous que ces noms correspondent aux fichiers JSON dans le dossier 'data'

// Variable globale pour stocker les données actuellement chargées
let currentData = [];

// Fonction pour charger un fichier JSON en fonction de la zone sélectionnée
async function loadDataForZone(zone) {
    const resultsContainer = document.getElementById("results").querySelector("tbody");
    resultsContainer.innerHTML = "";  // Efface les résultats précédents

    // Si "all" est sélectionné, charger toutes les zones
    if (zone === "all") {
        await loadAllData();
    } else {
        try {
            const response = await fetch(`data/${zone}.json`);
            currentData = await response.json();  // Stocke les données chargées dans currentData
            displayData(currentData);
        } catch (error) {
            console.error("Erreur lors du chargement des données pour la zone:", error);
        }
    }
}

// Fonction pour afficher les données dans le tableau
function displayData(data) {
    const resultsContainer = document.getElementById("results").querySelector("tbody");
    resultsContainer.innerHTML = "";  // Efface le tableau avant d'afficher les nouvelles données

    data.forEach(result => {
        const resultRow = document.createElement("tr");

        // Vérifie si l'une des valeurs est exactement "Phindym"
        const isPhindym = Object.values(result).some(val => String(val) === "Phindym");
        
        if (isPhindym) {
            resultRow.classList.add("phindym");  // Applique la classe spéciale
        }

        resultRow.innerHTML = `
            <td>${result.Name}</td>
            <td>${result.Item}</td>
            <td>${result.From}</td>
            <td>${result.Zone}</td>
            <td>${result.Maps}</td>
        `;
        resultsContainer.appendChild(resultRow);
    });
}

// Fonction pour charger toutes les zones au chargement de la page
async function loadAllData() {
    currentData = [];  // Réinitialise les données chargées

    for (const zone of zones) {
        try {
            const response = await fetch(`data/${zone}.json`);
            const data = await response.json();
            currentData = currentData.concat(data);  // Ajoute chaque zone aux données actuelles
        } catch (error) {
            console.error("Erreur lors du chargement des données pour la zone:", error);
        }
    }
    displayData(currentData);  // Affiche toutes les données dans le tableau
}

// Fonction de recherche en temps réel avec plusieurs noms
function search() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();

    // Divise l'entrée en plusieurs noms, en supprimant les espaces autour de chaque nom
    const searchTerms = searchInput.split(",").map(term => term.trim()).filter(term => term);

    // Filtre les données actuelles : conserve les résultats qui correspondent à au moins un des noms
    const filteredData = currentData.filter(result =>
        searchTerms.some(term => result.Name.toLowerCase().includes(term))
    );
    
    // Affiche les données filtrées
    displayData(filteredData);
}

// Fonction pour initialiser le menu déroulant des zones
function initializeZoneFilter() {
    const zoneFilter = document.getElementById("zoneFilter");

    // Ajoute une option pour chaque zone disponible
    zones.forEach(zone => {
        const option = document.createElement("option");
        option.value = zone;
        option.textContent = zone.charAt(0).toUpperCase() + zone.slice(1);
        zoneFilter.appendChild(option);
    });

    // Écouteur d'événement pour détecter les changements dans le filtre de zone
    zoneFilter.addEventListener("change", (event) => {
        loadDataForZone(event.target.value);
    });
}

// Charger toutes les données et initialiser le filtre de zone au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    initializeZoneFilter();
    loadAllData();  // Charger toutes les données par défaut
});

// Ajouter un écouteur pour la recherche en temps réel
document.getElementById("searchInput").addEventListener("input", search);