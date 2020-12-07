import { MergedTypeConfig } from 'graphql-tools'
import {
  AddQueryVariables,
  createMergeResolverWithTransform,
  Int,
  List,
  valuesFromResults,
  WrapQueryWithField,
} from '../util'

export const Media: MergedTypeConfig<string> = {
  selectionSet: '{ id }',
  key: ({ id }) => id,
  resolve: createMergeResolverWithTransform({
    argsFromKeys: id_in => ({ id_in }),
    valuesFromResults: valuesFromResults('id'),
    fieldName: 'Page',
    transforms: [
      new WrapQueryWithField({
        path: ['Page'],
        fieldName: 'media',
        arguments: {
          id_in: 'id_in_variable',
        },
      }),
      new AddQueryVariables({
        id_in_variable: {
          from: 'id_in',
          type: List(Int),
        },
      }),
    ],
  }),
}
