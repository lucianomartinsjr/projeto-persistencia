import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient('https://yhhbllvyxezpxmgtrcfb.supabase.co', 'SxG4#nNp1ZXMC1QY');
const prisma = new PrismaClient();

export class EstudanteController {
  static async createEstudante(req, res) {
    try {
      // Extraia os dados do corpo da requisição
      const { nome,imagem } = req.body;

        // Upload da imagem para o Supabase Storage
        const { data, error } = await supabase.storage
        .from('imagem') 
        .upload(`${imagem.name}`, imagem);

        const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/imagem/${imagem.name}`;

      if (error) {
        console.error('Erro ao fazer upload da imagem para o Supabase Storage:', error.message);
        return res.status(500).json({ error: 'Erro ao criar estudante' });
      }
  
      // Crie um novo estudante
      const novoEstudante = await prisma.estudante.create({
        data: {
          nome,
          imagem: imageUrl,
        },
      });
  
      // Envie a resposta com o novo estudante criado
      res.status(201).json(novoEstudante);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao criar estudante');
    }
  }

  static async findAllEstudantes(req, res) {
    try {
      const estudantes = await prisma.estudante.findMany();
      return res.json(estudantes);
    } catch (error) {
      return res.json({ error });
    }
  }

  static async findEstudante(req, res) {
    try {
      const { id } = req.params;

      const estudante = await prisma.estudante.findUnique({ where: { id: Number(id) } });

      if (!estudante)
        return res.json({ error: "Não possivel encotrar esse estudante" });

      return res.json(estudante);
    } catch (error) {
      return res.json({ error });
    }
  }

  static async updateEstudante(req, res) {
    try {
      const { id } = req.params;
      const { nome, imagem } = req.body;

      let estudante = await prisma.estudante.findUnique({ where: { id: Number(id) } });

      if (!estudante)
        return res.json({ error: "Não possivel encotrar esse estudante" });

      estudante = await prisma.estudante.update({
        where: { id: Number(id) },
        data: { nome, imagem },
      });

      return res.json(estudante);
    } catch (error) {
      res.json({ error });
    }
  }

  static async deleteEstudante(req, res) {
    try {
      const { id } = req.params;

      const estudante = await prisma.estudante.findUnique({ where: { id: Number(id) } });

      if (!estudante)
        return res.json({ error: "Não possivel encotrar esse estudante" });

      await prisma.estudante.delete({ where: { id: Number(id) } });

      return res.json({message: "estudante deletado"});
    } catch (error) {
      console.error('Erro ao criar estudante:', error.message);
      res.status(500).json({ error: 'Erro ao criar estudante' });
    }
  }
};
