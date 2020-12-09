import { IResolvers } from 'graphql-tools';

const resolverMap: IResolvers = {
  Query: {
    myForums(_: void, args: any): [{}?] {
      const { id } = args;

      return [
        {
          forum_id: 1001000001,
          creater: 1001,
          users: [
            { id: 1001, name: 'userOne', img: "imgone" }
          ],
          name: "name"
        }];
    },

    forums(_: void, args: void): [{}?]{
      return [{
        forum_id: 1001000001,
        creater: 1001,
        users: [
          { id: 1001, name: 'userOne', img: "imgone" }
        ]
      }];
    }
  },
};
export default resolverMap;