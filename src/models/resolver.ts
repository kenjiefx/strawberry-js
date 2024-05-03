/**
 * @class Resolver
 * Resolves all given expression
 */

import { __StrawberryElement } from "./element";
import { ScopeObject } from "./scope";

export class __Resolver {

    /**
     * @method _resolveExpression
     * Resolves an expression based on a given object
     * @param object baseObj
     * @param string expression
     *
     * @returns the value of the resolved expression
     */
    __resolveExpression(baseObj:ScopeObject,expression:string,element:Element|null=null){

        // We first determine what type of expression we will need to resolve.
        // This will be based on the structure of the operation
        let resolveType = this.__getResolveType(expression);

        // This is where the actual resolve process takes place
        return this.__resolve(baseObj,expression,resolveType,element);

    }

    /**
     * @method _getResolveType
     * Determines the type of an expression
     * @param string expression
     * @returns type of expression
     *
     * @NOTE: the expression should always have to be a string!
     */
    __getResolveType(expression){
        if (/^'.*'$/.test(expression)) return 'string';
        if (!isNaN(expression)) return 'number';
        if (expression.includes('(')) return 'function';
        if (expression.includes('==')) return 'boolOperation';
        if (expression.includes('is ')) return 'boolOperation';
        if (expression.includes('+') || expression.includes('-') || expression.includes('/') || expression.includes('*') || expression.includes('%')) {
            return 'operation';
        }
        if (expression=='false' || expression=='true' || expression=='null') {
            return 'boolean';
        }
        return 'object';
    }
    __resolve(scopeObj,expression,resolveType,element:Element|null=null){

        switch (resolveType) {

            // CASE: STRING
            case 'string':
                return expression.slice(1,-1);
                break;

            case 'boolean':
                if (expression=='true') return true;
                if (expression=='false') return false;
                if (expression=='null') return null;
                break;

            // CASE: OBJECT
            case 'object':
                return this.__evalObject(scopeObj,expression);
                break;

            // CASE: FUNCTION
            case 'function':

                /**
                 * @function _invokeFunction
                 * Invokes/calls a given function based on the function expression
                 *
                 * @param object refObject - The object where the function to invoke is a member of
                 * @param object argScope - The object where we can reference the argument expression
                 * of the function to invoke
                 * @param string functionExpression - The function expression, for example
                 * myFunction(arg)
                 */
                let _invokeFunction=(refObject,argScope,functionExpression)=>{

                    /**
                     * @TODO Need to check cases where this returns undefined
                     * One example,this returns undefined in cases when the 
                     * repeats are nested together
                     */
                    if (refObject===undefined) return ''

                    // Parses function structure
                    let splitfunctionExpression = functionExpression.match(/\(([^)]+)\)/);
                    let funcStruct = functionExpression.split('(');
                    let funcName = funcStruct[0];

                    // If function has an argument
                    if (splitfunctionExpression!==null) {

                        // Function argument holder
                        var argObj = new Array;

                        let splitFunctionArguments = splitfunctionExpression[1].split(',');
                        for(var i = 0; i < splitFunctionArguments.length; i++) {
                            argObj.push(this.__resolveExpression(argScope,splitFunctionArguments[i]));
                        }

                        if (element!==null) {
                            argObj.push(new __StrawberryElement(element));
                        }

                        // Checks if the given is a function
                        if (!(refObject[funcName] instanceof Function)) {
                            return '';
                        }

                        return refObject[funcName](...argObj);
                    }

                    // When there is no argument added to the function, and
                    // if there is an element passed to the Resolver
                    // that means that we need to add the element as one of the
                    // arguments of the referenced function to call
                    if (element!==null) {

                        // Function argument holder
                        var argObj = new Array;
                        argObj.push(new __StrawberryElement(element));

                        return refObject[funcName](...argObj);
                    }


                    if (!(refObject[funcName] instanceof Function)) {
                        return '';
                    }

                    // If it has no argument, and no Element object is required to
                    // be passed as argument to the referenced function to call
                    return refObject[funcName]();
                }


                let funcStruct = expression.split('(');

                // Checks to see if structure of a function resembles an object
                let expressionTest = funcStruct[0].split('.');

                // If the said function is a method of an object
                if (expressionTest.length>1) {

                    let refObject =this.__resolveExpression(scopeObj,this.__getParentObjectExp(funcStruct[0]));

                    let funcExpression = expression.split('.').slice(((expressionTest.length)-1)).join('.');

                    return _invokeFunction(refObject,scopeObj,funcExpression);
                }

                if (!scopeObj.hasOwnProperty(funcStruct[0])) {
                    // if (strawberry.debug) {
                    //     console.warn('strawberry.js: Unable to resolve $scope.'+expression);
                    // }
                    return '';
                }

                return _invokeFunction(scopeObj,scopeObj,expression);

                break;

            // CASE: BOOLEAN OPERATION
            case 'boolOperation':

                let isTheSame=(left,right)=>{
                    return (left===right);
                }

                let isNotTheSame=(left,right)=>{
                    return (left!==right);
                }

                if (expression.includes('!==')) {
                    let comparables = expression.split('!==');
                    return isNotTheSame(this.__resolveExpression(scopeObj,comparables[0].trim()),this.__resolveExpression(scopeObj,comparables[1].trim()));
                }
                else if (expression.includes('==')) {
                    let comparables = expression.split('==');
                    return isTheSame(this.__resolveExpression(scopeObj,comparables[0].trim()),this.__resolveExpression(scopeObj,comparables[1].trim()));
                }
                else if (expression.includes('is not ')) {
                    let comparables = expression.split('is not');
                    return isNotTheSame(this.__resolveExpression(scopeObj,comparables[0].trim()),this.__resolveExpression(scopeObj,comparables[1].trim()));
                }
                else if (expression.includes('is ')) {
                    let comparables = expression.split('is');
                    return isTheSame(this.__resolveExpression(scopeObj,comparables[0].trim()),this.__resolveExpression(scopeObj,comparables[1].trim()));
                }

                else {

                }

                break;

            case 'number':
                return Number(expression);
                break;

            case 'operation':

                let finalExpression = expression;

                let operations = ['+','-','*','/','%'];
                for (var i = 0; i < operations.length; i++) {

                    if (expression.includes(operations[i])) {
                        let exp = expression.split(operations[i]);
                        let left = this.__resolveExpression(scopeObj,exp[0].trim());
                        var right = this.__resolveExpression(scopeObj,exp[1].trim());
                        finalExpression = left+operations[i]+right;
                    }
                }

                return eval(finalExpression);
                break;
        }
    }
    __evalObject(scopeObj,objectExpression){
        if (objectExpression==='$scope') {
            return scopeObj;
        }
        return objectExpression.split(".").reduce(function(o,x){
            if (o===undefined) {
                return;
            }
            if (o[x]===undefined) {
                return;
            }
            return o[x];
        }, scopeObj);
    }
    __getParentObjectExp(expression){
        let expressionPieces = expression.split('.');
        if (expressionPieces.length<2) return '$scope';
        expressionPieces.pop();
        return expressionPieces.join('.');

    }
    __getChildObjectExp(expression){
        let expressionPieces = expression.split('.');
        return expressionPieces[expressionPieces.length - 1];
    }
    __getParentObjAsObject(baseObj,objExpression){
        let parentObjExpression = this.__getParentObjectExp(objExpression);
        return this.__resolveExpression(baseObj,parentObjExpression);
    }
}