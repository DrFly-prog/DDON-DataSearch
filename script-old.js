// Tableau pour stocker les données de chaque zone
let allData = [];

// Fonction pour charger un fichier JSON
async function loadJSONFile(file) {
    const response = await fetch(file);
    const jsonData = await response.json();
    return jsonData;
}

// Fonction pour charger tous les fichiers JSON dans le dossier 'data'
async function loadAllData() {
    const zones = ["Bloodbane Isle", "Phindym"];
    allData = [];  // Réinitialiser les données

    // Charger chaque fichier JSON et concaténer les données
    for (const zone of zones) {
        const data = await loadJSONFile(`data/${zone}.json`);
        allData = allData.concat(data);
    }

    populateZoneFilter();  // Remplit le filtre de zone avec les données chargées
    displayAllData();      // Affiche toutes les données au chargement
}

// Fonction pour remplir le filtre de zone
function populateZoneFilter() {
    const zoneFilter = document.getElementById("zoneFilter");
    const zones = new Set(allData.map(item => item.Zone));
    
    zoneFilter.innerHTML = '<option value="all">All</option>';  // Réinitialise avec l'option "All"
    zones.forEach(zone => {
        const option = document.createElement("option");
        option.value = zone;
        option.textContent = zone;
        zoneFilter.appendChild(option);
    });
}

// Fonction pour afficher toutes les données
function displayAllData() {
    const resultsContainer = document.getElementById("results").querySelector("tbody");
    resultsContainer.innerHTML = "";  // Efface les résultats précédents

    allData.forEach(result => {
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

// Fonction de recherche par noms et filtrage par zone
function search() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const zoneFilter = document.getElementById("zoneFilter").value;

    const resultsContainer = document.getElementById("results").querySelector("tbody");
    resultsContainer.innerHTML = "";  // Efface les résultats précédents

    const searchTerms = input.split(',').map(term => term.trim()).filter(term => term.length > 0);

    const results = allData.filter(item => {
        const matchesName = searchTerms.some(term => item.Name.toLowerCase().includes(term));
        const matchesZone = zoneFilter === "all" || item.Zone === zoneFilter;
        return matchesName && matchesZone;
    });

    results.forEach(result => {
        const resultRow = document.createElement("tr");

        const isPhindym = Object.values(result).some(val => String(val) === "Phindym");
        
        if (isPhindym) {
            resultRow.classList.add("phindym");
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

// Charger les données et préparer la page au chargement
document.addEventListener("DOMContentLoaded", () => {
    loadAllData();
});

// Ajouter des écouteurs d'événements pour la recherche en temps réel
document.getElementById("searchInput").addEventListener("input", search);
document.getElementById("zoneFilter").addEventListener("change", search);