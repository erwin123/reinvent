export class Menu {
    Text: string;
    Path: string;
    Icon: string;
}

export class Article {
    Id: number;
    Title: string;
    Text: string;
    CreatedBy: string;
    CreatedDate: string;
    ArticleCode: string;
    MediaType: string;
    MediaPath: string;
    Status: number;
    Shared: number;
    Viewed: number;
}

export class Comment {
    Id: number;
    ArticleCode: string;
    CreatedBy: string;
    CreatedDate: string;
    Text: string;
    Status: number;
}

export class ArticleLikes {
    Id: number;
    ArticleCode: string;
    Username: string;
}

export class UserCategory {
    Username: string;
    CategoryCode: string;
}

export class Category {
    Id: number;
    CategoryName: string;
    CategoryCode: string;
    Thumbnail: string;
    Color:string;
}

export class User {
    Id:number=0;
    Username: string;
    FirstName: string;
    LastName: string;
    BirthDate: string;
    Gender: string;
    Phone: string;
    Address: string;
    City: string;
    Photo: string;
    About:string;
}

export class Account {
    username: string = "";
    password: string = "";
}

export class AuthData {
    auth: boolean = false;
    profilepic: string = "";
    orn: string = "";
    username: string = "";
}