import * as React from 'react';
import { SearchIcon } from '../../assets/SearchIcon';
import { sp } from '@pnp/sp';
import '@pnp/sp/search';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/folders';
import '@pnp/sp/files';
import { SearchResults } from '@pnp/sp/search';
import { FilePdf, Link, MicrosoftExcelLogo, MicrosoftPowerpointLogo, MicrosoftWordLogo, Note, File, Folder, Image, List } from 'phosphor-react';
import { ISiteUserInfo } from '@pnp/sp/site-users/types';
import '@pnp/sp/site-users';
import { CancelIcon } from '../../assets/CancelIcon';

interface zones {
  Title: string;
  Id: number;
}

export function SearchModal(): JSX.Element {
  const [radioFilter, setRadioFilter] = React.useState<string>('');
  const [searchText, setSearchText] = React.useState<string>('');
  const [typeSearch, setTypeSearch] = React.useState<string>('Todos');
  const [searchResults, setSearchResults] = React.useState<SearchResults>();
  const [typeFilter, setTypeFilter] = React.useState<string>('');
  const [zones, setZones] = React.useState<zones[]>();
  const [zoneFilter, setZoneFilter] = React.useState<number>(0);
  const [zoneData, setZoneData] = React.useState<any[]>([]);
  const [currentUser, setCurrentUser] = React.useState<ISiteUserInfo>();
  const [clearerFilter, setClearFilter] = React.useState<boolean>(false)

  const search = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value)
    if (!zoneFilter) {
      sp.search(
        {
          Querytext: event.target.value,
          QueryTemplate: `${radioFilter === "Relevancia" ? '(modifiedby:{User} OR createdby:{user}) AND ' : ''}${typeFilter ? `${typeFilter} AND ` : ''}SiteName:https://fsbioenergia.sharepoint.com/sites/IntranetFS2 AND ParentLink:https://fsbioenergia.sharepoint.com/sites/IntranetFS2/DocumentosAreas/Forms/AllItems.aspx`,
          SortList: radioFilter && radioFilter !== "A-Z" ? [{ Property: 'LastModifiedTime', Direction: 1 }] : []
        }
      ).then((searchResult) => {
        setSearchResults(searchResult)
      })
    }
  }
  const filterRadio = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRadioFilter(event.target.value);
    if (!zoneData) {
      if (event.target.value === "Relevancia") {
        sp.search({
          Querytext: searchText ? searchText : '*',
          QueryTemplate: `${radioFilter === "Relevancia" ? '(modifiedby:{User} OR createdby:{user}) AND ' : ''}${typeFilter ? `${typeFilter} AND ` : ''}SiteName:https://fsbioenergia.sharepoint.com/sites/IntranetFS2`,
          SortList: [{ Property: 'LastModifiedTime', Direction: 1 }]
        }).then((searchResult) => {
          setSearchResults(searchResult)
        })
      }
      else if (event.target.value === "Recentes") {
        sp.search({
          Querytext: searchText ? searchText : '*',
          QueryTemplate: `${typeFilter ? `${typeFilter} AND ` : ''}SiteName:https://fsbioenergia.sharepoint.com/sites/IntranetFS2`,
          SortList: [{ Property: 'LastModifiedTime', Direction: 1 }]
        }).then((searchResult) => {
          setSearchResults(searchResult)
        })
      }
    } else {
      if (event.target.value === "Relevancia") {
        setZoneData(zoneData.sort((item, item2) => item.AuthorId === currentUser.Id ? 1 : item2.AuthorId > item.AuthorId ? 0 : -1))
      }
      else if (event.target.value === "Recentes") {
        setZoneData(zoneData.sort((a, b) => { return new Date(a.Modified) > new Date(b.Modified) ? -1 : new Date(a.Modified) < new Date(b.Modified) ? 1 : 0 }));
      }
      else {
        setZoneData(zoneData.sort((a, b) => a.FileLeafRef.localeCompare(b.FileLeafRef)));
      }
    }
  }
  React.useEffect(() => {
    sp.search({ Querytext: '*', QueryTemplate: 'SiteName:https://fsbioenergia.sharepoint.com/sites/IntranetFS2' }).then((searchResult) => setSearchResults(searchResult));
    sp.web.lists.getByTitle('Areas').items.getAll()
      .then((zones) => {
        setZones(zones);
      })
    sp.web.currentUser().then((data) => {
      setCurrentUser(data)
    })
  }, [clearerFilter])

  const onZoneFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setZoneFilter(parseInt(event.target.value));
    if (radioFilter) {
      if (radioFilter === "Revelancia") {
        console.log(radioFilter)
        sp.web.lists.getByTitle('DocumentosAreas').items
          .select('FileLeafRef, AreaId, TipoDocumento, FileRef, AuthorId,  Modified').filter(`AreaId eq ${event.target.value}`).top(20).get()
          .then((data) => {
            setZoneData(data.sort((item, item2) => item.AuthorId === currentUser.Id ? 1 : item2.AuthorId > item.AuthorId ? 0 : -1))
          })
      } else if (radioFilter === "Recentes") {
        console.log(radioFilter)
        sp.web.lists.getByTitle('DocumentosAreas').items.orderBy('Modified', false)
          .select('FileLeafRef, AreaId, TipoDocumento, FileRef, AuthorId,  Modified').filter(`AreaId eq ${event.target.value}`).top(20).get()
          .then((data) => {
            setZoneData(data)
          })
      } else {
        console.log(radioFilter)
        sp.web.lists.getByTitle('DocumentosAreas').items.orderBy('FileLeafRef')
          .select('FileLeafRef, AreaId, TipoDocumento, FileRef, AuthorId,  Modified').filter(`AreaId eq ${event.target.value}`).top(20).get()
          .then((data) => {
            setZoneData(data)
          })
      }
    } else {
      sp.web.lists.getByTitle('DocumentosAreas').items
        .select('FileLeafRef, AreaId, TipoDocumento, FileRef, AuthorId,  Modified').filter(`AreaId eq ${event.target.value}`).getAll()
        .then((data) => {
          setZoneData(data)
        })
    }
  }

  const searchType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypeSearch(event.target.value)
    if (!zoneFilter) {
      if (event.target.value === "Todos") {
        setTypeFilter('');
        sp.search({
          Querytext: searchText ? searchText : '*',
          QueryTemplate: `${radioFilter === "Relevancia" ? '(modifiedby:{User} OR createdby:{user}) AND ' : ''}SiteName:https://fsbioenergia.sharepoint.com/sites/IntranetFS2`,
          SortList: radioFilter && radioFilter !== "A-Z" ? [{ Property: 'LastModifiedTime', Direction: 1 }] : []
        }).then((searchResult) => {
          setSearchResults(searchResult)
        })
      }
      else if (event.target.value === "Links") {
        setTypeFilter('FileType:aspx')
        sp.search({
          Querytext: searchText ? searchText : '*',
          QueryTemplate: `${radioFilter === "Relevancia" ? '(modifiedby:{User} OR createdby:{user}) AND ' : ''}FileType:aspx AND SiteName:https://fsbioenergia.sharepoint.com/sites/IntranetFS2`,
          SortList: radioFilter && radioFilter !== "A-Z" ? [{ Property: 'LastModifiedTime', Direction: 1 }] : []
        }).then((searchResult) => {
          setSearchResults(searchResult)
        })
      } else if (event.target.value === "Documentos") {
        setTypeFilter('IsDocument:true AND FileType<>aspx')
        sp.search({
          Querytext: searchText ? searchText : '*',
          QueryTemplate: `${radioFilter === "Relevancia" ? '(modifiedby:{User} OR createdby:{user}) AND ' : ''} IsDocument:true AND FileType<>aspx ANDSiteName:https://fsbioenergia.sharepoint.com/sites/IntranetFS2`,
          SortList: radioFilter && radioFilter !== "A-Z" ? [{ Property: 'LastModifiedTime', Direction: 1 }] : []
        }).then((searchResult) => {
          setSearchResults(searchResult)
        })
      }
      else if (event.target.value === "Projetos") {
        setTypeFilter('ParentLink:https://fsbioenergia.sharepoint.com/sites/IntranetFS2/Lists/Projetos/AllItems.aspx')
        sp.search({
          Querytext: searchText ? searchText : '*',
          QueryTemplate: `${radioFilter === "Relevancia" ? '(modifiedby:{User} OR createdby:{user}) AND ' : ''}SiteName:https://fsbioenergia.sharepoint.com/sites/IntranetFS2 AND ParentLink:https://fsbioenergia.sharepoint.com/sites/IntranetFS2/Lists/Projetos/AllItems.aspx`,
          SortList: radioFilter && radioFilter !== "A-Z" ? [{ Property: 'LastModifiedTime', Direction: 1 }] : []
        }).then((searchResult) => {
          setSearchResults(searchResult)
        })
      } else if (event.target.value === "Áreas") {
        setTypeFilter('ParentLink:https://fsbioenergia.sharepoint.com/sites/IntranetFS2/DocumentosAreas/Forms/AllItems.aspx')
        sp.search({
          Querytext: searchText ? searchText : '*',
          QueryTemplate: `${radioFilter === "Relevancia" ? '(modifiedby:{User} OR createdby:{user}) AND ' : ''}SiteName:https://fsbioenergia.sharepoint.com/sites/IntranetFS2 AND ParentLink:https://fsbioenergia.sharepoint.com/sites/IntranetFS2/DocumentosAreas/Forms/AllItems.aspx`,
          SortList: radioFilter && radioFilter !== "A-Z" ? [{ Property: 'LastModifiedTime', Direction: 1 }] : []
        }).then((searchResult) => {
          setSearchResults(searchResult)
        })
      } else if (event.target.value === "Treinamentos") {
        setTypeFilter('TipoDocumento:Treinamento')
        sp.search({
          Querytext: searchText ? searchText : '*',
          QueryTemplate: `${radioFilter === "Relevancia" ? '(modifiedby:{User} OR createdby:{user}) AND ' : ''}SiteName:https://fsbioenergia.sharepoint.com/sites/IntranetFS2 AND Treinamento`,
          SortList: radioFilter && radioFilter !== "A-Z" ? [{ Property: 'LastModifiedTime', Direction: 1 }] : []
        }).then((searchResult) => {
          setSearchResults(searchResult)
        })
      } else if (event.target.value === "Ramais") {
        setTypeFilter('ParentLink:https://fsbioenergia.sharepoint.com/sites/IntranetFS2/Lists/Ramais/AllItems.aspx')
        sp.search({
          Querytext: searchText ? searchText : '*',
          QueryTemplate: `${radioFilter === "Relevancia" ? '(modifiedby:{User} OR createdby:{user}) AND ' : ''}SiteName:https://fsbioenergia.sharepoint.com/sites/IntranetFS2 AND ParentLink:https://fsbioenergia.sharepoint.com/sites/IntranetFS2/Lists/Ramais/AllItems.aspx`,
          SortList: radioFilter && radioFilter !== "A-Z" ? [{ Property: 'LastModifiedTime', Direction: 1 }] : []
        }).then((searchResult) => {
          setSearchResults(searchResult)
        })
      } else {
        console.log('Metódo não implementado')
      }
    }
  };


  const imageExtension = ['png', 'jpg', 'jpeg'];
  const docExtension = ['pdf', 'xls', 'doc'];
  const clearFilter = (Event: React.MouseEvent<HTMLAnchorElement>) => {
    setClearFilter(!clearerFilter)
    setTypeSearch('Todos');
    setTypeFilter('');
    setSearchText('');
    setRadioFilter('');
    setZoneFilter(0);
    setZoneData([])
  }
  return (
    <div className="search-Dialog">
      <div className="lateral-search-Dialog">
        <div className="lateral-search-header">FILTRAR BUSCA</div>
        <div className="lateral-search-filters">
          <div className="lateral-search-header-filter">ORDENAR POR</div>
          <label className="checkbox-lateral-search">
            <input type="radio" checked={radioFilter === "Relevancia"} onChange={filterRadio} value="Relevancia" name="orderby" className="lateral-search-radio" />
            Relevância
          </label>
          <label className="checkbox-lateral-search">
            <input type="radio" checked={radioFilter === "Recentes"} onChange={filterRadio} value="Recentes" name="orderby" className="lateral-search-radio" />
            Recentes
          </label>
          <label className="checkbox-lateral-search">
            <input type="radio" checked={radioFilter === "A-Z"} onChange={filterRadio} value="A-Z" name="orderby" className="lateral-search-radio" />
            A-Z
          </label>
          <div className="lateral-search-header-filter" style={{ marginTop: '24px' }}>ÁREAS</div>
          {zones ? zones.map((zone) => {
            return (
              <label className="checkbox-lateral-search">
                <input type="radio" checked={zoneFilter === zone.Id} name="zoneFilter" onChange={onZoneFilter} value={zone.Id} className="lateral-search-radio" />
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
              onChange={search}
              type="text"
              className="search-dialog-inputbox"
              placeholder="Digite o termo que deseja buscar" />
            {searchText || typeSearch !== "Todos" || typeFilter || zoneFilter || radioFilter ?
              <a onClick={clearFilter} className="clear-filters">
                <CancelIcon />
                Limpar Filtros
              </a> : null
            }
          </div>
          <div className='row-filter-search'>
            <label className='top-filter'>
              <input type='radio' onChange={searchType} className='top-filter-input' value="Todos" checked={typeSearch === "Todos"} />
              <span className='top-filter-label'>Todos</span>
            </label>
            <label className='top-filter'>
              <input type='radio' onChange={searchType} className='top-filter-input' value="Links" checked={typeSearch === "Links"} />
              <span className='top-filter-label'>Links</span>
            </label>
            <label className='top-filter'>
              <input type='radio' onChange={searchType} className='top-filter-input' value="Documentos" checked={typeSearch === "Documentos"} />
              <span className='top-filter-label'>Documentos</span>
            </label>
            <label className='top-filter'>
              <input type='radio' onChange={searchType} className='top-filter-input' value="Projetos" checked={typeSearch === "Projetos"} />
              <span className='top-filter-label'>Projetos</span>
            </label>
            <label className='top-filter'>
              <input type='radio' onChange={searchType} className='top-filter-input' value="Áreas" checked={typeSearch === "Áreas"} />
              <span className='top-filter-label'>Áreas</span>
            </label>
            <label className='top-filter'>
              <input type='radio' onChange={searchType} className='top-filter-input' value="Treinamentos" checked={typeSearch === "Treinamentos"} />
              <span className='top-filter-label'>Treinamentos</span>
            </label>
            <label className='top-filter'>
              <input type='radio' onChange={searchType} className='top-filter-input' value="Ramais" checked={typeSearch === "Ramais"} />
              <span className='top-filter-label'>Ramais</span>
            </label>
            <label className='top-filter'>
              <input type='radio' onChange={searchType} className='top-filter-input' value="FAQ" checked={typeSearch === "FAQ"} />
              <span className='top-filter-label'>FAQ</span>
            </label>
          </div>
        </div>
        <div className="items-result-search">
          {zoneFilter ? searchText ? zoneData.filter(item => item.FileLeafRef.includes(searchText)).map((item, index) => {
            return (
              <a href={item.FileRef} style={{ marginLeft: '23px' }} key={index} className='last-access-item'>
                <div className='icon-last-access-item' style={{ backgroundColor: 'transparent' }}>
                  {!item.FileRef.includes('.') ?
                    <Folder size={32} /> :
                    imageExtension.filter(a => a === item.FileLeafRef.includes(a)).length ?
                      <Image size={32} /> :
                      item.FileRef.split('.')[0].includes('doc') ? <MicrosoftWordLogo size={28} /> :
                        item.FileRef.includes('xls') ? <MicrosoftExcelLogo size={28} /> :
                          item.FileRef.includes('pdf') ? <FilePdf size={28} /> :
                            item.FileRef.includes('ppt') ? <MicrosoftPowerpointLogo size={28} /> :
                              item.FileRef.includes('one') ? <Note size={28} />
                                : <File size={32} />}
                </div>
                <div className="last-access-item-content">
                  <div className="last-access-item-path">
                    {docExtension.filter(x => item.FileLeafRef.includes(x)).length ? "Documents" :
                      !item.FileLeafRef.includes('.') ? "Pasta" :
                        imageExtension.filter(a => item.FileLeafRef.includes(a)).length ? "Imagens" : ''}
                  </div>
                  <div className="last-access-item-filename">
                    {item.FileLeafRef.split('.')[0]}
                  </div>
                </div>
              </a>
            )
          }) : zoneData.map((item, index) => {
            return (
              <a href={item.FileRef} style={{ marginLeft: '23px' }} key={index} className='last-access-item'>
                <div className='icon-last-access-item' style={{ backgroundColor: 'transparent' }}>
                  {!item.FileRef.includes('.') ?
                    <Folder size={32} /> :
                    imageExtension.filter(a => a === item.FileLeafRef.includes(a)).length ?
                      <Image size={32} /> :
                      item.FileRef.split('.')[0].includes('doc') ? <MicrosoftWordLogo size={28} /> :
                        item.FileRef.includes('xls') ? <MicrosoftExcelLogo size={28} /> :
                          item.FileRef.includes('pdf') ? <FilePdf size={28} /> :
                            item.FileRef.includes('ppt') ? <MicrosoftPowerpointLogo size={28} /> :
                              item.FileRef.includes('one') ? <Note size={28} />
                                : <File size={32} />}
                </div>
                <div className="last-access-item-content">
                  <div className="last-access-item-path">
                    {docExtension.filter(x => item.FileLeafRef.includes(x)).length ? "Documents" :
                      !item.FileLeafRef.includes('.') ? "Pasta" :
                        imageExtension.filter(a => item.FileLeafRef.includes(a)).length ? "Imagens" : ''}
                  </div>
                  <div className="last-access-item-filename">
                    {item.FileLeafRef.split('.')[0]}
                  </div>
                </div>
              </a>
            )
          }) : searchResults ? radioFilter === "A-Z" ? searchResults.PrimarySearchResults.sort((a, b) => a.Title.localeCompare(b.Title)).map((item, index) => {
            return (
              <a href={item.ServerRedirectedURL ? item.ServerRedirectedURL : item.OriginalPath} key={index} className='last-access-item' style={{ marginLeft: '23px' }}>
                <div className='icon-last-access-item' style={{ backgroundColor: 'transparent' }}>
                  {item.contentclass === 'STS_ListItem_DocumentLibrary' && !item.FileType ? <Folder size={32} /> : imageExtension.filter(a => a === item.FileType).length ? <Image size={32} /> :
                    item.OriginalPath.includes('Lists') ? <List size={32} /> :
                      item.OriginalPath.includes('Ramais') ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.45 2.16667C3.5 2.90833 3.625 3.63333 3.825 4.325L2.825 5.325C2.48333 4.325 2.26667 3.26667 2.19167 2.16667H3.45ZM11.6667 12.1833C12.375 12.3833 13.1 12.5083 13.8333 12.5583V13.8C12.7333 13.725 11.675 13.5083 10.6667 13.175L11.6667 12.1833ZM4.25 0.5H1.33333C0.875 0.5 0.5 0.875 0.5 1.33333C0.5 9.15833 6.84167 15.5 14.6667 15.5C15.125 15.5 15.5 15.125 15.5 14.6667V11.7583C15.5 11.3 15.125 10.925 14.6667 10.925C13.6333 10.925 12.625 10.7583 11.6917 10.45C11.6083 10.4167 11.5167 10.4083 11.4333 10.4083C11.2167 10.4083 11.0083 10.4917 10.8417 10.65L9.00833 12.4833C6.65 11.275 4.71667 9.35 3.51667 6.99167L5.35 5.15833C5.58333 4.925 5.65 4.6 5.55833 4.30833C5.25 3.375 5.08333 2.375 5.08333 1.33333C5.08333 0.875 4.70833 0.5 4.25 0.5Z" fill="#14181F" /></svg> :
                        item.FileType ?
                          item.FileType.includes('doc') ? <MicrosoftWordLogo size={28} /> :
                            item.FileType.includes('xls') || item.FileType === "xlsb" ? <MicrosoftExcelLogo size={28} /> :
                              item.FileType === 'pdf' ? <FilePdf size={28} /> :
                                item.FileType.includes('ppt') ? <MicrosoftPowerpointLogo size={28} /> :
                                  item.FileType === 'one' ? <Note size={28} /> :
                                    item.FileType === "aspx" ? <Link size={28} /> : <File size={32} />
                          : <File size={32} />}
                </div>
                <div className="last-access-item-content">
                  <div className="last-access-item-path">
                    {item.OriginalPath.split(`${item.SPWebUrl}/`)[1] ? item.OriginalPath.split(`${item.SPWebUrl}/`)[1].split(`/${item.Title}`)[0] : ''}
                  </div>
                  <div className="last-access-item-filename">
                    {item.Title}
                  </div>
                </div>
              </a>
            )
          }) : searchResults.PrimarySearchResults.map((item, index) => {
            return (
              <a href={item.ServerRedirectedURL ? item.ServerRedirectedURL : item.OriginalPath} style={{ marginLeft: '23px' }} key={index} className='last-access-item'>
                <div className='icon-last-access-item' style={{ backgroundColor: 'transparent' }}>
                  {item.contentclass === "STS_List_DocumentLibrary" || item.contentclass === 'STS_ListItem_DocumentLibrary' ? <Folder size={32} /> : imageExtension.filter(a => a === item.FileType).length ? <Image size={32} /> :
                    item.OriginalPath.includes('Lists') ? <List size={32} /> :
                      item.OriginalPath.includes('Ramais') ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.45 2.16667C3.5 2.90833 3.625 3.63333 3.825 4.325L2.825 5.325C2.48333 4.325 2.26667 3.26667 2.19167 2.16667H3.45ZM11.6667 12.1833C12.375 12.3833 13.1 12.5083 13.8333 12.5583V13.8C12.7333 13.725 11.675 13.5083 10.6667 13.175L11.6667 12.1833ZM4.25 0.5H1.33333C0.875 0.5 0.5 0.875 0.5 1.33333C0.5 9.15833 6.84167 15.5 14.6667 15.5C15.125 15.5 15.5 15.125 15.5 14.6667V11.7583C15.5 11.3 15.125 10.925 14.6667 10.925C13.6333 10.925 12.625 10.7583 11.6917 10.45C11.6083 10.4167 11.5167 10.4083 11.4333 10.4083C11.2167 10.4083 11.0083 10.4917 10.8417 10.65L9.00833 12.4833C6.65 11.275 4.71667 9.35 3.51667 6.99167L5.35 5.15833C5.58333 4.925 5.65 4.6 5.55833 4.30833C5.25 3.375 5.08333 2.375 5.08333 1.33333C5.08333 0.875 4.70833 0.5 4.25 0.5Z" fill="#14181F" /></svg> :
                        item.FileType ?
                          item.FileType.includes('doc') ? <MicrosoftWordLogo size={28} /> :
                            item.FileType.includes('xls') || item.FileType === "xlsb" ? <MicrosoftExcelLogo size={28} /> :
                              item.FileType === 'pdf' ? <FilePdf size={28} /> :
                                item.FileType.includes('ppt') ? <MicrosoftPowerpointLogo size={28} /> :
                                  item.FileType === 'one' ? <Note size={28} /> :
                                    item.FileType === "aspx" ? <Link size={28} /> : <File size={32} />
                          : <File size={32} />}
                </div>
                <div className="last-access-item-content">
                  <div className="last-access-item-path">
                    {item.OriginalPath.split(`${item.SPWebUrl}/`)[1] ? item.OriginalPath.split(`${item.SPWebUrl}/`)[1].split(`/${item.Title}`)[0] : ''}
                  </div>
                  <div className="last-access-item-filename">
                    {item.Title}
                  </div>
                </div>
              </a>
            )
          }) : null}
        </div>
      </div>
    </div>
  )
}
