import { test, beforeAll, afterAll, describe } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Transaction Routes', () => {

    beforeAll(async() => {
        await app.ready()
    })
    
    afterAll(async () => {
        await app.close()
    })
    
    test('user can create a new transaction', async () => {
        // Fazer a chamada HTTP p/ criar uma nova transacao
        // Todo teste precisar ter uma etapa de validacao
    
        await request(app.server)
        .post('/transactions')
        .send({
            title:'New transaction',
            amount: 5000,
            type: 'credit',
        })
        .expect(201)
    
    })
    
})
