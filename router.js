import { Router } from  "express";
import { Balade } from "./model.js"; //find, updateOne, aggregate, deleteOne
import { isValidObjectId } from "mongoose";


const router = Router();

router.get('/', (req, rep) => {
    rep.json("Bonjour");
})

//QUESTION 1
router.get("/all", async function(req,rep){
    const response = await Balade.find({});
    rep.json(response);
})

//QUESTION 2
router.get('/id/:id', async (req, rep) => {
    try {
        const balade = await Balade.findById(req.params.id);
        rep.json(balade);
    } catch (err) {
        res.status(404).json({ message: "Balade non trouvée" });
    }
});

//QUESTION 3
router.get('/search/:search', async (req, rep) => {
        const balades = await Balade.find({
            $or: [
                // $options 'i' permet de passer outre la sensibilité à la casse
                { nom_poi: { $regex: req.params.search, $options: 'i' } },
                { texte_intro: { $regex: req.params.search, $options: 'i' } }
            ]
        });
        rep.json(balades);
});

// QUESTION 4
router.get('/site-internet', async (req, res) => {
    const balades = await Balade.find({
        url_site: { $ne : null }
    });
    rep.json(balades);
})

// QUESTION 5
router.get('/mot-cle', async (req, rep) => {
    const balades = await Balade.find({
        "mot_cle.5" : {$exists:true}
    });
    rep.json(balades);
})

// QUESTION 6
router.get('/publie/:annee', async (req, rep) => {
    const annee = req.params.annee;
    const balades = await Balade.find({
        date_saisie : { $regex : "^" + annee}.sort({date_saisie :1})
    });
    rep.json(balades);
})

// QUESTION 7
router.get("/arrondissement/:num_arrondissement", async function (req, rep) {
    const arr = req.params.num_arrondissement;

    const count = await Balade.countDocuments({ 
        code_postal : {$regex : arr + "$"}
    });
    rep.json({ count: count });
});

//QUESTION 8
router.get("/synthese", async function (req, rep) {
    const balades = await Balade.aggregate([
        {
          $group: {
            _id: "$code_postal",
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
    ]);
    rep.json(balades);
});

// QUESTION 9
router.get("/categories", async function (req, rep) {
   
    const categories = await Balade.distinct("categorie");
    rep.json(categories);
});

//QUESTION 10
router.post("/add", async function (req, rep) {
    const newBalade = new Balade(req.body);

    if (!newBalade.nom_poi || !newBalade.adresse || !newBalade.categorie) {
      return rep.status(400).json({ msg: "Il manque des champs" });
    }
  
    const result = await newBalade.save();
    rep.json(result);
});

//QUESTION 11 

//QUESTION 12
router.put('/update-one/:id', async (req, res) => {
    try {
      const updatedBalade = await Balade.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updatedBalade) {
        return res.status(404).json({ message: 'Balade non présente dans notre base' });
      }
      res.status(200).json(updatedBalade);
    } catch (error) {
      console.log(error)
      if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'ID invalide' });
      }
      res.status(500).json({ message: error.message });
    }
  });

//QUESTION 13 
router.put('/update-many/:search', async (req, res) => {
    const search = req.params.search;
    const newNomPoi = req.body.nom_poi;
  
    if (!newNomPoi) {
      return res.status(400).json({ message: 'Un nouveau nom_poi est requis' });
    }
  
    try {
      const result = await Balade.updateMany(
        { texte_description: { $regex: search, $options: 'i' } },
        { $set: { nom_poi: newNomPoi } }
      );
  
      if (result.nModified === 0) {
        return res.status(404).json({ message: "Aucune correspondance" });
      }
  
      res.status(200).json({ message: "Balades mises à jour" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });  

  //QUESTION 14
  router.delete('/delete/:id', async (req, res) => {
    try {
      const deletedBalade = await Balade.findByIdAndDelete(req.params.id);
      if (!deletedBalade) {
        return res.status(404).json({ message: "Balade pas trouvée" });
      }
      res.status(200).json({ message: "Balade supprimée de la base de données" });
    } catch (error) {
      if (error.kind === "ObjectId") {
        return res.status(400).json({ message: "ID invalide" });
      }
      res.status(500).json({ message: error.message });
    }
  });




export default router ;

