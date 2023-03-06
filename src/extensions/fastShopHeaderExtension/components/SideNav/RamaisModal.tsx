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
        <div className="lateral-search-header">FILTRAR BUSCA</div>
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
