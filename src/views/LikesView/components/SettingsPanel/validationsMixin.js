
import { isSomeValueTrueInObject } from '../../../../utils/utils'
export default {
    computed:{
        userIdErrors() {
            const errors = []
            if (!this.$v.localFilters.userId.$dirty) return errors
            if (!this.$v.localFilters.userId.required) {
              errors.push('User ID не должно быть пустым')
            }
            if (!this.$v.localFilters.userId.correct) {
              errors.push('Некорретный формат')
            }
            return errors
          },
          selectUserFilterErrors() {
            const errors = []
            if (!this.$v.localFilters.whereSearchInUsers.selected.$dirty)
              return errors
            if (!this.$v.localFilters.whereSearchInUsers.selected.some) {
              errors.push('Выберите что-нибудь')
            }
            return errors
          },
          selectGroupFilterErrors() {
            const errors = []
            if (!this.$v.localFilters.whereSearchInGroups.selected.$dirty)
              return errors
            if (!this.$v.localFilters.whereSearchInGroups.selected.some) {
              errors.push('Выберите что-нибудь')
            }
            return errors
          },
          showLikesErrors() {
            this.localFilters.valid = true
      
            if (!isSomeValueTrueInObject(this.localFilters.contentTypes)) {
              this.localFilters.valid = false
              return 'Выберите хотя бы одну опцию'
            }
            return ''
          },
          searchInErrors() {
            this.localFilters.valid = true
            if (!isSomeValueTrueInObject(this.localFilters.whereSearch)) {
              this.localFilters.valid = false
              return 'Выберите хотя бы одну опцию'
            }
            return ''
          },
    }
}