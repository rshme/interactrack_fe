/*=========================================================================================
  File Name: sidebarItems.js
  Description: Sidebar Items list. Add / Remove menu items from here.
  Strucutre:
          url     => router path
          name    => name to display in sidebar
          slug    => router path name
          icon    => Feather Icon component/icon name
          tag     => text to display on badge
          tagColor  => class to apply on badge element
          i18n    => Internationalization
          submenu   => submenu of current item (current item will become dropdown )
                NOTE: Submenu don't have any icon(you can add icon if u want to display)
          isDisabled  => disable sidebar item/group
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default [
  // {
  //   url: "/apps/email",
  //   name: "Email",
  //   slug: "email",
  //   icon: "MailIcon",
  //   i18n: "Email",
  // },
  {
    url: '/dashboard/analytics',
    name: 'Dashboard',
    icon: 'HomeIcon',
    i18n: 'Dashboard'
  },
  {
    url: '/user',
    name: 'User',
    icon: 'UserIcon',
    i18n: 'User'
  },
  {
    header: 'Contact Management',
    icon: 'UsersIcon',
    i18n: 'Contact Management',
    items: [
      {
        url: '/contact',
        name: 'Contact',
        slug: 'contact',
        icon: 'BookIcon',
        i18n: 'Kontak'
      },
      {
        url: '/interaction',
        name: 'Interaction',
        slug: 'interaction',
        icon: 'BookOpenIcon',
        i18n: 'Catatan Interaksi'
      }
    ]
  },
  {
    header: 'Sales Management',
    icon: 'PackageIcon',
    i18n: 'Sales Management',
    items: [
      {
        url: '/quotation',
        name: 'Faktur',
        slug: 'quotation',
        icon: 'FileTextIcon',
        i18n: 'Faktur'
      },
      {
        url: '/invoice',
        name: 'Invoices',
        slug: 'invoices',
        icon: 'FileTextIcon',
        i18n: 'Invoice'
      },
      {
        url: '/report',
        name: 'Report',
        slug: 'report',
        icon: 'FileIcon',
        i18n: 'Laporan Penjualan'
      }
    ]
  }
]

