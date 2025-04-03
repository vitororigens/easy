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
      newtask: undefined;
      privateroutes: undefined;
      list: undefined;
      graphics: undefined;
      market: undefined;
      perfil: undefined;
      piggybank: undefined;
      historic: undefined;
      filter: {
        showMonthFilter?: boolean;
        showCategoryFilter?: boolean;
        showMinValueFilter?: boolean;
        showMaxValueFilter?: boolean;
      };
      newnotes: { selectedItemId?: string; isCreator: boolean };
      newtask: { selectedItemId?: string };
      newlaunch: { selectedItemId?: string };
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
};
