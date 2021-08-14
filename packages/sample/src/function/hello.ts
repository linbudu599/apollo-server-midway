import {
  Provide,
  Inject,
  ServerlessTrigger,
  ServerlessFunction,
  ServerlessTriggerType,
  ALL,
  Query,
  Config,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import { experimentalCreateHandler } from 'apollo-server-midway';
import {
  GraphQLService,
  PluginConfig,
  RenderPlaygroundQueryOptions,
} from 'midway-faas-graphql';

const apolloHandlerFuncName = 'apollo-handler';
const graphqlHandlerFuncName = 'graphql-handler';

const APOLLO_SERVER_MIDWAY_PATH = '/apollo';
const GRAPHQL_HANDLER_PATH = '/graphql';

@Provide()
export class HelloHTTPService {
  @Inject()
  ctx: Context;

  @Inject('graphql:GraphQLService')
  graphql: GraphQLService;

  @Config()
  faasGraphQLConfig: PluginConfig;

  @ServerlessFunction({
    functionName: graphqlHandlerFuncName,
  })
  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: GRAPHQL_HANDLER_PATH,
    method: 'get',
  })
  async graphqlPlaygroundHandler(
    @Query(ALL) playgroundOptions: RenderPlaygroundQueryOptions
  ) {
    return await this.graphql.playground(this.ctx, playgroundOptions);
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: GRAPHQL_HANDLER_PATH,
    method: 'post',
  })
  async graphqlHandler() {
    return this.graphql.handler(this.ctx, this.faasGraphQLConfig);
  }

  @ServerlessFunction({
    functionName: apolloHandlerFuncName,
  })
  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: APOLLO_SERVER_MIDWAY_PATH,
    method: 'get',
  })
  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: APOLLO_SERVER_MIDWAY_PATH,
    method: 'post',
  })
  async apolloHandler() {
    return await experimentalCreateHandler({
      path: '/apollo',
      context: this.ctx,
    });
  }
}
