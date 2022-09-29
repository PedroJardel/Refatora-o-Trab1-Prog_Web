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

    try {
        if (verificaDados(nome, sobrenome, matricula, curso, cpf, true)) {
            const novoAluno = await dbKnex("alunos").insert({ nome, sobrenome, matricula, curso: curso.toUpperCase().trim(), cpf })
            res.json({ id: novoAluno[0], msg: "Ok! Aluno inserido com sucesso" })
        }
    } catch (error) {
        res.status(400).json({ id: 0, msg: "Erro: " } + error.message)
    }
}

export const alunoUpdate = async (req, res) => {
    const { matricula } = req.params;
    const { nome, sobrenome, curso, cpf } = req.body

    try {
        if (verificaDados(nome, sobrenome, matricula, curso, cpf, false)) {
            const alunoAlterado = await dbKnex('alunos').where({ matricula }).update({ nome, sobrenome, curso: curso.toUpperCase().trim(), cpf })
            res.status(200).json({ id: alunoAlterado, msg: "Ok! Aluno alterado com sucesso" })
        }
    } catch (error) {
        res.status(400).json({ id: 0, msg: "Erro: " } + error.message)
    }
}

export const alunoDelete = async (req, res) => {
    const { matricula } = req.params;
    try {
        await dbKnex("alunos").where({ matricula }).del()
        res.status(200).json({ msg: "Aluno excluído com sucesso" })
    } catch (error) {
        res.status(400).json({ id: 0, msg: "Erro: " } + error.message)
    }
}

export const alunoPesq = async (req, res) => {
    const { matricula } = req.params
    try {
        const alunoEncontrado = await dbKnex.select("*").from("alunos").where({ matricula })
        alunoEncontrado.length != 0 ? res.status(200).json({ aluno: alunoEncontrado[0], msg: "Aluno encontrado com sucesso!" }) :
            res.status(400).json({ id: 0, msg: "Nenhum aluno foi encontrado! Por favor cadastre o aluno primeiramente." })
    } catch (error) {
        res.status(400).json({ id: 0, msg: "Erro: " } + error.message)
    }
}

 const verificaDados = async (nome, sobrenome, matricula, curso, cpf, checkInsere) => {
    const matVetor = matricula?.toString().trim().split('')
    const cpfVetor = cpf?.toString().trim().split('')

    try {
        if (checkInsere == true) {
            const verificaAluno = await dbKnex.select("*").from("alunos").where({ matricula }).orWhere({ cpf })
            if (verificaAluno.length != 0) {
                throw new Error("Aluno já cadastrado!")
            }
            if (!nome || !sobrenome || !matricula || !curso || !cpf) {
                throw new Error("Os campos de nome, sobrenome, matricula, curso e cpf devem ser preenchidos")
            }
        }
        if (checkInsere == false && (!nome || !sobrenome || !curso || !cpf)) {
            throw new Error("Os campos de nome, sobrenome, curso e cpf devem ser preenchidos")
        }
        if (matVetor.length != 9 || cpfVetor.length != 11) {
            throw new Error("Matricula ou cpf incorretos")
        }
        for (const num of matVetor) {
            if (!(/[0-9]/).test(num)) {
                throw new Error("Matricula deve conter somente números")
            }
        }
        for (const num of cpfVetor) {
            if (!(/[0-9]/).test(num)) {
                throw new Error("CPF deve conter somente números")
            }
        }
        if (curso.toUpperCase().trim() != "ADS" && curso.toUpperCase().trim() != "RC") {
            throw new Error("Cadastro dos cursos de tecnologia somente em formato de abreviatura => ADS ou RC")
        }
        const verificaAluno = await dbKnex.select("*").from("alunos").where({ matricula })
        if (checkInsere == false && verificaAluno.length != 1) {
            throw new Error("Há mais de um aluno com a mesma matrícula ou o aluno não existe!")
        }
    } catch (error) {
        console.log(error)
        return false
    }
    return true
}
