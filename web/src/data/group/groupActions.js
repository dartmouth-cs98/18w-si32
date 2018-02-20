import { httpPostAction } from "../httpCollectionActions";

const createGroup = (groupInfo) => httpPostAction("GROUP", "/groups", { groupInfo });

export { createGroup };
