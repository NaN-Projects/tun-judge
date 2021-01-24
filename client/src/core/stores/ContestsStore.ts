import { action, observable } from 'mobx';
import { Contest } from '../models';
import http from '../utils/http-client';
import { RootStore } from './RootStore';

export class ContestsStore {
  @observable data: Contest[] = [];

  constructor(private readonly rootStore: RootStore) {}

  @action
  fetchAll = async (): Promise<Contest[]> => {
    return (this.data = await http.get<Contest[]>('api/contests'));
  };

  @action
  create = async (contest: Partial<Contest>): Promise<void> => {
    await http.post<Contest>('api/contests', contest);
    await this.fetchAll();
  };

  @action
  update = async (contest: Partial<Contest>): Promise<void> => {
    await http.put<Contest>(`api/contests/${contest.id}`, contest);
    await this.fetchAll();
  };

  @action
  refreshScoreboardCache = async (id: number): Promise<void> => {
    await http.patch(`api/contests/${id}/refresh-scoreboard-cache`);
  };

  @action
  remove = async (id: number): Promise<void> => {
    await http.delete(`api/contests/${id}`);
    await this.fetchAll();
  };

  @action
  unzip = async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    await http.post(`api/contests/unzip`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    await this.fetchAll();
  };
}
