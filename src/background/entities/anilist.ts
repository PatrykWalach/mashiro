import { Kind, TypeNode, VariableDefinitionNode } from 'graphql'
import {
  DelegationContext,
  Transform,
  Request,
  WrapQuery,
  MergedTypeResolverOptions,
  MergedTypeResolver,
  batchDelegateToSchema,
  MergedTypeConfig,
} from 'graphql-tools'
import { valuesFromResults } from '../util'
// import { Media as MediaType } from './__generated__/types'

class WrapQueryWithField extends WrapQuery {
  constructor({
    path,
    fieldName,
    resultTransformer = r => r,
    arguments: args = {},
  }: {
    path: string[]
    fieldName: string
    resultTransformer: (result: any) => any
    arguments: Record<string, string>
  }) {
    const fieldArguments = Object.entries(args).map(
      ([argumentName, variableName]) => ({
        kind: Kind.ARGUMENT,
        name: { kind: Kind.NAME, value: argumentName },
        value: {
          kind: Kind.VARIABLE,
          name: {
            kind: Kind.NAME,
            value: variableName,
          },
        },
      }),
    )

    super(
      path,
      selectionSet => ({
        kind: Kind.FIELD,
        name: {
          kind: Kind.NAME,
          value: fieldName,
        },
        arguments: fieldArguments,
        selectionSet,
      }),
      resultTransformer,
    )
  }
}

interface AddQueryVariablesOption {
  from: string
  type: TypeNode
}

type AddQueryVariablesOptions = Record<string, AddQueryVariablesOption>

class AddQueryVariables implements Transform {
  optionsEntries: [string, AddQueryVariablesOption][]
  variables: VariableDefinitionNode[]

  constructor(options: AddQueryVariablesOptions) {
    this.optionsEntries = Object.entries(options)
    this.variables = this.optionsEntries.map(([variableName, { type }]) => ({
      kind: Kind.VARIABLE_DEFINITION,
      type,
      variable: {
        kind: Kind.VARIABLE,
        name: {
          kind: 'Name',
          value: variableName,
        },
      },
    }))
  }

  transformRequest(request: Request, context: DelegationContext): Request {
    const variables = Object.fromEntries(
      this.optionsEntries.map(([variableName, { from }]) => [
        variableName,
        context.args[from],
      ]),
    )

    return {
      ...request,
      variables,
      document: {
        ...request.document,
        definitions: request.document.definitions.map(def => {
          if (def.kind !== Kind.OPERATION_DEFINITION) {
            return def
          }
          if (def.operation !== 'query') {
            return def
          }
          return {
            ...def,
            variableDefinitions: this.variables.concat(
              def.variableDefinitions || [],
            ),
          }
        }),
      },
    }
  }
}

const createMergeResolverWithTransform = ({
  valuesFromResults,
  fieldName,
  argsFromKeys,
  transforms,
}: MergedTypeResolverOptions & {
  transforms: Transform[]
}): MergedTypeResolver => {
  return (originalResult, context, info, subschema, selectionSet, key) => {
    return batchDelegateToSchema({
      schema: subschema,
      operation: 'query',
      fieldName,
      key,
      argsFromKeys,
      valuesFromResults,
      selectionSet,
      context,
      info,
      skipTypeMerging: true,
      transforms,
    })
  }
}

// interface AnilistMergeResolvers {
//   Media: MergedTypeConfig<string>
// }

export const Media: MergedTypeConfig<string> = {
  selectionSet: '{ id }',
  key: ({ id }) => id,
  resolve: createMergeResolverWithTransform({
    argsFromKeys: id_in => ({ id_in }),
    valuesFromResults,
    fieldName: 'Page',
    transforms: [
      new WrapQueryWithField({
        path: ['Page'],
        fieldName: 'media',
        arguments: {
          id_in: 'id_in_variable',
        },
        resultTransformer: Page => Page && Page.media,
      }),
      new AddQueryVariables({
        id_in_variable: {
          from: 'id_in',
          type: {
            kind: Kind.LIST_TYPE,
            type: {
              kind: Kind.NAMED_TYPE,
              name: { kind: Kind.NAME, value: 'Int' },
            },
          },
        },
      }),
    ],
  }),
}
