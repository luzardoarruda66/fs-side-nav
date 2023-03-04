import {IListItem} from "./IListItem";
import LinkField from "../Fields/LinkField";

export interface  ILogErrorListItem {
    Title: string;
    Erro: string;
    Link: LinkField;
}