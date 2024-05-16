import { Router } from  "express";
import {Balade} from "./model.js"; //find, updateOne, aggregate, deleteOne
// import { isValidObjectId } from "mongoose";


const router = Router();

router.get('/', (req, rep) => {
    rep.json("Bonjour");
})

router.get("/all", async function(req,rep){
    const response = await Balade.find({});
    rep.json(response);
})

export default router ;

