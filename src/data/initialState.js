export const getInitialState = () => {
  return {
    boards: {},
    cards: {},
    boardOrder: [],
    recurringTemplates: {}, 
    settings: {
      currencySymbol: 'R$',
      theme: 'light'
    }
  };
};