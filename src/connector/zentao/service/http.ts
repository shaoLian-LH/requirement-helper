import { requestFactory } from "../../../utils/request";
import { SimpleStore } from "../../../utils/store";
import { getExtensionConfiguration } from "../../../utils";

const { zentao } = getExtensionConfiguration();
const prefix = (zentao.address || '') + '/api.php/v1';
const { get, post, patch, put } = requestFactory(
  prefix,
  {
    request: (req) => { 
      const zentaoStore = new SimpleStore('zentao');
      return {
        ...req,
        'Token': zentaoStore.getValue('token') || ''
      };
    }
  }
);

export { 
  get, post, patch, put
};