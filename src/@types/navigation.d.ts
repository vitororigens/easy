export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      login: undefined;
      forgetPassword: undefined;
      home: undefined;
      tabroutes: {
        screen?: keyof TabParamList;
        params?: TabParamList[keyof TabParamList];
      };
      newlaunch: { selectedItemId?: string, initialActiveButton: string };
      newtask: undefined;
      privateroutes: undefined;
      list: undefined;
      graphics: undefined;
      market: undefined;
      perfil: undefined;
      piggybank: undefined;
      notes: undefined;
      historic: undefined;
      filter: {
        showMonthFilter?: boolean;
        showCategoryFilter?: boolean;
        showMinValueFilter?: boolean;
        showMaxValueFilter?: boolean;
      };
      newnotes: { selectedItemId?: string; isCreator: boolean };
      newtask: { selectedItemId?: string };
 
      newitemtask: { selectedItemId?: string };
      "market-item": { selectedItemId?: string };
      historytask: { selectedItemId?: string };
      "market-history-item": { selectedItemId?: string };
      newexpense: { selectedItemId?: string };
      newrevenue: { selectedItemId?: string };
      notifications: undefined;
      shared: undefined;
      subscriptions: undefined;
      "new-subscription": { selectedItemId?: string };
      "subscription-history": { selectedItemId?: string };
      calendar: { reload?: boolean };
      newevent: { selectedItemId?: string; isCreator: boolean };
    }
  }
}

export type TabParamList = {
  Market: { reload?: boolean };
  Tarefas: undefined;
  Home: undefined;
  Notas: { reload?: boolean };
  Receitas: { reload?: boolean };
  Config: undefined;
  Assinaturas: { reload?: boolean };
  Agenda: { reload?: boolean };
};

export type RootStackParamList = {
  newtask: {
    selectedItemId: string;
    initialActiveButton: string;
  };
  newnotes: {
    selectedItemId: string;
  };
  "market-item": {
    selectedItemId: string;
  };
  newsubscription: {
    selectedItemId: string;
  };
  newevent: {
    selectedItemId: string;
    isCreator: boolean;
  };
  filter: undefined;
};
