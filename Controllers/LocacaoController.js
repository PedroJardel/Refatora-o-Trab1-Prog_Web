import dbKnex from '../data/db_config.js'

export const carroIndex = async (req, res) => {
  try {
    const carros = await dbKnex.select("*").from("carros")
    res.status(200).json(carros)
  } catch (error) {
    res.status(400).json({id: 0, msg: "Erro: "} + error.message)
  }
}

export const carroStore = async (req, res) => {
  const { modelo, marca, ano, preco } = req.body

  if (!modelo || !marca || !ano || !preco) {
    res.json(
      {
        id: 0,
        msg: "Erro... informe modelo, marca, ano e preco do veículo"
      })
    return
  }

  const novo = await dbKnex("carros").insert({ modelo, marca, ano, preco })

  res.json({ id: novo[0], msg: "Ok! Inserido com sucesso" })
}

export const carroUpdate = async (req, res) => {
  const { id } = req.params;

  const { modelo, marca, ano, preco } = req.body

  if (!modelo || !marca || !ano || !preco) {
    res.json(
      {
        id: 0,
        msg: "Erro... informe modelo, marca, ano e preco do veículo"
      })
    return
  }

  const alterado = await dbKnex('carros').where({ id }).update({ modelo, marca, ano, preco })
  res.json({ id, msg: "Ok! Alterado com sucesso" })
}

export const carroDelete = async (req, res) => {
  const { id } = req.params;

  await dbKnex("carros").where({ id }).del()

  res.json({ id, msg: "Ok! Excluído com sucesso" })
}

export const carroPesq = (req, res) => {

  const { marca } = req.params

  const lista = []

  for (const carro of carros) {
    if (carro.marca.toUpperCase() == marca.toUpperCase()) {
      lista.push(carro)
    }
  }

  if (lista.length == 0) {
    res.json({ id: 0, msg: "Não há carros desta marca" })
    return
  }

  res.json(lista)
}

export const carroIntervalo = (req, res) => {

  const { from, to } = req.params

  const lista = []

  for (const carro of carros) {
    if (carro.ano >= from && carro.ano <= to) {
      lista.push(carro)
    }
  }

  if (lista.length == 0) {
    res.json({ id: 0, msg: "Não há carros neste intervalo de anos" })
    return
  }

  res.json(lista)
}