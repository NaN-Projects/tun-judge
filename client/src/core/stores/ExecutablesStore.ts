import { action, observable } from 'mobx';
import { Executable } from '../models';
import http from '../utils/http-client';
import { RootStore } from './RootStore';

export class ExecutablesStore {
  @observable data: Executable[] = [];

  constructor(private readonly rootStore: RootStore) {}

  @action
  fetchAll = async (): Promise<Executable[]> => {
    return (this.data = await http.get<Executable[]>('api/executables'));
  };

  @action
  create = async (executable: Partial<Executable>): Promise<void> => {
    await http.post<Executable>('api/executables', executable);
    await this.fetchAll();
  };

  @action
  update = async (executable: Partial<Executable>): Promise<void> => {
    await http.put<Executable>(`api/executables/${executable.id}`, executable);
    await this.fetchAll();
  };

  @action
  remove = async (id: number): Promise<void> => {
    await http.delete(`api/executables/${id}`);
    await this.fetchAll();
  };

  @action
  unzip = async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    await http.post(`api/executables/unzip`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    await this.fetchAll();
  };
}
