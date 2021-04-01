import { arrayEqualOverwrite } from './array-overwrite';


export default function (chai: Chai.ChaiStatic, utils: Chai.ChaiUtils) {
    arrayEqualOverwrite(chai.Assertion, utils);
};