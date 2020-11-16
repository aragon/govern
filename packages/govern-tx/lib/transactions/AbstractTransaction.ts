
export default abstract class AbstractTransaction {
    /**
     * The function signature used to create a transaction
     * 
     * @var signature
     * 
     * @protected
     */
    protected signature: string;

    /**
     * The parameters used to create the transaction
     * 
     * @var {Array<any> parameters}
     */
    private parameters: any[];

    /**
     * @param {Configuration} configuration 
     * @param {Array<any>} parameters 
     * 
     * @constructor
     */
    constructor(private configuration: Configuration, parameters: any[]) {
        this.parameters = this.validateParameters(parameters);
     }

     /**
      * Validates the given parameters.
      * 
      * @method validateParameters 
      * 
      * @param {Array<any>} parameters 
      * 
      * @returns {Array<any>}
      * 
      * @protected
      */
    protected validateParameters(parameters: any[]): any[] {
        return parameters;
    }

    /**
     * Executes the transaction and returns the TransactionReceipt
     * 
     * @method execute
     * 
     * @returns {Promise<TransactionReceipt>} 
     * 
     * @public
     */
    public execute(): Promise<TransactionReceipt> {
        // TODO
    }
}