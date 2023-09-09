export const createComponentId = (existingComponentId:string,currentId:string) => {
    return existingComponentId+'.'+currentId
}

export const sortComponentIds = (Ids:Array<string>) => {
    const sortedIds = []
    let largest = 1
    Ids.forEach(Id=>{
        if (Id.length>largest) largest = Id.length
    })
    let i = largest 
    while (i>0) {
        Ids.forEach(Id=>{
            if (Id.length===i) sortedIds.push(Id)
        })
        i--
    }
    return sortedIds
    // const sortedIds = []
    // let largest = 1
    // Ids.forEach(Id=>{
    //     if (Id.length>largest) largest = Id.length
    // })
    // let i = largest 
    // while (largest>i) {
    //     Ids.forEach(Id=>{
    //         if (Id.length===i) sortedIds.push(Id)
    //     })
    //     i++
    // }
    // return sortedIds
}