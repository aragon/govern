import fp from 'fastify-plugin'
import Authenticator from './Authenticator'
import { Unauthorized } from 'http-errors'
import fastifyCookie from 'fastify-cookie'

export interface AuthOptions {
    authenticator: Authenticator,
    secret: string,
    cookieName: string
}


function authPlugin(fastify, options: AuthOptions, next) {
    const authenticator = options.authenticator
    const secret = options.secret
    fastify.register(fastifyCookie)
    fastify.decorate('pkAuth', auth)

    next()

    function auth(request, reply, next) {
        if (authenticator.verify(request.cookies[options.cookieName])) {
            next()

            return
        }
        
        const body = JSON.parse(request.body)
        const token = authenticator.authenticate(body.message, body.signature)
        if (!token) {
            next(new Unauthorized('Unknown account!'))
            return
        }
        
        reply.setCookie(request.cookies[options.cookieName], token, {secure: true})
        next()
    }
}


const plugin = fp(authPlugin, '3.x')
export default plugin
