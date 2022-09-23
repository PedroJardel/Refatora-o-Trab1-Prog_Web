import dbKnex from '../data/db_config.js'

export const alunoIndex = async (req, res) => {
    try {
        const alunos = await dbKnex.select("*").from("alunos")
        res.status(200).json(alunos)
    } catch (error) {
        res.status(400).json({ id: 0, msg: "Erro: " } + error.message)
    }
}

export const insereAluno = async (req, res) => {
    const { nome, sobrenome, matricula, curso, cpf } = req.body

    if (!nome || !sobrenome || !matricula || !curso || !cpf) {
        res.json({ id: 0, msg: "Todos os campos devem ser preenchidos!" })
        return
    }
    if (verificaDados(matricula, cpf)) {
        try {
            const verificaAluno = await dbKnex.select("*").from("alunos").where({ matricula }).orWhere({ cpf })
            if (verificaAluno.length != 0) {
                res.status(400).json({ msg: "Aluno já cadastrado" })
                return
            }
            const novoAluno = await dbKnex("alunos").insert({ nome, sobrenome, matricula, curso, cpf })
            res.json({ id: novoAluno[0], msg: "Ok! Aluno inserido com sucesso" })
        } catch (error) {
            res.status(400).json({ id: 0, msg: "Erro: " } + error.message)
        }
    } else {
        res.status(400).json({ id: 0, msg: `Matricula ou cpf incorretos! \n Matricula: ${matricula} CPF: ${cpf}` })
        return
    }
}

export const alunoUpdate = async (req, res) => {
    const { matricula } = req.params;
    const { nome, sobrenome, curso, cpf } = req.body


    if (!nome || !sobrenome || !curso) {
        res.json({ id: 0, msg: "Todos os campos devem ser preenchidos!" })
        return
    }
    if (verificaDados(matricula, cpf)) {
        try {
            const verificaAluno = await dbKnex.select("*").from("alunos").where({ matricula })
            if (verificaAluno.length == 1) {
                const alunoAlterado = await dbKnex('alunos').where({ matricula }).update({ nome, sobrenome, curso, cpf })
                res.status(200).json({ id: alunoAlterado, msg: "Ok! Aluno alterado com sucesso" })
            } else {
                res.status(400).json({ id: 0, msg: "Há mais de um aluno com a mesma matrícula ou o aluno não existe!" })
                return
            }
        } catch (error) {
            res.status(400).json({ id: 0, msg: "Erro: " } + error.message)
        }
    }
    else {
        res.status(400).json({ id: 0, msg: `Matricula ou cpf incorretos! Matricula: ${matricula} CPF: ${cpf}` })
        return
        
    }
}

export const alunoDelete = async (req, res) => {
    const { matricula } = req.params;
    try {
        await dbKnex("alunos").where({ matricula }).del()
        res.status(200).json({msg:"Aluno excluído com sucesso"})
    } catch (error) {
        res.status(400).json({ id: 0, msg: "Erro: " } + error.message)
    }
}

export const alunoPesq = async (req, res) => {
    const { matricula } = req.params
    try {
        const alunoEncontrado = await dbKnex.select("*").from("alunos").where({ matricula })
        alunoEncontrado.length != 0 ? res.status(200).json({ aluno: alunoEncontrado[0], msg: "Aluno encontrado com sucesso!"}) : res.status(400).json({ id: 0, msg: "Nenhum aluno foi encontrado! Por favor cadastre o aluno primeiramente." })
    } catch {
        res.status(400).json({ id: 0, msg: "Erro: " } + error.message)
    }
}

const verificaDados = (matricula, cpf,) => {
    let matVet = matricula.toString().split('')
    let cpfVet = cpf.toString().split('')

    if (matVet.length != 9 || cpfVet.length != 11) {
        return false
    }
    return true
}