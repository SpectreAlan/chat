import fetch from '@/api/fetch';

/**
 * 群分页消息
 * @param params
 */
export async function getFriendMessage(params: PagingParams) {
  return await fetch.get(`/friend/friendMessages`, {
    params,
  });
}

/**
 * 好友map
 * @param params
 */
export async function getFriends(params: any) {
  return await fetch.get(`/friend`, {
    params,
  });
}
