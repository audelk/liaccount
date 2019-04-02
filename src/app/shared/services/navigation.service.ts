import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

interface IMenuItem {
  type: string,       // Possible values: link/dropDown/icon/separator/extLink
  name?: string,      // Used as display text for item and title for separator type
  state?: string,     // Router state
  icon?: string,      // Material icon name
  tooltip?: string,   // Tooltip text 
  disabled?: boolean, // If true, item will not be appeared in sidenav.
  sub?: IChildItem[], // Dropdown items
  badges?: IBadge[]
}
interface IChildItem {
  type?: string,
  name: string,       // Display text
  state?: string,     // Router state
  icon?: string,
  sub?: IChildItem[]
}

interface IBadge {
  color: string;      // primary/accent/warn/hex color codes(#fff000)
  value: string;      // Display text
}

@Injectable()
export class NavigationService {
  constructor() { }

  defaultMenu: IMenuItem[] = [
  
  ]
  
  // Icon menu TITLE at the very top of navigation.
  // This title will appear if any icon type item is present in menu.
  iconTypeMenuTitle: string = 'Frequently Accessed';
  // sets iconMenu as default;
  menuItems = new BehaviorSubject<IMenuItem[]>(this.defaultMenu);
  // navigation component has subscribed to this Observable
  menuItems$ = this.menuItems.asObservable();

  // Customizer component uses this method to change menu.
  // You can remove this method and customizer component.
  // Or you can customize this method to supply different menu for
  // different user type.
  publishNavigationChange(menu) {
  
    this.menuItems.next(menu);
  }

  createMenu(accountID){
    let menu =[
   
     {
      name: 'Inbox',
      type: 'link',
      tooltip: 'Inbox',
      icon: 'contact_mail',
      state: '/inaccount/inbox/'
    },
     {
      name: 'Downloads',
      type: 'link',
      tooltip: 'Downloads',
      icon: 'file_download',
      state: '/inaccount/downloads/'
    },
    {
      name: 'Training',
      type: 'link',
      tooltip: 'Training Videos',
      icon: 'video_library',
      state: '/inaccount/training/'
    },
 
  
   
  ];
  return menu;
  }
}