import fastify, { FastifyInstance } from 'fastify'
import Configuration from './config/Configuration'
import Database from './db/Database'
import Whitelist from './db/Whitelist'
import Authenticator, { JWTOptions } from './auth/Authenticator';

import ExecuteTransaction from './transactions/ExecuteTransaction'
import ChallengeTransaction from './transactions/ChallengeTransaction'
import ScheduleTransaction from './transactions/ScheduleTransaction'

import AddItemAction from './whitelist/AddItemAction'
import DeleteItemAction from './whitelist/DeleteItemAction'
import GetListAction from './whitelist/GetListAction'
import AbstractTransaction from '../lib/transactions/AbstractTransaction'
import AbstractWhitelistAction from '../lib/whitelist/AbstractWhitelistAction';

export default class Bootstrap {
    /**
     * @property {FastifyInstance} server
     * 
     * @private
     */
    private server: FastifyInstance

    /**
     * @property {Authenticator} authenticator
     * 
     * @private
     */
    private authenticator: Authenticator

    /**
     * @property {whitelist} Whitelist
     * 
     * @private
     */
    private whitelist: Whitelist

    /**
     * @param {Configuration} config 
     * 
     * @constructor
     */
    constructor(private config: Configuration) {
        this.setServer()
        this.setupAuth()
        this.registerTransactionRoutes()
        this.registerWhitelistRoutes()
    }

    /**
     * Starts the entire server
     * 
     * @method run
     * 
     * @returns {void}
     * 
     * @public
     */
    public run(): void {
        this.server.listen(
            this.config.server.port,
            this.config.server.host,
            (error: Error, address: string): void => {
                if (error) {
                    console.error(error)
                    process.exit(0)
                }
            
                console.log(`Server is listening at ${address}`)
            }
        )
    }

    /**
     * TODO: Could be done cleaner but don't think it is necessary
     * 
     * Register all transaction relates routes
     * 
     * @method registerTransactionRoutes
     * 
     * @returns {void}
     * 
     * @private
     */
    private registerTransactionRoutes(): void {
        this.server.post(
            '/execute',
            {schema: AbstractTransaction.schema},
            (request): Promise<TransactionReceipt> => {
                return new ExecuteTransaction(this.config, request.params).execute()
            }
        )
        
        this.server.post(
            '/schedule',
            {schema: AbstractTransaction.schema},
            (request): Promise<TransactionReceipt> => {
                return new ScheduleTransaction(this.config, request.params).execute()
            }
        )
        
        this.server.post(
            '/challenge',
            {schema: AbstractTransaction.schema},
            (request): Promise<TransactionReceipt> => {
                return new ChallengeTransaction(this.config, request.params).execute()
            }
        )
    }

    /**
     * TODO: Could be done cleaner but don't think it is necessary
     * 
     * Register all whitelist relates routes
     * 
     * @method registerWhitelistRoutes
     * 
     * @returns {void}
     * 
     * @private
     */
    private registerWhitelistRoutes(): void {
        this.server.post(
            '/whitelist',
            {schema: AbstractWhitelistAction.schema},
            (request): Promise<boolean> => {
                return new AddItemAction(this.whitelist, request.params).execute()
            }
        )
        
        this.server.delete(
            '/whitelist',
            {schema: AbstractWhitelistAction.schema},
            (request): Promise<boolean> => {
                return new DeleteItemAction(this.whitelist, request.params).execute()
            }
        )
        
        this.server.get(
            '/whitelist',
            {schema: AbstractWhitelistAction.schema},
            (): Promise<ListItem[]> => {
                return new GetListAction(this.whitelist).execute()
            }
        )
    }

    /**
     * Inititates the server instance
     * 
     * @method setServer
     * 
     * @returns {void}
     * 
     * @private
     */
    private setServer(): void {
        this.server = fastify({
            logger: {
                level: this.config.server.logLevel ?? 'debug'
            },
            ignoreTrailingSlash: true
            //https: {} TODO: Configure TLS
        })
    }

    /**
     * Registers the authentication handler
     * 
     * @method setupAuth
     * 
     * @returns {void}
     * 
     * @private
     */
    private setupAuth(): void {
        this.whitelist =  new Whitelist(new Database(this.config.database));

        this.authenticator = new Authenticator(
            this.server,
            this.whitelist,
            this.config.auth.secret,
            this.config.auth.cookieName,
            this.config.auth.jwtOptions
        )
        
        this.server.addHook(
            'preHandler',
            this.authenticator.authenticate.bind(this.authenticator)
        )
    }
}
