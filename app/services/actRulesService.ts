import { apiService, ApiResponse } from './api';

export interface ActRule {
  id: number;
  name: string;
  description: string;
  file_name: string;
  addedby: number;
  created_at: string;
  updated_at: string;
}
export const actRulesService = {
  getActRules: async (): Promise<ApiResponse<ActRule[]>> => {
    return apiService.post<ActRule[]>('/act-rules', {});
  },
};