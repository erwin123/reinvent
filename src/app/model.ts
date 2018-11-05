export class Menu {
    Text:string;
    Path:string;
    Icon:string;
}

export class Article{
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
    ArticleCode:string;
    CreatedBy:string;
    CreatedDate:string;
    Text:string;
    Status:number;
}

export class ArticleLikes{
    ArticleCode:string;
    Username:string;
}

export class User{
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
