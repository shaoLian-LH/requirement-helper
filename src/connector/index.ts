import { getExtensionConfiguration } from "../utils";
import { ZentaoConnector } from "./zentao";

export const getDefaultConnector = () => { 
	const { platformInfo, userInfo } = getExtensionConfiguration();
	const { name } = platformInfo;

	switch (name) { 
		case 'zentao':
			return new ZentaoConnector(platformInfo, userInfo);
		default:
			return new ZentaoConnector(platformInfo, userInfo);
	}
};