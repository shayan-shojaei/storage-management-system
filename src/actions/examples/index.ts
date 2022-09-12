export const ADD_EXAMPLE = {
  _id: '631f11ec91ff9645f0690fa3',
  name: 'Kiwi',
  unit: 'KG',
  amount: 50,
  storage: '631d9d675237167ab2c1b75e',
  createdAt: '2022-09-12T11:03:08.441Z',
};

export const ADD_BATCH_EXAMPLE = [
  {
    _id: '631f11ec91ff9645f0690fa3',
    name: 'Kiwi',
    unit: 'KG',
    amount: 50,
    storage: '631d9d675237167ab2c1b75e',
    createdAt: '2022-09-12T11:03:08.441Z',
  },
  {
    _id: '631f1373d5e4af4a1f3fb1aa',
    name: 'Cucumber',
    unit: 'G',
    amount: 500,
    storage: '631d9d675237167ab2c1b75e',
    createdAt: '2022-09-12T11:09:39.615Z',
  },
];

export const ADD_BATCH_SCHEDULE_EXAMPLE = {
  success: true,
  data: {
    _id: '631f4c12d2e5aec9ac938181',
    data: {
      data: [
        {
          name: 'Kiwi',
          amount: 50,
          unit: 'G',
        },
        {
          name: 'Cucumber',
          amount: 24,
          unit: 'KG',
        },
        {
          name: 'Kiwi',
          amount: 25,
          unit: 'KG',
        },
      ],
      storageId: '631d9d675237167ab2c1b75e',
    },
    cron: '0/10 * * * * *',
    type: 'BATCH_ADD',
    createdAt: '2022-09-12T15:11:14.163Z',
  },
};
