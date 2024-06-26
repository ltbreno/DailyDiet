import 'dotenv/config'
import {z} from 'zod'


// ambientes NODE_ENV developmente, test, production
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
    DATABASE_URL: z.string(),
    PORT: z.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
    console.error('Invalid enviroment variable', _env.error.format)

    throw new Error('Invalid enviroment variables.')
}

export const env = _env.data