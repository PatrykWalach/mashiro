import {
  Kind,
  ListTypeNode,
  NamedTypeNode,
  NameNode,
  TypeNode,
  VariableDefinitionNode,
  VariableNode,
} from 'graphql'

import {
  WrapQuery,
  Transform,
  Request,
  DelegationContext,
  TransformQuery,
} from 'graphql-tools'

export const List = (type: TypeNode): ListTypeNode => ({
  kind: Kind.LIST_TYPE,
  type,
})

export const Name = (name: string): NameNode => ({
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

export class AddFields extends TransformQuery {
  constructor(path: string[], fileldOrFields: string[] | string) {
    const fields = Array.isArray(fileldOrFields)
      ? fileldOrFields
      : [fileldOrFields]

    super({
      path,
      queryTransformer: (selectionSet) => ({
        ...selectionSet,
        selections: [
          ...fields.map((name) => ({ kind: Kind.FIELD, name: Name(name) })),
          ...selectionSet.selections,
        ],
      }),
    })
  }
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
      (selectionSet) => ({
        kind: Kind.FIELD,
        name: Name(fieldName),
        arguments: fieldArguments,
        selectionSet,
      }),
      (r) => r && r[fieldName],
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
        definitions: request.document.definitions.map((def) => {
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
