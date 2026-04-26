import { getWeekStart } from "../utils/dateUtils";

export const alimentoService = {
  addFood(alimentos, payload) {
    const newItem = {
      id: `food-${Date.now()}`,
      nome: payload.nome,
      caixasRecebidas: Number(payload.caixasRecebidas || 0),
      itensPorCaixa: Number(payload.itensPorCaixa || 0),
      createdAt: new Date().toISOString(),
    };
    return [newItem, ...alimentos];
  },

  getTotalRecebido(alimentos) {
    return alimentos.reduce(
      (sum, item) => sum + Number(item.caixasRecebidas || 0) * Number(item.itensPorCaixa || 0),
      0
    );
  },

  getTotalPerdido(perdas) {
    return perdas.reduce((sum, item) => sum + Number(item.quantidade || 0), 0);
  },

  getWeeklyLossPercent(alimentos, perdas) {
    const start = getWeekStart(new Date());
    const perdasSemana = perdas
      .filter((item) => new Date(item.createdAt) >= start)
      .reduce((sum, item) => sum + Number(item.quantidade || 0), 0);

    const total = this.getTotalRecebido(alimentos);
    if (!total) return 0;
    return (perdasSemana / total) * 100;
  },

  addLoss(perdas, payload) {
    const loss = {
      id: `loss-${Date.now()}`,
      foodId: payload.foodId || null,
      nome: payload.nome,
      quantidade: Number(payload.quantidade || 0),
      reason: payload.reason,
      createdAt: new Date().toISOString(),
    };
    return [loss, ...perdas];
  },
};
