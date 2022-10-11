$block:function(args,contextObj){
    let blocks = strawberry.$getAtElementFrom(document,BLOCK_ELEMENT_ATTR,args.name);
    let b = 0;
    for (var i = 0; i < blocks.length; i++) {
        let block = blocks[i];
        if (strawberry.$isScopeOfComponent(block,contextObj.getName())) {
            args.each(new Element(block),b);
            b++;
        }
    }
}
