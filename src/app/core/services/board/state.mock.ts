import { BoardState } from '../../../models/index.model';

export const initialState: BoardState = {
  boards: {
    '9a1c8f3d-2b7e-4a58-9d3f-6c2b1e8d4f9a': {
      id: '9a1c8f3d-2b7e-4a58-9d3f-6c2b1e8d4f9a',
      title: 'Доска разработчика',
      columnIds: [
        'e3f5a7b2-8c1d-4e9f-a6b3-2c7d1e9f5a8b',
        'd2e6f8a1-9b4c-5d3e-7f1a-8b9c2d3e4f5a',
        'b4c6d8e2-1a3f-5b7d-9e1c-8a2b3f4d5e6a',
      ],
    },
    '7b5d3a9f-1e8c-4d2b-6f3a-9e1d5c8b2a4f': {
      id: '7b5d3a9f-1e8c-4d2b-6f3a-9e1d5c8b2a4f',
      title: 'Доска дизайнера',
      columnIds: [
        'a5b7c9d1-2e4f-6a8b-3c5d-7e9f1a2b3c4d',
        'f1e3d5a7-9b2c-4d6e-8f1a-3b5c7d9e2f4a',
        '8c2a4b6d-1e3f-5a7b-9c1d-2e4f6a8b3c5d',
        '3d5f7a9b-1c2e-4d6f-8a1b-3c5d7e9f2a4b',
      ],
    },
    '2e4f6a8b-3c5d-7e9f-1a2b-3c4d5e6f7a8b': {
      id: '2e4f6a8b-3c5d-7e9f-1a2b-3c4d5e6f7a8b',
      title: 'Личная доска',
      columnIds: [
        '1a3c5e7b-9d2f-4a6b-8c1d-3e5f7a9b2c4d',
        '6b8d2f4a-1c3e-5d7f-9a1b-2c3d4e5f6a7b',
        '9e1a3b5d-7f2c-4a6e-8b1d-2c3e5f7a9b1c',
      ],
    },
  },
  columns: {
    'e3f5a7b2-8c1d-4e9f-a6b3-2c7d1e9f5a8b': {
      id: 'e3f5a7b2-8c1d-4e9f-a6b3-2c7d1e9f5a8b',
      title: 'Бэклог',
      taskIds: [
        '8b77ec13-0b51-47bd-90c8-9fbc4ccb5982',
        'e75321c6-d9d2-4a0a-ae52-167b9c79742a',
        '6ea08a8a-11b6-4bab-a394-03bf22a2d434',
        '2cc9fbe2-844b-48bd-a110-a12ae5d76d59',
        '9094f4ff-1737-4cdd-b24e-0d958528ba57',
        'ab34bdc7-ec9b-44a0-b14d-10334e265552',
      ],
    },
    'd2e6f8a1-9b4c-5d3e-7f1a-8b9c2d3e4f5a': {
      id: 'd2e6f8a1-9b4c-5d3e-7f1a-8b9c2d3e4f5a',
      title: 'В работе',
      taskIds: [
        '090091dd-1261-468b-8cf0-a1c01b55710e',
        '0f8dba33-47a1-4f05-9696-64f5588803f0',
      ],
    },
    'b4c6d8e2-1a3f-5b7d-9e1c-8a2b3f4d5e6a': {
      id: 'b4c6d8e2-1a3f-5b7d-9e1c-8a2b3f4d5e6a',
      title: 'Готово',
      taskIds: [
        '344584bb-9fe7-4288-b455-7ec70a0e9024',
        'd2b49f59-8c4b-4c39-a2c6-9aa786dd8633',
      ],
    },
    'a5b7c9d1-2e4f-6a8b-3c5d-7e9f1a2b3c4d': {
      id: 'a5b7c9d1-2e4f-6a8b-3c5d-7e9f1a2b3c4d',
      title: 'To Do',
      taskIds: [
        '3e5f7a9b-1c2d-4e6f-8a1b-3c5d7e9f2a4b',
        '7a9b1c3d-5e2f-4a6b-8c1d-3e5f7a9b2c4d',
      ],
    },
    'f1e3d5a7-9b2c-4d6e-8f1a-3b5c7d9e2f4a': {
      id: 'f1e3d5a7-9b2c-4d6e-8f1a-3b5c7d9e2f4a',
      title: 'В работе',
      taskIds: ['2b4d6f8a-1c3e-5d7f-9a1b-2c3d4e5f6a7b'],
    },
    '8c2a4b6d-1e3f-5a7b-9c1d-2e4f6a8b3c5d': {
      id: '8c2a4b6d-1e3f-5a7b-9c1d-2e4f6a8b3c5d',
      title: 'На проверке',
      taskIds: ['9d1a3b5c-7e2f-4a6d-8b1c-2e3f5a7b9c1d'],
    },
    '3d5f7a9b-1c2e-4d6f-8a1b-3c5d7e9f2a4b': {
      id: '3d5f7a9b-1c2e-4d6f-8a1b-3c5d7e9f2a4b',
      title: 'Завершено',
      taskIds: ['4a6b8c1d-2e3f-5a7b-9c1d-2e4f6a8b3c5d'],
    },
    '1a3c5e7b-9d2f-4a6b-8c1d-3e5f7a9b2c4d': {
      id: '1a3c5e7b-9d2f-4a6b-8c1d-3e5f7a9b2c4d',
      title: 'To Do',
      taskIds: ['6699d606-ce33-4efd-b113-1000b8aea250'],
    },
    '6b8d2f4a-1c3e-5d7f-9a1b-2c3d4e5f6a7b': {
      id: '6b8d2f4a-1c3e-5d7f-9a1b-2c3d4e5f6a7b',
      title: 'В процессе',
      taskIds: [
        'dec2436a-df40-4e05-9824-5508e98f0ed4',
        '7e1b94eb-54ff-48e1-97a9-71d7efdae075',
      ],
    },
    '9e1a3b5d-7f2c-4a6e-8b1d-2c3e5f7a9b1c': {
      id: '9e1a3b5d-7f2c-4a6e-8b1d-2c3e5f7a9b1c',
      title: 'Сделано',
      taskIds: ['8e1a2b3c-4d5f-6a7b-8c9d-1e2f3a4b5c6d'],
    },
  },
  tasks: {
    '3e5f7a9b-1c2d-4e6f-8a1b-3c5d7e9f2a4b': {
      id: '3e5f7a9b-1c2d-4e6f-8a1b-3c5d7e9f2a4b',
      title: 'Дизайн главной страницы',
      description: 'Создать макет с учётом нового брендбука',
      status: 'new',
    },
    '7a9b1c3d-5e2f-4a6b-8c1d-3e5f7a9b2c4d': {
      id: '7a9b1c3d-5e2f-4a6b-8c1d-3e5f7a9b2c4d',
      title: 'Адаптив для мобильных устройств',
      description: 'Проработать breakpoints для основных экранов',
      status: 'new',
    },
    '2b4d6f8a-1c3e-5d7f-9a1b-2c3d4e5f6a7b': {
      id: '2b4d6f8a-1c3e-5d7f-9a1b-2c3d4e5f6a7b',
      title: 'Анимации интерфейса',
      description: 'Добавить микро-анимации для улучшения UX',
      status: 'done',
    },
    '9d1a3b5c-7e2f-4a6d-8b1c-2e3f5a7b9c1d': {
      id: '9d1a3b5c-7e2f-4a6d-8b1c-2e3f5a7b9c1d',
      title: 'UI Kit компоненты',
      description: 'Подготовить набор компонентов для передачи разработчикам',
      status: 'done',
    },
    '4a6b8c1d-2e3f-5a7b-9c1d-2e4f6a8b3c5d': {
      id: '4a6b8c1d-2e3f-5a7b-9c1d-2e4f6a8b3c5d',
      title: 'Лендинг продукта',
      description: 'Законченный дизайн для маркетинговой страницы',
      status: 'done',
    },
    '8e1a2b3c-4d5f-6a7b-8c9d-1e2f3a4b5c6d': {
      id: '8e1a2b3c-4d5f-6a7b-8c9d-1e2f3a4b5c6d',
      title: 'Оплатить счета',
      status: 'done',
    },
    '344584bb-9fe7-4288-b455-7ec70a0e9024': {
      id: '344584bb-9fe7-4288-b455-7ec70a0e9024',
      status: 'done',
      title: 'Залить BASE на GH',
      description: '',
    },
    'd2b49f59-8c4b-4c39-a2c6-9aa786dd8633': {
      id: 'd2b49f59-8c4b-4c39-a2c6-9aa786dd8633',
      status: 'done',
      title: 'Задеплоить gh-pages',
      description: 'Залить билд в gh-pages ветку',
    },
    '090091dd-1261-468b-8cf0-a1c01b55710e': {
      id: '090091dd-1261-468b-8cf0-a1c01b55710e',
      status: 'new',
      title: 'Добавить статусы таск',
      description: '',
    },
    'e75321c6-d9d2-4a0a-ae52-167b9c79742a': {
      id: 'e75321c6-d9d2-4a0a-ae52-167b9c79742a',
      status: 'new',
      title: 'Удаление колонок dnd',
      description: 'Удаление колонок через драг-дроп',
    },
    '8b77ec13-0b51-47bd-90c8-9fbc4ccb5982': {
      id: '8b77ec13-0b51-47bd-90c8-9fbc4ccb5982',
      status: 'new',
      title: 'Загрузка шрифтов',
      description: 'Убрать бесячую подгрузку шрифтов',
    },
    'dec2436a-df40-4e05-9824-5508e98f0ed4': {
      id: 'dec2436a-df40-4e05-9824-5508e98f0ed4',
      status: 'new',
      title: 'Грокаем алгоритмы',
      description: '5 глава',
    },
    '6ea08a8a-11b6-4bab-a394-03bf22a2d434': {
      id: '6ea08a8a-11b6-4bab-a394-03bf22a2d434',
      status: 'new',
      title: 'Поработать над стилями',
      description: '',
    },
    '0f8dba33-47a1-4f05-9696-64f5588803f0': {
      id: '0f8dba33-47a1-4f05-9696-64f5588803f0',
      status: 'new',
      title: 'Разбить логику на сервисы',
      description: 'board -> state+board+column+task',
    },
    '2cc9fbe2-844b-48bd-a110-a12ae5d76d59': {
      id: '2cc9fbe2-844b-48bd-a110-a12ae5d76d59',
      status: 'new',
      title: 'i18n',
      description: 'просто потому что хочу',
    },
    '9094f4ff-1737-4cdd-b24e-0d958528ba57': {
      id: '9094f4ff-1737-4cdd-b24e-0d958528ba57',
      status: 'new',
      title: 'накинуть алиасы',
      description: '',
    },
    'ab34bdc7-ec9b-44a0-b14d-10334e265552': {
      id: 'ab34bdc7-ec9b-44a0-b14d-10334e265552',
      status: 'new',
      title: 'Много чего надо',
      description: '',
    },
    '6699d606-ce33-4efd-b113-1000b8aea250': {
      id: '6699d606-ce33-4efd-b113-1000b8aea250',
      status: 'new',
      title: 'Купить продукты',
      description: 'Индейка, макорошки, посидорки',
    },
    '7e1b94eb-54ff-48e1-97a9-71d7efdae075': {
      id: '7e1b94eb-54ff-48e1-97a9-71d7efdae075',
      status: 'new',
      title: 'Любить Дашу',
      description: '¯\\_(ツ)_/¯',
    },
  },
};
