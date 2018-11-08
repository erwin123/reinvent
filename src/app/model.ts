export class Menu {
    Text:string;
    Path:string;
    Icon:string;
}

export class Article{
    Id:number;
    Title:string;
    Text:string;
    CreatedBy:string;
    CreatedDate:string;
    ArticleCode:string;
    MediaType:string;
    MediaPath:string;
    Status:number;
    Shared:number;
    Viewed:number;
}

export class Comment{
    Id:number;
    ArticleCode:string;
    CreatedBy:string;
    CreatedDate:string;
    Text:string;
    Status:number;
}

export class ArticleLikes{
    Id:number;
    ArticleCode:string;
    Username:string;
}

export class UserCategory{
    Username:string;
    CategoryCode:string;
}

export class Category{
    Id:number;
    CategoryName:string;
    CategoryCode:string;
}

export class User{
    Id;
    Username:string;
    FirstName:string;
    LastName:string;
    BirthDate:string;
    Gender:number;
    Phone:string;
    Address:string;
    City:string;
    Photo:string;
}

export class Account{
    username:string="";
    password:string="";
}