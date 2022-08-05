export interface Item {
  id: string
  name: string
  menuParentId: string
  tabName: string
}

export interface MenuItem {
  id: string
  name: string
  icon: string
  children: (Item | MenuItem)[]
}

export const route: MenuItem[] = [
  {
    id: '1',
    name: 'Clienti',
    icon: 'clienti',
    children: [
      {
        id: '1a',
        name: 'Elenco clienti',
        menuParentId: '1',
        tabName: 'ElencoClienti',
      },
      {
        id: '1b',
        name: 'Ordine lavoro',
        menuParentId: '1',
        tabName: 'OrdineLavoro',
      },
      {
        id: '1c',
        name: 'Ordini cliente',
        menuParentId: '1',
        tabName: 'OrdineCliente',
      },
      {
        id: '1d',
        name: 'Elenco commesse',
        menuParentId: '1',
        tabName: 'ElencoCommesse',
      },
      {
        id: '1e',
        name: 'Elenco righe commesse',
        menuParentId: '1',
        tabName: 'ElencoRigheCommesse',
      },
      {
        id: '1f',
        name: 'Elenco parti da ordinare',
        menuParentId: '1',
        tabName: 'ElencoPartiDaOrdinare',
      },
      {
        id: '1g',
        name: 'Grezzi',
        menuParentId: '1',
        tabName: 'Grezzi',
      },
      {
        id: '1h',
        name: 'Analisi fattuato',
        menuParentId: '1',
        tabName: 'AnalisiFatturatoClienti',
      },
    ],
  },
  {
    id: '2',
    name: 'Fornitori',
    icon: 'fornitori',
    children: [
      {
        id: '2a',
        name: 'Elenco fornitori',
        menuParentId: '2',
        tabName: 'ElencoFornitori',
      },
      {
        id: '2b',
        name: 'Ordini fornitori',
        menuParentId: '2',
        tabName: 'AnalisiFatturatoClienti',
      },
      {
        id: '2c',
        name: 'Analisi fattuato',
        menuParentId: '2',
        tabName: 'AnalisiFatturatoFornitori',
      },
    ],
  },
  {
    id: '3',
    name: 'DDT',
    icon: 'ddt',
    children: [
      {
        id: '3a',
        name: 'DDT uscita',
        menuParentId: '3',
        tabName: 'DdtUscita',
      },
      {
        id: '3b',
        name: 'DDT uscita fornitori',
        menuParentId: '3',
        tabName: 'DdtUscitaFornitori',
      },
      {
        id: '3c',
        name: 'DDT entrata',
        menuParentId: '3',
        tabName: 'DdtEntrata',
      },
    ],
  },
  {
    id: '4',
    name: 'Fatture',
    icon: 'fatture',
    children: [
      {
        id: '4a',
        name: 'Fatture',
        menuParentId: '4',
        tabName: 'Fatture',
      },
      {
        id: '4b',
        name: 'Scadenze attive',
        menuParentId: '4',
        tabName: 'ScadenzeAttive',
      },
      {
        id: '4c',
        name: 'Fatture fornitori',
        menuParentId: '4',
        tabName: 'FattureFornitori',
      },
      {
        id: '4d',
        name: 'Scadenze passive',
        menuParentId: '4',
        tabName: 'ScadenzePassive',
      },
    ],
  },
  {
    id: '5',
    name: 'Ordini',
    icon: 'ordini',
    children: [
      {
        id: '5a',
        name: 'Richieste offerta',
        menuParentId: '5',
        tabName: 'RichiesteOfferta',
      },
      {
        id: '5b',
        name: 'Preventivi',
        menuParentId: '5',
        tabName: 'Preventivi',
      },
      {
        id: '5c',
        name: 'Offerte',
        menuParentId: '5',
        tabName: 'Offerte',
      },
    ],
  },
  {
    id: '6',
    name: 'Materiali',
    icon: 'materiali',
    children: [
      {
        id: '6a',
        name: 'Materiali',
        menuParentId: '6',
        tabName: 'Materiali',
      },
      {
        id: '6b',
        name: 'Materie prime',
        menuParentId: '6',
        tabName: 'MateriePrime',
      },
      {
        id: '6c',
        name: 'Certificati manufatti',
        menuParentId: '6',
        tabName: 'CertificatiManufatti',
      },
    ],
  },
  {
    id: '7',
    name: 'Magazzino',
    icon: 'magazzino',
    children: [
      {
        id: '7a',
        name: 'Magazzino',
        menuParentId: '7',
        tabName: 'Magazzino',
      },
      {
        id: '7b',
        name: 'Listino interno',
        menuParentId: '7',
        tabName: 'ListinoInterno',
      },
    ],
  },
  {
    id: '8',
    name: 'Tipi',
    icon: 'tipi',
    children: [
      {
        id: '8a',
        name: 'Attività',
        menuParentId: '8',
        tabName: 'Attivita',
      },
      {
        id: '8b',
        name: 'Certificati',
        menuParentId: '8',
        tabName: 'Certificati',
      },
      {
        id: '8c',
        name: 'Fasi lavorazione',
        menuParentId: '8',
        tabName: 'FasiLavorazione',
      },
      {
        id: '8d',
        name: 'Condizioni pagamento',
        menuParentId: '8',
        tabName: 'CondizioniPagamento',
      },
    ],
  },
  {
    id: '9',
    name: 'Listini',
    icon: 'listini',
    children: [
      {
        id: '9a',
        name: 'Listino Temponi',
        menuParentId: '9',
        tabName: 'ListinoTemponi',
      },
      {
        id: '9b',
        name: 'Listino SAPIO',
        menuParentId: '9',
        tabName: 'ListinoSapio',
      },
      {
        id: '9c',
        name: 'listino SOL',
        menuParentId: '9',
        tabName: 'ListinoSol',
      },
    ],
  },
  {
    id: '10',
    name: 'Disegni',
    icon: 'disegni',
    children: [
      {
        id: '10a',
        name: 'Disegni',
        menuParentId: '10',
        tabName: 'Disegni',
      },
    ],
  },
  {
    id: '11',
    name: 'Registri',
    icon: 'registri',
    children: [
      {
        id: '11a',
        name: 'Carico clienti',
        menuParentId: '11',
        tabName: 'CaricoClienti',
      },
      {
        id: '11b',
        name: 'Scarico clienti',
        menuParentId: '11',
        tabName: 'ScaricoClienti',
      },
      {
        id: '11c',
        name: 'Carico fornitori',
        menuParentId: '11',
        tabName: 'CaricoFornitori',
      },
      {
        id: '11d',
        name: 'Scarico fornitori',
        menuParentId: '11',
        tabName: 'ScaricoFornitori',
      },
    ],
  },
  {
    id: '12',
    name: 'Personale',
    icon: 'personale',
    children: [
      {
        id: '12a',
        name: 'Gestione personale',
        menuParentId: '12',
        tabName: 'GestionePersonale',
      },
      {
        id: '12b',
        name: 'Inserimento/Riepilogo ore',
        menuParentId: '12',
        tabName: 'InserimentoRiepilogoOre',
      },
      {
        id: '12c',
        name: 'Calendario presenze',
        menuParentId: '12',
        tabName: 'CalendarioPresenze',
      },
    ],
  },
  {
    id: '13',
    name: 'Test',
    icon: 'test',
    children: [
      {
        id: '13a',
        name: 'Test Albero',
        menuParentId: '13',
        tabName: 'TestAlbero',
      },
      {
        id: '13b',
        name: 'Test PDF',
        menuParentId: '13',
        tabName: 'TestPdf',
      },
      {
        id: '13c',
        name: 'Test Report Viewer',
        menuParentId: '13',
        tabName: 'TestReportViewer',
      },
      {
        id: '13d',
        name: 'Test Report Designer',
        menuParentId: '13',
        tabName: 'TestReportDesigner',
      },
      {
        id: '13e',
        name: 'Test Electron',
        menuParentId: '13',
        tabName: 'TestElectron',
      },
      {
        id: '13z',
        name: 'Test 2°livello',
        icon: 'clienti',
        children: [
          {
            id: '13za',
            name: 'Elemento1',
            menuParentId: '13z',
            tabName: 'Elemento1',
          },
          {
            id: '13zb',
            name: 'Elemento2',
            menuParentId: '13z',
            tabName: 'Elemento2',
          },
          {
            id: '13zc',
            name: 'Elemento3',
            menuParentId: '13z',
            tabName: 'Elemento3',
          },
        ],
      },
    ],
  },
]

const recursiveLookUp = (menuItem: MenuItem, pageId: string) =>
  menuItem.children.map((item: Item | MenuItem) => {
    if ('children' in item) return recursiveLookUp(item, pageId)
    return item.tabName === pageId ? item : false
  })

export const routeLookUp = (pageId: string): string => {
  if (!pageId) return 'NoName'
  const findObj = route
    .map((menuItem: MenuItem) => recursiveLookUp(menuItem, pageId))
    .flat(Infinity)
    .filter((item) => item !== false)

  if (findObj.length === 0) return 'NotFound'
  return findObj[0].name
}
