import express from 'express'

import {criarUsers, listarUsers, loginUser} 
from "../controllers/UsersController.js"


const router = express.Router();


router.post("/registrar", criarUsers)
router.post("/login",loginUser)
router.get("/listarUser", listarUsers)


export default router