import * as React from "react";
import { IconButton } from "office-ui-fabric-react/lib/Button";
import SideNavNode from "./SideNavNode";
import ISideNavItem from "./model/ISideNavItem";
import ISideNavProvider from "./provider/ISideNavProvider";
import SideNavProvider from "./provider/SideNavProvider";
import ISideNavProps from "./ISideNavProps";
import ISideNavState from "./ISideNavState";
import { SearchIcon } from "../../assets/SearchIcon";
import { Dialog } from '@fluentui/react';
import { SearchModal } from "./searchModal";
import { SearchRamais } from "./RamaisModal";

const DEFAULT_HISTORY_HANDLER = "OriginalPushStateHandler";

export default class SideNav extends React.Component<
  ISideNavProps,
  ISideNavState
> {
  constructor(props) {
    super(props)
  }
  private sideNavProvider: ISideNavProvider;


  state = {
    siteNavItems: [],
    isOpened: true,
    showDialog: false,
    showRamais: false,
    searchText: '',
    showEditLink: document.location.href.indexOf("Mode=Edit") !== -1
  }

  public componentWillMount(): void {
    this.sideNavProvider = new SideNavProvider();
  }

  componentDidUpdate(prevProps: Readonly<ISideNavProps>, prevState: Readonly<ISideNavState>, snapshot?: any): void {
    if (!window[DEFAULT_HISTORY_HANDLER]) {
      window[DEFAULT_HISTORY_HANDLER] = history.pushState;
    }

    const _pushState = () => {
      const _defaultPushState = window[DEFAULT_HISTORY_HANDLER];
      const _self = this;
      return function (data: any, title: string, url?: string | null) {
        _self.setState({
          showEditLink: url.indexOf('Mode=Edit') !== -1
        });
        return _defaultPushState.apply(this, [data, title, url]);
      };
    };
    history.pushState = _pushState();
  }

  public componentDidMount(): void {
    if (!window[DEFAULT_HISTORY_HANDLER]) {
      window[DEFAULT_HISTORY_HANDLER] = history.pushState;
    }

    // Binding to page mode changes
    const _pushState = () => {
      const _defaultPushState = window[DEFAULT_HISTORY_HANDLER];
      // We need the current this context to update the component its state
      const _self = this;
      return function (data: any, title: string, url?: string | null) {
        // We need to call the in context of the component
        _self.setState({
          showEditLink: url.indexOf('Mode=Edit') !== -1
        });

        // Call the original function with the provided arguments
        // This context is necessary for the context of the history change
        return _defaultPushState.apply(this, [data, title, url]);
      };
    };
    history.pushState = _pushState();
    document.getElementById('sp-appBar').style.width = '260px';
    window.addEventListener("click", this.handleOutsideClick, true);

    this.sideNavProvider
      .getSideNav()
      .then((result: ISideNavItem[]): void => {
        this.setState({
          siteNavItems: result,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    if (window.innerWidth === 1024) {
      this.setState({ isOpened: false })
    }
    window.addEventListener('resize', (ev) => {
      if (window.innerWidth === 1024) {
        this.setState({ isOpened: false })
      }
      else if (window.innerHeight > 1024) {
        this.setState({ isOpened: true })
      }
    })

  }

  public render(): JSX.Element {
    const siteMenuClass: string = this.state.isOpened
      ? "site-menu opened"
      : "site-menu";
    const toggleIconName: string = this.state.isOpened
      ? "DoubleChevronLeft8"
      : "DoubleChevronRight8";

    console.log(this.state.showEditLink)
    if (this.state.showEditLink) {
      const clickPublishButton = () => {
        const publishButton = document.querySelector('[data-automation-id="pageCommandBarPublishButton"]');
        const discardChanges = document.querySelector('[data-automation-id="discardButton"]');
        if (publishButton && discardChanges) {
          console.log(publishButton,)
          publishButton.addEventListener('click', () => this.setState({ showEditLink: false }))
          discardChanges.addEventListener('click', () => this.setState({ showEditLink: false }))
          clearInterval(interval);
        }
      }
      const interval = setInterval(clickPublishButton, 500);
    }

    return (
      <div
        id='side-menu-id-to-hide'
        className={`site-menu-panel ms-slideRightIn40 visible-i`}
        style={{
          visibility: "hidden",
          display: this.state.showEditLink ? 'none' : 'flex'
        }} /* set to hidden then onces css loads it will be visible */
      ><link rel="stylesheet" type="text/css" href='https://fsbioenergia.sharepoint.com/sites/IntranetFS2/CustomStyle/fsbioenergy.css' />
        <div className={siteMenuClass}>
          <img src={require(this.state.isOpened ? '../../assets/logomenu.png' : '../../assets/logomini.png')} style={{ backgroundColor: 'transparent', marginLeft: '14px', marginTop: '14px' }} />
          <button className="search-btn-side" onClick={() => this.setState({ showDialog: true })} style={{ overflow: 'hidden', width: this.state.isOpened ? '' : '30px' }}>
            <SearchIcon isOpen={this.state.isOpened} />{this.state.isOpened ? 'Buscar por...' : ''}
          </button>
          {this.state.siteNavItems.length > 0 &&
            this.state.siteNavItems.map(this.renderSideNavNodes)}
          <div className="fixed-links-side-nav" style={{ marginTop: '200px' }}>
            <div className="site-nav-node">
              <div className="menu" onClick={() => this.setState({ showRamais: true })}>
                <div className="icon-node ms-fadeIn400">
                  <div className="icon ms-fadeIn400">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.45 2.16667C3.5 2.90833 3.625 3.63333 3.825 4.325L2.825 5.325C2.48333 4.325 2.26667 3.26667 2.19167 2.16667H3.45ZM11.6667 12.1833C12.375 12.3833 13.1 12.5083 13.8333 12.5583V13.8C12.7333 13.725 11.675 13.5083 10.6667 13.175L11.6667 12.1833ZM4.25 0.5H1.33333C0.875 0.5 0.5 0.875 0.5 1.33333C0.5 9.15833 6.84167 15.5 14.6667 15.5C15.125 15.5 15.5 15.125 15.5 14.6667V11.7583C15.5 11.3 15.125 10.925 14.6667 10.925C13.6333 10.925 12.625 10.7583 11.6917 10.45C11.6083 10.4167 11.5167 10.4083 11.4333 10.4083C11.2167 10.4083 11.0083 10.4917 10.8417 10.65L9.00833 12.4833C6.65 11.275 4.71667 9.35 3.51667 6.99167L5.35 5.15833C5.58333 4.925 5.65 4.6 5.55833 4.30833C5.25 3.375 5.08333 2.375 5.08333 1.33333C5.08333 0.875 4.70833 0.5 4.25 0.5Z" fill="#14181F" /></svg>
                  </div>
                  {this.state.isOpened &&
                    <div className="title noselect">
                      Ramais FS
                    </div>
                  }
                </div>
              </div>
            </div>
            {/*             <div className="site-nav-node">
              <div className="menu" onClick={() => window.location.href = "http://google.com/"}>
                <div className="icon-node ms-fadeIn400">
                  <div className="icon ms-fadeIn400">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.16669 14.0001H9.83335V12.3334H8.16669V14.0001ZM9.00002 0.666748C4.40002 0.666748 0.666687 4.40008 0.666687 9.00008C0.666687 13.6001 4.40002 17.3334 9.00002 17.3334C13.6 17.3334 17.3334 13.6001 17.3334 9.00008C17.3334 4.40008 13.6 0.666748 9.00002 0.666748ZM9.00002 15.6667C5.32502 15.6667 2.33335 12.6751 2.33335 9.00008C2.33335 5.32508 5.32502 2.33341 9.00002 2.33341C12.675 2.33341 15.6667 5.32508 15.6667 9.00008C15.6667 12.6751 12.675 15.6667 9.00002 15.6667ZM9.00002 4.00008C7.15835 4.00008 5.66669 5.49175 5.66669 7.33342H7.33335C7.33335 6.41675 8.08335 5.66675 9.00002 5.66675C9.91669 5.66675 10.6667 6.41675 10.6667 7.33342C10.6667 9.00008 8.16669 8.79175 8.16669 11.5001H9.83335C9.83335 9.62508 12.3334 9.41675 12.3334 7.33342C12.3334 5.49175 10.8417 4.00008 9.00002 4.00008Z" fill="#14181F" /></svg>
                  </div>
                  {this.state.isOpened &&
                    <div className="title noselect">
                      FAQ
                    </div>
                  }
                </div>
              </div>
            </div> */}
            <div className="site-nav-node">
              <div className="menu" onClick={() => window.location.href = "https://fsbioenergia.topdesk.net/"}>
                <div className="icon-node ms-fadeIn400">
                  <div className="icon ms-fadeIn400">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0.5C3.85833 0.5 0.5 3.85833 0.5 8V13.8333C0.5 14.75 1.25 15.5 2.16667 15.5H5.5V8.83333H2.16667V8C2.16667 4.775 4.775 2.16667 8 2.16667C11.225 2.16667 13.8333 4.775 13.8333 8V8.83333H10.5V15.5H13.8333C14.75 15.5 15.5 14.75 15.5 13.8333V8C15.5 3.85833 12.1417 0.5 8 0.5ZM3.83333 10.5V13.8333H2.16667V10.5H3.83333ZM13.8333 13.8333H12.1667V10.5H13.8333V13.8333Z" fill="#14181F" /></svg>
                  </div>
                  {this.state.isOpened &&
                    <div className="title noselect">
                      TopDesk
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="menu-toggle">
          {
            <IconButton
              className={"site-menu-icon"}
              checked={false}
              iconProps={{
                iconName: toggleIconName
              }}
              title="Toggle Menu"
              ariaLabel="Toggle Menu"
              onClick={this.toggleNav}
            />
          }
        </div>
        {/* Dialog*/}
        <Dialog
          isOpen={this.state.showDialog}
          modalProps={{ className: "dialog-box" }}
          onDismiss={() => this.setState({ showDialog: false })}
          dialogContentProps={{ showCloseButton: false }}>
          <SearchModal />
        </Dialog>
        <Dialog
          isOpen={this.state.showRamais}
          modalProps={{ className: "dialog-box" }}
          onDismiss={() => this.setState({ showRamais: false })}
          dialogContentProps={{ showCloseButton: false }}>
          <SearchRamais isOpen={this.state.showRamais} />
        </Dialog>
        <img src={require('../../assets/logofooter.png')} style={{ display: 'none' }} />
      </div>
    );
  }
  private handleOutsideClick = (event: any) => {
    if (!this.state.isOpened) {
      return;
    } // if site nav is already closed, abort
    let foundSideNavPanel: boolean = false;
    if (event.path) {
      for (let i: number = 0; i < event.path.length; i++) {
        const node: HTMLElement = event.path[i];
        if (!node.className) {
          continue;
        } // skip if no class name
        if (node.className.toLowerCase().indexOf("site-menu-panel") !== -1) {
          foundSideNavPanel = true;
          break;
        }
      }

      if (!foundSideNavPanel) {
        this.toggleNav(); // if no site menu panel found, close the site menu
      }
    }
  };

  private toggleNav = (): void => {
    const expand = document.getElementById('sp-appBar');
    if (expand) {
      expand.style.width = !this.state.isOpened ? '260px' : '48px';
    }
    this.setState((state, props) => ({
      isOpened: !state.isOpened,
    }));
  };

  private renderSideNavNodes = (
    siteNavItem: ISideNavItem,
    index: number
  ): JSX.Element => {
    return (
      <SideNavNode
        key={index}
        siteNavItem={siteNavItem}
        navIsOpened={this.state.isOpened}
      />
    );
  };
}
