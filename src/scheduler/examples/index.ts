export const SINGLE_EXAMPLE = {
  success: true,
  data: {
    _id: '63203fce1a8fad8b5b7b6a6e',
    data: {
      storageId: '631d9995ea642c9181db3186',
      ingredients: [
        {
          name: 'Tomato Sauce',
          amount: 10,
          unit: 'L',
        },
      ],
    },
    cron: '0/1 * * * * *',
    type: 'BATCH_ADD',
    createdAt: '2022-09-13T08:31:10.955Z',
  },
};
export const ALL_EXAMPLE = {
  success: true,
  data: [
    {
      _id: '63203fce1a8fad8b5b7b6a6e',
      data: {
        storageId: '631d9995ea642c9181db3186',
        ingredients: [
          {
            name: 'Tomato Sauce',
            amount: 10,
            unit: 'L',
          },
        ],
      },
      cron: '0/1 * * * * *',
      type: 'BATCH_ADD',
      createdAt: '2022-09-13T08:31:10.955Z',
    },
  ],
};
export const DELETE_EXAMPLE = {
  success: true,
};
