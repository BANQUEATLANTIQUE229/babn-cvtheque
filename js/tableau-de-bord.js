// ============================================================
// Tableau de bord RH — chargement, filtres, téléchargement des CV
// ============================================================

let toutesLesCandidatures = [];

// --- Protection de la page : vérifie que l'utilisateur est connecté ---
(async () => {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = 'connexion.html';
    return;
  }
  await chargerCandidatures();
})();

document.getElementById('btn-deconnexion').addEventListener('click', async () => {
  await supabaseClient.auth.signOut();
  window.location.href = 'connexion.html';
});

// --- Chargement des candidatures depuis Supabase ---
async function chargerCandidatures() {
  const { data, error } = await supabaseClient
    .from('candidatures')
    .select('*')
    .order('date_candidature', { ascending: false });

  if (error) {
    document.getElementById('zone-tableau').innerHTML = `
      <div class="etat-vide">
        <h3>Erreur de chargement</h3>
        <p>${error.message}</p>
      </div>`;
    return;
  }

  toutesLesCandidatures = data || [];
  mettreAJourStatistiques(toutesLesCandidatures);
  appliquerFiltres();
}

// --- Statistiques en haut de page ---
function mettreAJourStatistiques(liste) {
  document.getElementById('stat-total').textContent = liste.length;

  const uneSemaineAvant = new Date();
  uneSemaineAvant.setDate(uneSemaineAvant.getDate() - 7);
  const cetteSemaine = liste.filter(c => new Date(c.date_candidature) >= uneSemaineAvant);
  document.getElementById('stat-semaine').textContent = cetteSemaine.length;

  const domainesUniques = new Set(liste.map(c => c.domaine).filter(Boolean));
  document.getElementById('stat-domaines').textContent = domainesUniques.size;
}

// --- Filtres ---
document.getElementById('filtre-recherche').addEventListener('input', appliquerFiltres);
document.getElementById('filtre-domaine').addEventListener('change', appliquerFiltres);
document.getElementById('filtre-niveau').addEventListener('change', appliquerFiltres);

function appliquerFiltres() {
  const recherche = document.getElementById('filtre-recherche').value.toLowerCase().trim();
  const domaine = document.getElementById('filtre-domaine').value;
  const niveau = document.getElementById('filtre-niveau').value;

  let resultats = toutesLesCandidatures.filter(c => {
    const correspondRecherche = !recherche ||
      `${c.nom} ${c.prenom} ${c.email}`.toLowerCase().includes(recherche);
    const correspondDomaine = !domaine || c.domaine === domaine;
    const correspondNiveau = !niveau || c.niveau === niveau;
    return correspondRecherche && correspondDomaine && correspondNiveau;
  });

  document.getElementById('stat-affiches').textContent = resultats.length;
  document.getElementById('compteur-resultats').textContent =
    `${resultats.length} candidature${resultats.length !== 1 ? 's' : ''} affichée${resultats.length !== 1 ? 's' : ''}`;

  afficherTableau(resultats);
}

// --- Rendu du tableau ---
function afficherTableau(liste) {
  const zone = document.getElementById('zone-tableau');

  if (liste.length === 0) {
    zone.innerHTML = `
      <div class="etat-vide">
        <h3>Aucune candidature trouvée</h3>
        <p>Essayez de modifier vos filtres de recherche.</p>
      </div>`;
    return;
  }

  const lignes = liste.map(c => `
    <tr>
      <td>
        <div class="nom-candidat">${echapperHtml(c.prenom)} ${echapperHtml(c.nom)}</div>
      </td>
      <td>${echapperHtml(c.email)}</td>
      <td>${echapperHtml(c.telephone || '—')}</td>
      <td>${echapperHtml(c.ville || '—')}</td>
      <td><span class="badge-domaine">${echapperHtml(c.domaine || 'Non précisé')}</span></td>
      <td>${echapperHtml(c.niveau || '—')}</td>
      <td>${formaterDate(c.date_candidature)}</td>
      <td>
        <a href="#" class="lien-cv" data-chemin="${echapperHtml(c.cv_chemin)}" data-nom="${echapperHtml(c.cv_nom_original || 'cv.pdf')}">
          Télécharger
        </a>
      </td>
    </tr>
  `).join('');

  zone.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Candidat</th>
          <th>E-mail</th>
          <th>Téléphone</th>
          <th>Ville</th>
          <th>Domaine</th>
          <th>Niveau</th>
          <th>Date</th>
          <th>CV</th>
        </tr>
      </thead>
      <tbody>${lignes}</tbody>
    </table>
  `;

  // Attache les gestionnaires de téléchargement
  document.querySelectorAll('.lien-cv').forEach(lien => {
    lien.addEventListener('click', async (e) => {
      e.preventDefault();
      const chemin = lien.getAttribute('data-chemin');
      const nomFichier = lien.getAttribute('data-nom');
      await telechargerCv(chemin, nomFichier, lien);
    });
  });
}

// --- Téléchargement d'un CV depuis le stockage Supabase ---
async function telechargerCv(chemin, nomFichier, elementLien) {
  const texteOriginal = elementLien.textContent;
  elementLien.textContent = 'Chargement...';

  const { data, error } = await supabaseClient
    .storage
    .from('cvs')
    .download(chemin);

  if (error) {
    alert("Impossible de télécharger ce CV : " + error.message);
    elementLien.textContent = texteOriginal;
    return;
  }

  const url = URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = nomFichier;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  elementLien.textContent = texteOriginal;
}

// --- Utilitaires ---
function formaterDate(dateIso) {
  if (!dateIso) return '—';
  const d = new Date(dateIso);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function echapperHtml(texte) {
  if (texte === null || texte === undefined) return '';
  const div = document.createElement('div');
  div.textContent = texte;
  return div.innerHTML;
}
