import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class CursoController {
  static async createCurso(req, res) {
    const { nomeCurso, idEstudantes } = req.body;


    try {
      const curso = await prisma.curso.create({
        data: {
          nomeCurso
        }
      });

      for (const idEstudante of idEstudantes) {
        await prisma.cursoEstudante.create({
          data: {
            curso: { connect: { id: curso.id } },  
            estudante: { connect: { id: idEstudante } } 
          }
        });
      }


      return curso;
    } catch (error) {
      return res.json({ message: error.message });
    }
  }

  static async findAllCursos(req, res) {
    try {
      const cursos = await prisma.curso.findMany();

      return res.json(cursos);
    } catch (error) {
      return res.json(error);
    }
  }
  
  static async findCurso(req, res) {
    try {
      const { id } = req.params;

      const curso = await prisma.curso.findUnique({
        where: { id: Number(id)},
        include:{
          CursoEstudante:{
            include:{
              estudante:{
                select:{
                  id:true,
                  nome:true,
                }
              },
            }
          }
        }
      });

      if (!curso)
        return res.json({ error: "Não possivel encotrar esse Curso" });

    // Reformatar a resposta para incluir diretamente os objetos de estudante
    const estudantes = curso.CursoEstudante.map(item => ({
      estudante: {
        id: item.estudante.id,
        nome: item.estudante.nome,
      },
    }));

    return res.json({
      id: curso.id,
      nomeCurso: curso.nomeCurso,
      criadoEm: curso.criadoEm,
      atualizadoEm: curso.atualizadoEm,
      CursoEstudante: estudantes,
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
  }

  static async updateCurso(req, res) {
    const { id } = req.params;
    try {
      const curso = await prisma.curso.findUnique({ where: { id: Number(id) } });

      if (!curso) {
        return res.json({ message: "curso inexistente" });
      }

      await prisma.curso.update({
        where: { id: Number(id) },
        data: { curso },
      });

      return res.json({ message: "curso Atualizado!"})
    } catch (error) {
      return res.json({ message: error.message });
    }
  }
};