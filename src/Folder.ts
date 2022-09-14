interface Ancestor{
    "id" : string,
    "name" : string
}

export interface Folder{
    "_id" : any,
    "name" : string,
    "type" : string,
    "level" : number,
    "ancestors" : Ancestor[],
    "parent" ?: string
}