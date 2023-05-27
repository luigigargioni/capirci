export const endpoints = {
  customer: {
    list: {
      mod: 'customer',
      fnz: 'list',
    },
    get: {
      mod: 'customer',
      fnz: 'get',
    },
    update: {
      mod: 'customer',
      fnz: 'update',
    },
    delete: {
      mod: 'customer',
      fnz: 'delete',
    },
    setVeterinarian: {
      mod: 'customer',
      fnz: 'setVeterinarian',
    },
    add: {
      mod: 'customer',
      fnz: 'add',
    },
  },
  reservation: {
    add: {
      mod: 'reservation',
      fnz: 'add',
    },
    list: {
      mod: 'reservation',
      fnz: 'list',
    },
    get: {
      mod: 'reservation',
      fnz: 'get',
    },
    update: {
      mod: 'reservation',
      fnz: 'update',
    },
    delete: {
      mod: 'reservation',
      fnz: 'delete',
    },
    disable: {
      mod: 'reservation',
      fnz: 'disable',
    },
    checkIn: {
      mod: 'reservation',
      fnz: 'checkIn',
    },
    checkOut: {
      mod: 'reservation',
      fnz: 'checkOut',
    },
    checkOutSpecial: {
      mod: 'reservation',
      fnz: 'checkOutSpecial',
    },
    deletePet: {
      mod: 'reservation',
      fnz: 'deletePet',
    },
    paymentMethods: {
      mod: 'reservation',
      fnz: 'payment_methods',
    },
    list_calendar: {
      mod: 'reservation',
      fnz: 'list_calendar',
    },
    pre_bill: {
      mod: 'reservation',
      fnz: 'pre_bill',
    },
  },
  user: {
    list: {
      mod: 'user',
      fnz: 'list',
    },
    get: {
      mod: 'user',
      fnz: 'get',
    },
    update: {
      mod: 'user',
      fnz: 'update',
    },
    activate: {
      mod: 'user',
      fnz: 'activate',
    },
    add: {
      mod: 'user',
      fnz: 'add',
    },
    resetPwd: {
      mod: 'user',
      fnz: 'resetPwd',
    },
    verifyToken: {
      mod: 'user',
      fnz: 'verifyToken',
    },
    login: {
      mod: 'user',
      fnz: 'login',
    },
    changePassword: {
      mod: 'user',
      fnz: 'changePassword',
    },
  },
  services: {
    list: {
      grooming: {
        mod: 'services',
        fnz: 'list',
        type: 'grooming',
      },
      prices: {
        mod: 'services',
        fnz: 'list',
        type: 'prices',
      },
      other: {
        mod: 'services',
        fnz: 'list',
        type: 'other',
      },
    },
    listDelivered: {
      mod: 'services',
      fnz: 'listDelivered',
    },
    addDelivered: {
      mod: 'services',
      fnz: 'addDelivered',
    },
    deleteDelivered: {
      mod: 'services',
      fnz: 'deleteDelivered',
    },
    toDeliver: {
      mod: 'services',
      fnz: 'toDeliver',
    },
  },
  register: {
    empty: {
      mod: 'register',
      fnz: 'empty',
    },
    full: {
      mod: 'register',
      fnz: 'full',
    },
  },
  pet: {
    get: {
      mod: 'pet',
      fnz: 'get',
    },
    update: {
      mod: 'pet',
      fnz: 'update',
    },
    reservationUpdate: {
      mod: 'pet',
      fnz: 'reservationUpdate',
    },
    list: {
      mod: 'pet',
      fnz: 'list',
    },
    delete: {
      mod: 'pet',
      fnz: 'delete',
    },
    add: {
      mod: 'pet',
      fnz: 'add',
    },
  },
  veterinarian: {
    list: {
      mod: 'veterinarian',
      fnz: 'list',
    },
    get: {
      mod: 'veterinarian',
      fnz: 'get',
    },
    update: {
      mod: 'veterinarian',
      fnz: 'update',
    },
    insert: {
      mod: 'veterinarian',
      fnz: 'insert',
    },
    delete: {
      mod: 'veterinarian',
      fnz: 'delete',
    },
  },
  stats: {
    get: {
      mod: 'stats',
      fnz: 'get',
    },
  },
}
