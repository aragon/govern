import fastify, { FastifyInstance } from 'fastify'
import { TransactionReceipt } from '@ethersproject/abstract-provider'

import { Request } from '../lib/AbstractAction'
import Configuration from './config/Configuration'
import Provider from './provider/Provider'
import Wallet from './wallet/Wallet'

import Database from './db/Database'
import Whitelist, { ListItem } from './db/Whitelist'
import Admin from './db/Admin'
import Authenticator from './auth/Authenticator'

import ExecuteTransaction from './transactions/execute/ExecuteTransaction'
import ChallengeTransaction from './transactions/challenge/ChallengeTransaction'
import ScheduleTransaction from './transactions/schedule/ScheduleTransaction'

import AddItemAction from './whitelist/AddItemAction'
import DeleteItemAction from './whitelist/DeleteItemAction'
import GetListAction from './whitelist/GetListAction'
import AbstractTransaction from '../lib/transactions/AbstractTransaction'
import AbstractWhitelistAction from '../lib/whitelist/AbstractWhitelistAction'

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
     * @property {Whitelist} whitelist
     * 
     * @private
     */
    private whitelist: Whitelist

    /**
     * @property {Provider} provider
     * 
     * @private
     */
    private provider: Provider

    /**
     * @property {Database} database
     * 
     * @private
     */
    private database: Database

    /**
     * @param {Configuration} config 
     * 
     * @constructor
     */
    constructor(private config: Configuration) {
        this.setServer()
        this.setDatabase()
        this.setProvider()
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
     * Register all transaction related routes
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
                return new ExecuteTransaction(this.config.ethereum, this.provider, request.params as Request).execute()
            }
        )
        
        this.server.post(
            '/schedule',
            {schema: AbstractTransaction.schema},
            (request): Promise<TransactionReceipt> => {
                return new ScheduleTransaction(this.config.ethereum, this.provider, request.params as Request).execute()
            }
        )
        
        this.server.post(
            '/challenge',
            {schema: AbstractTransaction.schema},
            (request): Promise<TransactionReceipt> => {
                return new ChallengeTransaction(this.config.ethereum, this.provider, request.params as Request).execute()
            }
        )
    }

    /**
     * Register all whitelist related routes
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
            (request): Promise<ListItem> => {
                return new AddItemAction(this.whitelist, request.params as Request).execute()
            }
        )
        
        this.server.delete(
            '/whitelist',
            {schema: AbstractWhitelistAction.schema},
            (request): Promise<boolean> => {
                return new DeleteItemAction(this.whitelist, request.params as Request).execute()
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
            }
        })
    }

    /**
     * Initiates the database instance
     * 
     * @method setProvider
     * 
     * @returns {void}
     * 
     * @private
     */
    private setDatabase(): void {
        this.database = new Database(this.config.database)
    }

    /**
     * Initiates the provider instance
     * 
     * @method setProvider
     * 
     * @returns {void}
     * 
     * @private
     */
    private setProvider(): void {
        this.provider = new Provider(this.config.ethereum, new Wallet(this.database))
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
        const admin = new Admin(this.database);
        this.whitelist =  new Whitelist(this.database)


        this.authenticator = new Authenticator(
            this.whitelist,
            admin,
        )
        
        this.server.addHook(
            'preHandler',
            this.authenticator.authenticate.bind(this.authenticator)
        )
    }
}
