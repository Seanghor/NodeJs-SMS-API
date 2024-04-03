import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'],
  });
prisma.$use(async (params, next) => {
  // Check incoming query type
  if (params.model == 'School') {
    switch (params.action) {
      case 'create':
        // Create queries
        // Add createdAt and updatedAt fields
        params.args['data']['createdAt'] = new Date();
        params.args['data']['updatedAt'] = new Date();

        break;
      case 'update':
        // Update queries
        // Add updatedAt field
        params.args['data']['updatedAt'] = new Date();
        break;
      case 'updateMany':
        // Update many queries
        // Add updatedAt field
        if (params.args.data != undefined) {
          params.args.data['updatedAt'] = new Date();
        } else {
          params.args['data'] = { updatedAt: new Date() };
        }
        break;
      case 'createMany':
        // Create many queries
        // Add createdAt and updatedAt fields
        if (params.args.data != undefined) {
          params.args.data.forEach((item: any) => {
            item['createdAt'] = new Date();
            item['updatedAt'] = new Date();
          });
        } else {
          params.args['data'] = { createdAt: new Date(), updatedAt: new Date() };
        }
        break;
      case 'delete':
        // Delete queries
        // Change action to an update
        params.action = 'update';
        params.args['data'] = { deletedAt: new Date() };
        break;
      case 'deleteMany':
        // Delete many queries
        params.action = 'updateMany';
        if (params.args.data != undefined) {
          params.args.data['deletedAt'] = new Date();
        } else {
          params.args['data'] = { deletedAt: new Date() };
        }
        break;

      default:
        break;
    }
  }
  return next(params);
});

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
