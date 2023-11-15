import {Router} from "express";
import { EstudanteController } from "./controllers/EstudanteController";
import { CursoController } from "./controllers/CursoController";

const router = Router();

router.post("/estudante", EstudanteController.createEstudante);
router.get("/estudantes", EstudanteController.findAllEstudantes);
router.get("/estudante/:id", EstudanteController.findEstudante);
router.put("/estudante/:id", EstudanteController.updateEstudante);
router.delete("/estudante/:id", EstudanteController.deleteEstudante);

router.post("/cursos", CursoController.createCurso);
router.get("/cursos", CursoController.findAllCursos);
router.get("/cursos/:id", CursoController.findCurso);
router.put("/cursos/:id", CursoController.updateCurso);

export default router