import {RecorrenciaContextProps} from "./Recorrencia.context";
import { useLocalStorage } from '../hooks/useLocalStorage';

export const CardContextProps = () => {
  return {
    id: '',
    boardId: '',
    descricao: '',
    valor: '',
    data: '',
    recorrente: RecorrenciaContextProps | null
  }
};

export const IncluirCard = (DadosCard) => {
  const [data, setData] = useLocalStorage('finanKanbanData', getInitialState());
  
  
  return {...DadosCard, recorrente: null};
};