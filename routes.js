import { Router, json } from 'express'
import { alunoDelete, alunoIndex, alunoPesq, insereAluno, alunoUpdate } from './Controllers/AlunoController.js'
import { livroDelete, livroIndex, livroPesq, livroUpdate, insereLivro } from './Controllers/LivroController.js'
//import { locacaoIndex, locacaoDelete, insereLocacao, locacaoUpdate, locacaoPesq } from './Controllers/LocacaoController.js'
const router = Router()

// "converte" os dados recebidos para o formato json
router.use(json())

// define as rotas de cadastro de alunos
router.get('/alunos', alunoIndex)
      .post('/alunos', insereAluno) 
      .put('/alunos/:matricula', alunoUpdate) 
      .delete('/alunos/:matricula', alunoDelete) 
      .get('/alunos/pesq/:matricula', alunoPesq)
 
//define as rotas de cadastro de livros
router.get('/livros', livroIndex)
      .post('/livros', insereLivro)
      .put('/livros/:registro', livroUpdate)
      .delete('/livros/:registro', livroDelete)
      .get('/livros/pesq/:registro', livroPesq)

//define as rodas de cadastro de alocação do livro pelo aluno
// router.get('/locacao', locacaoIndex)
//       .post('/locacao', insereLocacao)
//       .put('/locacao/:id', locacaoUpdate)
//       .delete('/locacao/:registro', locacaoDelete)
//       .get('locacao/pesq/:id', locacaoPesq)

export default router