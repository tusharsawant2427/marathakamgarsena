import { apiService, ApiResponse } from './api';

export interface Issue {
  id: number;
  name: string;
  mobile_number: string;
  company: string;
  designation: string;
  description: string;
  status?: string;
  created_at: string;
}

export interface CreateIssueData {
  name: string;
  mobile_number: string;
  company: string;
  designation: string;
  description: string;
}

export interface ListIssuesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const issueService = {
  listIssues: async (params?: ListIssuesParams): Promise<ApiResponse<Issue[]>> => {
    return apiService.post<Issue[]>('/list-issue', params || {});
  },

  createIssue: async (issueData: CreateIssueData): Promise<ApiResponse<Issue>> => {
    return apiService.post<Issue>('/add-issue', issueData);
  },

  updateIssue: async (id: number, issueData: Partial<Issue>): Promise<ApiResponse<Issue>> => {
    return apiService.put<Issue>(`/update-issue/${id}`, issueData);
  },

  deleteIssue: async (id: number): Promise<ApiResponse<void>> => {
    return apiService.delete<void>(`/delete-issue/${id}`);
  },
}; 