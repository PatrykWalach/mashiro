import {
  Kind,
  ListTypeNode,
  NamedTypeNode,
  NameNode,
  print,
  TypeNode,
  VariableDefinitionNode,
  VariableNode,
} from 'graphql'
import fetch from 'cross-fetch'
import Dataloader from 'dataloader'

import { AnitomyResult, parse } from 'anitomy-js'
import {
  linkToExecutor,
  loadSchema,
  UrlLoader,
  SubschemaConfig,
  WrapQuery,
  Transform,
  Request,
  DelegationContext,
  MergedTypeResolverOptions,
  MergedTypeResolver,
  batchDelegateToSchema,
} from 'graphql-tools'

import { ApolloLink, HttpLink } from '@apollo/client'

export const diff = <T>(
  prev: T[],
  next: T[],
  comparator: (a: T, b: T) => number,
) => {
  let i = 0,
    j = 0

  const removed = [],
    added = []

  while (i < prev.length && j < next.length) {
    const cmp = comparator(prev[i], next[j])

    if (cmp < 0) {
      removed.push(prev[i])
      i++
    } else if (cmp > 0) {
      added.push(next[j])
      j++
    } else {
      i++
      j++
    }
  }

  for (; i < prev.length; i++) {
    removed.push(prev[i])
  }

  for (; j < next.length; j++) {
    added.push(next[j])
  }

  return [added, removed] as const
}

export const isString = (t: unknown): t is string =>
  typeof t === 'string' || t instanceof (String as any)

export const keyToBoolean = <T>(item: T, key: keyof T) => {
  if (!(key in item)) {
    return null
  }
  const value = item[key]
  if (isString(value)) {
    return value === 'Yes'
  }
  return null
}

export const checkUndefined = <T>(value: T | undefined): T | null =>
  value === undefined ? null : value

export const valuesFromResults = <Id extends string | symbol | number>(
  id_: Id,
) => <
  K extends string | symbol | number,
  T extends {
    [J in Id]: K
  }
>(
  media: T[],
  keys: readonly K[],
): (T | null)[] => {
  const mediaIdToIndex: Record<K, number> = Object.fromEntries(
    media.map((result, i) => [[result[id_]], i]),
  )

  return keys.map(id => media[mediaIdToIndex[id]] || null)
}

export const createRemoteSchema = async ({
  uri,
  ...settings
}: Omit<SubschemaConfig, 'schema' | 'executor'> & { uri: string }) => ({
  ...settings,
  executor: linkToExecutor(
    ApolloLink.from([
      new ApolloLink((operation, forward) => {
        console.log(print(operation.query))
        console.log(operation.variables)
        return forward(operation)
      }),
      new HttpLink({ uri, fetch }),
    ]),
  ),
  schema: await loadSchema(uri, {
    loaders: [new UrlLoader()],
  }),
})

const normalizeAnitomyResult = ({
  anime_title,
  episode_number,
  video_resolution,
  release_group,
  file_name,
}: AnitomyResult) => ({
  animeTitle: anime_title,
  episodeNumber: episode_number,
  videoResolution: video_resolution,
  subgroup: release_group,
  fileName: file_name,
})

export const anitomyLoader = new Dataloader(
  async ([...titles]: readonly string[]) => {
    const results = await parse(titles)
    return results.map(normalizeAnitomyResult)
  },
)

export const List = (type: TypeNode): ListTypeNode => ({
  kind: Kind.LIST_TYPE,
  type,
})

const Name = (name: string): NameNode => ({
  kind: Kind.NAME,
  value: name,
})

const Type = (typeName: string): NamedTypeNode => ({
  kind: Kind.NAMED_TYPE,
  name: Name(typeName),
})

export const Int: TypeNode = Type('Int')
export const String: TypeNode = Type('String')

const Variable = (variableName: string): VariableNode => ({
  kind: Kind.VARIABLE,
  name: Name(variableName),
})

interface WrapQueryWithFieldOptions {
  path: string[]
  fieldName: string
  arguments: Record<string, string>
}
export class WrapQueryWithField extends WrapQuery {
  constructor({
    path,
    fieldName,
    arguments: args = {},
  }: WrapQueryWithFieldOptions) {
    const fieldArguments = Object.entries(args).map(
      ([argumentName, variableName]) => ({
        kind: Kind.ARGUMENT,
        name: Name(argumentName),
        value: Variable(variableName),
      }),
    )

    super(
      path,
      selectionSet => ({
        kind: Kind.FIELD,
        name: Name(fieldName),
        arguments: fieldArguments,
        selectionSet,
      }),
      r => r && r[fieldName],
    )
  }
}

interface AddQueryVariablesOption {
  from: string
  type: TypeNode
}

type AddQueryVariablesOptions = Record<string, AddQueryVariablesOption>

export class AddQueryVariables implements Transform {
  optionsEntries: [string, AddQueryVariablesOption][]
  variables: VariableDefinitionNode[]

  constructor(options: AddQueryVariablesOptions) {
    this.optionsEntries = Object.entries(options)
    this.variables = this.optionsEntries.map(([variableName, { type }]) => ({
      kind: Kind.VARIABLE_DEFINITION,
      type,
      variable: Variable(variableName),
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

interface MergedTypeResolverWithTransformOptions
  extends MergedTypeResolverOptions {
  transforms: Transform[]
}

export const createMergeResolverWithTransform = (
  options: MergedTypeResolverWithTransformOptions,
): MergedTypeResolver => (
  originalResult,
  context,
  info,
  subschema,
  selectionSet,
  key,
) =>
  batchDelegateToSchema({
    ...options,
    schema: subschema,
    operation: 'query',
    key,
    selectionSet,
    context,
    info,
    skipTypeMerging: true,
  })
