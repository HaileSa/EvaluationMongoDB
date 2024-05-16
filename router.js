import { Router } from  "express";
import { Balade } from "./model.js"; //find, updateOne, aggregate, deleteOne
// import { isValidObjectId } from "mongoose";


const router = Router();

router.get('/', (req, rep) => {
    rep.json("Bonjour");
})

router.get("/all", async function(req,rep){
    const response = await Balade.find({});
    rep.json(response);
})

router.get('/id/:id', async (req, rep) => {
    try {
        const balade = await Balade.findById(req.params.id);
        rep.json(balade);
    } catch (err) {
        res.status(404).json({ message: "Balade non trouvée" });
    }
});

router.get('/search/:search', async (req, rep) => {
        const balades = await Balade.find({
            $or: [
                { nom_poi: { $regex: req.params.search, $options: 'i' } },
                { texte_intro: { $regex: req.params.search, $options: 'i' } }
            ]
        });
        rep.json(balades);
});

export default router ;

