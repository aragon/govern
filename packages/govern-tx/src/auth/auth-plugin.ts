import fp from 'fastify-plugin'
import Authenticator from './Authenticator'
import { Unauthorized } from 'http-errors'
import fastifyCookie from 'fastify-cookie'

export interface AuthOptions {
    authenticator: Authenticator,
    cookieName: string
}

function authPlugin(fastify, options: AuthOptions, next) {
    const authenticator = options.authenticator
    fastify.register(fastifyCookie)
    fastify.decorate('authPlugin', auth)

    next()

    async function auth(request, reply, next) {
        const cookie = request.cookies[options.cookieName];
        
        if (cookie && authenticator.verify(cookie)) {
            next()

            return
        }
        
        const body = JSON.parse(request.body)
        const token = await authenticator.authenticate(body.message, body.signature)
        if (!token) {
            next(new Unauthorized('Unknown account!'))

            return
        }
        
        reply.setCookie(options.cookieName, token, {secure: true})
        next()
    }
}


const plugin = fp(authPlugin, '3.x')
export default plugin
