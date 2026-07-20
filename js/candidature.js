// ============================================================
// Gestion du formulaire de candidature — envoi vers Supabase
// ============================================================

const form = document.getElementById('form-candidature');
const btnEnvoyer = document.getElementById('btn-envoyer');
const msgSucces = document.getElementById('msg-succes');
const msgErreur = document.getElementById('msg-erreur');
const zoneUpload = document.getElementById('zone-upload');
const inputCv = document.getElementById('cv');
const fichierChoisi = document.getElementById('fichier-choisi');

// Affiche le nom du fichier sélectionné
inputCv.addEventListener('change', () => {
  if (inputCv.files.length > 0) {
    const fichier = inputCv.files[0];
    const tailleMo = (fichier.size / (1024 * 1024)).toFixed(2);
    fichierChoisi.textContent = `✓ ${fichier.name} (${tailleMo} Mo)`;
    fichierChoisi.style.display = 'block';
    zoneUpload.classList.add('survol');
  } else {
    fichierChoisi.style.display = 'none';
    zoneUpload.classList.remove('survol');
  }
});

// Génère un nom de fichier sûr et unique pour le stockage
function genererNomFichier(nomOriginal, nom, prenom) {
  const extension = nomOriginal.split('.').pop();
  const horodatage = Date.now();
  const nomPropre = `${prenom}-${nom}`.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // enlève les accents
    .replace(/[^a-z0-9]+/g, '-');
  return `${horodatage}-${nomPropre}.${extension}`;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  msgSucces.classList.remove('visible');
  msgErreur.classList.remove('visible');

  const fichier = inputCv.files[0];

  // Validations
  if (!fichier) {
    afficherErreur("Merci de joindre votre CV au format PDF.");
    return;
  }
  if (fichier.type !== 'application/pdf') {
    afficherErreur("Le fichier doit être au format PDF.");
    return;
  }
  if (fichier.size > 5 * 1024 * 1024) {
    afficherErreur("Le fichier ne doit pas dépasser 5 Mo.");
    return;
  }

  const donnees = {
    nom: document.getElementById('nom').value.trim(),
    prenom: document.getElementById('prenom').value.trim(),
    email: document.getElementById('email').value.trim(),
    telephone: document.getElementById('telephone').value.trim(),
    ville: document.getElementById('ville').value.trim(),
    domaine: document.getElementById('domaine').value,
    niveau: document.getElementById('niveau').value,
    diplome: document.getElementById('diplome').value.trim(),
    message: document.getElementById('message').value.trim(),
  };

  btnEnvoyer.disabled = true;
  btnEnvoyer.textContent = 'Envoi en cours...';

  try {
    // 1. Upload du CV dans le stockage Supabase
    const nomFichier = genererNomFichier(fichier.name, donnees.nom, donnees.prenom);
    const { data: uploadData, error: erreurUpload } = await supabaseClient
      .storage
      .from('cvs')
      .upload(nomFichier, fichier, {
        cacheControl: '3600',
        upsert: false
      });

    if (erreurUpload) throw erreurUpload;

    // 2. Enregistrement des données du candidat dans la base
    const { error: erreurInsert } = await supabaseClient
      .from('candidatures')
      .insert([{
        ...donnees,
        cv_chemin: nomFichier,
        cv_nom_original: fichier.name,
        date_candidature: new Date().toISOString()
      }]);

    if (erreurInsert) throw erreurInsert;

    // Succès
    msgSucces.classList.add('visible');
    msgSucces.scrollIntoView({ behavior: 'smooth', block: 'center' });
    form.reset();
    fichierChoisi.style.display = 'none';
    zoneUpload.classList.remove('survol');

  } catch (erreur) {
    console.error('Erreur lors de la soumission :', erreur);
    afficherErreur("Une erreur est survenue lors de l'envoi. Merci de réessayer dans quelques instants.");
  } finally {
    btnEnvoyer.disabled = false;
    btnEnvoyer.textContent = 'Envoyer ma candidature';
  }
});

function afficherErreur(texte) {
  msgErreur.textContent = `✕ ${texte}`;
  msgErreur.classList.add('visible');
  msgErreur.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
