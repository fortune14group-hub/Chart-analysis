import { AnalysisResult } from "@/lib/types";
import { createUUID } from "@/lib/utils/uuid";

const store = new Map<string, AnalysisResult>();

export function persistAnalysis(payload: Omit<AnalysisResult, "meta"> & { meta: Omit<AnalysisResult["meta"], "id"> }): string {
  const id = createUUID();
  const record: AnalysisResult = {
    ...payload,
    meta: {
      ...payload.meta,
      id
    }
  };
  store.set(id, record);
  return id;
}

export function getAnalysis(id: string): AnalysisResult | undefined {
  return store.get(id);
}

export function setAnalysis(id: string, result: AnalysisResult): void {
  store.set(id, { ...result, meta: { ...result.meta, id } });
}

export function listAnalyses(limit = 20): AnalysisResult[] {
  return Array.from(store.values())
    .sort((a, b) => (a.meta.createdAt > b.meta.createdAt ? -1 : 1))
    .slice(0, limit)
    .map((res) => ({ ...res, meta: { ...res.meta } }));
}

export function clearAll() {
  store.clear();
}
