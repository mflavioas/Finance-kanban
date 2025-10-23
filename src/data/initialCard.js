export const getInitialCard = () => {
  return {
    title: '',
    amount: '',
    type: 'despesa',
    date: '',
    isRecurring: false,
    dayOfMonth: new Date().getDate(),
  };
};