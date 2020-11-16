export default abstract class AbstractAction {
    /**
     * The parameters used to create the transaction
     * 
     * @var {Object} parameters
     */
    private parameters: any;

    /**
     * @param {Array<any>} parameters 
     * 
     * @constructor
     */
    constructor(parameters: any[]) {
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
     * Executes the actual action
     * 
     * @method execute
     * 
     * @returns {Promise<any>} 
     * 
     * @public
     */
    public abstract execute(): Promise<any>
}
