import { mutationField, objectType } from 'nexus'

// const AccountUpdate = objectType({
//   name: 'AccountUpdate',
//   definition(t) {
//     t.nonNull.int('id')
//     t.nonNull.string('updatedAt')
//     t.nonNull.field('status', { type: 'AccountStatus' })
//   },
// })

const AccountMutation = mutationField((t) => {
  t.crud.createOneAccount()
})

export const AccountType = objectType({
  name: 'Account',
  definition(t) {
    t.model.id()
    t.model.token()
    t.model.service()
  },
})

export default [AccountType, AccountMutation]
