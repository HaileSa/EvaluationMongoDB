import { Router } from  "express";
import { Balade } from "./model.js"; //find, updateOne, aggregate, deleteOne
// import { isValidObjectId } from "mongoose";


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
      return rep.status(400).json({ msg: "Missing required fields" });
    }
  
    const result = await newBalade.save();
    rep.json(result);
});




export default router ;

