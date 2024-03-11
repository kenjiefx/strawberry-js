class __TestAObject {
    __testProperty
    constructor(__testProperty){
        this.__testProperty = __testProperty
    }
    __testMethod(){

    }
}

class __TestBObject{
    __testProperty
    __testBProperty
    constructor( __testBProperty ){
        this.__testProperty = __testBProperty
    }
    __testMethod(testBProperty){
        this.__testBProperty = testBProperty
    }
}

const test = new __TestAObject
test.__testMethod()