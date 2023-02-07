import type { Requirement } from "../types/connector";
import { SimpleStore } from "./store";

export const updateTagInfos = (requirements: Requirement[], scope: string = 'global') => {
  const store = new SimpleStore(scope);
  const settings: Requirement[] = [];

  requirements.forEach(setting => { 
    const { type, id, position } = setting;
    
    store.setValue(`${type}.${id}`, { position });
    settings.push(setting);
  });

  return settings;
};