import { AddListItemWithLog } from '../services/sharePointRequests';
import { ILogErrorListItem } from "../fastShopHeaderExtension/models/Lists/ILogErrorListItem";

//Recupera nome da lista pelo ID
export const AddError = (nameApp: string, erroList: string, error: any) => new Promise((resolve, reject) => {

    //Adicona o erro no console para eventuais manutenções.
    console.log(error);

    //Cria o objeto de erro de item de lista.
    let logError: ILogErrorListItem = {
        Title: nameApp,
        Link: {
            Description: "",
            Url: window.location.href
        },
        Erro: error.message.toString()
    };

    //Adicona o erro na lista do SharePoint para eventuais logs.
    AddListItemWithLog(nameApp, erroList, null, logError)
        .then(title => {
            
            resolve(title);
        })
        .catch(err => {
            
            console.log(err);
        })
})