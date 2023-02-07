import { getDefaultConnector } from "../connector";
import { TaskDetail } from "../connector/zentao/zentao";
import type { PressedRequirementInfo, Requirement } from "../types/connector";
import { SimpleStore } from "./store";

export const updateTagInfos = (requirements: Requirement[], scope: string) => {
  const store = new SimpleStore(scope);
  const settings: Requirement[] = [];

  requirements.forEach(setting => {
    const { type, id, position } = setting;
    const preSetting = store.getValue(`${type}.${id}`);
    let newRecord = { position };
    if (preSetting) {
      newRecord = { ...preSetting, position };
    }
    store.setValue(`${type}.${id}`, newRecord);
    settings.push(setting);
  });

  return settings;
};

export const fillTagInfosFromServer = async (
  requirements: Requirement[],
  scope: string
): Promise<PressedRequirementInfo[]> => {
  const store = new SimpleStore(scope);
  const isRequesting = !!store.getGlobalValue('requesting');
  if (isRequesting) { return []; }

  store.setGlobalValue('requesting', true);
  const connector = getDefaultConnector();
  const requestArr = requirements
    .filter(requirement => {
      const { type, id } = requirement;
      const preSetting = store.getValue(`${type}.${id}`) as { info?: any };
      if (preSetting.info) { return false; }
      if (!(['task'].includes(type))) { return false; }
      return true;
    })
    .map(requirement => connector.getTaskInfo(requirement.id));

  const requestRes = await Promise.all(requestArr)
    .then(results => {
      const successRes = results.filter((result) => {
        return result && result.id;
      });
      return successRes;
    }).catch(() => {
      return [];
    }) as TaskDetail[];

  const pressedTaskInfos = requestRes.map((requestRes) => {
    const { id, name, desc, storySpec } = requestRes;
    const taskRequirementSetting = requirements.find(rq => String(rq.id) === String(id)) as Requirement;

    return {
      id: String(id),
      title: name,
      desc: storySpec || desc,
      ref: taskRequirementSetting
    };
  }) as PressedRequirementInfo[];

  store.setGlobalValue('requesting', false);

  return [...pressedTaskInfos];
};