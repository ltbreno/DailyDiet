import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { randomUUID } from "crypto"
import { knex } from "../database"
import { checkSessionIdExists } from "../middlewares/check-session-id-exist"

// Cookies <-> Formas da gente manter conteto entre requisicoes

// Testes unitarios
// Testes de integracao
// Teste e2e - ( ponta a ponta) : simula o usuario operando na nossa aplicacao

// back-end: chamadas Http, websockets

// Piramide de testes: E2E ( nao dependem de nenhuma tecnologia, nao dependem de arquitetura)
// 

//Todo plugin precisa ser uma funcao assincrona
export async function transactionsRoutes(app: FastifyInstance) {

    //Rota de pegar dados no bd
    app.get('/', {
        preHandler: [checkSessionIdExists]
    }, async (request, reply) => {
        
        const { sessionId } = request.cookies

        const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select()

        return { transactions }
    })

    //Rota para listar o resumo da sua conta
    app.get('/sumarry',{
        preHandler: [checkSessionIdExists]
    }, async(request) => {
        const { sessionId } = request.cookies

        const sumarry = await knex('transactions')
        .sum('amount', {as: 'amount'})
        .where('session_id', sessionId)
        .first()

        return { sumarry }
    })

    //Rota que busca uma transacao unica no bd
    app.get('/:id',{
        preHandler: [checkSessionIdExists]
    }, async (request) => {
        const getTransactionsParamsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = getTransactionsParamsSchema.parse(request.params)

        const { sessionId } = request.cookies

        const transaction = await knex('transactions')
        .where({
            session_id: sessionId,
            id,
        })
        .first()

        return { transaction }
    })
    
    // Rota de envidar dados para o bd
    app.post('/', {
        preHandler: [checkSessionIdExists]
    }, async (request, reply) => {
        // { title, amount, type: credit or debit }
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit']),
        })

        const { title, amount, type } = createTransactionBodySchema.parse(
            request.body
        )

        let sessionId = request.cookies.sessionId

        if(!sessionId) {
            sessionId = randomUUID()

            reply.cookie('sessionId', sessionId, {
                path: '/', // Assim todas as rotas tem acesso aos cookies
                maxAge: 60 * 60 * 24 * 7, // 7 days
            })
        }

        await knex('transactions').insert({
            id:randomUUID(),
            title,
            amount: type === 'credit' ? amount : amount * -1,
            session_id: sessionId
        })

        // 201 - recurso criado com sucesso

        return reply.status(201).send()
      })
}