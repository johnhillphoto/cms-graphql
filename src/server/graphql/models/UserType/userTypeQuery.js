import {
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull
} from 'graphql';

import {Usertype} from './userTypeSchema.js';
import {Permission} from '../Permission/permissionSchema.js';

import Db from '../../../database/setupDB.js';

export default {

  getAllUserTypesBy: {
    type: new GraphQLList(Usertype),
    args: {
      id: {type: GraphQLID},
      name: {type: GraphQLString}
    },
    resolve(root, args) {
      return Db.models.usertype.findAll({where: args});
    }
  },
  getAllUserTypes: {
    type: new GraphQLList(Usertype),
    args: {
    },
    resolve(root, args) {
      return Db.models.usertype.findAll();
    }
  },
  getUserTypeById: {
    type: Usertype,
    args: {
      id: {type: new GraphQLNonNull(GraphQLID)}
    },
    async resolve(root, args) {
      return Db.models.usertype.findById(args.id);
    }
  },
  getPermissionsListedOnUserTypebyId: {
    type: new GraphQLList(Permission),
    args: {
      id: {type: new GraphQLNonNull(GraphQLID)}
    },
    async resolve(root, args) {
      const foundUserType = await Db.models.usertype.findById(args.id);
      return await foundUserType.getPermissions();
      // return foundUserTypePermissions;
    }
  }
};
// getPermissions
