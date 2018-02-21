import { httpGetAction, httpPostAction } from "../httpCollectionActions";

const createGroup = (groupInfo) => httpPostAction("GROUP", "/groups", { groupInfo });

const fetchGroup = (id) => httpGetAction("GROUP", `/groups/${id}`, { id }, { doMerge: false, isSingle: true });


export { createGroup, fetchGroup };
