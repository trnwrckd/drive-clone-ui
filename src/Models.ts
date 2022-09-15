export interface Ancestor{
    "id" : string,
    "name" : string
}

export interface Folder{
    "_id" ?: any,
    "name" : string,
    "type" : string,
    "level" : number,
    "ancestors" : Ancestor[],
    "parent" ?: string
}

export const MyDrive : Folder = {
    "_id" : "-1",
    "name": "My Drive",
    "type": "folder",
    "level": 0,
    "ancestors": []
}