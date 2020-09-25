import { statics } from '../../types'
import $gate from '../../../implementation/crudly/CRUDlyInstance'

export default ({ commit }, done) => {
  $gate
    .all([
      $gate.course.getAll(),
      $gate.category.getAll(),
      $gate.tag.getAll(),
      $gate.auth.getUser(),
      $gate.message.notRead(),
      $gate.comment.notAccepted()
    ])
    .then(
      ([
        courses,
        categories,
        tags,
        user,
        notReadedMessages,
        notAcceptedComments
      ]) => {
        commit(statics.mutations.allCourses, courses)
        commit(statics.mutations.allCategories, categories)
        commit(statics.mutations.allTags, tags)
        commit(statics.mutations.user, user)
        commit(statics.mutations.notReadedMessages, notReadedMessages)
        commit(
          statics.mutations.notReadedCount,
          (notReadedMessages || []).length
        )
        commit(statics.mutations.notAcceptedComments, notAcceptedComments)
        commit(
          statics.mutations.notAcceptedCount,
          (notAcceptedComments || []).length
        )
        done()
      }
    )
    .catch(error => {
      console.log(error)
      done(error)
    })
}
