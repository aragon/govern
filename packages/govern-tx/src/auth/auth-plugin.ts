import fp from 'fastify-plugin'
import Authenticator from './Authenticator'
import { Unauthorized } from 'http-errors'

export interface AuthOptions {
    authenticator: Authenticator,
    secret: string
}


function authPlugin(fastify, options: AuthOptions, next) {
    const authenticator = options.authenticator
    const secret = options.secret

    fastify.decorate('pkAuth', auth)

    next()

    function auth(request, reply, next) {
        if (request.header.autorization && authenticator.verify(request.header.autorization)) {
            next()
            return
        }
        
        const body = JSON.parse(request.body)
        const token = authenticator.authenticate(body.message, body.signature)
        if (!token) {
            reply()
            return
        }

        next(new Unauthorized('Unknown account!'))
    }
}


const plugin = fp(authPlugin, '3.x')
export default plugin
