import dbKnex from '../data/db_config.js'

export const livroIndex = async (req, res) => {
  try {
    const livros = await dbKnex.select("*").from("livros")
    res.status(200).json(livros)
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " } + error.message)
  }
}

export const insereLivro = async (req, res) => {
  const { titulo, editora, registro, quantidade } = req.body

  if (!titulo || !editora || !registro || !quantidade) {
    res.json({ id: 0, msg: "Erro: Preencha todos os campos" })
    return
  }
  if (verificaDados(registro)) {
    try {
      const livroExistente = await dbKnex.select("*").from("livros").where({ registro })
      if (livroExistente.length != 0) {
        res.status(400).json({ livros: livroExistente, msg: "Já existe um livro cadastrado com esse número de registro" })
        return
      }
      const novoLivro = await dbKnex("livros").insert({ titulo, editora, registro, quantidade })
      res.json({ id: novoLivro[0], msg: "Ok! Livro inserido com sucesso." })
    } catch (error) {
      res.status(400).json({ id: 0, msg: "Erro: " } + error.message)
    }
  } else {
    res.status(400).json({ id: 0, msg: "Registro incorreto!" })
  }
}

export const livroUpdate = async (req, res) => {
  const { registro } = req.params

  const { titulo, editora, quantidade } = req.body

  if (!titulo || !editora || !quantidade) {
    res.json({ id: 0, msg: "Erro... Preencha todos os campos!" })
    return
  }
  if (verificaDados(registro)) {
    try {
      const livroExistente = await dbKnex.select("*").from("livros").where({ registro })
      if (livroExistente.length != 1) {
        res.status(400).json({ livros: livroExistente, msg: "Há mais de um livro com o mesmo registro ou esse livro ainda não foi cadastrado!" })
        return
      }
      await dbKnex("livros").where({ registro }).update({ titulo, editora, quantidade })
      res.status(200).json({ livro: registro, msg: "Ok! Livro alterado com sucesso." })
    } catch (error) {
      res.status(400).json({ id: 0, msg: "Erro: " } + error.message)
    }
  } else {
    res.status(400).json({ id: 0, msg: "Registro incorreto!" })
  }
}

export const livroDelete = async (req, res) => {
  const { registro } = req.params
  try {
    await dbKnex("livros").where({ registro }).del()
    res.status(200).json({livro: registro, msg:"Livro excluído com sucesso"})
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " } + error.message)
  }
}

export const livroPesq = async (req, res) => {
  const { registro } = req.params
  try {
    const livroEncontrado = await dbKnex.select("*").from("livros").where({ registro })
    livroEncontrado.length != 0 ? res.status(200).json({ livro: livroEncontrado[0], msg: "Livro Encontrado com sucesso!" }) : res.status(400).json({ id: 0, msg: "Nenhum livro encontrado com esse registro! Por favor cadastre o livro primeiramente." })
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " } + error.message)
  }
}

const verificaDados = (registro) => {
  let regVet = registro.toString().split('')
  if (regVet.length != 9) {
    return false
  } 
    return true
}