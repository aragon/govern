import { equalOverwrite } from './equal-overwrite';


export default function (chai: Chai.ChaiStatic, utils: Chai.ChaiUtils) {
    equalOverwrite(chai.Assertion, utils);
};