export interface ChatState {
  socket: SocketIOClient.Socket;
  dropped: boolean;
  activeGroupUser: ActiveGroupUser;
  activeRoom: (Group & Friend) | null;
  groupGather: GroupGather;
  groupInfo: GroupInfo;
  userGather: FriendGather;
  friendGather: FriendGather;
  unReadGather: UnReadGather;
}

const chatState: ChatState = {
  // @ts-ignore
  socket: null,
  dropped: false,
  activeGroupUser: {},
  activeRoom: null,
  groupInfo: {},
  groupGather: {},
  userGather: {},
  friendGather: {},
  unReadGather: {}
};

export default chatState;
