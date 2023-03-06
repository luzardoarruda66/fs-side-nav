import * as React from 'react';
import { SearchIcon } from '../../assets/SearchIcon';
import { sp } from '@pnp/sp';
import '@pnp/sp/search';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/folders';
import '@pnp/sp/files';
import '@pnp/sp/site-users';
import { CancelIcon } from '../../assets/CancelIcon';

interface contactItem {
  Id: number;
  Title: string;
  telefone: string;
  Icone: string;
  AreaId: number;
  modified: string;
}

interface zones {
  Title: string;
  Id: number;
}

interface SearchModalProps {
  isOpen: boolean
}

export function SearchRamais(props: SearchModalProps): JSX.Element {
  const [zoneData, setZoneData] = React.useState<zones[]>([]);
  const [searchText, setSearchText] = React.useState<string>('');
  const [contacts, setContacts] = React.useState<contactItem[]>([]);
  const [selectedZone, setSelectedZone] = React.useState<number>(0);
  const [selectedOrder, setSelectedOrder] = React.useState<string>('')

  const filteredContacts: contactItem[] = contacts.filter((item: contactItem) => item.Title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").indexOf(searchText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > -1 && selectedZone ? item.AreaId === selectedZone : true)

  React.useEffect(() => {
    sp.web.lists.getByTitle('Areas').items.getAll()
      .then((zones) => {
        setZoneData(zones);
      })
    sp.web.lists.getByTitle('Ramais').items.getAll()
      .then((data: contactItem[]) => {
        setContacts(data)
      })
      .catch((er) => {
        console.log(er)
      })
  }, []);

  const onZoneFilter = (Event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedZone(parseInt(Event.target.value))
  }

  const orderBy = (Event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOrder(Event.target.value);
    if (Event.target.value === 'A-Z') {
      setContacts(contacts.sort((a, b) => a.Title.localeCompare(b.Title)));
    } else {
      setContacts(contacts.sort((a, b) => new Date(a.modified).getTime() < new Date(b.modified).getTime() ? 1 : -1));
    }
  };

  const clearFilter = (Event: React.MouseEvent<HTMLAnchorElement>) => {
    setSelectedOrder('');
    setSelectedZone(0);
    setSearchText('');
    setContacts(contacts.sort((a, b) => a.Id - b.Id));
  }


  return (
    <div className="search-Dialog">
      <div className="lateral-search-Dialog">
        <div className="lateral-search-header ramais-search">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.675 10.8167C13.65 10.8167 12.6583 10.65 11.7333 10.35C11.4417 10.25 11.1167 10.325 10.8917 10.55L9.58333 12.1917C7.225 11.0667 5.01667 8.94167 3.84167 6.5L5.46667 5.11667C5.69167 4.88333 5.75833 4.55833 5.66667 4.26667C5.35833 3.34167 5.2 2.35 5.2 1.325C5.2 0.875 4.825 0.5 4.375 0.5H1.49167C1.04167 0.5 0.5 0.7 0.5 1.325C0.5 9.06667 6.94167 15.5 14.675 15.5C15.2667 15.5 15.5 14.975 15.5 14.5167V11.6417C15.5 11.1917 15.125 10.8167 14.675 10.8167Z" fill="#22272F" />
          </svg>
          Ramais FS
          </div>
        <div className="lateral-search-filters">
          <div className="lateral-search-header-filter">ORDENAR POR</div>
          <label className="checkbox-lateral-search">
            <input type="radio" checked={selectedOrder === "Recentes"} onChange={orderBy} value="Recentes" name="orderby" className="lateral-search-radio" />
            Recentes
          </label>
          <label className="checkbox-lateral-search">
            <input type="radio" checked={selectedOrder === "A-Z"} onChange={orderBy} value="A-Z" name="orderby" className="lateral-search-radio" />
            A-Z
          </label>
          <div className="lateral-search-header-filter" style={{ marginTop: '24px' }}>ÁREAS</div>
          {zoneData.length ? zoneData.map((zone) => {
            return (
              <label className="checkbox-lateral-search">
                <input type="radio" checked={selectedZone === zone.Id} name="zoneFilter" onChange={onZoneFilter} value={zone.Id} className="lateral-search-radio" />
                {zone.Title}
              </label>
            )
          }) : null}
        </div>
      </div>
      <div className="principal-content-search">
        <div className="header-search-input">
          <div className="search-dialog-input">
            <SearchIcon isOpen={true} />
            <input
              value={searchText}
              onChange={(ev) => setSearchText(ev.target.value)}
              type="text"
              className="search-dialog-inputbox"
              placeholder="Digite o termo que deseja buscar" />
            {searchText || selectedOrder || selectedZone ?
              <a onClick={clearFilter} className="clear-filters">
                <CancelIcon />
                Limpar Filtros
              </a> : null
            }
          </div>
        </div>
        <div className="items-result-search ramais-search">
          {searchText || selectedZone ? filteredContacts.map((contact) => {
            return (
              <div className='contactsItem'>
                <div className='icon-contacts' dangerouslySetInnerHTML={{ __html: contact.Icone }} />
                <div>
                  <div className='contactsTitle'>{contact.Title}</div>
                  <div className='contactsNumber'>{contact.telefone}</div>
                </div>
              </div>
            )
          }) :
            contacts.map((contact) => {
              return (
                <div className='contactsItem'>
                  <div className='icon-contacts' dangerouslySetInnerHTML={{ __html: contact.Icone }} />
                  <div>
                    <div className='contactsTitle'>{contact.Title}</div>
                    <div className='contactsNumber'>{contact.telefone}</div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
