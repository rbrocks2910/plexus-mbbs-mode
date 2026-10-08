/**
 * @file firstYearTopics.ts
 * @description Master catalog of every single topic from 1st year.pdf across Anatomy, Physiology, and Biochemistry.
 * Directly powers the question database, simulation case picker, and university exam model answers.
 */

export interface MasterTopicItem {
  id: string;
  subject: 'anatomy' | 'physiology' | 'biochemistry';
  subdivision: string;
  type: 'SN' | 'LAQ';
  name: string;
  importance: number; // 0 to 4 stars
  clinicalDiagnosis: string;
  complaint: string;
  history: string;
  universityQuestion: string;
  highYieldAnswer: string;
}

// --------------------------------------------------------------------------
// 1. ANATOMY TOPICS (Pages 1-6 of 1st year.pdf)
// --------------------------------------------------------------------------
export const ANATOMY_MASTER_TOPICS: MasterTopicItem[] = [
  // HNF - SN
  {
    id: 'anat-hnf-1',
    subject: 'anatomy',
    subdivision: 'Head, Neck & Face (HNF)',
    type: 'SN',
    name: 'Digastric Triangle',
    importance: 0,
    clinicalDiagnosis: 'Submandibular Sialadenitis in Digastric Triangle',
    complaint: 'Painful right submandibular swelling worsening with meals',
    history: 'A 35-year-old male presents with tender swelling below the body of the mandible. Examination reveals tender submandibular gland with purulent discharge from Wharton duct.',
    universityQuestion: 'Describe the Digastric Triangle under: Boundaries, Contents, and Applied Anatomy.',
    highYieldAnswer: `### Digastric Triangle (Model Answer)
* **Boundaries:** Anterosuperiorly: lower border of mandible and line to mastoid process; Anteroinferiorly: anterior belly of digastric; Posteroinferiorly: posterior belly of digastric and stylohyoid. Roof: investing deep cervical fascia, platysma, cervical branch of CN VII. Floor: mylohyoid and hyoglossus.
* **Contents:** Submandibular salivary gland & lymph nodes, facial artery & vein, lingual nerve, submandibular ganglion, hypoglossal nerve (CN XII), mylohyoid nerve/vessels.
* **Applied Anatomy:** Submandibular sialolithiasis causing postprandial colic; surgical incision placed 2.5 cm below mandible to avoid marginal mandibular nerve.`
  },
  {
    id: 'anat-hnf-2',
    subject: 'anatomy',
    subdivision: 'Head, Neck & Face (HNF)',
    type: 'SN',
    name: 'Nasal Septum',
    importance: 1,
    clinicalDiagnosis: 'Deviated Nasal Septum with Epistaxis',
    complaint: 'Chronic left-sided nasal blockage and recurrent bleeding from anterior septum',
    history: 'A 22-year-old athlete presents with unilateral nasal obstruction and episodes of bleeding from Little\'s area following nasal trauma.',
    universityQuestion: 'Describe the Nasal Septum under: Skeletal framework, Blood supply (Little\'s area), and Clinical Significance.',
    highYieldAnswer: `### Nasal Septum (Model Answer)
* **Skeletal Framework:** Bony part: Perpendicular plate of ethmoid (posterosuperior) and Vomer (posteroinferior). Cartilaginous: Septal cartilage and medial crus of greater alar cartilage. Cuticular: Fibrofatty tissue (columella).
* **Arterial Supply & Little\'s Area:** Anteroinferior area (Kiesselbach\'s plexus) formed by anastomosis of 4 arteries: Anterior ethmoidal, Sphenopalatine, Greater palatine, and Superior labial (septal branch). Commonest site of epistaxis.
* **Clinical Significance:** Deviated septum produces sinusitis and headache (Sluder\'s neuralgia); Septal hematoma can cause avascular necrosis of cartilage and saddle nose deformity.`
  },
  {
    id: 'anat-hnf-3',
    subject: 'anatomy',
    subdivision: 'Head, Neck & Face (HNF)',
    type: 'SN',
    name: 'Thyroid Gland – Blood Supply, Applied Anatomy',
    importance: 1,
    clinicalDiagnosis: 'Multinodular Goiter with Surgical Nerve Vulnerability',
    complaint: 'Progressive neck swelling that elevates with deglutition with voice fatigue',
    history: 'A 45-year-old woman presents for pre-operative anatomical assessment of a large multinodular goiter scheduled for hemithyroidectomy.',
    universityQuestion: 'Describe the Blood Supply of Thyroid Gland, relations of associated laryngeal nerves, and Applied Anatomy.',
    highYieldAnswer: `### Thyroid Gland – Blood Supply & Nerve Relations
* **Arteries:** Superior thyroid artery (from ECA) related closely to External Laryngeal Nerve; Inferior thyroid artery (from thyrocervical trunk) crossing Recurrent Laryngeal Nerve; Thyroidea ima artery (in 10%).
* **Veins:** Superior thyroid & Middle thyroid veins (drain into IJV); Inferior thyroid veins (drain into left brachiocephalic vein).
* **Surgical Rules:** Ligate superior thyroid artery close to upper pole to save external laryngeal nerve (loss of high pitch); Ligate inferior thyroid artery far away from gland to save recurrent laryngeal nerve (vocal cord paralysis).`
  },
  {
    id: 'anat-hnf-4',
    subject: 'anatomy',
    subdivision: 'Head, Neck & Face (HNF)',
    type: 'SN',
    name: 'Carotid Sheath',
    importance: 0,
    clinicalDiagnosis: 'Carotid Body Chemodectoma within Carotid Sheath',
    complaint: 'Pulsatile swelling in lateral neck anterior to sternocleidomastoid',
    history: 'A 48-year-old presents with a painless pulsatile lateral neck lump at the carotid bifurcation that moves transversely but not longitudinally.',
    universityQuestion: 'Describe Carotid Sheath: Formation, Contents, and Clinical Importance.',
    highYieldAnswer: `### Carotid Sheath
* **Formation:** Tubular condensation of deep cervical fascia extending from base of skull to aortic adventitia.
* **Contents:** Common & Internal carotid arteries (medial), Internal jugular vein (lateral), Vagus nerve (posterior in groove). Ansa cervicalis embedded in anterior wall; sympathetic trunk lies behind sheath.
* **Applied Anatomy:** Conduit for spread of deep neck infections into superior mediastinum; critical landmark during central venous catheterization.`
  },
  {
    id: 'anat-hnf-5',
    subject: 'anatomy',
    subdivision: 'Head, Neck & Face (HNF)',
    type: 'SN',
    name: 'Muscles of Mastication',
    importance: 0,
    clinicalDiagnosis: 'Temporomandibular Spasm with Trismus (Lockjaw)',
    complaint: 'Inability to open mouth with severe masseteric muscle spasm',
    history: 'A 24-year-old presents with severe jaw stiffness following prolonged dental extraction of third molar with spasm of masticatory muscles.',
    universityQuestion: 'Enumerate Muscles of Mastication. Describe their nerve supply, origin, insertion, and actions.',
    highYieldAnswer: `### Muscles of Mastication
* **Enumerate & Innervation:** Masseter, Temporalis, Medial pterygoid, Lateral pterygoid. All derived from 1st pharyngeal arch and supplied by Mandibular Nerve (CN V3).
* **Actions:** Masseter & Temporalis elevate mandible (close jaw); Medial pterygoid elevates and protracts; Lateral pterygoid **depresses mandible (opens mouth)** and pulls articular disc forward.
* **Applied:** Tetanus causes trismus ("lockjaw") by acting on motor endplates of masseter; Spasm of lateral pterygoid in TMJ anterior dislocation prevents closure.`
  },
  {
    id: 'anat-hnf-6',
    subject: 'anatomy',
    subdivision: 'Head, Neck & Face (HNF)',
    type: 'SN',
    name: 'Cavernous Sinus',
    importance: 1,
    clinicalDiagnosis: 'Cavernous Sinus Thrombophlebitis',
    complaint: 'High fever, proptosis, periorbital edema, and ophthalmoplegia after squeezing facial pimple',
    history: 'A 20-year-old student squeezed a furuncle on the upper lip and developed spiking rigors, chemosis, and abducent nerve palsy with fixed dilated pupil.',
    universityQuestion: 'Describe Cavernous Sinus: Relations, Structures passing through/in wall, Tributaries, and Clinical Significance.',
    highYieldAnswer: `### Cavernous Sinus
* **Location:** Middle cranial fossa on either side of sphenoid body from superior orbital fissure to petrous apex.
* **Through Sinus:** Internal Carotid Artery and Abducent Nerve (CN VI - most vulnerable).
* **In Lateral Wall (Superior to Inferior):** CN III (Oculomotor), CN IV (Trochlear), CN V1 (Ophthalmic), CN V2 (Maxillary).
* **Connections & Applied:** Valveless connection with facial vein via superior ophthalmic vein allows retrograde infection from "Dangerous Area of Face" causing Cavernous Sinus Thrombosis.`
  },
  {
    id: 'anat-hnf-7',
    subject: 'anatomy',
    subdivision: 'Head, Neck & Face (HNF)',
    type: 'SN',
    name: 'Carotid Triangle',
    importance: 0,
    clinicalDiagnosis: 'Carotid Sinus Hypersensitivity Syndrome',
    complaint: 'Recurrent syncope on turning neck or wearing tight collar shirts',
    history: 'A 60-year-old male experiences bradycardia and syncopal episodes when buttoning tight collars due to mechanical stimulation of the carotid sinus in the carotid triangle.',
    universityQuestion: 'Boundaries, Contents, and Applied Anatomy of Carotid Triangle.',
    highYieldAnswer: `### Carotid Triangle
* **Boundaries:** Superior: Posterior belly of digastric; Anteroinferior: Superior belly of omohyoid; Posterior: Anterior border of sternocleidomastoid.
* **Contents:** Carotid arteries (CCA bifurcation into ICA & ECA with branches), IJV, CN X (Vagus), CN XI (Accessory crossing triangle), CN XII (Hypoglossal looping forward), Ansa cervicalis.
* **Applied:** Digital compression of common carotid artery against Chassaignac\'s tubercle (C6 anterior tubercle) stops severe head/neck hemorrhage.`
  },
  {
    id: 'anat-hnf-8',
    subject: 'anatomy',
    subdivision: 'Head, Neck & Face (HNF)',
    type: 'SN',
    name: 'Little\'s Area of Nose – Clinical Significance',
    importance: 0,
    clinicalDiagnosis: 'Anterior Epistaxis from Kiesselbach Plexus',
    complaint: 'Spontaneous profuse bright red bleeding from anterior nasal cavity',
    history: 'A 14-year-old boy presents with sudden nosebleeds following habitual digital trauma in dry, hot weather.',
    universityQuestion: 'Name the arteries forming Kiesselbach\'s plexus at Little\'s area and discuss its clinical significance.',
    highYieldAnswer: `### Little\'s Area / Kiesselbach\'s Plexus
* **Four Arteries Anastomosing:** 1. Anterior ethmoidal (Ophthalmic/ICA); 2. Sphenopalatine (Maxillary/ECA); 3. Greater palatine (Maxillary/ECA); 4. Superior labial septal branch (Facial/ECA).
* **Clinical Significance:** 90% of all epistaxis occurs here because mucosa is thin and vascular. Managed by Trotter\'s method (pinching cartilaginous nose), chemical cautery (Silver nitrate), or anterior nasal packing.`
  },
  {
    id: 'anat-hnf-9',
    subject: 'anatomy',
    subdivision: 'Head, Neck & Face (HNF)',
    type: 'SN',
    name: 'Lateral Rectus Muscle of Eyeball',
    importance: 0,
    clinicalDiagnosis: 'Isolated Sixth Cranial Nerve Palsy',
    complaint: 'Horizontal diplopia on looking to the right with convergent squint',
    history: 'A 55-year-old diabetic presents with horizontal double vision worse on right gaze. Examination shows inability to abduct the right eye beyond the midline.',
    universityQuestion: 'Describe Lateral Rectus: Origin, Insertion, Nerve Supply, Action, and Effect of Paralysis.',
    highYieldAnswer: `### Lateral Rectus Muscle of Eyeball
* **Origin:** Common tendinous ring (annulus of Zinn) bridging superior orbital fissure.
* **Insertion:** Sclera on lateral aspect of eyeball ~7 mm behind corneoscleral junction.
* **Nerve Supply:** Abducent Nerve (CN VI).
* **Action:** Abduction of the eyeball (moves eye laterally).
* **Paralysis:** Produces convergent (internal) strabismus and uncrossed horizontal diplopia maximum on looking toward the paralyzed side.`
  },
  {
    id: 'anat-hnf-10',
    subject: 'anatomy',
    subdivision: 'Head, Neck & Face (HNF)',
    type: 'SN',
    name: 'Hyoid Bone',
    importance: 0,
    clinicalDiagnosis: 'Fracture of Hyoid Bone in Manual Strangulation',
    complaint: 'Forensic evaluation of neck trauma with suspected throttling',
    history: 'Medicolegal postmortem examination in suspected manual strangulation with bruising over the anterior neck and fracture of the greater horn of the hyoid bone.',
    universityQuestion: 'Describe Hyoid Bone: Parts, Muscular attachments, and Forensic/Applied Significance.',
    highYieldAnswer: `### Hyoid Bone
* **Parts:** Central Body, paired Greater Cornua (horns), and Lesser Cornua. Situated at C3 vertebral level; doesn\'t articulate with any other bone.
* **Attachments:** Suprahyoid muscles (digastric, stylohyoid, mylohyoid, geniohyoid), Infrahyoid muscles (sternohyoid, omohyoid, thyrohyoid), Middle pharyngeal constrictor, Hyoglossus.
* **Applied/Forensic Importance:** Fracture of greater cornua is a pathognomonic sign of manual strangulation (throttling) in forensic medicine.`
  },
  {
    id: 'anat-hnf-11',
    subject: 'anatomy',
    subdivision: 'Head, Neck & Face (HNF)',
    type: 'SN',
    name: 'Palatine Tonsil – Applied Anatomy',
    importance: 1,
    clinicalDiagnosis: 'Peritonsillar Abscess (Quinsy)',
    complaint: 'Severe sore throat, hot-potato voice, trismus, and uvular deviation',
    history: 'A 19-year-old presents with acute tonsillitis that progressed to severe unilateral peritonsillar fullness and uvula pushed to the opposite side.',
    universityQuestion: 'Describe Palatine Tonsil: Bed, Blood supply, and Applied Anatomy (Quinsy, Tonsillectomy hemorrhage).',
    highYieldAnswer: `### Palatine Tonsil
* **Tonsillar Bed:** Formed from inside out by pharyngobasilar fascia, superior constrictor, and buccopharyngeal fascia. Paratonsillar vein lies on bed.
* **Arterial Supply:** Tonsillar branch of Facial artery (principal), Ascending palatine, Ascending pharyngeal, Dorsal lingual, Lesser palatine.
* **Applied Anatomy:**
  * **Quinsy (Peritonsillar Abscess):** Pus collects in intratonsillar cleft/peritonsillar space; requires aspiration through incision in palate.
  * **Tonsillectomy Hemorrhage:** Severe venous bleeding occurs if **Paratonsillar Vein** on bed is injured; arterial hemorrhage from tonsillar branch of facial artery.`
  },
  {
    id: 'anat-hnf-12',
    subject: 'anatomy',
    subdivision: 'Head, Neck & Face (HNF)',
    type: 'SN',
    name: 'Dangerous Area of Face',
    importance: 0,
    clinicalDiagnosis: 'Retrograde Intracranial Spread of Facial Infection',
    complaint: 'Upper lip furuncle complicated by cavernous sinus thrombosis',
    history: 'A young adult with a squeezing boil on the philtrum of the upper lip develops periorbital swelling, chemosis, and high swinging fever.',
    universityQuestion: 'Define Dangerous Area of Face. Explain its anatomical basis and clinical significance.',
    highYieldAnswer: `### Dangerous Area of Face
* **Definition:** Triangular area bounded by root of nose at apex and angles of mouth at base, encompassing upper lip and external nose.
* **Anatomical Basis:** 1. Deep connections between facial vein and cavernous sinus via: (a) Angular vein -> Superior ophthalmic vein, (b) Deep facial vein -> Pterygoid plexus -> Emissary veins; 2. Facial vein has **no valves** allowing retrograde blood flow; 3. Facial muscles lack deep fascia, meaning movements act as a pump propelling septic thrombi upwards.
* **Clinical Significance:** Squeezing boils in this zone can cause septic Cavernous Sinus Thrombosis.`
  },
  {
    id: 'anat-hnf-13',
    subject: 'anatomy',
    subdivision: 'Head, Neck & Face (HNF)',
    type: 'SN',
    name: 'Nasal Meatus',
    importance: 0,
    clinicalDiagnosis: 'Maxillary Sinusitis with Middle Meatus Ostial Blockade',
    complaint: 'Facial fullness, foul purulent nasal discharge, and tender cheekbones',
    history: 'A 34-year-old presents with throbbing right cheek pain worse on bending forward following an upper respiratory infection. Examination reveals pus flowing from middle meatus.',
    universityQuestion: 'Enumerate the Nasal Meatuses and describe the openings into each meatus.',
    highYieldAnswer: `### Nasal Meatuses and Openings
* **Inferior Meatus:** Lies below inferior concha. Contains opening of **Nasolacrimal Duct** (guarded by Hasner\'s valve).
* **Middle Meatus:** Lies below middle concha. Contains Ethmoidal bulla and Hiatus semilunaris:
  * Frontal sinus opens via frontonasal duct.
  * Anterior ethmoidal air cells open on hiatus.
  * Middle ethmoidal cells open on bulla ethmoidalis.
  * **Maxillary sinus** opens into posterior part of hiatus semilunaris.
* **Superior Meatus:** Below superior concha. Receives **Posterior ethmoidal air cells**.
* **Sphenoethmoidal Recess:** Above superior concha. Receives **Sphenoidal air sinus** opening.`
  },
  {
    id: 'anat-hnf-14',
    subject: 'anatomy',
    subdivision: 'Head, Neck & Face (HNF)',
    type: 'SN',
    name: 'Tongue – Applied Anatomy',
    importance: 0,
    clinicalDiagnosis: 'Hypoglossal Nerve Palsy with Deviation of Tongue',
    complaint: 'Difficulty in speech and tongue deviating to the right on protrusion',
    history: 'A 50-year-old with a base-of-skull injury displays ipsilateral right-sided tongue atrophy and deviation to the right side on protrusion.',
    universityQuestion: 'Discuss the Applied Anatomy of the Tongue (Nerve lesions, Lymphatic drainage, Ankyloglossia).',
    highYieldAnswer: `### Tongue – Applied Anatomy
* **Deviation on Protrusion:** Genioglossus is the safety muscle of tongue (protrudes tongue). In unilateral **CN XII palsy**, intact genioglossus pushes tongue to the **paralyzed side**.
* **Airway Obstruction in Coma:** In unconscious or anesthetized patients, genioglossus relaxes allowing tongue to fall back into oropharynx; averted by jaw thrust or endotracheal intubation.
* **Lymphatic Drainage in Carcinoma:** Tip drains bilaterally to submental nodes; Anterior 2/3 drains to submandibular & jugulo-omohyoid nodes; Posterior 1/3 drains bilaterally to jugulodigastric nodes (early bilateral metastasis in posterior 1/3 cancer).
* **Ankyloglossia ("Tongue-tie"):** Abnormally short lingual frenulum restricting tongue movement and causing speech defects.`
  },
  {
    id: 'anat-hnf-15',
    subject: 'anatomy',
    subdivision: 'Head, Neck & Face (HNF)',
    type: 'SN',
    name: 'Ansa Cervicalis',
    importance: 0,
    clinicalDiagnosis: 'Iatrogenic Ansa Cervicalis Injury during Radical Neck Dissection',
    complaint: 'Weakness of laryngeal depression and strap muscle atrophy following neck surgery',
    history: 'A 58-year-old underwent modified radical neck dissection with sacrifice of superficial cervical plexus branches embedded in anterior carotid sheath.',
    universityQuestion: 'Describe Ansa Cervicalis: Formation, Location, Branches, and Applied Importance.',
    highYieldAnswer: `### Ansa Cervicalis
* **Formation:** Nerve loop embedded in anterior wall of carotid sheath:
  * **Superior Root (Radix Superior):** C1 fibers hitchhiking with hypoglossal nerve (descendens hypoglossi).
  * **Inferior Root (Radix Inferior):** Arises from C2 and C3 ventral rami (descendens cervicalis).
* **Branches:** Supplies three infrahyoid (strap) muscles: **Sternohyoid, Sternothyroid, Omohyoid (both bellies)**. (Note: Thyrohyoid is supplied directly by C1 via CN XII).
* **Applied Importance:** Used for nerve graft transfers to reinnervate paralyzed recurrent laryngeal nerve.`
  },
  {
    id: 'anat-hnf-16',
    subject: 'anatomy',
    subdivision: 'Head, Neck & Face (HNF)',
    type: 'SN',
    name: 'Falx Cerebri',
    importance: 0,
    clinicalDiagnosis: 'Subfalcine (Cingulate Gyrus) Herniation',
    complaint: 'Severe headache, contralateral leg weakness, and stupor following unilateral subdural hematoma',
    history: 'A 68-year-old presents with hemispheric mass effect following head trauma. CT shows midline shift with cingulate gyrus herniating under the free margin of falx cerebri.',
    universityQuestion: 'Describe Falx Cerebri: Shape, Attachments, Venous sinuses enclosed, and Applied Anatomy.',
    highYieldAnswer: `### Falx Cerebri
* **Definition & Attachments:** Sickle-shaped vertical dural fold in median longitudinal cerebral fissure.
  * Anterior end: Attached to crista galli of ethmoid and frontal crest.
  * Posterior end: Attached to upper surface of tentorium cerebelli.
  * Upper convex margin: Attached to lips of sagittal sulcus of vault of skull.
  * Lower concave margin: Free, arched over corpus callosum.
* **Enclosed Venous Sinuses:**
  * Upper margin: **Superior Sagittal Sinus**.
  * Lower margin: **Inferior Sagittal Sinus**.
  * Junction with tentorium: **Straight Sinus**.
* **Applied:** Raised unilateral intracranial pressure causes **Subfalcine Herniation** of cingulate gyrus under free margin, compressing anterior cerebral artery.`
  },

  // HNF - LAQ
  {
    id: 'anat-hnf-laq-1-full',
    subject: 'anatomy',
    subdivision: 'Head, Neck & Face (HNF)',
    type: 'LAQ',
    name: 'Parotid Gland',
    importance: 4,
    clinicalDiagnosis: 'Pleomorphic Adenoma / Parotid Neoplasm',
    complaint: 'Painless lobulated swelling anterior to right tragus lifting ear lobule for 3 years',
    history: 'A 44-year-old presents with a slow-growing preauricular tumor. Facial nerve branches are mapped prior to superficial parotidectomy.',
    universityQuestion: 'Describe the Parotid Gland under: Location, Capsule, Surfaces & Relations, Structures passing through, Secretomotor Pathway, and Applied Anatomy.',
    highYieldAnswer: `### Parotid Gland (Master LAQ Answer)
1. **Location & Capsule:** Lies in retromandibular fossa. True capsule is glandular; false capsule is investing deep cervical fascia splitting into superficial dense layer (zygomatic arch) and deep thin layer forming stylomandibular ligament.
2. **Surfaces & Relations:** Superior (base) related to external acoustic meatus and TMJ; Apex overlaps posterior belly of digastric; Superficial surface covered by skin, platysma, great auricular nerve; Anteromedial surface grooves ramus of mandible, masseter, medial pterygoid; Posteromedial surface relates to mastoid process, sternocleidomastoid, posterior digastric, styloid apparatus, ICA.
3. **Structures Piercing Through (Superficial to Deep):**
   * Facial Nerve (CN VII) divides into 5 terminal branches (**Pes Anserinus**: Temporal, Zygomatic, Buccal, Marginal Mandibular, Cervical).
   * Retromandibular Vein (Superficial temporal + Maxillary vein).
   * External Carotid Artery (gives posterior auricular, terminates into superficial temporal and maxillary).
4. **Parotid Duct (Stensen\'s Duct):** Pierces buccal pad of fat, buccopharyngeal fascia, and buccinator; opens opposite upper 2nd molar crown.
5. **Secretomotor Pathway:** Inferior salivatory nucleus -> CN IX -> Tympanic branch -> Tympanic plexus -> Lesser petrosal nerve -> **Otic ganglion** -> Auriculotemporal nerve -> Parotid.
6. **Applied:** **Frey\'s Syndrome** (gustatory sweating after parotid surgery); **Mumps** viral parotitis; Superficial parotidectomy requires identifying facial nerve trunk at stylomastoid foramen.`
  },
  {
    id: 'anat-hnf-laq-2',
    subject: 'anatomy',
    subdivision: 'Head, Neck & Face (HNF)',
    type: 'LAQ',
    name: 'Tongue',
    importance: 2,
    clinicalDiagnosis: 'Carcinoma of Lateral Border of Tongue',
    complaint: 'Non-healing indurated ulcer on lateral border of tongue with painful swallowing',
    history: 'A 56-year-old chronic tobacco chewer presents with a 2 cm hard ulcer on the right lateral border of anterior two-thirds of tongue and submandibular lymphadenopathy.',
    universityQuestion: 'Describe the Tongue under: Parts, Musculature (intrinsic & extrinsic), Nerve Supply (sensory & motor), Lymphatic Drainage, and Applied Anatomy.',
    highYieldAnswer: `### Tongue (Master LAQ Answer)
1. **Parts:** Root, Tip, Body. Dorsum divided by sulcus terminalis into oral (anterior 2/3) and pharyngeal (posterior 1/3) parts. Foramen cecum marks origin of thyroglossal duct.
2. **Muscles of Tongue:**
   * **Extrinsic (4 pairs):** Genioglossus (safety muscle, protrudes), Hyoglossus (depresses), Styloglossus (retracts), Palatoglossus (elevates root).
   * **Intrinsic:** Superior and inferior longitudinal, transverse, and vertical (alter shape).
3. **Nerve Supply:**
   * **Motor:** All muscles supplied by **Hypoglossal Nerve (CN XII)** EXCEPT Palatoglossus (Cranial root of Accessory via Pharyngeal Plexus).
   * **Sensory:**
     * Anterior 2/3: General sensation by **Lingual Nerve (V3)**; Taste sensation by **Chorda Tympani (CN VII)** via lingual nerve.
     * Posterior 1/3: Both general and taste by **Glossopharyngeal Nerve (CN IX)**.
     * Vallecula / Posterior-most: Internal laryngeal nerve (CN X).
4. **Lymphatic Drainage:**
   * Tip: Submental nodes bilaterally.
   * Anterior 2/3: Submandibular and jugulo-omohyoid nodes (mostly unilateral).
   * Posterior 1/3: Deep cervical / Jugulodigastric nodes bilaterally (cross-metastasis).
5. **Applied:** Carcinoma of tongue carries high mortality; excision (hemiglossectomy); unilateral CN XII palsy causes tongue protrusion to paralyzed side.`
  },
  {
    id: 'anat-hnf-laq-3',
    subject: 'anatomy',
    subdivision: 'Head, Neck & Face (HNF)',
    type: 'LAQ',
    name: 'Scalp',
    importance: 0,
    clinicalDiagnosis: 'Subgaleal Hematoma / Dangerous Layer Infection',
    complaint: 'Fluctuant diffuse swelling across entire cranial vault bounded by eyelids anteriorly',
    history: 'A 16-year-old presents after blunt head trauma with massive swelling extending from supraorbital margins to superior nuchal line that pits on pressure.',
    universityQuestion: 'Describe the Scalp: Layers (SCALP), Blood supply, Nerve supply, and Applied Anatomy (Dangerous layer of scalp).',
    highYieldAnswer: `### Scalp (Master LAQ Answer)
1. **Layers (S-C-A-L-P):**
   * **S - Skin:** Thick, hair-bearing, rich in sebaceous glands (common site for sebaceous cysts).
   * **C - Connective Tissue (Dense):** Highly vascular fibrofatty tissue with blood vessels held open by fibrous septa -> profuse bleeding from minor lacerations.
   * **A - Aponeurosis (Galea Aponeurotica):** Epicranial aponeurosis connecting occipitalis and frontalis bellies.
   * **L - Loose Areolar Tissue:** **"Dangerous Layer of Scalp"**. Contains emissary veins traversing skull foramina to enter dural venous sinuses.
   * **P - Pericranium:** Deep periosteum of cranial bones, adherent to sutures.
2. **Blood Supply:**
   * In front of auricle: Supratrochlear, Supraorbital, Superficial temporal.
   * Behind auricle: Posterior auricular, Occipital arteries.
3. **Nerve Supply:** Supratrochlear, Supraorbital, Zygomaticotemporal, Auriculotemporal, Great auricular, Lesser occipital, Greater occipital, Third occipital.
4. **Applied Anatomy:**
   * **Dangerous Layer:** Infections in loose areolar layer easily spread into intracranial dural sinuses via emissary veins causing meningitis.
   * **Black Eye:** Blood in loose areolar layer travels anteriorly into eyelids because frontalis has no bony attachment.`
  },
  {
    id: 'anat-hnf-laq-4',
    subject: 'anatomy',
    subdivision: 'Head, Neck & Face (HNF)',
    type: 'LAQ',
    name: 'Thyroid Gland',
    importance: 2,
    clinicalDiagnosis: 'Papillary Thyroid Carcinoma / Total Thyroidectomy Planning',
    complaint: 'Rapidly enlarging solitary hard thyroid nodule with cervical lymphadenopathy',
    history: 'A 38-year-old presents with a firm thyroid nodule in the right lobe. Ultrasound-guided FNAC confirms papillary thyroid carcinoma requiring total thyroidectomy.',
    universityQuestion: 'Describe the Thyroid Gland: Location, Capsules, Lobes & Isthmus, Relations, Blood Supply, Histology, and Applied Anatomy.',
    highYieldAnswer: `### Thyroid Gland (Master LAQ Answer)
1. **Location & Coverings:** Extends from C5 to T1 vertebrae. Enclosed by pretracheal fascia attached to thyroid cartilage by ligament of Berry (explains ascent with deglutition).
2. **Parts & Relations:**
   * Lateral Lobes: Extend from middle of thyroid cartilage to 5th tracheal ring. Anterolateral surface covered by strap muscles; Medial surface relates to larynx, trachea, esophagus, recurrent & external laryngeal nerves; Posterior surface overlaps carotid sheath.
   * Isthmus: Lies in front of 2nd, 3rd, and 4th tracheal rings.
3. **Blood Supply:** Superior thyroid artery (with external laryngeal nerve), Inferior thyroid artery (with recurrent laryngeal nerve), Thyroidea ima; Superior, middle, and inferior thyroid veins.
4. **Applied Anatomy:**
   * Recurrent laryngeal nerve injury during thyroidectomy leads to abductor vocal cord palsy (hoarseness if unilateral; fatal inspiratory stridor if bilateral).
   * Inadvertent removal of parathyroid glands leads to hypocalcemic tetany.`
  },
  {
    id: 'anat-hnf-laq-5',
    subject: 'anatomy',
    subdivision: 'Head, Neck & Face (HNF)',
    type: 'LAQ',
    name: 'Middle Ear',
    importance: 0,
    clinicalDiagnosis: 'Acute Otitis Media with Mastoiditis and Facial Nerve Palsy',
    complaint: 'Severe throbbing ear pain, purulent discharge, mastoid tenderness, and facial weakness',
    history: 'A 7-year-old child presents with unresolved otitis media complicated by acute mastoiditis and ipsilateral lower motor neuron facial nerve palsy.',
    universityQuestion: 'Describe the Middle Ear (Tympanic Cavity): Boundaries, Contents, Communications, and Applied Anatomy.',
    highYieldAnswer: `### Middle Ear (Master LAQ Answer)
1. **Shape & Location:** Biconcave narrow air-filled space in petrous temporal bone.
2. **Six Boundaries (Walls):**
   * **Roof (Tegmental wall):** Tegmen tympani separating ear from middle cranial fossa.
   * **Floor (Jugular wall):** Thin bone separating cavity from superior bulb of IJV.
   * **Lateral (Membranous wall):** Tympanic membrane and epitympanic recess.
   * **Medial (Labyrinthine wall):** Promontory (basal cochlear turn), Oval window (fenestra vestibuli), Round window (fenestra cochleae), Prominence of facial nerve canal.
   * **Anterior (Carotid wall):** Separates cavity from internal carotid artery; contains openings of Eustachian tube and Tensor Tympani canal.
   * **Posterior (Mastoid wall):** Aditus ad antrum (leads to mastoid antrum), Pyramid (transmits stapedius tendon), Fossa incudis.
3. **Contents:** Ear ossicles (Malleus, Incus, Stapes), Muscles (Tensor tympani, Stapedius), Nerves (Chorda tympani, Tympanic plexus).
4. **Applied Anatomy:** Otitis media can spread through tegmen tympani causing extradural/temporal lobe brain abscess; erosion of medial wall causes labyrinthitis or facial palsy.`
  }
];

// Combine all 1st year question database entries
export function getFirstYearTopicByName(query: string): MasterTopicItem | undefined {
  const q = query.toLowerCase();
  return ANATOMY_MASTER_TOPICS.find(t => 
    t.name.toLowerCase().includes(q) || 
    t.topic.toLowerCase().includes(q) ||
    t.clinicalDiagnosis.toLowerCase().includes(q)
  );
}
