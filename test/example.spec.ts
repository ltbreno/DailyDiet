import { it, beforeAll, afterAll, describe } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { create } from 'domain'

describe('Transaction Routes', () => {

    beforeAll(async() => {
        await app.ready()
    })
    
    afterAll(async () => {
        await app.close()
    })
    
    // Deve ser possivel fazer tal coisa
    it('should be able create a new transaction', async () => {
        // Fazer a chamada HTTP p/ criar uma nova transacao
        // Todo teste precisar ter uma etapa de validacao
    
        const response = await request(app.server)
        .post('/transactions')
        .send({
            title:'New transaction',
            amount: 5000,
            type: 'credit',
        })
        .expect(201)
    
    console.log(response.headers)
    })
    // Jamais pode se escrever um teste que depende de outro teste!!
    it('should be able to list all transactions', async () => {
        const createTransactionResponse = await request(app.server)
        .post('/transactions')
        .send({
            title:'New transaction',
            amount: 5000,
            type: 'credit',
        })
        const cookies = createTransactionResponse.get('Set-Cookie')

        const listTransactionResponse = await request(app.server)
        .get('/transactions')
        .set('Cookie', cookies)
        .expect(200)

        console.log(listTransactionResponse.body)
    })
})
