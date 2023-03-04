import axios from 'axios';
import { IList } from "@pnp/sp/lists";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import { isConstructorDeclaration } from 'typescript';
import { AddListItemDAO, GetIAllInformationSelectDAO } from "../fastShopHeaderExtension/DAO/SharePointDAO";
import { AddError } from "../services/LogErrorService";

var webUrl = window.location.protocol + "//" + window.location.hostname + "/" + window.location.pathname.split('/')[1] + "/" + window.location.pathname.split('/')[2];
sp.setup({
    sp: {
        headers: {
            Accept: "application/json;odata=verbose",
        },
        baseUrl: webUrl
    },
});


//Setup necessário para retorno de infomações em formato JSON
sp.setup({
    sp: {
        headers: {
            Accept: "application/json;odata=verbose",
        },
        baseUrl: webUrl
    },
});

export const GetNavigationMenu = () => new Promise((resolve, reject) => {
    let url = webUrl + "/_api/navigation/menustate";
    axios.get(url)
        .then(res => {
            resolve(res.data.Nodes);
        })
        .catch((e: Error) => {
            reject(e);
        })
})

export const GetListAllItens = (listName: string) => new Promise((resolve, reject) => {
    let url = webUrl + "/_api/web/lists/GetByTitle('" + listName + "')/items";
    axios.get(url)
        .then(res => {
            resolve(res.data.value);
        })
        .catch((e: Error) => {
            reject(e);
        })
})

export const GetUserById = async (user) => {
    let results = await sp.web.siteUsers.getById(user).get()
        return results
}

export const AddListItem = (listGuid: string, item: any) => new Promise((resolve, reject) => {
    sp.web.lists.getByTitle(listGuid).items.add(item)
        .then(newItem => {
            resolve(newItem);
        })
        .catch(err => {
            reject(err);
        })
})

//Adiciona um item de lista com log de erro
export const AddListItemWithLog = (nameApp: string, listGuid: string, errorList: string, item: any) => new Promise((resolve, reject) => {
    AddListItemDAO(listGuid, item)
        .then(newItem => {
            resolve(newItem);
        })
        .catch(err => {
            if (errorList != null) {
                AddError(nameApp, errorList, err);
            }
            reject(null);
        })
})


export const GetListAllOrderFilterData = (listName: string, filter: string, order: string) => new Promise((resolve, reject) => {
    let url = webUrl + "/_api/web/lists/GetByTitle('" + listName + "')/items?$top=1000&$filter=" + filter + "&$orderby=" + order;
    axios.get(url)
        .then(res => {
            resolve(res.data.value);
        })
        .catch((e: Error) => {
            reject(e);
        })
})

export const GetCurrentPage = (listName: string, filter) => new Promise((resolve,reject) => {
    let url = webUrl + "/_api/web/lists/GetByTitle('" + listName + "')/items?$top=1000&$filter=" + filter;
    axios.get(url)
        .then(res => {
            resolve(res.data.value);
        })
        .catch((e: Error) => {
            reject(e);
        })
})

export const GetListAllOrderFilterDataExpand = (listName: string, filter: string, select: string,  order: string) => new Promise((resolve, reject) => {
    let url = webUrl + "/_api/web/lists/GetByTitle('" + listName + "')/items?$top=1000&$filter=" + filter + "&$select=" + select + "&$orderby=" + order;
    axios.get(url)
        .then(res => {
            resolve(res.data.value);
        })
        .catch((e: Error) => {
            reject(e);
        })
})


export const GetCurrentUser = async () => new Promise((resolve, reject) => {
    sp.web.currentUser.get().then(r => {
        resolve(r);
    }).catch(err => {
        reject(err);
    })
})

export const GetAllItensSelect = (nameApp: string, library: string, errorList: string, filter: string, orderby: string, select: string, limitConsult: number) => new Promise((resolve, reject) => {
    GetIAllInformationSelectDAO(library, filter, orderby, select, limitConsult)
        .then(res => {
            resolve(res);
        })
        .catch(err => {
            if (errorList != null) {
                AddError(nameApp, errorList, err);
            }
            reject(null);
        })
})
