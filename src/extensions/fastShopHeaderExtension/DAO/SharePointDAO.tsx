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

export const GetIAllInformationSelectDAO = (list: string, filter: string, orderby: string,select: string,limitConsult: number) => new Promise((resolve, reject) => {
    sp.web.lists.getByTitle(list).items.orderBy(orderby).select(select).filter(filter).top(limitConsult).get()
        .then(res => {
            resolve(res);
        })
        .catch(err => {
            reject(err);
        });
})

// CRUD
//Adiciona um item de lista
export const AddListItemDAO = (list: string, item: any) => new Promise((resolve, reject) => {
    sp.web.lists.getByTitle(list).items.add(item)
        .then(newItem => {
            resolve(newItem);
        })
        .catch(err => {
            reject(err);
        })
})

